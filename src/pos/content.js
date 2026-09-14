import magokThumb from "../assets/projects/magok-thumb.webp";
import magokPreview from "../assets/projects/magok-preview.webp";
import allreviewThumb from "../assets/projects/allreview-thumb.webp";
import allreviewPreview from "../assets/projects/allreview-preview.webp";
import monimoThumb from "../assets/projects/monimo-thumb.webp";
import monimoPreview from "../assets/projects/monimo-preview.webp";
import wcmsThumb from "../assets/projects/wcms-thumb.webp";
import wcmsPreview from "../assets/projects/wcms-preview.webp";
import lgThumb from "../assets/projects/lg-thumb.webp";
import lgPreview from "../assets/projects/lg-preview.webp";
import iphone14Thumb from "../assets/projects/iphone14-thumb.webp";
import iphone14Preview from "../assets/projects/iphone14-preview.webp";
import proposeThumb from "../assets/projects/propose-thumb.webp";
import proposePreview from "../assets/projects/propose-preview.webp";

export const ABOUT = {
  eyebrow: "PRODUCT OVERVIEW",
  name: "김채영",
  role: "Frontend Developer",
  tagline: "문제를 구조화하고 사용자 경험을 고민하는 개발자",
  mission:
    "앞으로도 사용자 경험을 고민하며 서비스를 만들고, 코드 리뷰와 기술적인 논의를 통해 동료들과 함께 성장하는 개발자가 되고 싶습니다.",
};

// 카드를 누르면 상세 팝업(.detail-modal)으로 전문을 보여준다. <strong>으로 감싼
// 구간은 팝업에서 머스타드색 볼드로 강조된다 (about-detail__paragraph strong 참고)
export const ABOUT_STORIES = [
  {
    id: "planning",
    title: "기획 의도를 서비스로 구체화하는 개발자",
    hook: "화면을 구현하는 것에서 끝내지 않고, 이 기능이 정말 필요한지까지 고민합니다.",
    body: [
      "디자인을 전공하고 퍼블리싱으로 커리어를 시작해서인지, 화면을 구현하는 것에서 끝내기보다 <strong>이 기능이 사용자에게 정말 필요한지</strong>를 자꾸 생각하게 됩니다.",
      "모바일 가이드 웹앱 프로젝트에서는 사업 보고서와 요구사항만 있고 화면 설계는 없는 상태에서 시작해, <strong>IA와 와이어프레임을 직접 설계</strong>해 추상적인 기획을 실제로 쓸 수 있는 화면과 기능으로 구체화했습니다.",
      "사내 리뷰 시스템을 만들 때도 디자인 시안 없이, 평가 프로세스를 사용자 흐름 기준으로 직접 구조화하고 개발까지 진행했습니다.",
      "기획이나 디자인을 전문적으로 하는 건 아니지만, 관심이 있다 보니 자연스럽게 그 영역까지 함께 고민하고 제안하게 됩니다. <strong>그게 제가 일하는 방식이자 강점</strong>이라고 생각합니다.",
    ],
  },
  {
    id: "collab",
    title: "함께 문제를 풀 때 더 재미있는 개발자",
    hook: "개발은 혼자 하는 일이 아니라 함께 문제를 해결하는 과정이라고 생각합니다.",
    body: [
      "저는 개발을 <strong>혼자 하는 일보다 함께 문제를 해결하는 과정</strong>이라고 생각합니다.",
      "전 직장에서 팀원이 며칠째 풀리지 않는 버그를 붙잡고 야근하는 모습을 보고, 제 일이 아니었지만 옆에 앉아 같이 코드를 봤습니다. 원인을 찾아 함께 해결했을 때의 보람이 컸고, 이후로도 비슷한 상황이면 자연스럽게 먼저 다가가게 됐습니다.",
      "이 경험은 코드 리뷰와 기술적인 논의를 좋아하게 만들었습니다. <strong>PR 템플릿 도입과 회고 문화 제안</strong>도 팀이 더 쉽게 지식을 나누고 함께 성장할 환경을 만들고 싶어서였습니다.",
      "기술 블로그에 <strong>100편 넘게</strong> 글을 쓴 것도 같은 맥락입니다. 제가 겪은 문제와 해결 과정을 남겨두면 언젠가 비슷한 문제를 겪는 누군가에게 도움이 될 거라고 생각했습니다.",
    ],
  },
  {
    id: "dig",
    title: "막혔을 때 원인을 끝까지 파보는 개발자",
    hook: "답이 바로 보이지 않는 문제도 하나씩 분석해서 끝까지 원인을 찾아갑니다.",
    body: [
      "설 연휴 이벤트용 Canvas 미니게임을 <strong>외부 라이브러리 없이 3주 안에</strong> 만들어야 했던 적이 있습니다.",
      "완성 후 iPhone 7에서 화면이 멈추는 문제가 생겼고, 원인은 변하지 않는 배경까지 매 프레임 다시 그리고 있었기 때문이었습니다. <strong>Canvas 레이어를 변하는 부분과 변하지 않는 부분으로 나눠</strong> 다시 설계해, 저사양 기기를 포함한 전 기종에서 문제없이 돌아가게 만들었습니다.",
      "답이 바로 보이지 않는 문제를 하나씩 분석해 원인을 찾아가는 과정은 쉽지 않지만, 결국 해결했을 때의 성취감 때문에 이 과정을 좋아하게 됐습니다.",
    ],
  },
];

