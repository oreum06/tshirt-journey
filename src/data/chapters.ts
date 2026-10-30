// 챕터 카피·수치·출처의 유일한 원본 (PRD 9장 프롬프트 규칙: 수치는 이 파일에서만 관리)

export type SourceId =
  | 'waterTee'
  | 'asket'
  | 'unNews'
  | 'unep'
  | 'unAlliance'
  | 'greenpeaceRana'
  | 'wef'
  | 'pnu'
  | 'dasiipda'
  | 'pnuSurvey'
  | 'greenpeaceGhana'
  | 'mt21'
  | 'sdgGuide';

export interface Source {
  name: string;
  date?: string;
  url?: string;
  note?: string;
}

export const SOURCES: Record<SourceId, Source> = {
  waterTee: {
    name: 'Chapagain 외, UNESCO-IHE 면화 물발자국 연구 (요약 기사)',
    url: 'https://scienceblog.com/d-a-single-cotton-t-shirt-can-have-a-water-footprint-of-roughly-2500-litres-about-what-one-person-drinks-in-two-and-a-half-years-and-cotton-production-places-some-of-its-greatest-pr/',
    note: '계산 기준: 면 티셔츠 250g, 관개·빗물·희석수 포함. 연구·재배지에 따라 약 2,500~2,700L로 편차가 있어 "약"으로 표기합니다. 1인 1년 식수는 하루 약 3L 기준.',
  },
  asket: {
    name: 'ASKET, Case Study: The T-Shirt (수치 논쟁)',
    url: 'https://www.asket.com/en-fi/journal/conversations/case-study-the-t-shirt-olivia-pinnock',
  },
  unNews: {
    name: 'UN News, "UN launches drive to highlight environmental cost of staying fashionable"',
    date: '2019.3',
  },
  unep: { name: 'UNEP · UNCTAD', date: '2019' },
  unAlliance: { name: 'UN 지속가능패션연합 (UN Alliance for Sustainable Fashion)', date: '2019' },
  greenpeaceRana: { name: '그린피스 서울사무소 · 그린피스 인터내셔널' },
  wef: { name: '세계경제포럼(WEF)', date: '2019.1', note: '채널PNU 재인용 (2024.5.23)' },
  pnu: { name: '채널PNU', date: '2024.5.23' },
  dasiipda: { name: '다시입다연구소 설문', date: '2020' },
  pnuSurvey: { name: '채널PNU, 부산대 재학생 100명 설문', date: '2024.4' },
  greenpeaceGhana: { name: '그린피스 인터내셔널 · 서울사무소 (가나 아크라 현지 조사)' },
  mt21: { name: '머니투데이 · 고구마팜 21% 파티 툴킷', date: '2026.8.29' },
  sdgGuide: {
    name: 'UN SDG 로고·아이콘 가이드라인',
    url: 'https://www.un.org/sustainabledevelopment/wp-content/uploads/2023/09/E_SDG_Guidelines_Sep20238.pdf',
  },
};

export interface Stat {
  value: number;
  /** 표시용 접두/접미 (예: "약", "L") */
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  /** 사람 단위 환산 문구 (디자인 원칙 4) */
  human?: string;
  sources: SourceId[];
  compare?: { label: string; value: number; suffix?: string; human?: string };
}

export interface Card {
  text: string[];
  stat?: Stat;
  /** 카드 안 특수 위젯 */
  widget?: 'priceChips' | 'drops' | 'streams' | 'bars' | 'closetGrid' | 'wearSlider' | 'branch' | 'receipt';
  stamp?: boolean;
}

export type Sdg = 6 | 7 | 12;

export interface Chapter {
  id: number;
  slug: string;
  title: string;
  kicker: string;
  sdg?: Sdg;
  place: string;
  /** 배경색 (스크롤 진입 → 이탈 보간) */
  bg: [string, string];
  dark?: boolean;
  /** 이 챕터를 지나면 HUD에 누적되는 물(L) */
  waterAt?: number;
  cards: Card[];
}

export interface PriceOption {
  value: number;
  /** 가격 칩·여권 문구 */
  label: string;
  /** 칩 아래 설명 */
  note: string;
  /** 가격표(스테이지 태그)용 짧은 표기 */
  tag: string;
  /** 영수증 표기 */
  receipt: string;
}

export const PRICES: PriceOption[] = [
  { value: 9900, label: '9,900원', note: '쇼핑몰·쉬인 할인가 수준', tag: '₩9,900', receipt: '₩9,900' },
  { value: 12900, label: '12,900원', note: 'SPA 브랜드 정가 수준', tag: '₩12,900', receipt: '₩12,900' },
  { value: 100000, label: '10만 원 이상', note: '고가 브랜드', tag: '₩10만+', receipt: '₩100,000 이상' },
];
export const DEFAULT_PRICE = 9900;
export const priceOf = (value: number) => PRICES.find((p) => p.value === value) ?? PRICES[0];
export const DEFAULT_WEARS = 7;

