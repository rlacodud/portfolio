import "./style.css";

const heroSection = document.getElementById("hero");
const heroCanvas = document.getElementById("hero-canvas");
const heroHint = document.getElementById("hero-hint");
const heroExploreBtn = document.getElementById("hero-explore-btn");
const scanLineEl = document.getElementById("scan-line");
const beepEl = document.getElementById("beep-bubble");
const posSection = document.getElementById("pos");

let heroStarted = false;
let posStarted = false;
let posApi = null;
let receiptApi = null;
let heroApi = null;
let posPrefetchStarted = false;

// 히어로(3D 박스)가 로드된 뒤 브라우저가 한가한 틈에 POS 번들을 미리 받아둔다 —
// 실제 진입은 여전히 스캔해야만 가능하지만, 그 전에 이미 캐시돼 있어서 전환이
// 끊김 없이 바로 이어진다. requestIdleCallback이 없는 브라우저(Safari 등)는
// setTimeout으로 대체한다
function prefetchPos() {
  if (posPrefetchStarted || posStarted) return;
  posPrefetchStarted = true;
  // 히어로가 매 프레임 requestAnimationFrame으로 계속 렌더링하는 동안에는
  // 브라우저가 "진짜 유휴 상태"를 거의 보고하지 않아 timeout 없는
  // requestIdleCallback은 사실상 발동하지 않는다 — timeout으로 상한을 둬서
  // 유휴 여부와 무관하게 일정 시간 안에는 반드시 실행되게 한다
  const schedule =
    window.requestIdleCallback || ((cb) => setTimeout(cb, 2000));
  schedule(
    () => {
      import("./pos/receipt.js");
      import("./pos/index.js");
    },
    { timeout: 2000 }
  );
}

// --- 아주 단순한 4-경로 라우터 (외부 라이브러리 없이 History API를 직접 쓴다) ---
// /                 → 히어로부터 시작 (풀 인트로)
// /pos              → 인트로 없이 곧장 POS 화면
// /pos/projects/:id → POS + 해당 프로젝트 상세 팝업이 열린 상태
// /pos/contact      → POS + 영수증(연락처) 패널이 열린 상태
function parseRoute(pathname) {
  if (pathname === "/pos") return { name: "pos" };
  if (pathname === "/pos/contact") return { name: "contact" };
  const match = pathname.match(/^\/pos\/projects\/([^/]+)\/?$/);
  if (match) return { name: "project", id: match[1] };
  return { name: "home" };
}

// 사용자 상호작용(스캔, 카드 클릭, 뒤로가기 버튼 등)은 전부 이 함수를 거쳐서
// URL을 바꾸고, 그 결과로 render()가 실제 화면 상태를 맞춘다 — 화면을 직접
// 조작하는 코드는 이 파일 하나로 모아서 URL과 화면이 어긋나지 않게 한다
function navigate(path, { replace = false } = {}) {
  if (location.pathname !== path) {
    history[replace ? "replaceState" : "pushState"]({}, "", path);
  }
  render(parseRoute(path), true);
}

window.addEventListener("popstate", () => {
  render(parseRoute(location.pathname), true);
});

async function ensureHero() {
  if (heroStarted) return;
  heroStarted = true;
  const { initHero } = await import("./hero/index.js");
  heroApi = await initHero(heroCanvas, heroHint, {
    scanLineEl,
    beepEl,
    exploreBtn: heroExploreBtn,
    onScanned: () => navigate("/pos"),
  });
}

async function ensurePos() {
  if (posStarted) return;
  posStarted = true;
  const { initReceipt } = await import("./pos/receipt.js");
  receiptApi = initReceipt(posSection, { onNavigate: navigate });
  const { initPos } = await import("./pos/index.js");
  posApi = initPos(posSection, { onNavigate: navigate });
}

// animated=false면(최초 딥링크 진입) 트랜지션 없이 즉시 상태를 맞춰서, 이전
// 화면을 거치지 않고 목표 화면부터 바로 보이게 한다. animated=true면 기존의
// 스캔/뒤로가기 애니메이션 그대로 재생된다
function showHero(animated) {
  if (heroSection.hidden === false && posSection.hidden) return;
  heroApi?.resume();
  if (animated && !posSection.hidden) {
    posSection.classList.remove("is-entering");
    posSection.classList.add("is-leaving");
    posSection.addEventListener(
      "animationend",
      () => {
        posSection.hidden = true;
        posSection.classList.remove("is-leaving");
      },
      { once: true }
    );
    heroSection.hidden = false;
    heroSection.classList.remove("is-leaving");
    heroSection.classList.add("is-entering");
    heroSection.addEventListener(
      "animationend",
      () => heroSection.classList.remove("is-entering"),
      { once: true }
    );
  } else {
    posSection.hidden = true;
    posSection.classList.remove("is-leaving", "is-entering");
    heroSection.hidden = false;
    heroSection.classList.remove("is-leaving", "is-entering");
  }
}

function showPos(animated) {
  if (posSection.hidden === false && heroSection.hidden) return;
  heroApi?.pause();
  if (animated && !heroSection.hidden) {
    heroSection.classList.remove("is-entering");
    heroSection.classList.add("is-leaving");
    heroSection.addEventListener(
      "animationend",
      () => {
        heroSection.hidden = true;
        heroSection.classList.remove("is-leaving");
      },
      { once: true }
    );
    posSection.hidden = false;
    posSection.classList.remove("is-leaving");
    posSection.classList.add("is-entering");
    posSection.addEventListener(
      "animationend",
      () => posSection.classList.remove("is-entering"),
      { once: true }
    );
  } else {
    heroSection.hidden = true;
    heroSection.classList.remove("is-leaving", "is-entering");
    posSection.hidden = false;
    posSection.classList.remove("is-leaving", "is-entering");
  }
}

// 주어진 라우트에 맞춰 DOM 상태를 처음부터 다시 계산해 적용한다(멱등) —
// 최초 로드, 인앱 내비게이션(navigate), 브라우저 뒤/앞으로가기(popstate)가
// 전부 이 한 함수를 통과하므로 상태가 어긋날 일이 없다
async function render(route, animated) {
  if (route.name === "home") {
    if (posStarted) {
      posApi.closeProject();
      receiptApi.close({ instant: true });
    }
    // 섹션을 먼저 보이게 한 뒤에 히어로를 초기화해야 한다 — Three.js가 캔버스
    // 크기(clientWidth/Height)를 읽는 시점에 #hero가 아직 display:none이면
    // 0×0으로 렌더러가 잡혀버린다
    showHero(animated);
    await ensureHero();
    prefetchPos();
    return;
  }

  showPos(animated);
  // 마찬가지로 #pos가 보이는 상태에서 초기화해야 영수증 종이 높이 측정 등
  // 레이아웃 값을 읽는 로직이 올바르게 동작한다
  await ensurePos();

  if (route.name === "project") {
    posApi.showProject(route.id);
  } else {
    posApi.closeProject();
  }

  if (route.name === "contact") {
    receiptApi.open({ instant: !animated });
  } else {
    receiptApi.close({ instant: !animated });
  }
}

// 최초 진입: 현재 주소에 맞는 화면으로 트랜지션 없이 바로 들어간다
render(parseRoute(location.pathname), false);