export const PORTFOLIO_CONCEPT = {
  id: "concept-note",
  title: "왜 바코드였을까",
  hook: "포트폴리오는 결국 '나'라는 제품을 PR하는 사이트라고 생각했습니다.",
  body: [
    "포트폴리오는 결국 <strong>'나'라는 제품을 PR하는 사이트</strong>라고 생각했습니다. 그 생각이 들자 바코드라는 키워드에 꽂혔습니다. 바코드를 찍으면 제품 정보가 포스기에도, 영수증에도 나오니, 바코드가 곧 저를 대표하는 상징이 될 수 있겠다고 생각했습니다.",
    "그래서 <strong>바코드를 찍고 포스기로 정보를 확인하고, 옵션을 담고, 주문하면 영수증으로 연락처가 노출되는 흐름</strong>으로 만들면 재미있겠다고 생각했습니다.",
  ],
};

export const CONTACT = {
  name: "KIM CHAEYOUNG",
  role: "Frontend Developer",
  github: {
    label: "github.com/rlacodud",
    url: "https://github.com/rlacodud",
  },
  blog: { label: "chaeng03.tistory.com", url: "https://chaeng03.tistory.com/" },
  email: "rlacodud0313@naver.com",
  status: "Available",
  experience: "4년 5개월",
  code: "CY-0313",
  resume: {
    url: "/김채영_이력서.pdf",
    filename: "김채영_이력서.pdf",
  },
  coverLetter: {
    url: "/김채영_자기소개서.pdf",
    filename: "김채영_자기소개서.pdf",
  },
};

export const LIFE = {
  eyebrow: "PACKAGE CONTENTS",
  summary:
    "1 x Drummer / 1 x Athlete / 1 x Reader / 1 x Writer / 1 x Thinker / 1 x Gamer",
  items: [
    {
      label: "음악",
      desc: "직장인 밴드 드러머로 활동하고 있고 음악을 좋아해서 오케스트라·콘서트 관람도 즐깁니다.",
    },
    {
      label: "운동",
      desc: "몸을 움직이는 걸 좋아해서 꾸준히 홈트레이닝을 하고, 배드민턴·러닝처럼 밖에서 하는 운동도 즐깁니다.",
    },
    {
      label: "독서",
      desc: "책을 통해 다양한 세상을 만나는 걸 좋아해서 분야를 가리지 않고 읽습니다.",
    },
    {
      label: "글쓰기",
      desc: "기록을 중요하게 생각하여 기술 블로그, 독후감, 일기를 작성합니다.",
    },
    {
      label: "철학",
      desc: "철학적인 주제로 이야기하고 생각을 나누는 걸 좋아합니다.",
    },
    {
      label: "게임",
      desc: "직접 하는 것도, 보는 것도 좋아하는 게이머입니다. 그중에서도 젤다 시리즈를 가장 아낍니다.",
    },
  ],
};

