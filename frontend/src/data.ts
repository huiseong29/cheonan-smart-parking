/**
 * 서비스 상수 데이터 (시안 Component 클래스에서 이식).
 * 점유 해시·요금·문구가 이 값에 의존하므로 임의 수정 금지 — API 연동 시 이 모듈을 교체한다.
 */

// ---------- 차량 유형 ----------
export type SlotType = '일반' | '전기차' | '장애인' | '여성전용' | '임산부';
export type VehType = '일반' | '전기차';
export type CondKey = '장애인' | '여성전용' | '임산부';
export type CertKey = '전기차' | '장애인' | '임산부';

export const VEH_TYPES: VehType[] = ['일반', '전기차'];
export const VEH_CONDS: CondKey[] = ['장애인', '여성전용', '임산부'];

// ---------- 자격 확인 모달 메타 ----------
export const VERIFY_META: Record<CertKey, { title: string; desc: string; source: string; color: string; soft: string }> = {
  전기차: { title: '전기차 확인', desc: '등록 차량(123가 4567)이 전기차인지 자동차등록원부에서 자동으로 확인합니다.', source: '국토교통부 자동차등록원부 조회', color: '#2E9E6B', soft: '#E3F3EA' },
  장애인: { title: '장애인 주차표지 확인', desc: '등록 차량에 유효한 장애인 전용 주차구역 주차표지가 발급되어 있는지 확인합니다.', source: '보건복지부 주차표지 정보 연계', color: '#2F6BD6', soft: '#E4EDFB' },
  임산부: { title: '임산부 확인', desc: '정부24에 등록된 임신 확인 정보로 자격을 확인합니다. 확인 후 출산 예정일까지 유지됩니다.', source: '정부24 맘편한 임신 서비스 연계', color: '#D08344', soft: '#FBEFE3' },
};

// ---------- 테마 (폰 화면 루트 CSS 변수) ----------
export const THEME: Record<string, string> = {
  '--bg': '#EDF0F3', '--surface': '#FFFFFF', '--line': '#E3E7EC', '--line-strong': '#CDD5DC',
  '--ink': '#1A2632', '--ink-2': '#556472', '--ink-3': '#8A97A4',
  '--accent': '#2563EB', '--accent-soft': '#EAF1FE', '--ok': '#0E9F6E', '--ok-soft': '#E5F6EF',
  '--warn': '#B05E12', '--warn-soft': '#FBEEDD', '--danger': '#C0362C', '--danger-soft': '#FAE7E4',
  '--r-card': '16px', '--r-btn': '12px',
  '--shadow': '0 1px 2px rgba(16,24,40,.06),0 2px 6px rgba(16,24,40,.04)',
  '--sheet-shadow': '0 -10px 34px rgba(16,24,40,.12)',
  '--wt': '700', '--ws': '600', '--wb': '500',
};

// ---------- 주차장 ----------
export interface Facility {
  id: string; name: string; type: 'PUBLIC' | 'PRIVATE';
  dist: number; price: number; occ: number; floors: string[]; x: number; y: number;
}
export const FACS: Facility[] = [
  { id: 'F1', name: '천안역 서부광장 주차장', type: 'PUBLIC', dist: 150, price: 1000, occ: 64, floors: ['B1', '1F', '2F'], x: 22, y: 34 },
  { id: 'F2', name: '천안역 동부 공영주차장', type: 'PUBLIC', dist: 450, price: 800, occ: 100, floors: ['B2', 'B1'], x: 72, y: 23 },
  { id: 'F3', name: '신부동 터미널 파킹', type: 'PRIVATE', dist: 1200, price: 2000, occ: 36, floors: ['B2', 'B1', '1F', '2F'], x: 38, y: 66 },
  { id: 'F4', name: '두정역 환승 주차장', type: 'PUBLIC', dist: 3800, price: 500, occ: 93, floors: ['1F', '2F', '3F'], x: 80, y: 60 },
  { id: 'F5', name: '불당동 스마트 타워', type: 'PRIVATE', dist: 5400, price: 1500, occ: 44, floors: ['B2', 'B1', '1F', '2F', '3F'], x: 30, y: 84 },
];

export const PER_FLOOR: Record<SlotType, number> = { 장애인: 4, 임산부: 2, 전기차: 6, 여성전용: 6, 일반: 30 };

// ---------- 주차면 메타 ----------
export const SLOT_META: Record<SlotType, { short: string; color: string; label: string; desc: string }> = {
  일반: { short: '일반', color: 'var(--ink-3)', label: '일반 주차면', desc: '일반 차량이 이용할 수 있는 자리입니다. 저장하면 내 차 위치와 요금 계산이 시작됩니다.' },
  전기차: { short: '전기', color: '#2E9E6B', label: '전기차 충전 주차면', desc: '전기차 충전 차량을 위한 자리입니다. 일반 차량은 다른 자리를 선택해 주세요.' },
  장애인: { short: '장애인', color: '#2F6BD6', label: '장애인 전용 주차면', desc: '장애인 주차 표지가 있는 차량만 이용할 수 있습니다.' },
  여성전용: { short: '여성', color: '#C0559B', label: '여성전용 주차면', desc: '여성 운전자를 위한 우선 배려 주차면입니다.' },
  임산부: { short: '임산부', color: '#D08344', label: '임산부 배려 주차면', desc: '임산부·영유아 동반 차량을 위한 배려 주차면입니다.' },
};

/** [진한색, 소프트배경, 본문텍스트] */
export const SLOT_TINTS: Record<SlotType, [string, string, string]> = {
  일반: ['var(--accent)', 'var(--accent-soft)', 'var(--ink-2)'],
  전기차: ['#1F8A58', '#E5F6EF', '#166B43'],
  장애인: ['#2F6BD6', '#E9F0FC', '#2456B4'],
  여성전용: ['#B84E92', '#F8EAF4', '#A8437F'],
  임산부: ['#C1712F', '#FAEEE3', '#A55D20'],
};

