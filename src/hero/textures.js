import JsBarcode from "jsbarcode";
import characterFrontUrl from "../assets/character-front.webp";
import accessoriesSetUrl from "../assets/accessories-set.webp";

const PALETTE = {
  yellow: "#f5cb39",
  navy: "#22252b",
  white: "#ffffff",
  accent: "#ff5c39",
  ink: "#1c1c1a",
};

const FRONT_W = 700;
const FRONT_H = 880;
const BACK_W = 700;
const BACK_H = 880;
const SIDE_W = 320;
const SIDE_H = 880;

// accessories_set.png (1232x928) 안의 5개 아이템 위치 — 알파 채널 연결 요소 분석으로 구한
// 실제 바운딩 박스 기준 정규화 좌표/반폭/반높이 (다른 소품이 함께 잘리지 않도록 정확히 맞춤)
const ACCESSORY_CROPS = [
  { label: "Keyboard", cx: 0.4708, cy: 0.319, rw: 0.138, rh: 0.2069 },
  { label: "Drum Sticks", cx: 0.1883, cy: 0.347, rw: 0.1185, rh: 0.1466 },
  { label: "Books", cx: 0.7524, cy: 0.3524, rw: 0.103, rh: 0.1713 },
  { label: "Diary", cx: 0.7508, cy: 0.7231, rw: 0.0999, rh: 0.1455 },
  { label: "Notebook", cx: 0.2224, cy: 0.6649, rw: 0.1023, rh: 0.1606 },
];

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function roundRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

// 이미지 소품 안의 정규화 좌표(cx,cy)와 반폭/반높이(rw,rh)를 크롭해 지름 size짜리 원형
// 캔버스로 만든다. fitMode "contain"(기본)은 소품 비율을 유지한 채 안에 맞춰서 옆 소품이
// 함께 잘려 들어오거나 비율이 일그러지는 일이 없도록 하고, "cover"는 이미지가 원을 꽉
// 채우도록(원이 이미지를 마스킹하는 형태로) 크게 확대해 그린다.
function cropToCircle(img, cx, cy, rw, rh, size = 320, fitMode = "contain") {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const sw = rw * 2 * img.width;
  const sh = rh * 2 * img.height;
  const sx = cx * img.width - sw / 2;
  const sy = cy * img.height - sh / 2;

  const scale =
    fitMode === "cover" ? Math.max(size / sw, size / sh) : Math.min(size / sw, size / sh) * 0.94;
  const dw = sw * scale;
  const dh = sh * scale;
  const dx = (size - dw) / 2;
  const dy = (size - dh) / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
  ctx.restore();
  return canvas;
}

function drawCircleThumb(
  ctx,
  canvas,
  cx,
  cy,
  diameter,
  { ring = PALETTE.yellow, ringWidth = 5, glow = "rgba(0,0,0,0.18)", fill = PALETTE.white } = {}
) {
  ctx.save();
  ctx.shadowColor = glow;
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, diameter / 2 + 6, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, diameter / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(canvas, cx - diameter / 2, cy - diameter / 2, diameter, diameter);
  ctx.restore();

  ctx.beginPath();
  ctx.arc(cx, cy, diameter / 2, 0, Math.PI * 2);
  ctx.lineWidth = ringWidth;
  ctx.strokeStyle = ring;
  ctx.stroke();
}