export const PROJECTS = [
  {
    id: "001",
    thumbnail: magokThumb,
    preview: magokPreview,
    company: "획기획",
    title: "마곡 미술길 모바일 가이드 웹앱",
    intro:
      "지역 상권과 문화 콘텐츠를 연결하는 마곡 미술길 사업의 프로그램·투어 예약, 쿠폰 발급, 참여 이력 관리 기능을 제공하는 모바일 가이드 웹앱을, 기획 문서 분석 단계부터 와이어프레임 설계, 프론트엔드 개발까지 전 과정 담당했습니다.",
    role: "와이어프레임 설계 및 프론트엔드 개발",
    sections: [
      {
        title: "기획 문서 분석부터 화면 설계, 개발까지 담당",
        points: [
          "사업 보고서와 요구사항만으로 사용자 흐름 중심의 IA·와이어프레임을 직접 설계해, 추상적인 기획을 실제 서비스 화면과 기능 구조로 구체화",
          "와이어프레임을 기준으로 재사용 가능한 컴포넌트 구조를 설계한 뒤, 퍼블리싱과 API 연동으로 실제 기능까지 구현",
        ],
      },
      {
        title: "기획 의도를 개발 가능한 구조로 전환",
        points: [
          "기획·디자인·개발 관점을 함께 고려해 화면 구성과 사용자 경험을 설계",
          "프로그램 신청부터 참여 이력 관리까지, 사용자 플로우를 기준으로 서비스 흐름을 구조화",
        ],
      },
      {
        title: "촉박한 일정 속 우선순위 기반 개발",
        points: [
          "기획·디자인·개발이 동시에 진행되는 일정 환경에서, 핵심 기능부터 구현되도록 화면·기능 단위를 재정의해 개발 범위 조정",
          "앞서 설계한 컴포넌트 재사용 구조 덕분에 빠듯한 일정에도 생산성 있게 개발 진행",
        ],
      },
    ],
    stack: [
      "Next",
      "TypeScript",
      "TanStack Query",
      "SCSS",
      "Styled-Components",
      "Storybook",
    ],
    retro:
      "사업 보고서만 보고 와이어프레임을 직접 설계해본 건 처음이라 막막했지만, 개발 관점에서 재사용 가능한 구조와 엣지 케이스까지 함께 고려하다 보니 오히려 더 촘촘하게 설계할 수 있었습니다. 프로그램·투어·축제 콘텐츠가 동시에 구체화되는 상황이라 디자인이 계속 바뀌었는데, 기능을 먼저 구현해두고 디자인을 나중에 입히는 방식으로 진행해 변경에 유연하게 대응할 수 있었습니다. 덕분에 일정 지연 없이 2주 만에 오픈할 수 있었고, 이 과정이 꽤 짜릿했습니다.",
  },
  {
    id: "002",
    thumbnail: allreviewThumb,
    preview: allreviewPreview,
    company: "획기획",
    title: "사내 리뷰 관리 웹앱 '올리뷰'",
    intro:
      "프로젝트 온보딩, 중간·최종 리뷰, 자가/동료 평가로 이어지는 사내 평가 프로세스를 운영하기 위한 리뷰 관리 웹앱을, 디자인 시안 없이 기획 문서만으로 처음부터 설계·개발했습니다.",
    role: "유저 화면 프론트엔드 개발",
    sections: [
      {
        title: "기획 문서 기반, AI를 활용한 컴포넌트 설계",
        points: [
          "디자인 시안 없이 기획 문서만으로 화면 구조와 컴포넌트 체계를 직접 설계",
          "AI로 초기 UI·컴포넌트 구조를 빠르게 잡은 뒤 서비스 요구사항에 맞게 다듬어 사용자·관리자 화면 개발",
          "공통 컴포넌트 구조로 화면 간 일관성과 개발 생산성 확보",
        ],
      },
      {
        title: "계층형 데이터 구조 설계 및 API 연동",
        points: [
          "리뷰 → 평가 항목 → 세부 문항으로 이어지는 계층형 데이터 구조를 분석해, API 응답에 맞춘 화면 구성과 상태 관리 로직 설계",
        ],
      },
      {
        title: "운영 및 개발 프로세스 개선 주도",
        points: [
          "서비스 사용 가이드와 테스트 시나리오를 직접 작성해 QA·운영까지 지원",
          "PR 템플릿을 도입해 코드 리뷰를 체계화하고, 회고 문화를 제안해 팀 단위 개선 프로세스 정착",
        ],
      },
    ],
    stack: [
      "Next",
      "TypeScript",
      "TanStack Query",
      "SCSS",
      "Styled-Components",
      "Storybook",
      "React-DND",
      "Docker",
    ],
    retro:
      "첫 실무 구축 프로젝트였고, 디자인 시안 없이 화면설계서만으로 작업해야 해서 AI를 적극 활용했습니다. 유저 화면 개발을 맡으면서 어드민과 유저 화면 간 데이터 연계, 그리고 리뷰-평가 항목-세부 문항으로 이어지는 계층형 데이터 구조를 단계적으로 조회하는 방법을 익힐 수 있었습니다. 어드민을 담당한 동료와 코드 스타일을 맞추기 위해 PR 템플릿을 도입했고, 프로젝트 종료 후에는 회고 문화를 제안해 팀이 좋았던 점과 개선할 점을 함께 나눌 수 있었습니다.",
  },
  {
    id: "003",
    thumbnail: monimoThumb,
    preview: monimoPreview,
    company: "스페이드컴퍼니",
    title: "모니모 설 연휴 이벤트 Canvas 웹 게임",
    intro:
      "Nuxt 기반 금융 앱 '모니모'의 설날 이벤트용 좌/우 분류 미니게임을 단독으로 개발했습니다.",
    role: "미니게임 개발",
    sections: [
      {
        title: "웹 게임 3주 내 단독 구현",
        points: [
          "보안 정책 및 Node 버전 제약으로 외부 Canvas 라이브러리 사용이 불가한 환경에서, Canvas API 문서만으로 렌더링 루프·인터랙션·애니메이션 로직 직접 구현",
          "유지보수성과 확장성을 고려해 렌더링·애니메이션·입력 처리 로직을 역할 단위로 분리 설계",
        ],
      },
      {
        title: "저사양 기기(iPhone 7) 렌더링 이슈 해결 및 성능 최적화",
        points: [
          "iPhone 7에서 인트로 이후 화면 미출력 이슈 발생 → 변하지 않는 요소까지 매 프레임 재렌더링되는 구조가 병목이라고 판단",
          "Canvas 레이어를 정적(배경·고정 UI, 초기 1회만 렌더)과 동적(사용자 입력에 반응하는 요소만 프레임 단위 렌더)으로 분리",
          "iPhone 7 포함 전 기기에서 모션 끊김 없는 안정적인 게임 플레이 환경 구현",
        ],
      },
    ],
    stack: ["Nuxt", "SCSS", "Canvas"],
    retro:
      "보안 정책상 외부 라이브러리도, AI 도구도 쓸 수 없는 환경이라 Canvas API를 단계별로 익히며 기능을 하나씩 구현해나갔습니다. 디자인 작업이 진행되는 동안 기능을 먼저 완성해두는 방식으로 진행해 일정 안에 혼자서도 무리 없이 마무리할 수 있었습니다. 실제 기기로 테스트하던 중 발견한 문제를 원인부터 분석해 렌더링 구조를 개선했고, 결과적으로 저사양 기기에서도 끊김 없이 플레이할 수 있는 수준까지 만들 수 있었습니다.",
  },
  {
    id: "004",
    thumbnail: wcmsThumb,
    preview: wcmsPreview,
    company: "스페이드컴퍼니",
    title: "WCMS 내부 업무 효율화 도구",
    intro:
      "기존 앱과 신규 통합 앱을 병행 운영하는 환경에서, 콘텐츠 이중 작업을 제거하기 위한 내부 업무 효율화 도구를 자발적으로 기획·개발했습니다.",
    role: "업무 효율화 도구 설계 및 개발",
    sections: [
      {
        title: "콘텐츠 구조 통일을 위한 가이드 문서 정의",
        points: [
          "신규 앱 구축팀으로부터 가이드가 공유되지 않아 팀원별 마크업 구조가 제각각이고, 결과물의 구조 일관성이 무너지는 문제 발생",
          "신규 앱 SCSS 구조를 직접 분석해 콘텐츠 구조 기준을 정의하고 가이드 문서로 정리·공유 → 개인 숙련도에 의존하던 작업 방식을 공통 기준으로 전환",
        ],
      },
      {
        title: "반복 작업 제거를 위한 내부 자동화 도구 개발",
        points: [
          "수작업 전환 과정에서 반복되는 휴먼 에러를 구조적 문제로 인식하고, 가이드 문서를 변환 규칙으로 재정의해 자동화 가능성 판단",
          "Vanilla JS로 DOM 파싱·문자열 변환 로직을 구현해, 기존 앱 경로만 입력하면 신규 앱 기준 변환 프리뷰와 HTML 코드가 자동 생성되는 도구 완성",
          "콘텐츠 1건당 이중 작업이 사라지고, 결과물 구조도 통일됨",
        ],
      },
    ],
    stack: ["HTML", "JavaScript", "CSS"],
    retro:
      "가이드 공유 요청에도 별다른 자료를 받지 못해, 신규 앱의 SCSS 구조를 직접 역분석해 마크업 규칙을 정리하고 공유하는 것부터 시작했습니다. 이후에도 반복되는 휴먼 에러와 이중 작업이 계속 눈에 걸렸고, 보안 환경상 외부 도구를 쓸 수 없는 상황이라 Vanilla JS로 직접 변환·프리뷰 도구를 만들었습니다. 결과적으로 이중 작업이 사라지고 결과물 구조도 통일할 수 있었습니다.",
  },
  {
    id: "005",
    thumbnail: lgThumb,
    preview: lgPreview,
    company: "더피프티원",
    title: "LG.com 글로벌 페이지 6.0 — Cart/Checkout",
    intro:
      "21개 국가에 공통 적용되는 상품 구매 프로세스(Cart/Checkout)를 구현하고 장기 유지보수를 담당했습니다.",
    role: "Cart/Checkout 퍼블리싱 및 유지보수",
    sections: [
      {
        title: "글로벌 공통 구매 플로우의 구조 안정성 확보",
        points: [
          "21개 국가에 동일한 구매 프로세스를 제공해야 하는 글로벌 서비스 환경으로, 상품 선택부터 결제 완료까지 이어지는 핵심 플로우라 작은 변경도 매출에 직접 영향",
          "구매 흐름의 핵심 단계는 공통 구조로 유지하고, 국가별 요구사항은 옵션화해 분기 확산을 최소화하는 방향으로 구조 설계",
        ],
      },
      {
        title: "인력 교체 환경에서 맥락을 유지하는 히스토리 기록 체계 구축",
        points: [
          "프로젝트 장기화로 작업 인력 교체가 반복되며, 히스토리 기록 부재로 커뮤니케이션 비용 증가",
          "단순 변경 내역이 아닌 '구현 이유' 중심의 히스토리 구조를 정의해, 신규 투입 인원도 빠르게 맥락을 파악할 수 있도록 기준 문서 지속 관리",
        ],
      },
    ],
    stack: ["Pug", "SCSS", "JavaScript"],
    retro:
      "국가마다 요구하는 구매 옵션이 조금씩 달라 분기 처리가 불가피했는데, 케이스를 먼저 정리한 뒤 적용해 분기가 불필요하게 늘어나지 않도록 관리했습니다. 히스토리 관리 체계가 없어 인력이나 작업이 바뀔 때마다 맥락 파악에 시간이 걸리는 문제가 반복됐고, 이를 개선하기 위해 변경 이유를 기록하고 공유하는 히스토리 문서화 방식을 도입했습니다.",
  },
  {
    id: "006",
    thumbnail: iphone14Thumb,
    preview: iphone14Preview,
    company: "더피프티원",
    title: "iPhone 14 배경화면 꾸미기 이벤트",
    intro:
      "iPhone 14 출시 프로모션용으로, 사용자가 참여해 배경화면을 커스터마이징하는 이벤트 페이지 기능을 구현했습니다.",
    role: "iPhone 14 배경화면 꾸미기 이벤트 페이지 퍼블리싱",
    sections: [
      {
        title: "이미지 비율 제약을 고려한 커스터마이징 리사이즈 기능 구현",
        points: [
          "Moveable 라이브러리가 1:1 정비율 리사이즈만 지원하는 한계 → 이미지 원본 비율 기준으로 크기가 조정되도록 리사이즈 로직을 직접 구성",
          "사용자 조작 과정에서 시각적 왜곡 없이 자연스러운 편집 경험 제공",
        ],
      },
      {
        title: "다중 요소 편집 환경에서 조작 대상 인지성 개선",
        points: [
          "텍스트·스티커 등 여러 요소가 화면에 겹칠 때, 사용자가 조작 중인 대상을 인지하기 어려운 문제 발생",
          "선택된 요소를 부모 컨테이너의 마지막 자식 노드로 이동시켜, 다중 요소 편집 중에도 조작 대상이 명확히 드러나도록 개선",
        ],
      },
    ],
    stack: ["HTML", "CSS", "Moveable", "JavaScript"],
    retro:
      "iPhone 14 프로모션을 위해, 제공된 스티커나 배경 이미지 또는 사용자가 업로드한 사진으로 화면을 꾸미고 그 결과를 이미지로 저장하는 페이지를 만들었습니다. 사용한 라이브러리가 정비율 리사이즈만 지원해서, 이미지 원본 비율을 기준으로 크기가 조정되도록 직접 로직을 수정했습니다. 라이브러리 내부 구조를 분석하고 필요한 부분만 커스터마이징해본 경험이었습니다.",
  },
  {
    id: "007",
    thumbnail: proposeThumb,
    preview: proposePreview,
    company: "더피프티원",
    title: "제안 프로젝트 인터랙션 템플릿화",
    intro:
      "짧은 일정과 높은 완성도를 동시에 요구하는 제안 프로젝트 환경에서, 반복되는 인터랙션 구현 구조를 개선하고 팀 단위 생산성을 끌어올린 경험입니다.",
    role: "인터랙션 템플릿 설계 및 작업 분배 주도",
    sections: [
      {
        title: "인터랙션 기능 구조화 및 템플릿화",
        points: [
          "매번 유사한 인터랙션을 개별 구현하는 방식이 짧은 일정·제한된 리소스로는 지속 가능하지 않다고 판단",
          "자주 쓰이는 인터랙션 패턴을 분석해 공통 로직 단위로 구조화하고, 이후 필요에 따라 조합·확장 가능한 템플릿으로 정리·공유",
        ],
      },
      {
        title: "일정 압박 상황에서의 작업 분배 및 구현 주도",
        points: [
          "팀장 부재 상황에서 빠듯한 제안 일정이 반복되며 작업 병목 발생 가능성 인지",
          "설계서를 기준으로 기능 난이도와 의존성을 분석해 팀원별 구현 담당을 분배하고 전체 작업 흐름을 조율 → 일정 내 구현 안정성과 팀 단위 생산성 유지",
        ],
      },
    ],
    stack: [],
  },
];