/** bay 셀 배경 틴트 (bayVal 내 TINT 상수) */
export const BAY_TINT: Record<SlotType, string> = {
  일반: 'rgba(255,255,255,.3)', 전기차: 'rgba(46,158,107,.55)', 장애인: 'rgba(63,118,214,.6)',
  여성전용: 'rgba(192,85,155,.55)', 임산부: 'rgba(208,131,68,.6)',
};

// ---------- 층별 덱 레이아웃 ----------
interface LayoutRow { block?: string; open?: 'up' | 'down'; items?: [SlotType, number][]; aisle?: string }
export const LAYOUT: LayoutRow[] = [
  { block: 'A', open: 'down', items: [['장애인', 4], ['임산부', 2]] },
  { aisle: '▶  ▶  ▶' },
  { block: 'B', open: 'up', items: [['전기차', 6]] },
  { block: 'B', open: 'down', items: [['여성전용', 6]] },
  { aisle: '◀  ◀  ◀' },
  { block: 'C', open: 'up', items: [['일반', 6]] },
  { block: 'C', open: 'down', items: [['일반', 6]] },
  { aisle: '▶  ▶  ▶' },
  { block: 'D', open: 'up', items: [['일반', 6]] },
  { block: 'D', open: 'down', items: [['일반', 6]] },
  { aisle: '◀  ◀  ◀' },
  { block: 'E', open: 'up', items: [['일반', 6]] },
];

// ---------- 천안 소식 ----------
export interface NewsItem { tag: string; title: string; date: string; summary: string; detail: string; benefit: string; actionLabel: string }
export const NEWS: NewsItem[] = [
  { tag: 'EVENT', title: '흥타령춤축제 주차장 무료 개방', date: '2026.05.20', summary: '축제 기간 천안역 주변 공영주차장 일부가 무료 개방됩니다.', detail: '흥타령춤축제 방문객 분산을 위해 행사 기간 주요 공영주차장 일부 구역을 무료 개방합니다. 앱에서 혼잡 예측 모드를 켜면 출차가 빠른 주차장을 우선 추천합니다.', benefit: '방문객 QR 할인과 중복 적용 가능', actionLabel: '행사 추천 주차장 보기' },
  { tag: 'NOTICE', title: '천안역 서부광장 정산기 교체 공사', date: '2026.05.15', summary: '교체 기간에도 하이패스형 자동결제는 정상 이용됩니다.', detail: '스마트 정산기 교체 작업으로 일부 현장 정산기 사용이 제한됩니다. 차량번호와 결제수단을 등록한 이용자는 출차 시 자동결제를 그대로 이용할 수 있습니다.', benefit: '교체 기간 출차 유예 30분 유지', actionLabel: '자동결제 등록 확인' },
  { tag: 'CITY', title: '천안시 청년 주차 지원 사업 신청', date: '2026.05.11', summary: '청년 이동 지원 월 주차 할인 신청이 시작됩니다.', detail: '천안시 거주 청년은 앱에서 본인인증 후 월 주차 할인 혜택을 신청할 수 있습니다. 승인된 할인은 결제 화면에 자동 반영됩니다.', benefit: '월 최대 12,000원 주차 할인', actionLabel: '지원 혜택 확인' },
  { tag: 'NEW', title: '불당동 스마트 타워 신규 오픈', date: '2026.05.08', summary: '전기차·여성전용면을 포함한 신규 주차장이 추가되었습니다.', detail: '불당동 생활권 주차 수요 분산을 위해 신규 연계 주차장이 추가되었습니다. 층별 실내 지도와 전기차 충전 가능 여부를 함께 확인할 수 있습니다.', benefit: '오픈 기념 첫 결제 1,000원 할인', actionLabel: '신규 주차장 보기' },
];

export const TAG_COLORS: Record<string, [string, string]> = {
  EVENT: ['#FBEEDD', '#B05E12'], NOTICE: ['var(--accent-soft)', 'var(--accent)'],
  CITY: ['#E5F6EF', '#0E9F6E'], NEW: ['#F3E8FA', '#8B44AD'],
};

// ---------- 이용 내역 ----------
interface PayRecord { location: string; date: string; duration: number; amount: number }
export const PAYS: PayRecord[] = [
  { location: '천안역 서부광장 주차장', date: '2026.05.10 14:30', duration: 125, amount: 8500 },
  { location: '천안역 동부 공영주차장', date: '2026.05.08 09:15', duration: 45, amount: 3200 },
  { location: '신부동 터미널 파킹', date: '2026.05.05 18:40', duration: 210, amount: 12000 },
  { location: '천안시청 주차장', date: '2026.05.01 11:20', duration: 60, amount: 4000 },
];

// ---------- 결제 오류 ----------
export type PayErrKind = 'card' | 'limit';
export const PAY_ERRORS: Record<PayErrKind, { title: string; desc: string; primary: string; secondary: string }> = {
  card: { title: '카드 결제가 거절되었어요', desc: '카드사에서 승인을 거절했습니다. 카드 상태를 확인하거나 다른 결제수단으로 시도해 주세요.', primary: '다른 결제수단으로 시도', secondary: '카드사 문의 1588-0000' },
  limit: { title: '카드 한도가 초과되었어요', desc: '등록된 카드의 결제 한도를 초과했습니다. 다른 카드로 결제하거나 한도를 확인해 주세요.', primary: '다른 카드로 결제', secondary: '한도 확인 방법 보기' },
};