/** 21% 파티 신청 구글 폼 — 열린 질문: 링크 확정 시 교체 */
export const PARTY_FORM_URL = 'https://forms.gle/REPLACE_ME';
/** 인스타 캠페인 계정 — 열린 질문 */
export const INSTAGRAM_URL = 'https://www.instagram.com/';
/** 파티 후 수동 갱신. null이면 "파티 후 공개" */
export const EXCHANGED_COUNT: number | null = null;

export const WATER_TEE = 2720;

export const CHAPTERS: Chapter[] = [
  {
    id: 0,
    slug: 'start',
    title: '이 티셔츠, 얼마였나요?',
    kicker: 'Ch.0 출발',
    place: '내 방',
    bg: ['#F7F4EE', '#F7F4EE'],
    cards: [
      { text: ['당신이 지난주에 산 티셔츠.', '그 옷은 어디서 왔고, 어디로 갈까요?'] },
      { text: ['가격표부터 골라 주세요.'], widget: 'priceChips', stamp: true },
    ],
  },
  {
    id: 1,
    slug: 'cotton',
    title: '목화밭',
    kicker: 'Ch.1',
    sdg: 6,
    place: '목화밭',
    bg: ['#EAF4F2', '#F2E6CF'],
    waterAt: WATER_TEE,
    cards: [
      { text: ['티셔츠는 실을 풀며', '목화송이로 돌아가요.'] },
      {
        text: ['면 티셔츠 한 벌(250g)을 만드는 데 드는 물이에요.'],
        stat: {
          value: WATER_TEE,
          prefix: '약 ',
          suffix: 'L',
          label: '티셔츠 한 벌의 물발자국',
          human: '한 사람이 약 2년 반 동안 마실 물',
          sources: ['waterTee', 'asket'],
          compare: { label: '청바지 한 벌', value: 7500, suffix: 'L', human: '7년 동안 마실 물' },
        },
        widget: 'drops',
      },
      {
        text: ['패션 산업은 한 해 930억㎥의 물을 써요.', '500만 명이 쓸 수 있는 양이에요.'],
        stamp: true,
      },
    ],
  },
  {
    id: 2,
    slug: 'dye',
    title: '염색 공장',
    kicker: 'Ch.2',
    sdg: 6,
    place: '염색 공장',
    bg: ['#DCDCE8', '#DCDCE8'],
    cards: [
      { text: ['흰 티셔츠가 염료통에 잠겨요.', '공장 뒤 강물 색이 변하기 시작해요.'] },
      {
        text: ['전 세계 폐수의 다섯 줄기 중 하나가', '패션 산업(염색·가공)에서 나와요.'],
        stat: {
          value: 20,
          prefix: '약 ',
          suffix: '%',
          label: '패션 산업이 만드는 전 세계 폐수 비중',
          human: '물줄기 5개 중 1개',
          sources: ['unNews', 'unep'],
        },
        widget: 'streams',
        stamp: true,
      },
    ],
  },
  {
    id: 3,
    slug: 'sewing',
    title: '봉제 공장',
    kicker: 'Ch.3',
    sdg: 7,
    place: '봉제 공장',
    bg: ['#D3CFC7', '#D3CFC7'],
    cards: [
      { text: ['미싱이 쉬지 않고 돌아가요.', '전기 플러그를 따라가면 석탄·가스 발전소예요.'] },
      {
        text: ['의류·신발 생산은 국제선 항공과', '해운을 합친 것보다 많이 배출해요.'],
        stat: {
          value: 8,
          suffix: '%',
          label: '전 세계 온실가스 중 의류·신발 생산',
          human: '지금 방식이면 2030년까지 약 50% 더 늘어나요',
          sources: ['unNews', 'unAlliance'],
        },
        widget: 'bars',
        stamp: true,
      },
    ],
  },
  {
    id: 4,
    slug: 'workers',
    title: '일하는 사람들',
    kicker: 'Ch.4 · 사회적 비용',
    place: '방글라데시 사바르',
    bg: ['#2A2927', '#2A2927'],
    dark: true,
    cards: [
      { text: ['2013년 4월 24일,', '방글라데시 라나플라자가 무너졌어요.'] },
      { text: ['최소 1,134명이 숨지고', '2,500명 이상이 다쳤어요.'], stamp: false },
      { text: ['싸고 빠르게 만드는 동안,', '안전은 뒤로 밀렸습니다.'], stamp: true },
    ],
  },
  {
    id: 5,
    slug: 'store',
    title: '매장',
    kicker: 'Ch.5',
    sdg: 12,
    place: '매장',
    bg: ['#FFF8EC', '#FFF8EC'],
    cards: [
      { text: ['NEW, NEW, NEW.', '우리 티셔츠는 그 사이에 묻혀요.'] },
      {
        text: ['패스트패션 브랜드는', '매주 수백 종의 새 디자인을 내요.'],
        stat: {
          value: 1500,
          suffix: '억 벌',
          label: '전 세계에서 해마다 생산되는 옷',
          human: '지구인 한 명당 매년 약 19벌',
          sources: ['wef', 'pnu'],
        },
        stamp: true,
      },
    ],
  },
  {
    id: 6,
    slug: 'closet',
    title: '내 옷장',
    kicker: 'Ch.6',
    sdg: 12,
    place: '내 옷장',
    bg: ['#ECE6DA', '#ECE6DA'],
    cards: [
      {
        text: ['버리기 전까지, 옷은 평균 7번 입혀요.'],
        stat: {
          value: 7,
          suffix: '번',
          label: '버리기 전까지 평균 착용 횟수',
          human: '일주일에 한 번이면 두 달이 안 돼요',
          sources: ['pnu', 'dasiipda'],
        },
      },
      {
        text: ['옷장 속 옷 100벌 중 21벌은', '사 놓고 한 번도 입지 않아요.'],
        widget: 'closetGrid',
      },
      {
        text: ['대학생 80% 이상이 1년에 10벌 넘게 사고,', '10명 중 7명은 3년 정도 입고 버려요.'],
        stat: {
          value: 80,
          suffix: '%+',
          label: '1년에 10벌 넘게 사는 대학생',
          sources: ['pnuSurvey'],
        },
      },
      { text: ['나는 이 티셔츠를 몇 번 입었지?'], widget: 'wearSlider', stamp: true },
    ],
  },
  {
    id: 7,
    slug: 'ghana',
    title: '수거함, 그리고 가나',
    kicker: 'Ch.7',
    sdg: 12,
    place: '가나 아크라',
    bg: ['#3B342E', '#3B342E'],
    dark: true,
    cards: [
      { text: ['티셔츠가 의류수거함에 들어가요.', '여정은 바다를 건너요.'] },
      {
        text: ['가나로 들어오는 중고 의류,', '절반 이상은 되팔 수 없어 매립되거나 태워져요.'],
        stat: {
          value: 12,
          prefix: '해마다 ',
          suffix: '만 톤',
          label: '가나로 들어오는 중고 의류',
          human: '절반 이상은 되팔 수 없어요',
          sources: ['greenpeaceGhana'],
        },
      },
      {
        text: ['버려진 옷의 89%는 합성섬유.', '결국 미세플라스틱이 돼요.'],
        stat: {
          value: 89,
          suffix: '%',
          label: '버려진 옷 중 합성섬유',
          sources: ['greenpeaceGhana'],
        },
        stamp: true,
      },
    ],
  },
  {
    id: 8,
    slug: 'fork',
    title: '이 티셔츠의 다음 여행은?',
    kicker: 'Ch.8 갈림길',
    place: '갈림길',
    bg: ['#3B342E', '#3B342E'],
    dark: true,
    cards: [
      { text: ['연기가 걷히고, 다시 내 옷장 앞.', '티셔츠가 두 갈래 길 앞에 서 있어요.'] },
      { text: ['이 티셔츠의 여행은', '아직 바꿀 수 있어요.'], widget: 'branch' },
    ],
  },
  {
    id: 9,
    slug: 'receipt',
    title: '진짜 영수증',
    kicker: 'Ch.9',
    place: '영수증',
    bg: ['#F7F4EE', '#F7F4EE'],
    cards: [{ text: [], widget: 'receipt' }],
  },
];

/** Ch.8 21% 파티 근거 수치 */
export const PARTY_STAT: Stat = {
  value: 3436,
  suffix: '점',
  label: '2025년 21% 파티에서 교환된 옷',
  human: '탄소 약 13.1톤을 줄인 것으로 추산돼요',
  sources: ['mt21'],
};

export const CHECKLIST = ['장바구니 3일 기다리기', '한 벌을 30번 입기', '안 입는 옷은 수거함 대신 교환'];

export const CREDITS = '공공칠빵(7팀) · 사회공헌 프로젝트 해결안 2 (SDG 12.8)';
/** 제작자 표기 — 첫 화면과 페이지 맨 아래에 회색 작은 글씨로 */
export const AUTHOR = '사회공헌프로젝트 7팀 20252907김서현';