// 사이트 컨셉(스캔 제품)에 맞춘 작은 로고 배지: 미니 바코드 + 모노그램
function drawLogo(ctx, x, y, size) {
  ctx.save();
  roundRectPath(ctx, x, y, size, size, size * 0.28);
  ctx.fillStyle = PALETTE.navy;
  ctx.fill();

  const bars = [2, 1, 3, 1, 1, 2, 1, 3];
  const totalUnits = bars.reduce((a, b) => a + b + 1, 0);
  const padX = size * 0.18;
  const barsW = size - padX * 2;
  const unit = barsW / totalUnits;
  const barTop = y + size * 0.16;
  const barH = size * 0.38;

  ctx.fillStyle = PALETTE.white;
  let bx = x + padX;
  bars.forEach((w) => {
    ctx.fillRect(bx, barTop, unit * w, barH);
    bx += unit * (w + 1);
  });

  ctx.fillStyle = "#c9a233";
  ctx.font = `800 ${Math.round(size * 0.34)}px 'Pretendard', Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("CY", x + size / 2, y + size * 0.86);
  ctx.restore();
}

function drawCheckmark(ctx, cx, cy, size, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.24;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.5, cy);
  ctx.lineTo(cx - size * 0.12, cy + size * 0.42);
  ctx.lineTo(cx + size * 0.55, cy - size * 0.4);
  ctx.stroke();
  ctx.restore();
}

// 폰트 크기를 줄여가며 maxWidth 안에 들어가도록 fillText 한다.
function fitText(ctx, text, x, y, maxWidth) {
  const baseFont = ctx.font;
  let size = parseInt(baseFont.match(/(\d+)px/)[1], 10);

  while (size > 12 && ctx.measureText(text).width > maxWidth) {
    size -= 2;
    ctx.font = baseFont.replace(/\d+px/, `${size}px`);
  }
  ctx.fillText(text, x, y);
}

// 캔버스에서 실제로 불투명한 픽셀이 차지하는 바운딩 박스를 구한다.
function getOpaqueBBoxFromCanvas(canvas, alphaThreshold = 30) {
  const { width, height } = canvas;
  const { data } = canvas.getContext("2d").getImageData(0, 0, width, height);

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = data[(y * width + x) * 4 + 3];
      if (a > alphaThreshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  return { x: minX, y: minY, w: Math.max(1, maxX - minX), h: Math.max(1, maxY - minY) };
}

function getOpaqueBBox(img, alphaThreshold = 30) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext("2d").drawImage(img, 0, 0);
  return getOpaqueBBoxFromCanvas(canvas, alphaThreshold);
}

// 정규화 좌표(cx,cy,r) 주변을 잘라낸 뒤, 투명한 여백을 다시 한번 다듬어
// 소품 실루엣에 꼭 맞는 캔버스를 만든다 (원형 마스크 없이 자연스러운 모양 그대로).
function cropTight(img, cx, cy, rw, rh, pad = 14) {
  const sw = rw * 2 * img.width + pad * 2;
  const sh = rh * 2 * img.height + pad * 2;
  const sx = cx * img.width - sw / 2;
  const sy = cy * img.height - sh / 2;

  const rough = document.createElement("canvas");
  rough.width = sw;
  rough.height = sh;
  rough.getContext("2d").drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

  const bbox = getOpaqueBBoxFromCanvas(rough);
  const trimmed = document.createElement("canvas");
  trimmed.width = bbox.w;
  trimmed.height = bbox.h;
  trimmed.getContext("2d").drawImage(rough, bbox.x, bbox.y, bbox.w, bbox.h, 0, 0, bbox.w, bbox.h);
  return trimmed;
}

async function loadAssets() {
  const [character, accessories] = await Promise.all([
    loadImage(characterFrontUrl),
    loadImage(accessoriesSetUrl),
  ]);

  const characterBBox = getOpaqueBBox(character);

  const accessoryThumbs = ACCESSORY_CROPS.map((item) => ({
    label: item.label,
    canvas: cropToCircle(accessories, item.cx, item.cy, item.rw, item.rh, 340),
  }));

  const accessoryCutouts = ACCESSORY_CROPS.map((item) => ({
    label: item.label,
    canvas: cropTight(accessories, item.cx, item.cy, item.rw, item.rh),
  }));

  return { character, accessories, characterBBox, accessoryThumbs, accessoryCutouts };
}

function buildFrontTexture(assets) {
  const canvas = document.createElement("canvas");
  canvas.width = FRONT_W;
  canvas.height = FRONT_H;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#fbfaf6";
  ctx.fillRect(0, 0, FRONT_W, FRONT_H);

  // --- 상단: 작은 로고 배지 + 식별 표시 (실제 넨도로이드 박스의 미니 로고/번호 자리) ---
  drawLogo(ctx, 28, 10, 30);

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = PALETTE.navy;
  ctx.font = "700 17px 'Pretendard', 'Apple SD Gothic Neo', Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("KIM CHAEYOUNG", 68, 34);

  ctx.fillStyle = "rgba(28,28,26,0.55)";
  ctx.font = "600 14px 'Pretendard', 'Apple SD Gothic Neo', Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("No. 313", FRONT_W - 30, 23);
  ctx.fillText("Frontend Developer", FRONT_W - 30, 40);

  ctx.strokeStyle = "rgba(28,28,26,0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(28, 48);
  ctx.lineTo(FRONT_W - 28, 48);
  ctx.stroke();

  // --- 창(윈도우): 박스 안에 피규어가 들어있는 것처럼. 좌우 폭은 좁게(흰 여백을 굵게) ---
  const windowMargin = 62;
  const windowTop = 88;
  const windowBottom = 662;
  const windowX = windowMargin;
  const windowW = FRONT_W - windowMargin * 2;
  const windowH = windowBottom - windowTop;

  ctx.save();
  roundRectPath(ctx, windowX, windowTop, windowW, windowH, 16);
  ctx.clip();

  // 테마 옐로우 계열의 밝은 머스타드 배경 (라디얼로 은은한 명암만)
  const bgGrad = ctx.createRadialGradient(
    windowX + windowW * 0.5,
    windowTop + windowH * 0.4,
    windowW * 0.05,
    windowX + windowW * 0.5,
    windowTop + windowH * 0.48,
    windowW * 0.85
  );
  bgGrad.addColorStop(0, "#ecc85f");
  bgGrad.addColorStop(0.55, "#cda538");
  bgGrad.addColorStop(1, "#96772a");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(windowX, windowTop, windowW, windowH);

  // 인물 이미지를 실제 크기(알파 바운딩 박스) 기준으로 배치
  const bbox = assets.characterBBox;
  const innerW = windowW - 84;
  const innerH = windowH - 40;
  const scale = Math.min(innerW / bbox.w, innerH / bbox.h);
  const drawW = bbox.w * scale;
  const drawH = bbox.h * scale;
  const charDx = windowX + (windowW - drawW) / 2;
  const charDy = windowBottom - 18 - drawH;

  // 자연스러운 실루엣 그대로의 소품 크롭 (원형 마스크 없이 배경색과 함께 어우러지도록),
  // 바닥이 아니라 캐릭터 주위(좌우 상/중/하)에 골고루 흩뿌려 배치한다.
  const cutouts = assets.accessoryCutouts;
  const drawProp = (cutout, cx, cy, targetH, opacity = 1) => {
    const h = targetH;
    const w = (cutout.canvas.width / cutout.canvas.height) * h;
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 16;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 8;
    ctx.drawImage(cutout.canvas, cx - w / 2, cy - h / 2, w, h);
    ctx.restore();
  };

  // 격자형 배치: 좌/우 컬럼을 같은 x, 같은 3단 y에 정렬해 한쪽이 빽빽해 보이지 않도록 한다.
  // 실제로 피규어가 사용하는 소품이라고 느껴지도록 캐릭터 대비 충분히 큰 크기로.
  const gridLeftX = windowX + 72;
  const gridRightX = windowX + windowW - 72;
  const gridRowY = [
    windowTop + windowH * 0.16,
    windowTop + windowH * 0.48,
    windowTop + windowH * 0.8,
  ];

  // 뒤쪽 줄(위/중간)은 캐릭터보다 먼저 그려 살짝 뒤에 있는 듯하게
  drawProp(cutouts[2], gridLeftX, gridRowY[0], 100, 0.85); // Books - 왼쪽 위
  drawProp(cutouts[4], gridRightX, gridRowY[0], 155, 0.85); // Notebook(헤드폰) - 오른쪽 위, 머리 대비 1.5:1
  drawProp(cutouts[0], gridLeftX, gridRowY[1], 118, 0.92); // Keyboard - 왼쪽 중간

  ctx.drawImage(assets.character, bbox.x, bbox.y, bbox.w, bbox.h, charDx, charDy, drawW, drawH);

  // 맨 아래 줄은 캐릭터보다 앞에 겹쳐서 z 깊이를 강조
  drawProp(cutouts[1], gridLeftX, gridRowY[2], 128, 1); // Drum Sticks - 왼쪽 아래
  drawProp(cutouts[3], gridRightX, gridRowY[2], 110, 1); // Diary - 오른쪽 아래

  // 박스 프레임과 내부 사이의 단차 — 가장자리를 안쪽으로 살짝 어둡게 해 리세스(깊이) 표현
  const edge = 46;
  let edgeGrad = ctx.createLinearGradient(0, windowTop, 0, windowTop + edge);
  edgeGrad.addColorStop(0, "rgba(0,0,0,0.38)");
  edgeGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(windowX, windowTop, windowW, edge);

  edgeGrad = ctx.createLinearGradient(0, windowBottom - edge, 0, windowBottom);
  edgeGrad.addColorStop(0, "rgba(0,0,0,0)");
  edgeGrad.addColorStop(1, "rgba(0,0,0,0.38)");
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(windowX, windowBottom - edge, windowW, edge);

  edgeGrad = ctx.createLinearGradient(windowX, 0, windowX + edge, 0);
  edgeGrad.addColorStop(0, "rgba(0,0,0,0.34)");
  edgeGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(windowX, windowTop, edge, windowH);

  edgeGrad = ctx.createLinearGradient(windowX + windowW - edge, 0, windowX + windowW, 0);
  edgeGrad.addColorStop(0, "rgba(0,0,0,0)");
  edgeGrad.addColorStop(1, "rgba(0,0,0,0.34)");
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(windowX + windowW - edge, windowTop, edge, windowH);

  // 유리/플라스틱 느낌의 매끈한 표면 광택 — 대각선 그라데이션 + 상단 하이라이트 + 반사 스트릭
  const glassGrad = ctx.createLinearGradient(windowX, windowTop, windowX + windowW, windowBottom);
  glassGrad.addColorStop(0, "rgba(255,255,255,0.24)");
  glassGrad.addColorStop(0.45, "rgba(255,255,255,0.04)");
  glassGrad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glassGrad;
  ctx.fillRect(windowX, windowTop, windowW, windowH);

  const sheen = ctx.createLinearGradient(0, windowTop, 0, windowTop + windowH * 0.28);
  sheen.addColorStop(0, "rgba(255,255,255,0.2)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(windowX, windowTop, windowW, windowH * 0.28);

  ctx.save();
  ctx.translate(windowX + windowW * 0.2, windowTop + windowH * 0.5);
  ctx.rotate(-0.4);
  const streak = ctx.createLinearGradient(-34, 0, 34, 0);
  streak.addColorStop(0, "rgba(255,255,255,0)");
  streak.addColorStop(0.5, "rgba(255,255,255,0.2)");
  streak.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = streak;
  ctx.fillRect(-34, -windowH, 68, windowH * 2);
  ctx.restore();

  ctx.restore(); // clip 해제

  // 창 프레임 (플라스틱 테두리)
  ctx.save();
  roundRectPath(ctx, windowX, windowTop, windowW, windowH, 18);
  ctx.lineWidth = 10;
  ctx.strokeStyle = PALETTE.white;
  ctx.stroke();
  roundRectPath(ctx, windowX, windowTop, windowW, windowH, 18);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(34,37,43,0.4)";
  ctx.stroke();
  ctx.restore();

  // --- 하단: 큰 번호 + 이름 (좌측, 더 굵고 크게), 미리보기 원형 (우측, 창 모서리와 이어지도록) ---
  // 원의 우하단 꼭짓점(789.6, 950.4)을 고정하고 10% 확대
  const previewD = 320 * 1.1;
  const previewCx = 789.6 - previewD / 2;
  const previewCy = 950.4 - previewD / 2;

  const textRight = previewCx - previewD / 2 - 22;
  const textW = textRight - 32;

  // 하단에는 313 + 이름만 남기고, 313은 둥근 폰트 + 머스타드 브랜드 컬러로 크게
  ctx.textAlign = "left";
  ctx.fillStyle = "#c9a233";
  ctx.font = "800 108px Fredoka, 'Pretendard', 'Apple SD Gothic Neo', Arial, sans-serif";
  fitText(ctx, "313", 30, windowBottom + 104, textW);

  ctx.fillStyle = PALETTE.ink;
  ctx.font = "800 40px 'Pretendard', 'Apple SD Gothic Neo', Arial, sans-serif";
  fitText(ctx, "KIM CHAEYOUNG", 34, windowBottom + 176, textW);

  // 미리보기 원형: 창과 같은 톤의 머스타드 배경 + 얇은 링으로, 창 모서리와 자연스럽게 이어지도록
  const previewFill = ctx.createRadialGradient(
    previewCx,
    previewCy - previewD * 0.12,
    previewD * 0.06,
    previewCx,
    previewCy,
    previewD * 0.6
  );
  previewFill.addColorStop(0, "#ecc85f");
  previewFill.addColorStop(1, "#a2812f");

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.22)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;
  ctx.beginPath();
  ctx.arc(previewCx, previewCy, previewD / 2 + 6, 0, Math.PI * 2);
  ctx.fillStyle = previewFill;
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.arc(previewCx, previewCy, previewD / 2, 0, Math.PI * 2);
  ctx.lineWidth = 4;
  ctx.strokeStyle = PALETTE.yellow;
  ctx.stroke();

  // 원 안에 가두지 않고 상체(어깨~가슴)까지 보이도록 살짝 크게 올려서 그린다 (위쪽이 원을 넘어도 무방)
  const bustBBox = assets.characterBBox;
  const bustCenterX = bustBBox.x + bustBBox.w / 2;
  const bustSize = bustBBox.w * 1.05;
  const bustSx = bustCenterX - bustSize / 2;
  const bustSy = bustBBox.y;

  const bustDrawH = previewD * 1.1;
  const bustDrawW = bustDrawH;
  const bustDx = previewCx - bustDrawW / 2;
  const bustDy = previewCy - bustDrawH * 0.56;

  ctx.drawImage(
    assets.character,
    bustSx,
    bustSy,
    bustSize,
    bustSize,
    bustDx,
    bustDy,
    bustDrawW,
    bustDrawH
  );

  return canvas;
}

function buildBackTexture(assets) {
  const canvas = document.createElement("canvas");
  canvas.width = BACK_W;
  canvas.height = BACK_H;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = PALETTE.navy;
  ctx.fillRect(0, 0, BACK_W, BACK_H);

  // 헤더 + 번호 배지
  ctx.fillStyle = PALETTE.yellow;
  ctx.font = "800 32px 'Pretendard', 'Apple SD Gothic Neo', Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("SPECIFICATION", 50, 66);
  ctx.fillRect(50, 82, 80, 4);

  const codeBadgeW = 110;
  const codeBadgeH = 36;
  const codeBadgeX = BACK_W - codeBadgeW - 50;
  const codeBadgeY = 32;
  roundRectPath(ctx, codeBadgeX, codeBadgeY, codeBadgeW, codeBadgeH, 18);
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.fill();
  ctx.fillStyle = PALETTE.yellow;
  ctx.font = "700 17px 'Pretendard', 'Apple SD Gothic Neo', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("No. 313", codeBadgeX + codeBadgeW / 2, codeBadgeY + codeBadgeH / 2 + 1);

  // 스펙 목록 — 2열 그리드로 압축해서 중앙 콜라주에 공간을 내준다
  const specRows = [
    ["NAME", "김채영", "STATUS", "Available"],
    ["TYPE", "Frontend Developer", "EXPERIENCE", "4년 5개월"],
  ];
  const col1X = 50;
  const col2X = BACK_W / 2 + 20;
  const gridTop = 136;
  const gridRowGap = 64;

  specRows.forEach(([l1, v1, l2, v2], i) => {
    const y = gridTop + i * gridRowGap;
    [
      [col1X, l1, v1],
      [col2X, l2, v2],
    ].forEach(([x, label, value]) => {
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "600 13px ui-monospace, 'SF Mono', Menlo, Consolas, monospace";
      ctx.fillText(label, x, y);

      ctx.fillStyle = PALETTE.white;
      ctx.font = "700 22px 'Pretendard', 'Apple SD Gothic Neo', Arial, sans-serif";
      ctx.fillText(value, x, y + 26);
    });
  });

  const dividerY = gridTop + gridRowGap + 56;
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(50, dividerY);
  ctx.lineTo(BACK_W - 50, dividerY);
  ctx.stroke();
  ctx.setLineDash([]);

  // 중앙 콜라주: preview.webp처럼 큰 원 하나(왼쪽) + 작은 원 두 개(오른쪽, 세로 나열).
  // 이미지를 축소해서 담는 게 아니라 원이 이미지를 꽉 채워 마스킹하도록(cover) 하고,
  // 같은 인물을 전신 / 상체 / 하체로 다르게 잘라 배치한다.
  const collageTop = dividerY + 42;
  const collageBottom = BACK_H - 214;
  const collageCx = BACK_W / 2;
  const collageCy = (collageTop + collageBottom) / 2;

  const bigD = 266;
  const smallD = 172;
  const leftCx = collageCx - 120;
  const rightCx = collageCx + 140;

  const bbox = assets.characterBBox;
  const charW = assets.character.width;
  const charH = assets.character.height;

  // cover 크롭 시 세로로 넘치는 부분이 위/아래 대칭으로 잘리므로, 중심을 위로 당겨서
  // 발끝 대신 머리부터 온전히 보이도록 한다.
  const fullBodyThumb = cropToCircle(
    assets.character,
    (bbox.x + bbox.w / 2) / charW,
    (bbox.y + bbox.h * 0.33) / charH,
    ((bbox.w / 2) / charW) * 1.08,
    ((bbox.h / 2) / charH) * 1.08,
    380,
    "cover"
  );

  const upperH = bbox.h * 0.56;
  const upperThumb = cropToCircle(
    assets.character,
    (bbox.x + bbox.w / 2) / charW,
    (bbox.y + upperH / 2) / charH,
    ((bbox.w / 2) / charW) * 1.05,
    (upperH / 2 / charH) * 1.05,
    300,
    "cover"
  );

  const lowerH = bbox.h - upperH;
  const lowerThumb = cropToCircle(
    assets.character,
    (bbox.x + bbox.w / 2) / charW,
    (bbox.y + upperH + lowerH / 2) / charH,
    ((bbox.w / 2) / charW) * 1.05,
    (lowerH / 2 / charH) * 1.05,
    300,
    "cover"
  );

  const collageFill = (cx, cy, r) => {
    const grad = ctx.createRadialGradient(cx, cy - r * 0.12, r * 0.08, cx, cy, r * 1.05);
    grad.addColorStop(0, "#ecc85f");
    grad.addColorStop(1, "#a2812f");
    return grad;
  };

  drawCircleThumb(ctx, upperThumb, rightCx, collageCy - smallD * 0.58, smallD, {
    ring: PALETTE.white,
    ringWidth: 5,
    glow: "rgba(0,0,0,0.35)",
    fill: collageFill(rightCx, collageCy - smallD * 0.58, smallD / 2),
  });
  drawCircleThumb(ctx, lowerThumb, rightCx, collageCy + smallD * 0.58, smallD, {
    ring: PALETTE.white,
    ringWidth: 5,
    glow: "rgba(0,0,0,0.35)",
    fill: collageFill(rightCx, collageCy + smallD * 0.58, smallD / 2),
  });
  drawCircleThumb(ctx, fullBodyThumb, leftCx, collageCy, bigD, {
    ring: PALETTE.yellow,
    ringWidth: 6,
    glow: "rgba(0,0,0,0.4)",
    fill: PALETTE.white,
  });

  // 좌하단: 포트폴리오 컨셉 문서의 "Includes" 체크리스트
  const includesTop = collageBottom + 56;
  ctx.fillStyle = "#c9a233";
  ctx.font = "800 16px 'Pretendard', 'Apple SD Gothic Neo', Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("INCLUDES", 50, includesTop);
  ctx.fillRect(50, includesTop + 10, 46, 3);

  const includeItems = ["Keyboard", "Drum Sticks", "Books", "Notebook", "Diary", "Zelda"];
  const includeColW = 138;
  const includeRowGap = 30;
  const includeGridTop = includesTop + 40;
  includeItems.forEach((label, i) => {
    const col = Math.floor(i / 3);
    const row = i % 3;
    const x = 50 + col * includeColW;
    const y = includeGridTop + row * includeRowGap;

    drawCheckmark(ctx, x + 7, y - 5, 13, PALETTE.yellow);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "600 14px 'Pretendard', 'Apple SD Gothic Neo', Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + 22, y - 4);
  });

  // 바코드: 일반적인 제품처럼 우하단에 작게, "탭해서 스캔" 유도 펄스 글로우 포함
  const barcodeCanvas = document.createElement("canvas");
  JsBarcode(barcodeCanvas, "CY-0313", {
    format: "CODE128",
    background: "#ffffff",
    lineColor: "#1c1c1a",
    width: 2,
    height: 44,
    displayValue: true,
    fontSize: 13,
    margin: 8,
  });

  const panelW = 168;
  const panelH = barcodeCanvas.height * (panelW / barcodeCanvas.width);
  const panelX = BACK_W - panelW - 50;
  const panelY = BACK_H - panelH - 46;
  const padPanel = 7;

  const drawBarcodeStatic = () => {
    ctx.fillStyle = PALETTE.white;
    roundRectPath(
      ctx,
      panelX - padPanel,
      panelY - padPanel,
      panelW + padPanel * 2,
      panelH + padPanel * 2,
      9
    );
    ctx.fill();
    ctx.drawImage(barcodeCanvas, panelX, panelY, panelW, panelH);

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "600 12px 'Pretendard', 'Apple SD Gothic Neo', Arial, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("TAP TO SCAN", panelX + panelW, panelY - padPanel - 10);
  };

  // 바코드 패널을 감싸는 사각 영역 — 매 프레임 이 영역만 지우고 다시 그린다
  const borderInset = 5;
  const clearPad = padPanel + borderInset + 8;
  const clearX = panelX - clearPad;
  const clearY = panelY - clearPad;
  const clearW = panelW + clearPad * 2;
  const clearH = panelH + clearPad * 2;

  drawBarcodeStatic();

  // 애니메이션 루프에서 매 프레임 호출: 바코드 테두리를 따라 점선 보더가 도는(march) 효과
  // active(뒷면을 보고 있고 + 몇 초 이상 조작이 없을 때)일 때만 테두리가 천천히
  // 깜빡인다. 빠르게 도는 점선(마칭 앤츠)은 벌레처럼 보여서, 고정된 테두리의
  // 밝기만 은은하게 숨쉬듯 페이드 인/아웃 하는 방식으로 바꿨다.
  const pulse = (t, active) => {
    ctx.fillStyle = PALETTE.navy;
    ctx.fillRect(clearX, clearY, clearW, clearH);

    drawBarcodeStatic();

    if (!active) return;

    const alpha = 0.25 + 0.55 * Math.max(0, Math.sin(t / 900));
    ctx.save();
    roundRectPath(
      ctx,
      panelX - padPanel - borderInset,
      panelY - padPanel - borderInset,
      panelW + (padPanel + borderInset) * 2,
      panelH + (padPanel + borderInset) * 2,
      9 + borderInset
    );
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = `rgba(255,92,57,${alpha})`;
    ctx.stroke();
    ctx.restore();
  };

  // 바코드를 클릭으로 감지하기 위한 정규화(0~1) 히트 영역 — 손가락으로도 누르기 쉽게
  // 흰 패널보다 한 단계 더 넉넉하게 잡는다.
  const hitPad = padPanel + 16;
  const barcodeRect = {
    x: (panelX - hitPad) / BACK_W,
    y: (panelY - hitPad) / BACK_H,
    w: (panelW + hitPad * 2) / BACK_W,
    h: (panelH + hitPad * 2) / BACK_H,
  };

  return { canvas, pulse, barcodeRect };
}

function buildSideTextures(assets) {
  const leftItems = assets.accessoryThumbs.slice(0, 3);
  const rightItems = assets.accessoryThumbs.slice(3, 5);

  const renderSide = (items) => {
    const canvas = document.createElement("canvas");
    canvas.width = SIDE_W;
    canvas.height = SIDE_H;
    const ctx = canvas.getContext("2d");

    const grad = ctx.createLinearGradient(0, 0, 0, SIDE_H);
    grad.addColorStop(0, "#2a2e35");
    grad.addColorStop(1, PALETTE.navy);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SIDE_W, SIDE_H);

    ctx.fillStyle = PALETTE.yellow;
    ctx.fillRect(0, 0, SIDE_W, 10);
    ctx.fillRect(0, SIDE_H - 10, SIDE_W, 10);

    const thumbSize = 210;
    const gap = (SIDE_H - items.length * thumbSize) / (items.length + 1);
    const cx = SIDE_W / 2;

    items.forEach((thumb, i) => {
      const cy = gap + i * (thumbSize + gap) + thumbSize / 2;
      drawCircleThumb(ctx, thumb.canvas, cx, cy, thumbSize, {
        ring: PALETTE.yellow,
        ringWidth: 5,
        glow: "rgba(245,203,57,0.25)",
      });
    });

    return canvas;
  };

  return {
    left: renderSide(leftItems),
    right: renderSide(rightItems),
  };
}

export async function buildBoxTextures() {
  const [assets] = await Promise.all([
    loadAssets(),
    document.fonts.load("800 86px Fredoka").catch(() => {}),
  ]);

  const backResult = buildBackTexture(assets);

  return {
    front: buildFrontTexture(assets),
    back: backResult.canvas,
    backPulse: backResult.pulse,
    backBarcodeRect: backResult.barcodeRect,
    ...buildSideTextures(assets),
  };
}