export const BLOG = {
  eyebrow: "USER MANUAL",
  stat: "Knowledge Base · 127 Articles",
  posts: [
    {
      category: "어떻게 공부하는가",
      title: "[항해99] 5주차_Vanilla JS로 나만의 React 만들기",
      url: "chaeng03.tistory.com/entry/항해99-5주차Vanilla-JS로-나만의-React-만들기",
    },
    {
      category: "문제를 해결하는 방식",
      title:
        "[Vue] Nuxt2에서는 문제없던 로직이 Nuxt3에서는 복병?!_ref_Lottie_requestAnimationFrame",
      url: "chaeng03.tistory.com/entry/Vue-Nuxt2에서는-문제없던-로직이-Nuxt3에서는-복병refLottierequestAnimationFrame",
    },
    {
      category: "개발자로서의 성장 기록",
      title:
        "[일에 대하여] 프론트엔드 개발자로 전환한 지 3주, 그리고 AI 시대의 개발자",
      url: "chaeng03.tistory.com/entry/일에-대하여-프론트엔드-개발자로-전환한-지-3주-그리고-AI-시대의-개발자",
    },
    {
      category: "기술적인 고민",
      title:
        "[일에 대하여] 퍼블리셔에서 프론트엔드로 전환을 준비하며 느낀 고민들",
      url: "chaeng03.tistory.com/entry/퍼블리셔에서-프론트엔드로-전환을-준비하며-느낀-고민들",
    },
  ],
};

export const EXPERIENCE = {
  eyebrow: "WORK HISTORY",
  companies: [
    {
      name: "획기획",
      takeaways: [
        "원하는 조직 문화와 컬쳐핏을 알게 됨",
        "프론트엔드 개발자로서의 실무 경험",
      ],
    },
    {
      name: "스페이드컴퍼니",
      takeaways: [
        "장기 유지보수 경험",
        "보안 환경에서의 개발 경험",
        "Canvas 기반 게임 개발 경험",
      ],
    },
    {
      name: "더피프티원",
      takeaways: [
        "협업 과정에서 히스토리 관리의 중요성",
        "문서화와 커뮤니케이션의 중요성",
      ],
    },
  ],
};
