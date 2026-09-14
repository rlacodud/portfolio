import JsBarcode from "jsbarcode";
import { CONTACT } from "./content.js";

const PAPER = "#faf7ee";
const INK = "#1c1c1a";

// 스크롤이 멈췄다고 판단하기까지의 디바운스 시간
const SETTLE_DEBOUNCE_MS = 60;
// 영수증 패널에 다 도착한 뒤, "인쇄"가 시작되기까지의 텀 — 스크롤과 동시에 나오면
// 뽑히는 느낌이 안 나서, 도착 후 잠깐 멈췄다가 인쇄되도록 의도적으로 지연시킨다
const PRINT_DELAY_MS = 80;
// .receipt-outlet의 margin-top: -14px 과 맞춰, 프린터 바닥과 종이가 겹치는 양
const OUTLET_OVERLAP_PX = 14;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export function initReceipt(posScreen, options = {}) {
  const { onNavigate } = options;
  const stack = posScreen.querySelector(".receipt-scene__stack");
  const printer = posScreen.querySelector(".receipt-printer");
  const outlet = posScreen.querySelector("#receipt-outlet");
  const paper = posScreen.querySelector("#receipt-paper");
  const closeBtn = posScreen.querySelector("#receipt-close");

  let paperHeight = 0;
  let ready = false;
  let printed = false;
  let settleTimer = null;
  let printTimer = null;

  function buildContent() {
    paper.innerHTML = `
      <div class="receipt__header">
        <p class="receipt__name">${CONTACT.name}</p>
        <p class="receipt__role">${CONTACT.role}</p>
      </div>
      <div class="receipt__divider" aria-hidden="true"></div>
      <dl class="receipt__contact">
        <div class="receipt__row">
          <dt>GitHub</dt>
          <dd>
            <a href="${CONTACT.github.url}" target="_blank" rel="noopener noreferrer">${CONTACT.github.label}</a>
          </dd>
        </div>
        <div class="receipt__row">
          <dt>Blog</dt>
          <dd>
            <a href="${CONTACT.blog.url}" target="_blank" rel="noopener noreferrer">${CONTACT.blog.label}</a>
          </dd>
        </div>
        <div class="receipt__row">
          <dt>Email</dt>
          <dd>${CONTACT.email}</dd>
        </div>
      </dl>
      <div class="receipt__status">
        <span>STATUS</span>
        <span>${CONTACT.status}</span>
      </div>
      <a class="receipt__download" href="${CONTACT.resume.url}" download="${CONTACT.resume.filename}">
        ⬇ DOWNLOAD RESUME
      </a>
      <a class="receipt__download" href="${CONTACT.coverLetter.url}" download="${CONTACT.coverLetter.filename}">
        ⬇ DOWNLOAD COVER LETTER
      </a>
      <div class="receipt__divider" aria-hidden="true"></div>
      <p class="receipt__thanks">THANK YOU</p>
      <div class="receipt__barcode">
        <canvas></canvas>
      </div>
    `;

    const barcodeCanvas = paper.querySelector(".receipt__barcode canvas");
    JsBarcode(barcodeCanvas, CONTACT.code, {
      format: "CODE128",
      background: PAPER,
      lineColor: INK,
      width: 2,
      height: 44,
      displayValue: true,
      fontSize: 12,
      margin: 4,
    });
  }

  function measurePaper() {
    paperHeight = paper.scrollHeight + 8;
    // outlet은 종이 크기에 맞춰 고정된 "창"이고, 실제 인쇄 모션은 안의 .receipt를
    // 위→아래로 슬라이드시켜서 만든다 (printPaper/retractPaper 참고)
    outlet.style.height = `${paperHeight}px`;
  }

  // 다 뽑힌 영수증 기준(프린터 + 종이 전체 높이)으로 묶음 전체를 화면
  // 정중앙에 오도록 top을 픽셀로 고정한다. 종이가 프린터보다 훨씬 길기
  // 때문에 슬롯은 결과적으로 화면 중앙보다 더 위쪽에 자리하게 된다
  function positionStack() {
    const vh = posScreen.clientHeight || 0;
    const printerHeight = printer.offsetHeight;
    const assemblyHeight = printerHeight + Math.max(paperHeight - OUTLET_OVERLAP_PX, 0);
    const top = Math.max((vh - assemblyHeight) / 2, 64);
    stack.style.top = `${top}px`;
  }

  // 프린터/헤더의 페이드·패럴렉스는 스크롤에 그대로 붙어서 즉시 반응한다
  function updateProgress() {
    const vh = posScreen.clientHeight || 1;
    const progress = clamp(posScreen.scrollTop / vh, 0, 1);
    posScreen.style.setProperty("--progress", progress.toFixed(4));
    return progress;
  }

  function printPaper() {
    if (printed) return;
    printed = true;
    paper.classList.add("is-printed");
  }

  function retractPaper() {
    if (!printed) return;
    printed = false;
    paper.classList.remove("is-printed");
  }

  // 스크롤이 실제로 멈춘 뒤에야(디바운스) 어느 패널에 "도착"했는지 판단한다.
  // 영수증 패널에 도착했으면 텀을 두고 인쇄를 시작하고, POS 쪽으로 돌아왔으면 종이를 거둬들인다
  function handleSettle() {
    const progress = clamp(posScreen.scrollTop / (posScreen.clientHeight || 1), 0, 1);
    window.clearTimeout(printTimer);

    if (progress > 0.92) {
      printTimer = window.setTimeout(printPaper, PRINT_DELAY_MS);
    } else if (progress < 0.08) {
      retractPaper();
    }
  }

  function handleScroll() {
    updateProgress();
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(handleSettle, SETTLE_DEBOUNCE_MS);
  }

  posScreen.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", () => {
    updateProgress();
    if (!ready) return;
    measurePaper();
    positionStack();
  });

  buildContent();
  ready = true;
  measurePaper();
  positionStack();
  updateProgress();

  // instant: true면 /pos/contact로 곧장 딥링크 진입할 때처럼, POS 화면을
  // 거쳐가는 스크롤 애니메이션 없이 바로 그 자리로 점프한다
  function open({ instant = false } = {}) {
    if (instant) posScreen.scrollTop = posScreen.clientHeight;
    else posScreen.scrollTo({ top: posScreen.clientHeight, behavior: "smooth" });
  }

  function close({ instant = false } = {}) {
    if (instant) posScreen.scrollTop = 0;
    else posScreen.scrollTo({ top: 0, behavior: "smooth" });
  }

  // 닫기 버튼/Esc는 항상 onNavigate("/pos")를 거친다 — 라우터가 render()에서
  // close()를 호출해 실제 스크롤을 되돌리므로 여기서 직접 close()를 부르지 않는다
  closeBtn?.addEventListener("click", () => onNavigate?.("/pos"));
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (posScreen.scrollTop > posScreen.clientHeight / 2) onNavigate?.("/pos");
  });

  return { open, close };
}
