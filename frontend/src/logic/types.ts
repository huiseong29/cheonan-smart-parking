/** 원본 Component.state의 완전한 타입 모델 (런타임에 추가되는 키는 optional) */
import type { CondKey, CertKey, NewsItem, PayErrKind, SlotType, VehType } from '../data';

export type Tab = 'home' | 'register' | 'payment' | 'benefits' | 'profile';
export type View = 'none' | 'detail' | 'success' | 'history';
export type PayStep = 'none' | 'confirm' | 'complete' | 'failed' | 'pending';
export type RecStatus = '확인 중' | '완료' | '확인 실패';
export type FeeState = null | 'loading' | 'ok' | 'fail';
export type ResumeState = null | 'checking' | 'found';

export interface Session { fac: string; slot: string; floor: string; min: number }
export interface Benefit { label: string; amount: number }
export interface LiveRec { location: string; time: string; status: RecStatus; amount: number }

export interface AppState {
  // 데이터 신뢰
  sync: number; syncing: boolean; syncFail?: boolean;
  // 결제 오류 종류
  payErr: PayErrKind;
  // 차량번호
  plateDraft: string; plate: string; plateErr: boolean;
  plateConfirm?: boolean; plateEdit: boolean; kb?: boolean;
  // 라우팅
  tab: Tab; view: View; pay: PayStep; onboarded: boolean;
  // 지도·층별
  selFac: string; floor: string; selSlot: string | null; selType: SlotType; selOk?: boolean;
  filter: string; sheet: boolean;
  // 설정
  hipass: boolean; autoDiscount: boolean; isCitizen: boolean; scale: number;
  // 콘텐츠
  news: NewsItem | null; benefit: Benefit | null;
  // 세션
  session: Session | null; exit: number;
  // 오버레이
  fsOpen: boolean; qr: boolean; cardLink: boolean; cardLinked: boolean; eventRec: boolean;
  navTo: string | null;
  // 차량 유형·자격
  vehType: VehType;
  conds: Record<CondKey, boolean>;
  certs: Record<CertKey, boolean>;
  verify: CertKey | null; verifying: boolean;
  // 결제
  liveRec: LiveRec | null;
  feeState: FeeState; feeSync: number | null; feeBump: number;
  resume: ResumeState;
  // 런타임 추가 플래그
  mapLoading?: boolean; floorLoading?: boolean; tabLoading?: boolean;
  paying?: boolean; rechk?: boolean;
}

/** 원본 state 초기값 1:1 */
export const INITIAL_STATE: AppState = {
  sync: Date.now(), syncing: false, payErr: 'limit',
  plateDraft: '', plate: '123가 4567',
  tab: 'home', view: 'none', pay: 'none', onboarded: false,
  selFac: 'F1', floor: 'B1', selSlot: null, selType: '일반', filter: '전체', sheet: false,
  hipass: true, autoDiscount: true, isCitizen: true, scale: 1,
  news: null, benefit: null, session: null, exit: 1800,
  fsOpen: false, qr: false, cardLink: false, cardLinked: false, eventRec: false,
  navTo: null, vehType: '일반',
  conds: { 장애인: false, 여성전용: false, 임산부: false },
  certs: { 전기차: false, 장애인: false, 임산부: false },
  verify: null, verifying: false, plateErr: false,
  liveRec: null, feeState: null, feeSync: null, feeBump: 0, plateEdit: false, resume: null,
};
