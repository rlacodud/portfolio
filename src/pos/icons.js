// 아이콘은 전부 코드로 직접 그린 인라인 SVG(선 굵기 1.8, 라운드 캡)로 통일한다.
const svg = (paths, viewBox = "0 0 24 24") =>
  `<svg viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

export const MENU_ICONS = {
  about: svg(
    `<circle cx="12" cy="12" r="9" /><line x1="12" y1="11" x2="12" y2="16.5" /><circle cx="12" cy="7.5" r="0.9" fill="currentColor" stroke="none" />`
  ),
  life: svg(
    `<path d="M12 20.2s-7.5-4.4-9.3-9.2C1.5 7.6 3.4 4.6 6.6 4.3c1.9-.2 3.7.8 4.4 2.4.7-1.6 2.5-2.6 4.4-2.4 3.2.3 5.1 3.3 3.9 6.7-1.8 4.8-9.3 9.2-9.3 9.2z" />`
  ),
  projects: svg(
    `<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.2" /><rect x="13" y="3.5" width="7.5" height="7.5" rx="1.2" /><rect x="3.5" y="13" width="7.5" height="7.5" rx="1.2" /><rect x="13" y="13" width="7.5" height="7.5" rx="1.2" />`
  ),
  blog: svg(
    `<path d="M6 3.5h9.5L19 7v13.5H6z" /><path d="M15.5 3.5V7H19" /><line x1="9" y1="11.5" x2="15.5" y2="11.5" /><line x1="9" y1="15" x2="15.5" y2="15" /><line x1="9" y1="18" x2="13" y2="18" />`
  ),
  experience: svg(
    `<rect x="3.5" y="7.5" width="17" height="12" rx="1.6" /><path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" /><line x1="3.5" y1="12.5" x2="20.5" y2="12.5" />`
  ),
};

// 프로젝트 썸네일이 아직 없을 때 보여주는 자리표시자(회색 배경 + 이미지 아이콘)
export const IMAGE_PLACEHOLDER_ICON = svg(
  `<rect x="3" y="3" width="18" height="18" rx="2.2" /><circle cx="8.5" cy="8.5" r="1.6" fill="currentColor" stroke="none" /><path d="M21 15.5l-5.5-5.5-4 4-2.5-2.5L3 17" />`
);

export const CHECK_ICON = svg(`<path d="M5 12.5l4.3 4.3L19 6.5" />`);

export const STATUS_ICONS = {
  wifi: svg(
    `<path d="M3.5 8.5a13 13 0 0 1 17 0" /><path d="M6.5 12a9 9 0 0 1 11 0" /><path d="M9.5 15.5a4.5 4.5 0 0 1 5 0" /><circle cx="12" cy="18.5" r="1" fill="currentColor" stroke="none" />`
  ),
  battery: svg(
    `<rect x="2" y="8" width="18" height="8" rx="2.2" /><rect x="3.8" y="9.8" width="11.5" height="4.4" rx="1" fill="currentColor" stroke="none" /><path d="M22 10.5v3" />`
  ),
};
