import { buildBoxTextures } from "./textures.js";

const NAVY = 0x22252b;
const BOX_W = 1.4;
const BOX_H = 1.76;
const BOX_D = 0.6;
const IDLE_DELAY = 3000;
const DRAG_SENSITIVITY = 0.008;
const TILT_LIMIT = 0.28;
const SNAP_STEP = Math.PI / 2;
// 뒷면(바코드)을 발견하기 전까지 박스가 저절로 천천히 회전해서, 굳이 직접
// 뒤집어보지 않아도 바코드가 있다는 걸 자연스럽게 보여준다 — 2π 기준 약
// 24초에 한 바퀴 도는 속도. 사용자가 처음 드래그하는 순간 영구히 멈춘다
const AUTO_ROTATE_SPEED = 0.26;
// style.css의 scan-sweep / beep-pop 애니메이션 길이와 맞춰야 한다
const SCAN_MS = 400;
const BEEP_MS = 700;

export async function initHero(container, hintEl, options = {}) {
  const { scanLineEl, beepEl, onScanned, exploreBtn } = options;
  const [THREE, { RoomEnvironment }] = await Promise.all([
    import("three"),
    import("three/addons/environments/RoomEnvironment.js"),
  ]);

  const scene = new THREE.Scene();

  const BASE_CAMERA_Z = 6;
  // 세로로 좁은(모바일 세로) 화면에서는 세로 FOV가 고정이라 가로로 보이는
  // 폭이 급격히 줄어들어 박스가 화면을 꽉 채우다 못해 잘려 보인다. 가로로
  // 이만큼(월드 단위)은 항상 보이도록 필요하면 카메라를 더 뒤로 물린다
  const MIN_VISIBLE_WIDTH = 2.8;

  const camera = new THREE.PerspectiveCamera(
    32,
    container.clientWidth / container.clientHeight,
    0.1,
    50
  );
  camera.position.set(0, 0.1, BASE_CAMERA_Z);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

  // 조명
  const hemi = new THREE.HemisphereLight(0xffffff, 0x33342f, 0.65);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(2.4, 3.2, 3.2);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 10;
  key.shadow.radius = 4;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xfff3d6, 0.5);
  fill.position.set(-3, 1.4, 2);
  scene.add(fill);

  const rim = new THREE.PointLight(0xffe9a8, 0.6, 8);
  rim.position.set(-1.5, 1.8, -2.5);
  scene.add(rim);

  // 그림자를 받는 바닥
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12),
    new THREE.ShadowMaterial({ opacity: 0.22 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -BOX_H / 2 - 0.35;
  floor.receiveShadow = true;
  scene.add(floor);

  // 박스
  const group = new THREE.Group();
  group.rotation.y = -0.55;
  scene.add(group);

  const placeholderMat = new THREE.MeshPhysicalMaterial({
    color: NAVY,
    roughness: 0.4,
    metalness: 0.1,
    clearcoat: 0.4,
    clearcoatRoughness: 0.25,
  });

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(BOX_W, BOX_H, BOX_D),
    [
      placeholderMat, // +x right
      placeholderMat, // -x left
      placeholderMat, // +y top
      placeholderMat, // -y bottom
      placeholderMat, // +z front
      placeholderMat, // -z back
    ]
  );
  box.castShadow = true;
  group.add(box);

  let backPulse = null;
  let backBarcodeRect = null;
  loadFaceTextures(THREE, box).then((result) => {
    backPulse = result.backPulse;
    backBarcodeRect = result.backBarcodeRect;
  });

  // --- 인터랙션: 드래그 회전 + 스냅 ---
  let isDragging = false;
  let prevX = 0;
  let prevY = 0;
  let snapAnim = null;
  let idleTimer = null;
  let autoRotate = true;

  let isIdle = false;
  const setHintIdle = (idle) => {
    isIdle = idle;
    hintEl.classList.toggle("is-idle", idle);
  };

  const resetIdleTimer = () => {
    setHintIdle(false);
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => setHintIdle(true), IDLE_DELAY);
  };

  const cancelSnap = () => {
    if (snapAnim) {
      cancelAnimationFrame(snapAnim.raf);
      snapAnim = null;
    }
  };

  const snapToNearest = () => {
    cancelSnap();
    const fromY = group.rotation.y;
    const fromX = group.rotation.x;
    const toY = Math.round(fromY / SNAP_STEP) * SNAP_STEP;
    const toX = 0;
    const duration = 420;
    const start = performance.now();

    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      group.rotation.y = fromY + (toY - fromY) * eased;
      group.rotation.x = fromX + (toX - fromX) * eased;
      if (t < 1) {
        snapAnim = { raf: requestAnimationFrame(step) };
      } else {
        snapAnim = null;
      }
    };
    snapAnim = { raf: requestAnimationFrame(step) };
  };

  // --- 바코드 클릭(탭) 감지: 드래그와 구분하기 위해 이동 거리/시간을 함께 본다 ---
  let downX = 0;
  let downY = 0;
  let downTime = 0;
  let isScanning = false;

  const raycaster = new THREE.Raycaster();
  const pointerNDC = new THREE.Vector2();

  const hitBarcode = (clientX, clientY) => {
    if (!backBarcodeRect) return false;
    const rect = container.getBoundingClientRect();
    pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointerNDC, camera);

    const hits = raycaster.intersectObject(box, false);
    const hit = hits[0];
    if (!hit || !hit.face || hit.face.materialIndex !== 5 || !hit.uv) return false;

    const bx = hit.uv.x;
    const by = 1 - hit.uv.y;
    const r = backBarcodeRect;
    return bx >= r.x && bx <= r.x + r.w && by >= r.y && by <= r.y + r.h;
  };

  const runScanSequence = () => {
    isScanning = true;
    cancelSnap();
    if (idleTimer) clearTimeout(idleTimer);
    setHintIdle(false);

    scanLineEl?.classList.remove("is-active");
    beepEl?.classList.remove("is-active");
    // 리플로우를 강제해 애니메이션을 다시 시작할 수 있게 한다
    void scanLineEl?.offsetWidth;
    scanLineEl?.classList.add("is-active");

    window.setTimeout(() => {
      beepEl?.classList.add("is-active");
    }, SCAN_MS);

    window.setTimeout(() => {
      scanLineEl?.classList.remove("is-active");
      beepEl?.classList.remove("is-active");
      // 스캔 연출이 끝났으니 다시 인터랙션(드래그/탭)을 받을 수 있게 풀어준다 —
      // 이걸 안 풀면 POS에서 뒤로 돌아왔을 때 박스가 완전히 먹통이 된다
      isScanning = false;
      resetIdleTimer();
      onScanned?.();
    }, SCAN_MS + BEEP_MS + 100);
  };

  // --- 모바일(터치)에서는 드래그가 페이지 스크롤 제스처와 충돌할 수 있어서,
  // "제품 둘러보기" 버튼으로 탐색 모드를 켰을 때만 터치 드래그를 회전으로
  // 인식한다. 마우스/펜 입력은 이 모드와 무관하게 항상 바로 드래그-회전된다.
  // 탐색 모드가 꺼져 있어도 탭(바코드 스캔)은 그대로 동작해야 하므로, 회전
  // 적용 자체만 막고 pointerdown/up의 탭 판정 로직은 그대로 둔다 */
  let exploreMode = false;
  const setExploreMode = (active) => {
    exploreMode = active;
    exploreBtn?.classList.toggle("is-active", active);
    if (exploreBtn) {
      exploreBtn.textContent = active ? "둘러보기 종료" : "제품 둘러보기";
    }
    // 탐색 모드일 때만 터치 제스처를 전부 우리가 가로챈다(touch-action: none).
    // 꺼져 있으면 pan-y로 둬서 세로 스크롤은 브라우저가 그대로 처리하게 한다
    container.classList.toggle("is-exploring", active);
  };
  exploreBtn?.addEventListener("click", () => setExploreMode(!exploreMode));

  const canRotate = (e) => e.pointerType !== "touch" || exploreMode;

  const onPointerDown = (e) => {
    if (isScanning) return;
    // 사용자가 처음으로 직접 손을 대는 순간이 곧 "이제 스스로 조작할 줄 안다"는
    // 신호이므로, 자동 회전을 이 시점에 영구히 꺼서 수동 조작과 겹치지 않게 한다
    autoRotate = false;
    isDragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
    downX = e.clientX;
    downY = e.clientY;
    downTime = performance.now();
    cancelSnap();
    resetIdleTimer();
    container.setPointerCapture?.(e.pointerId);
  };

  // 드래그 중이 아닐 때 마우스가 뒷면 바코드 위에 있으면 뷰파인더 커서로
  // 바꿔서 "여기 누르면 스캔된다"는 걸 알려준다 — 터치는 호버 개념이 없어서
  // 마우스 입력일 때만 검사한다(레이캐스트 자체는 hitBarcode가 이미 뒷면
  // 재질을 맞았을 때만 true라 앞면을 보고 있으면 자연히 false가 된다)
  const onPointerHover = (e) => {
    if (isDragging || e.pointerType !== "mouse") return;
    container.classList.toggle("is-hovering-barcode", hitBarcode(e.clientX, e.clientY));
  };

  const onPointerMove = (e) => {
    onPointerHover(e);
    if (!isDragging) return;
    const dx = e.clientX - prevX;
    const dy = e.clientY - prevY;
    prevX = e.clientX;
    prevY = e.clientY;

    // 탐색 모드가 꺼진 터치 입력은 좌표 추적만 계속하고 회전은 적용하지
    // 않는다 — 탭(스캔) 판정은 pointerup에서 이동 거리로 그대로 계산된다
    if (canRotate(e)) {
      group.rotation.y += dx * DRAG_SENSITIVITY;
      group.rotation.x = THREE.MathUtils.clamp(
        group.rotation.x + dy * DRAG_SENSITIVITY,
        -TILT_LIMIT,
        TILT_LIMIT
      );
    }
    resetIdleTimer();
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;
    isDragging = false;

    const moved = Math.hypot(e.clientX - downX, e.clientY - downY);
    const elapsed = performance.now() - downTime;
    const wasTap = moved < 6 && elapsed < 500;

    snapToNearest();
    resetIdleTimer();

    if (wasTap && !isScanning && hitBarcode(e.clientX, e.clientY)) {
      runScanSequence();
    }
  };

  container.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);

  resetIdleTimer();

  // --- 리사이즈 ---
  const handleResize = () => {
    const { clientWidth, clientHeight } = container;
    const aspect = clientWidth / clientHeight;
    camera.aspect = aspect;

    // 세로 FOV는 고정이라 가로로 보이는 폭은 aspect에 비례해서 줄어든다.
    // 좁은 화면에서 MIN_VISIBLE_WIDTH를 확보하는 데 필요한 거리가 기존
    // 프레이밍 거리(BASE_CAMERA_Z)보다 멀면 그만큼 카메라를 물러나게 한다
    const fovRad = (camera.fov * Math.PI) / 180;
    const requiredZ = MIN_VISIBLE_WIDTH / (2 * Math.tan(fovRad / 2) * aspect);
    camera.position.z = Math.max(BASE_CAMERA_Z, requiredZ);

    camera.updateProjectionMatrix();
    renderer.setSize(clientWidth, clientHeight);
  };
  const resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(container);
  handleResize();

  // --- 렌더 루프 ---
  // POS 화면에 가려져 있는 동안에도 계속 매 프레임 렌더링하면 GPU/메인
  // 스레드를 불필요하게 잡아먹고, 특히 POS→Hero 전환 애니메이션이 그
  // 경합 때문에 끝났다는 이벤트(animationend)조차 제때 못 받아 멈춰
  // 보이는 문제로 이어진다 — 그래서 안 보일 땐 루프 자체를 멈춘다
  let rafId;
  let isPaused = false;
  let lastPulseAt = 0;
  let lastFrameAt = performance.now();
  const tick = (t = performance.now()) => {
    // 일시정지 뒤 다시 시작할 때(POS에 다녀온 뒤) 그 사이 지난 실제 시간만큼
    // 한 번에 확 돌아버리지 않도록 프레임 간 간격을 최대 100ms로 잡아둔다
    const dt = Math.min((t - lastFrameAt) / 1000, 0.1);
    lastFrameAt = t;
    if (autoRotate) {
      group.rotation.y += AUTO_ROTATE_SPEED * dt;
    }

    if (backPulse && t - lastPulseAt > 40) {
      const isBackFacing = Math.cos(group.rotation.y) < -0.85;
      backPulse(t, isIdle && isBackFacing);
      lastPulseAt = t;
    }
    renderer.render(scene, camera);
    if (!isPaused) rafId = requestAnimationFrame(tick);
  };
  tick();

  const pause = () => {
    if (isPaused) return;
    isPaused = true;
    cancelAnimationFrame(rafId);
  };
  const resume = () => {
    if (!isPaused) return;
    isPaused = false;
    tick();
  };

  const dispose = () => {
    pause();
    cancelSnap();
    if (idleTimer) clearTimeout(idleTimer);
    resizeObserver.disconnect();
    container.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    renderer.dispose();
    container.removeChild(renderer.domElement);
  };

  return { pause, resume, dispose };
}

async function loadFaceTextures(THREE, box) {
  const makeMaterial = (canvas) => {
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return new THREE.MeshPhysicalMaterial({
      map: texture,
      roughness: 0.32,
      metalness: 0.06,
      clearcoat: 0.65,
      clearcoatRoughness: 0.18,
    });
  };

  const { front, back, backPulse, backBarcodeRect, left, right } = await buildBoxTextures();

  const backMaterial = makeMaterial(back);

  box.material[4] = makeMaterial(front); // +z front
  box.material[5] = backMaterial; // -z back
  box.material[0] = makeMaterial(right); // +x right
  box.material[1] = makeMaterial(left); // -x left
  box.material.forEach((m) => (m.needsUpdate = true));

  return {
    backPulse: backPulse
      ? (t, active) => {
          backPulse(t, active);
          backMaterial.map.needsUpdate = true;
        }
      : null,
    backBarcodeRect,
  };
}
