import {
  ABOUT,
  ABOUT_STORIES,
  PORTFOLIO_CONCEPT,
  LIFE,
  PROJECTS,
  BLOG,
  EXPERIENCE,
  CONTACT,
} from "./content.js";
import { MENU_ICONS, STATUS_ICONS, IMAGE_PLACEHOLDER_ICON, CHECK_ICON } from "./icons.js";

const MENU = [
  { id: "about", label: "ABOUT" },
  { id: "life", label: "LIFE" },
  { id: "projects", label: "PROJECTS" },
  { id: "blog", label: "BLOG" },
  { id: "experience", label: "EXPERIENCE" },
];

const ABOUT_ITEMS = [...ABOUT_STORIES, PORTFOLIO_CONCEPT];

// style.css의 pos-panel-leave / pos-panel-enter 애니메이션 길이와 맞춰야 한다
const LEAVE_MS = 180;
const ENTER_MS = 260;

export function initPos(container, options = {}) {
  const { onNavigate } = options;
  const backBtn = container.querySelector("#pos-back");
  const menuEl = container.querySelector("#pos-menu");
  const previewInner = container.querySelector("#pos-preview-inner");
  const orderBtn = container.querySelector("#pos-order");
  const summaryExpEl = container.querySelector("#pos-summary-exp");
  const summaryStatusEl = container.querySelector("#pos-summary-status");
  const summaryCodeEl = container.querySelector("#pos-summary-code");
  const clockEl = container.querySelector("#pos-clock");
  const wifiIconEl = container.querySelector("#pos-wifi-icon");
  const batteryIconEl = container.querySelector("#pos-battery-icon");
  const modalBackdrop = container.querySelector("#project-modal");
  const modalTitleEl = container.querySelector("#project-modal-title");
  const modalBody = container.querySelector("#project-modal-body");
  const modalCloseBtn = container.querySelector("#project-modal-close");
  const modalSelectBtn = container.querySelector("#project-modal-select");
  const cartListEl = container.querySelector("#pos-cart-list");
  const aboutModalBackdrop = container.querySelector("#about-modal");
  const aboutModalTitleEl = container.querySelector("#about-modal-title");
  const aboutModalBody = container.querySelector("#about-modal-body");
  const aboutModalCloseBtn = container.querySelector("#about-modal-close");

  let activeTab = "about";
  let switching = false;
  const selectedProjects = new Set();
  let modalProjectId = null;

  if (wifiIconEl) wifiIconEl.innerHTML = STATUS_ICONS.wifi;
  if (batteryIconEl) batteryIconEl.innerHTML = STATUS_ICONS.battery;

  // 모바일 레이아웃에서 ORDER SUMMARY가 하단 고정 바로 바뀌는데, 내용(줄 수)에
  // 따라 바 높이가 달라지므로 실제 높이를 재서 .pos__main의 하단 여백에 반영한다
  const summaryEl = container.querySelector(".pos-summary");
  if (summaryEl && "ResizeObserver" in window) {
    const syncSummaryHeight = () => {
      document.documentElement.style.setProperty("--summary-h", `${summaryEl.offsetHeight}px`);
    };
    new ResizeObserver(syncSummaryHeight).observe(summaryEl);
  }

  // 데스크톱 2단 레이아웃에서 우측 카트가 좌측 탭 바로 밑(= .pos__preview
  // 시작점)에서부터 시작하도록, 탭 줄 높이를 재서 카트 쪽 상단 여백으로 넘겨준다
  // (탭이 줄바꿈되면 높이가 달라지므로 고정값 대신 실측)
  if (menuEl && "ResizeObserver" in window) {
    const syncTabsHeight = () => {
      document.documentElement.style.setProperty("--tabs-h", `${menuEl.offsetHeight}px`);
    };
    new ResizeObserver(syncTabsHeight).observe(menuEl);
  }

  // 실제 포스기 화면처럼 상단에 실시간으로 흘러가는 날짜/시계를 띄운다
  if (clockEl) {
    const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
    const pad = (n) => String(n).padStart(2, "0");
    const tickClock = () => {
      const now = new Date();
      const hours24 = now.getHours();
      const ampm = hours24 < 12 ? "오전" : "오후";
      const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
      clockEl.textContent = `${pad(now.getMonth() + 1)}월 ${pad(now.getDate())}일(${WEEKDAYS[now.getDay()]}) ${ampm} ${pad(hours12)}:${pad(now.getMinutes())}`;
    };
    tickClock();
    window.setInterval(tickClock, 1000);
  }

  MENU.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pos-tabs__item";
    btn.dataset.tab = item.id;
    btn.innerHTML = `
      <span class="pos-tabs__icon">${MENU_ICONS[item.id]}</span>
      <span class="pos-tabs__label">${item.label}</span>
    `;
    btn.addEventListener("click", () => selectTab(item.id));
    menuEl.appendChild(btn);
  });

  if (summaryExpEl) summaryExpEl.textContent = CONTACT.experience;
  if (summaryStatusEl) summaryStatusEl.textContent = CONTACT.status;
  if (summaryCodeEl) summaryCodeEl.textContent = CONTACT.code;

  orderBtn?.addEventListener("click", () => onNavigate?.("/pos/contact"));
  backBtn?.addEventListener("click", () => onNavigate?.("/"));

  // --- 프로젝트 카드 클릭 시 뜨는 상세 팝업: 실제 포스기에서 상품을 눌렀을 때
  // 옵션을 고르는 팝업이 뜨는 것을 참고했다. SELECT를 누르면 해당 카드에
  // 선택 표시가 남는다(체크 배지 + 테두리 강조) ---
  function openProjectModal(id) {
    const project = PROJECTS.find((p) => p.id === id);
    if (!project || !modalBackdrop) return;
    modalProjectId = id;
    if (modalTitleEl) modalTitleEl.textContent = `#${project.id} ${project.title}`;
    modalBody.innerHTML = renderProjectDetail(project);
    modalBody.scrollTop = 0;
    updateModalSelectButton();
    modalBackdrop.classList.add("is-open");
    // 팝업이 떠 있는 동안 뒤의 #pos 섹션(영수증 패널로 넘어가는 100vh 스크롤)이
    // 스크롤 체이닝으로 같이 움직이지 않도록 잠근다
    container.classList.add("is-modal-open");
  }

  function closeProjectModal() {
    modalBackdrop?.classList.remove("is-open");
    container.classList.remove("is-modal-open");
  }

  // 문제 상황 및 해결 과정이 여러 소주제(sections)로 나뉜 프로젝트는 서브탭을
  // 눌러서 해당 소주제의 항목만 바꿔 보여준다 (팝업을 새로 열지 않고 내용만 교체)
  modalBody?.addEventListener("click", (e) => {
    const tab = e.target.closest(".project-subtab");
    if (!tab) return;
    const project = PROJECTS.find((p) => p.id === modalProjectId);
    if (!project?.sections) return;
    const index = Number(tab.dataset.index);
    modalBody.querySelectorAll(".project-subtab").forEach((t, i) => {
      t.classList.toggle("is-active", i === index);
    });
    const panel = modalBody.querySelector("#project-subpanel");
    if (panel) panel.innerHTML = renderProjectSection(project.sections[index]);
  });

  // --- ABOUT 스토리 카드 팝업: PROJECTS와 같은 .detail-modal 컴포넌트를 재사용한다 ---
  function openAboutModal(id) {
    const story = ABOUT_ITEMS.find((s) => s.id === id);
    if (!story || !aboutModalBackdrop) return;
    if (aboutModalTitleEl) aboutModalTitleEl.textContent = story.title;
    aboutModalBody.innerHTML = renderAboutDetail(story);
    aboutModalBody.scrollTop = 0;
    aboutModalBackdrop.classList.add("is-open");
    container.classList.add("is-modal-open");
  }

  function closeAboutModal() {
    aboutModalBackdrop?.classList.remove("is-open");
    container.classList.remove("is-modal-open");
  }

  aboutModalCloseBtn?.addEventListener("click", closeAboutModal);
  aboutModalBackdrop?.addEventListener("click", (e) => {
    if (e.target === aboutModalBackdrop) closeAboutModal();
  });

  // 카드가 커서를 살짝 따라 기울어지는 입체 효과 — 별도 물리 라이브러리 없이
  // CSS 커스텀 프로퍼티 + transition만으로 스프링에 가까운 느낌을 낸다
  function wireCardTilt(el) {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--tilt-x", `${(-py * 8).toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${(px * 10).toFixed(2)}deg`);
    });
    el.addEventListener("mouseleave", () => {
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
    });
  }

  // 등장 애니메이션이 fill-forwards로 transform을 붙들고 있으면 호버 기울임이
  // 하나도 반영되지 않는다 — 끝나는 즉시 최종 모습(불투명)을 인라인으로 고정하고
  // 애니메이션을 떼어내 transform을 돌려준다 (opacity:0인 기본 규칙으로 되돌아가
  // 카드가 다시 사라지지 않도록 opacity도 함께 고정해야 한다)
  function settleCardAnimation(el) {
    el.addEventListener(
      "animationend",
      () => {
        el.style.opacity = "1";
        el.style.animation = "none";
      },
      { once: true }
    );
  }

  function wireAboutCards() {
    previewInner.querySelectorAll(".about-card").forEach((card) => {
      card.addEventListener("click", () => openAboutModal(card.dataset.id));
      wireCardTilt(card);
      settleCardAnimation(card);
    });
  }

  function wireLifeCards() {
    previewInner.querySelectorAll(".life-grid__item").forEach((card) => {
      wireCardTilt(card);
      settleCardAnimation(card);
    });
  }

  function updateModalSelectButton() {
    if (!modalSelectBtn) return;
    const isSelected = selectedProjects.has(modalProjectId);
    modalSelectBtn.textContent = isSelected ? "SELECTED ✓" : "SELECT";
    modalSelectBtn.classList.toggle("is-selected", isSelected);
  }

  function updateCardSelectedState(id) {
    previewInner.querySelectorAll(`.project-card[data-id="${id}"]`).forEach((card) => {
      card.classList.toggle("is-selected", selectedProjects.has(id));
    });
  }

  // --- 우측 컬럼: 담은(선택한) 프로젝트 목록. 빈 상태에서는 안내 문구를 보여준다 ---
  function renderCart() {
    if (!cartListEl) return;
    if (selectedProjects.size === 0) {
      cartListEl.innerHTML = `
        <p class="pos-cart__empty">아직 담은 항목이 없어요.<br />PROJECTS에서 마음에 드는 항목을 선택해보세요.</p>
      `;
      return;
    }
    cartListEl.innerHTML = [...selectedProjects]
      .map((id) => PROJECTS.find((p) => p.id === id))
      .filter(Boolean)
      .map(
        (p) => `
        <div class="pos-cart__item">
          <span class="pos-cart__thumb">
            ${p.thumbnail ? `<img src="${p.thumbnail}" alt="" />` : IMAGE_PLACEHOLDER_ICON}
          </span>
          <span class="pos-cart__title">#${p.id} ${p.title}</span>
          <button type="button" class="pos-cart__remove" data-id="${p.id}" aria-label="담은 항목에서 빼기">✕</button>
        </div>
      `
      )
      .join("");
  }

  function toggleSelected(id) {
    if (selectedProjects.has(id)) selectedProjects.delete(id);
    else selectedProjects.add(id);
    updateCardSelectedState(id);
    renderCart();
    if (modalProjectId === id) updateModalSelectButton();
  }

  // 프로젝트 팝업은 /pos/projects/:id 라우트와 1:1로 대응한다 — 닫는 동작은
  // 전부 onNavigate("/pos")를 호출해서 라우터가 실제 DOM 반영(closeProject)을
  // 하도록 한다 (여기서 직접 closeProjectModal을 부르지 않는다)
  modalCloseBtn?.addEventListener("click", () => onNavigate?.("/pos"));
  modalBackdrop?.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) onNavigate?.("/pos");
  });
  modalSelectBtn?.addEventListener("click", () => {
    if (!modalProjectId) return;
    const wasSelected = selectedProjects.has(modalProjectId);
    toggleSelected(modalProjectId);
    // 방금 새로 담았을 때만 선택 표시를 아주 잠깐 보여주고 자동으로 닫는다
    // (다시 눌러서 빼는 경우는 계속 고르고 있을 수 있으니 열어둔다)
    if (!wasSelected) window.setTimeout(() => onNavigate?.("/pos"), 120);
  });
  cartListEl?.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".pos-cart__remove");
    if (removeBtn) toggleSelected(removeBtn.dataset.id);
  });
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (modalBackdrop?.classList.contains("is-open")) onNavigate?.("/pos");
    closeAboutModal();
  });

  function updateMenuActive() {
    menuEl.querySelectorAll(".pos-tabs__item").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.tab === activeTab);
    });
  }

  function renderActivePanel() {
    previewInner.innerHTML = renderTab(activeTab);
    previewInner.scrollTop = 0;
    if (activeTab === "projects") wireProjectCards();
    if (activeTab === "about") wireAboutCards();
    if (activeTab === "life") wireLifeCards();
  }

  // 탭/프로젝트 전환: 콘텐츠가 스케일 축소되며 사라졌다가(레이아웃 밀림 없이) 스케일
  // 확대되며 등장 — previewInner 자체의 transform만 애니메이션하고 내용 교체는
  // 완전히 사라진 뒤에 이뤄지므로 텍스트가 밀리듯 보이지 않는다.
  function swapContent() {
    if (switching) return;
    switching = true;
    previewInner.classList.add("is-leaving");

    window.setTimeout(() => {
      renderActivePanel();
      previewInner.classList.remove("is-leaving");
      previewInner.classList.add("is-entering");

      window.setTimeout(() => {
        previewInner.classList.remove("is-entering");
        switching = false;
      }, ENTER_MS);
    }, LEAVE_MS);
  }

  function selectTab(tabId) {
    if (tabId === activeTab || switching) return;
    // 프로젝트 팝업이 열린 채로 다른 탭을 누르면 팝업을 닫고, /pos/projects/:id
    // 상태였다면 주소도 /pos로 되돌려서 URL과 화면이 어긋나지 않게 한다
    if (modalBackdrop?.classList.contains("is-open")) {
      closeProjectModal();
      if (location.pathname.startsWith("/pos/projects/")) {
        history.replaceState({}, "", "/pos");
      }
    }
    closeAboutModal();
    activeTab = tabId;
    updateMenuActive();
    swapContent();
  }

  // /pos/projects/:id로 곧장 진입할 때 쓰는 진입점 — 탭이 이미 projects가
  // 아니면 전환 애니메이션 없이 즉시 그리드부터 그린 뒤 팝업을 연다
  function showProject(id) {
    if (activeTab !== "projects") {
      activeTab = "projects";
      updateMenuActive();
      previewInner.innerHTML = renderTab(activeTab);
      previewInner.scrollTop = 0;
      wireProjectCards();
    }
    openProjectModal(id);
  }

  function wireProjectCards() {
    previewInner.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("click", () => onNavigate?.(`/pos/projects/${card.dataset.id}`));
    });
  }

  function renderTab(tabId) {
    switch (tabId) {
      case "about":
        return renderAbout();
      case "life":
        return renderLife();
      case "projects":
        return renderProjects();
      case "blog":
        return renderBlog();
      case "experience":
        return renderExperience();
      default:
        return "";
    }
  }

  function renderAbout() {
    return `
      <div class="pos-panel pos-panel--about">
        <p class="pos-eyebrow">${ABOUT.eyebrow}</p>
        <h2 class="pos-panel__title">${ABOUT.name} · ${ABOUT.role}</h2>
        <p class="pos-panel__tagline">${ABOUT.tagline}</p>
        <p class="about-mission">${ABOUT.mission}</p>
        <div class="about-grid">
          ${ABOUT_ITEMS.map(
            (s, i) => `
            <button type="button" class="about-card${
              s === PORTFOLIO_CONCEPT ? " about-card--concept" : ""
            }" data-id="${s.id}" style="--i:${i}">
              <span class="about-card__index">${
                s === PORTFOLIO_CONCEPT ? "✦" : `0${i + 1}`
              }</span>
              <span class="about-card__title">${s.title}</span>
              <span class="about-card__hook">${s.hook}</span>
              <span class="about-card__cta">더 보기 →</span>
            </button>
          `
          ).join("")}
        </div>
        <a
          class="pos-panel__download"
          href="${CONTACT.coverLetter.url}"
          download="${CONTACT.coverLetter.filename}"
        >
          ⬇ 자기소개서 다운로드
        </a>
      </div>
    `;
  }

  function renderAboutDetail(story) {
    return `<div class="detail-modal__content">${story.body
      .map((p) => `<p class="about-detail__paragraph">${p}</p>`)
      .join("")}</div>`;
  }

  function renderLife() {
    return `
      <div class="pos-panel pos-panel--life">
        <p class="pos-eyebrow">${LIFE.eyebrow}</p>
        <p class="pos-panel__summary">${LIFE.summary}</p>
        <ul class="life-grid">
          ${LIFE.items
            .map(
              (item, i) => `
            <li class="life-grid__item" style="--i:${i}">
              <span class="life-grid__label">${item.label}</span>
              <span class="life-grid__desc">${item.desc}</span>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    `;
  }

  // 썸네일이 없는 프로젝트는 회색 배경 + 이미지 아이콘 자리표시자로 대신한다
  function renderProjects() {
    return `
      <div class="pos-panel pos-panel--projects">
        <p class="pos-eyebrow">SCAN HISTORY</p>
        <div class="project-grid">
          ${PROJECTS.map(
            (p) => `
            <button type="button" class="project-card${
              selectedProjects.has(p.id) ? " is-selected" : ""
            }" data-id="${p.id}">
              <span class="project-card__thumb">
                ${
                  p.thumbnail
                    ? `<img src="${p.thumbnail}" alt="" />`
                    : IMAGE_PLACEHOLDER_ICON
                }
                <span class="project-card__check">${CHECK_ICON}</span>
              </span>
              <span class="project-card__body">
                <span class="project-card__id">#${p.id}</span>
                <span class="project-card__title">${p.title}</span>
                <span class="project-card__tags">${p.stack.slice(0, 2).join(" · ")}</span>
              </span>
            </button>
          `
          ).join("")}
        </div>
      </div>
    `;
  }

  // process가 sections(여러 소주제)로 나뉜 프로젝트는 서브탭(01/02...)으로,
  // 예전처럼 단일 목록(process)인 프로젝트는 기존 방식 그대로 보여준다
  function renderProjectDetail(project) {
    const processHtml = project.sections
      ? `
        <div class="project-subtabs" role="tablist">
          ${project.sections
            .map(
              (s, i) => `
            <button type="button" class="project-subtab${
              i === 0 ? " is-active" : ""
            }" data-index="${i}">0${i + 1}</button>
          `
            )
            .join("")}
        </div>
        <div class="project-subpanel" id="project-subpanel">
          ${renderProjectSection(project.sections[0])}
        </div>
      `
      : `
        <ul class="project-detail__process">
          ${project.process.map((step) => `<li>${step}</li>`).join("")}
        </ul>
      `;

    return `
      <div class="detail-modal__banner">
        ${
          project.preview || project.thumbnail
            ? `<img src="${project.preview || project.thumbnail}" alt="" />`
            : IMAGE_PLACEHOLDER_ICON
        }
      </div>
      <div class="detail-modal__content">
        <h2 class="project-detail__title">#${project.id} ${project.title}</h2>
        ${project.company ? `<p class="project-detail__company">${project.company}</p>` : ""}
        <p class="project-detail__intro">${project.intro}</p>

        ${
          project.role
            ? `
          <h3 class="project-detail__heading">담당 역할</h3>
          <p class="project-detail__role">${project.role}</p>
        `
            : ""
        }

        <h3 class="project-detail__heading">문제 상황 및 해결 과정</h3>
        ${processHtml}

        ${
          project.stack?.length
            ? `
          <h3 class="project-detail__heading">기술 스택</h3>
          <div class="stack-chips">
            ${project.stack.map((s) => `<span class="stack-chip">${s}</span>`).join("")}
          </div>
        `
            : ""
        }

        ${
          project.retro
            ? `
          <h3 class="project-detail__heading">회고</h3>
          <p class="project-detail__retro">${project.retro}</p>
        `
            : ""
        }
      </div>
    `;
  }

  function renderProjectSection(section) {
    return `
      <p class="project-subpanel__title">${section.title}</p>
      <ul class="project-detail__process">
        ${section.points.map((p) => `<li>${p}</li>`).join("")}
      </ul>
    `;
  }

  function renderBlog() {
    return `
      <div class="pos-panel pos-panel--blog">
        <p class="pos-eyebrow">${BLOG.eyebrow}</p>
        <p class="pos-panel__summary">${BLOG.stat}</p>
        <ul class="blog-list">
          ${BLOG.posts
            .map(
              (post) => `
            <li class="blog-list__item">
              <span class="blog-list__category">${post.category}</span>
              <a
                class="blog-list__title"
                href="https://${post.url}"
                target="_blank"
                rel="noopener noreferrer"
              >${post.title}</a>
            </li>
          `
            )
            .join("")}
        </ul>
        <a
          class="blog-list__more"
          href="${CONTACT.blog.url}"
          target="_blank"
          rel="noopener noreferrer"
        >블로그에서 더 보기 →</a>
      </div>
    `;
  }

  function renderExperience() {
    return `
      <div class="pos-panel pos-panel--experience">
        <p class="pos-eyebrow">${EXPERIENCE.eyebrow}</p>
        <ul class="experience-list">
          ${EXPERIENCE.companies
            .map(
              (c) => `
            <li class="experience-list__item">
              <h3 class="experience-list__name">${c.name}</h3>
              <ul class="experience-list__takeaways">
                ${c.takeaways.map((t) => `<li>${t}</li>`).join("")}
              </ul>
            </li>
          `
            )
            .join("")}
        </ul>
        <a
          class="pos-panel__download"
          href="${CONTACT.resume.url}"
          download="${CONTACT.resume.filename}"
        >
          ⬇ 이력서 다운로드
        </a>
      </div>
    `;
  }

  updateMenuActive();
  renderActivePanel();
  renderCart();

  // main.js의 라우터가 URL에 맞춰 DOM 상태를 직접 맞출 때 쓰는 진입점.
  // 사용자 상호작용(클릭 등)에서는 항상 onNavigate를 거치고, 여기 반환하는
  // 함수들은 오직 "이미 결정된 라우트에 화면을 맞추는" 용도로만 호출된다
  return {
    showProject,
    closeProject: closeProjectModal,
  };
}
