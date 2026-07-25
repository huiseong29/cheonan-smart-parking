/**
 * 앱 상태·로직 훅 (시안 .dc.html의 Component 클래스에서 이식).
 *
 * 구조:
 *  - 단일 state + set(patch|fn) 부분 병합
 *  - 타이머는 T ref, 첫 방문 기록·IME 플래그는 ref (리렌더 무관)
 *  - 파생값·핸들러는 렌더 시 계산해 하나의 vals 객체로 반환 → UI 컴포넌트가 소비
 *
 * 백엔드/PG 연동 지점 (현재 setTimeout 시뮬레이션):
 *  - fetchFee(요금 조회) · doPay(승인 요청 → 실패 시 pay:'failed', 무응답 시 pay:'pending')
 *  - startPoll(미확정 승인 폴링) · resume(재실행 시 미확정 결제 복구 → resume:'checking')
 *  - refresh(잔여면 실시간 조회)
 */
import { useEffect, useReducer, useRef, useState } from 'react';
import type { ChangeEvent, CompositionEvent, MouseEvent as ReactMouseEvent } from 'react';
import {
  FACS, NEWS, PAYS, PER_FLOOR, SLOT_META, SLOT_TINTS, BAY_TINT, TAG_COLORS, PAY_ERRORS,
  VERIFY_META, THEME, VEH_TYPES, VEH_CONDS,
  type CondKey, type Facility, type SlotType,
} from '../data';
import { INITIAL_STATE, type AppState, type RecStatus, type Tab } from './types';
import { buildDeck, countEmpty, facEmpty, type DeckBay } from './deck';
import { plateOk as plateOkFn, maskPlate } from '../lib/plate';
import { qrRows as buildQrRows } from '../lib/qr';
import { clk, distText, hm, status, won } from '../lib/util';

type Patch = Partial<AppState> | ((s: AppState) => Partial<AppState>);

export interface BayVal {
  id: string; code: string; num: string; typeLabel: SlotType;
  occupied: boolean; available: boolean; showLabel: boolean; plainOpen: boolean;
  short: string; style: string; hoverable: boolean; onPick: () => void;
}
export interface RowVal { isAisle: boolean; isRow: boolean; arrow?: string; block?: string; bays?: BayVal[] }

export function useApp() {
  const [S, setStateRaw] = useState<AppState>(INITIAL_STATE);
  const R = useRef(S);
  R.current = S; // 핸들러·타이머 콜백이 항상 최신 state를 읽도록 (클래스 this.state 시맨틱)

  const set = useRef((p: Patch) =>
    setStateRaw((prev) => ({ ...prev, ...(typeof p === 'function' ? p(prev) : p) })),
  ).current;

  // ---- 인스턴스 필드(원본 this._*) ----
  const T = useRef<Record<string, ReturnType<typeof setTimeout> | undefined>>({});
  const pl = useRef<ReturnType<typeof setInterval> | undefined>(undefined);   // _pl 승인 폴링
  const plN = useRef(0);                                                      // _plN
  const exitT = useRef<ReturnType<typeof setInterval> | undefined>(undefined); // _t 출차 카운트다운
  const seenFloors = useRef<Record<string, boolean>>({});                     // _seenFloors
  const seenTabs = useRef<Record<string, boolean>>({});                       // _seenTabs
  const comp = useRef(false);                                                 // _comp (IME)
  const [, force] = useReducer((n: number) => n + 1, 0);                      // forceUpdate

  // ---------------------------------------------------------------- methods
  const fetchFee = () => {
    clearTimeout(T.current.feeT);
    if (typeof navigator !== 'undefined' && !navigator.onLine) { set({ feeState: 'fail' }); return; }
    set({ feeState: 'loading' });
    T.current.feeT = setTimeout(() => {
      set({ feeState: 'ok', feeSync: Date.now() });
      clearTimeout(T.current.feeB);
      T.current.feeB = setTimeout(() => {
        if (R.current.pay === 'confirm') set({ feeBump: 100, feeSync: Date.now() });
      }, 25000);
    }, 700);
  };

  const startPoll = () => {
    clearInterval(pl.current);
    plN.current = 0;
    pl.current = setInterval(() => {
      const r = R.current.liveRec;
      if (!r || r.status !== '확인 중') { clearInterval(pl.current); return; }
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        plN.current++;
        if (plN.current >= 4) { clearInterval(pl.current); set({ liveRec: { ...r, status: '확인 실패' } }); }
        return;
      }
      clearInterval(pl.current);
      set({ liveRec: { ...r, status: '완료' } });
    }, 8000);
  };

  const pushRec = (recStatus: RecStatus, amount: number) => {
    const fac = FACS.find((f) => f.id === R.current.selFac) || FACS[0];
    const d = new Date();
    const hhmm = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    set({ liveRec: { location: fac.name, time: hhmm, status: recStatus, amount } });
    if (recStatus === '확인 중') startPoll(); else clearInterval(pl.current);
  };

  const eligible = (bayType: SlotType) => {
    const st = R.current, c = st.conds || ({} as AppState['conds']);
    if (bayType === '일반') return true;
    if (bayType === '전기차') return st.vehType === '전기차';
    if (bayType === '여성전용') return !!(c.여성전용 || c.임산부);
    return !!c[bayType as CondKey];
  };

  const refresh = () => {
    if (R.current.syncing) return;
    const off = typeof navigator !== 'undefined' && !navigator.onLine;
    if (off) {
      set({ syncFail: true });
      clearTimeout(T.current.sfT);
      T.current.sfT = setTimeout(() => set({ syncFail: false }), 2600);
      return;
    }
    set({ syncing: true, syncFail: false });
    clearTimeout(T.current.syT);
    T.current.syT = setTimeout(() => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) set({ syncing: false, syncFail: true });
      else set({ syncing: false, sync: Date.now() });
    }, 900);
  };

  const applyPlate = (el: HTMLInputElement) => {
    const sigBefore = el.value.slice(0, el.selectionStart || 0).replace(/[^0-9가-힣]/g, '').length;
    const { v, rejected } = maskPlate(el.value);
    let pos = 0, cnt = 0;
    for (const ch of v) { if (cnt >= sigBefore) break; pos++; if (/[0-9가-힣]/.test(ch)) cnt++; }
    const ok = plateOkFn(v);
    set((s) => ({ plateDraft: v, plateErr: rejected ? true : (ok ? false : s.plateErr), plate: ok ? v : s.plate }));
    requestAnimationFrame(() => { try { el.setSelectionRange(pos, pos); } catch { /* noop */ } });
  };

  // ------------------------------------------------------- componentDidMount
  useEffect(() => {
    const timers = T.current; // 재할당되지 않는 타이머 레지스트리 — 클린업에서 안전하게 참조
    const minT = setInterval(() => force(), 30000); // 상대시각("N분 전 기준") 갱신
    const onl = () => {
      if (navigator.onLine) {
        refresh();
        const r = R.current.liveRec;
        if (r && r.status === '확인 중') { clearInterval(pl.current); set({ liveRec: { ...r, status: '완료' } }); }
      } else force();
    };
    window.addEventListener('online', onl);
    window.addEventListener('offline', onl);
    const vis = () => {
      if (document.visibilityState === 'visible') {
        if (Date.now() - (R.current.sync || 0) > 30000) refresh();
        else force();
      }
    };
    document.addEventListener('visibilitychange', vis);
    return () => { // componentWillUnmount(원본 2개 정의의 합집합)
      clearInterval(minT); clearInterval(exitT.current); clearInterval(pl.current);
      Object.values(timers).forEach((t) => { if (t !== undefined) clearTimeout(t); });
      window.removeEventListener('online', onl);
      window.removeEventListener('offline', onl);
      document.removeEventListener('visibilitychange', vis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------------ componentDidUpdate
  const prevRef = useRef({ pay: S.pay, view: S.view, tab: S.tab });
  useEffect(() => {
    const prev = prevRef.current;
    if (S.pay === 'complete' && prev.pay !== 'complete') {
      clearInterval(exitT.current);
      exitT.current = setInterval(() => set((s) => ({ exit: Math.max(0, s.exit - 1) })), 1000);
    }
    if (S.pay !== 'complete' && prev.pay === 'complete') clearInterval(exitT.current);
    const stale = Date.now() - (S.sync || 0) > 30000;
    if (stale && ((S.view === 'detail' && prev.view !== 'detail') || (S.tab === 'home' && prev.tab !== 'home'))) refresh();
    prevRef.current = { pay: S.pay, view: S.view, tab: S.tab };
  });

  // ============================================================ renderVals()
  const theme: Record<string, string> = { ...THEME, '--scale': String(S.scale) };
  const plateOk = plateOkFn(S.plateDraft);
  const chip = 'display:inline-flex;align-items:center;gap:.32em;flex:none;padding:.24em .6em;border-radius:99px;font-size:.72em;font-weight:var(--ws)';
  const nFloor = PER_FLOOR;
  const perFloorTotal = nFloor.장애인 + nFloor.임산부 + nFloor.전기차 + nFloor.여성전용 + nFloor.일반;

  const facFor = (f: Facility) => {
    const empty = facEmpty(f.id);
    const total = f.floors.length * perFloorTotal;
    const st = status(empty, total);
    const openDetail = () => {
      const fl0 = f.floors.includes(S.floor) ? S.floor : (f.floors.includes('B1') ? 'B1' : f.floors[0]);
      set({ selFac: f.id, view: 'detail', floor: fl0, selSlot: null });
    };
    return {
      ...f, empty, total,
      typeLabel: f.type === 'PUBLIC' ? '공영' : '사설',
      distText: distText(f.dist), priceText: won(f.price),
      statusLabel: st.label, statusColor: st.color,
      statusChip: `${chip};color:${st.color};background:${st.soft}`,
      specialText: `전기 ${nFloor.전기차 * f.floors.length} · 장애인 ${nFloor.장애인 * f.floors.length} · 여성 ${nFloor.여성전용 * f.floors.length} · 임산부 ${nFloor.임산부 * f.floors.length}`,
      floorsText: f.floors[0] + '~' + f.floors[f.floors.length - 1] + ' ' + f.floors.length + '개 층',
      onSelect: () => set({ selFac: f.id, sheet: false }),
      onDetail: openDetail,
    };
  };

  let list = FACS.slice();
  const fl = S.filter;
  if (fl === '가까운 순') list.sort((a, b) => a.dist - b.dist);
  else if (fl === '빈자리') list = list.filter((f) => facEmpty(f.id) > 0).sort((a, b) => facEmpty(b.id) - facEmpty(a.id));
  else if (fl === '공영') list = list.filter((f) => f.type === 'PUBLIC');
  const facilities = list.map(facFor);
  const filters = ['전체', '가까운 순', '빈자리', '공영', '전기차', '장애인', '여성전용'].map((label) => {
    const on = S.filter === label;
    return { label, style: `flex:none;white-space:nowrap;border:1px solid ${on ? 'var(--accent)' : 'var(--line)'};background:${on ? 'var(--accent)' : 'var(--surface)'};color:${on ? '#fff' : 'var(--ink-2)'};border-radius:99px;padding:.5em .95em;font-size:.78em;font-weight:var(--ws);box-shadow:var(--shadow)`, onPick: () => set({ filter: label }) };
  });
  const markers = facilities.map((f, mi) => {
    const on = S.selFac === f.id;
    return { x: f.x, y: f.y, delay: (mi * 70) + 'ms', z: on ? 30 : (f.empty === 0 ? 20 : 10), color: f.statusColor, text: f.empty > 0 ? f.empty + '대' : '만차', pinStyle: `display:flex;align-items:center;justify-content:center;padding:.32em .6em;border-radius:11px;font-size:.72em;font-weight:var(--wt);color:#fff;background:${f.statusColor};box-shadow:${on ? '0 0 0 3px #fff,0 4px 12px rgba(0,0,0,.25)' : '0 3px 8px rgba(0,0,0,.2)'};white-space:nowrap;${on ? 'animation:markerPulse 2s ease-out infinite' : ''}`, onPick: () => set({ selFac: f.id, sheet: false }) };
  });
  const selFacObj = facFor(FACS.find((f) => f.id === S.selFac) || FACS[0]);

  const selFacRaw = FACS.find((f) => f.id === S.selFac) || FACS[0];
  const activeF = selFacRaw.floors.includes(S.floor) ? S.floor : (selFacRaw.floors.includes('B1') ? 'B1' : selFacRaw.floors[0]);
  const floors = selFacRaw.floors.map((f) => {
    const on = activeF === f;
    const empty = countEmpty(selFacRaw.id, f);
    return {
      f, emptyText: empty > 0 ? empty + '대' : '만차',
      style: `flex:none;min-width:4.6em;border:1px solid ${on ? 'var(--accent)' : 'var(--line)'};background:${on ? 'var(--accent)' : 'var(--surface)'};color:${on ? '#fff' : 'var(--ink-2)'};border-radius:var(--r-btn);padding:.6em .4em`,
      onPick: () => {
        if (f === activeF) return;
        const key = selFacRaw.id + '|' + f;
        const need = !seenFloors.current[key];
        seenFloors.current[key] = true;
        set({ floor: f, selSlot: null, floorLoading: need });
        if (need) { clearTimeout(T.current.flT); T.current.flT = setTimeout(() => set({ floorLoading: false }), 650); }
      },
    };
  });
  const legend = ([['일반', 'var(--ink-3)'], ['전기차', '#2E9E6B'], ['장애인', '#2F6BD6'], ['여성전용', '#C0559B'], ['임산부', '#D08344']] as [string, string][]).map(([label, color]) => ({ label, color }));

  // 원본 bayVal(): 상태 의존 스타일·핸들러 결합 (style-hover → hoverable 플래그)
  const bayVal = (bay: DeckBay): BayVal => {
    const meta = SLOT_META[bay.type];
    const sel = S.selSlot === bay.id;
    const ok = eligible(bay.type);
    const line = '2px solid rgba(255,255,255,.85)';
    const closed = bay.open === 'down' ? 'border-top' : 'border-bottom';
    let st = `display:flex;flex-direction:${bay.open === 'down' ? 'column' : 'column-reverse'};justify-content:space-between;align-items:center;height:5em;padding:.35em .2em;border-left:${line};border-right:${line};${closed}:${line};border-radius:0;`;
    if (bay.occupied) st += 'background:repeating-linear-gradient(45deg,rgba(74,84,95,.7),rgba(74,84,95,.7) 6px,rgba(90,100,112,.7) 6px,rgba(90,100,112,.7) 12px);color:rgba(220,227,234,.45);cursor:default';
    else if (sel && ok) st += 'background:var(--accent);color:#fff;box-shadow:inset 0 0 0 3px rgba(255,255,255,.55);animation:pulseRing 1.8s ease-out infinite';
    else if (!ok) st += `background:${BAY_TINT[bay.type]};color:#fff;opacity:.35;cursor:not-allowed`;
    else st += `background:${BAY_TINT[bay.type]};color:#fff;box-shadow:inset 0 0 0 2px rgba(255,255,255,.35);transition:transform .12s,box-shadow .12s`;
    const showLabel = !bay.occupied && bay.type !== '일반';
    const hoverable = !bay.occupied && ok && !sel;
    if (bay.occupied) st += ';pointer-events:none';
    return {
      id: bay.id, code: bay.code, num: bay.code, typeLabel: bay.type,
      occupied: bay.occupied, available: !bay.occupied,
      showLabel, plainOpen: !bay.occupied && bay.type === '일반', short: meta.short,
      style: st, hoverable,
      onPick: () => { if (!bay.occupied) set({ selSlot: bay.id, selType: bay.type, selOk: ok }); },
    };
  };
  const rows: RowVal[] = buildDeck(selFacRaw.id, activeF).map((r) =>
    r.isAisle ? { isAisle: true, isRow: false, arrow: r.arrow } : { isAisle: false, isRow: true, block: r.block, bays: r.bays!.map(bayVal) },
  );
  const selMeta = S.selSlot ? SLOT_META[S.selType] : null;

  // fees
  const baseFee = 8200, discount = 2600, benefitAmt = S.benefit ? S.benefit.amount : 0;
  const curFee = Math.max(0, baseFee - discount - benefitAmt);
  const finalFee = Math.max(0, curFee + (S.feeBump || 0));

  const nav = (id: Tab) => {
    const on = S.tab === id && S.view === 'none' && S.pay === 'none';
    return {
      color: on ? 'var(--accent)' : 'var(--ink-3)', weight: on ? 'var(--wt)' : 'var(--ws)',
      onPick: () => {
        const sw = !(S.tab === id && S.view === 'none' && S.pay === 'none') && id !== 'home' && !seenTabs.current[id];
        seenTabs.current[id] = true;
        set({ tab: id, view: 'none', pay: 'none', qr: false, cardLink: false, eventRec: false, fsOpen: false, selSlot: null, navTo: null, tabLoading: sw });
        if (sw) { clearTimeout(T.current.tabT); T.current.tabT = setTimeout(() => set({ tabLoading: false }), 550); }
      },
    };
  };

  const fontSizes = ([[1, '보통'], [1.15, '크게'], [1.3, '매우 크게']] as [number, string][]).map(([v, label]) => {
    const on = S.scale === v;
    return { label, style: `min-height:2.8em;border:1px solid ${on ? 'var(--ink)' : 'var(--line)'};background:${on ? 'var(--ink)' : 'var(--surface)'};color:${on ? '#fff' : 'var(--ink-2)'};border-radius:var(--r-btn);font-size:.82em;font-weight:var(--ws)`, onPick: () => set({ scale: v }) };
  });
  const carToggles = ([
    { key: 'hipass', title: '하이패스형 자동결제', desc: '출차 시 정산기 없이 자동 결제' },
    { key: 'autoDiscount', title: '할인 혜택 자동 적용', desc: '경차·저공해·유공자 등' },
  ] as { key: 'hipass' | 'autoDiscount'; title: string; desc: string }[]).map((t) => {
    const on = S[t.key];
    return { title: t.title, desc: t.desc, bg: on ? 'var(--ok)' : 'var(--line-strong)', dot: on ? 'right:.18em' : 'left:.18em', onToggle: () => set((s) => ({ [t.key]: !s[t.key] } as Partial<AppState>)) };
  });

  const overlayUp = !S.onboarded || S.view === 'detail' || S.view === 'success' || S.pay !== 'none' || !!S.selSlot || !!S.news || S.qr || S.cardLink || S.eventRec || !!S.resume || !!S.plateEdit;
  const fsOptions = ([[1, '보통'], [1.15, '크게'], [1.3, '매우 크게']] as [number, string][]).map(([v, label]) => {
    const on = S.scale === v;
    return { label, style: `width:100%;min-height:2.6em;border:1px solid ${on ? 'var(--ink)' : 'var(--line)'};background:${on ? 'var(--ink)' : 'var(--surface)'};color:${on ? '#fff' : 'var(--ink-2)'};border-radius:10px;font-size:.8em;font-weight:var(--ws)`, onPick: () => set({ scale: v, fsOpen: false }) };
  });
  const methods = ['하이패스', '천안사랑카드', '일반카드', '무료'];
  const methodColor: Record<string, string> = { 하이패스: 'var(--ok)', 천안사랑카드: 'var(--accent)', 일반카드: 'var(--ink-2)', 무료: 'var(--warn)' };
  const eventFacs = ['F1', 'F3', 'F5'].map((id) => {
    const f = FACS.find((x) => x.id === id)!;
    const o = facFor(f);
    return {
      name: f.name,
      empty: o.empty,
      distText: o.distText,
      onDetail: () => set({ selFac: id, eventRec: false, news: null, view: 'detail', tab: 'home' }),
      onNav: () => set({ selFac: id, navTo: id, eventRec: false, news: null, view: 'none', pay: 'none', tab: 'home', sheet: false }),
    };
  });
  const navFac = S.navTo ? FACS.find((f) => f.id === S.navTo) : null;
  const navSx = 55, navSy = 620;
  let navVals: {
    navOn: boolean; navPath?: string; navSx?: number; navSy?: number;
    navFacName?: string; navDist?: string; navEta?: string;
    navEnd?: () => void; navArrive?: () => void;
  } = { navOn: false };
  if (navFac) {
    const tx = navFac.x * 3.96, ty = navFac.y * 7;
    const mx = (navSx + tx) / 2;
    navVals = {
      navOn: true,
      navPath: `M${navSx} ${navSy} C ${navSx} ${navSy - 140}, ${mx} ${ty + 160}, ${mx} ${(navSy + ty) / 2} S ${tx} ${ty + 90}, ${tx} ${ty + 14}`,
      navSx, navSy,
      navFacName: navFac.name, navDist: distText(navFac.dist), navEta: Math.max(2, Math.round(navFac.dist / 500)) + '분 후',
      navEnd: () => set({ navTo: null }), navArrive: () => set({ navTo: null, view: 'detail' }),
    };
  }

  return {
    // 전체 뷰포트(100%) 사용 · 노치 기기 안전영역 패딩 (데스크톱 브라우저에선 0)
    screenStyle: 'position:relative;display:flex;flex-direction:column;height:100%;overflow:hidden;background:var(--bg);color:var(--ink);padding-top:env(safe-area-inset-top);' + Object.keys(theme).map((k) => `${k}:${theme[k]}`).join(';') + ';font-size:calc(16px * var(--scale))',
    // tab flags
    isHome: S.tab === 'home' && S.view === 'none',
    isRegister: S.tab === 'register' && S.view === 'none' && !S.tabLoading,
    isPayment: S.tab === 'payment' && S.view === 'none' && !S.tabLoading,
    isBenefits: S.tab === 'benefits' && S.view === 'none' && !S.tabLoading,
    isProfile: S.tab === 'profile' && S.view === 'none' && !S.tabLoading,
    isHistory: S.view === 'history' && !S.tabLoading,
    tabSkeleton: !!S.tabLoading && S.pay === 'none',
    showNav: !overlayUp,
    nHome: nav('home'), nReg: nav('register'), nPay: nav('payment'), nBen: nav('benefits'), nProf: nav('profile'),
    // overlays
    isOnboarding: !S.onboarded,
    isDetail: S.view === 'detail' && S.onboarded,
    isSuccess: S.view === 'success',
    slotModal: !!S.selSlot && S.view === 'detail',
    payConfirm: S.pay === 'confirm',
    payComplete: S.pay === 'complete',
    newsModal: !!S.news,
    // home
    filters, markers, facilities, selFacObj,
    sheetPeekShow: !S.sheet && !S.mapLoading, sheetList: S.sheet,
    sheetStyle: `position:absolute;left:0;right:0;bottom:0;z-index:${S.sheet ? 60 : 25};background:var(--surface);border-top:1px solid var(--line);border-radius:26px 26px 0 0;box-shadow:var(--sheet-shadow);${S.sheet ? 'top:32%;display:flex;flex-direction:column' : ''}`,
    toggleSheet: () => set((s) => ({ sheet: !s.sheet })),
    openDetail: () => set({ view: 'detail' }),
    sessionOnMap: !!S.session, parkMin: S.session ? S.session.min : 0,
    goPayConfirm: () => { fetchFee(); set({ pay: 'confirm' }); },
    // detail
    floors, activeFloor: activeF, legend, rows,
    recommend: () => {
      const all = rows.flatMap((z) => z.bays || []).filter((b) => b.available && eligible(b.typeLabel));
      const pick = all.find((b) => b.typeLabel !== '일반') || all[0];
      if (pick) set({ selSlot: pick.id, selType: pick.typeLabel });
    },
    vehTypeLabel: (() => { const cs = VEH_CONDS.filter((k) => S.conds[k]); return [S.vehType, ...cs].join('·'); })(),
    vehSummary: (() => { const cs = VEH_CONDS.filter((k) => S.conds[k]); const extra = cs.length ? ` + ${cs.join('·')} 면` : ''; return `층별 지도에서 일반${S.vehType === '전기차' ? '·전기차' : ''}${extra} 이용이 가능합니다`; })(),
    vehChips: VEH_TYPES.map((t) => {
      const on = S.vehType === t;
      const col = t === '전기차' ? '#2E9E6B' : 'var(--accent)';
      return { label: t, dotBg: on ? '#fff' : col, dotBorder: on ? '1px solid rgba(255,255,255,.5)' : 'none', style: `display:inline-flex;align-items:center;gap:.45em;flex:none;border:1.5px solid ${on ? col : 'var(--line)'};background:${on ? col : 'var(--surface)'};color:${on ? '#fff' : 'var(--ink-2)'};border-radius:99px;padding:.5em .95em;font-size:.8em;font-weight:var(--ws)`, onPick: () => { if (t === '전기차' && !S.certs.전기차) { set({ verify: '전기차' }); return; } set({ vehType: t, selSlot: null }); } };
    }),
    condChips: VEH_CONDS.map((t) => {
      const on = !!S.conds[t];
      const col = (SLOT_META[t] || {}).color || 'var(--accent)';
      // 여성전용은 자격확인 대상이 아니므로 cert 배지 없음 (certs에 키 자체가 없음)
      return { label: t, on, off: !on, cert: t !== '여성전용' && !!S.certs[t] && on, dotColor: col, style: `display:inline-flex;align-items:center;gap:.45em;flex:none;border:1.5px solid ${on ? col : 'var(--line)'};background:${on ? col : 'var(--surface)'};color:${on ? '#fff' : 'var(--ink-2)'};border-radius:99px;padding:.5em .95em;font-size:.8em;font-weight:var(--ws)`, onPick: () => { if (!on && t !== '여성전용' && !S.certs[t as '장애인' | '임산부']) { set({ verify: t as '장애인' | '임산부' }); return; } set((s) => ({ conds: { ...s.conds, [t]: !s.conds[t] }, selSlot: null })); } };
    }),
    verifyOpen: !!S.verify, vLoading: S.verifying, vIdle: !!S.verify && !S.verifying,
    vTitle: S.verify ? VERIFY_META[S.verify].title : '', vDesc: S.verify ? VERIFY_META[S.verify].desc : '', vSource: S.verify ? VERIFY_META[S.verify].source : '',
    vColor: S.verify ? VERIFY_META[S.verify].color : 'var(--accent)', vSoft: S.verify ? VERIFY_META[S.verify].soft : 'var(--accent-soft)',
    closeVerify: () => { if (!S.verifying) set({ verify: null }); },
    stopProp: (e: ReactMouseEvent) => e.stopPropagation(),
    runVerify: () => {
      const t = S.verify;
      set({ verifying: true });
      T.current.vfT = setTimeout(() => {
        set((s) => {
          const next: Partial<AppState> = { certs: { ...s.certs, [t!]: true }, verify: null, verifying: false, selSlot: null };
          if (t === '전기차') next.vehType = '전기차';
          else next.conds = { ...s.conds, [t as CondKey]: true };
          return next;
        });
      }, 1100);
    },
    goHome: () => set({ tab: 'home', view: 'none', pay: 'none', news: null }),
    // slot modal
    selSlotDisp: S.selSlot ? (S.selSlot.split('|')[1] || S.selSlot) : '', selSlotLabel: selMeta ? selMeta.label : '',
    selSlotDesc: selMeta ? (S.selOk !== false ? selMeta.desc : selMeta.label + '입니다. 등록된 차량 정보에 해당 조건이 없어 이용할 수 없어요. 해당된다면 내 차 탭에서 조건을 추가해 주세요.') : '',
    selSlotDot: selMeta ? selMeta.color : 'var(--ink-3)', selEligible: S.selOk !== false,
    selTint: (SLOT_TINTS[S.selType] || SLOT_TINTS.일반)[0], selTintSoft: (SLOT_TINTS[S.selType] || SLOT_TINTS.일반)[1], selTintText: (SLOT_TINTS[S.selType] || SLOT_TINTS.일반)[2],
    closeSlot: () => set({ selSlot: null }),
    saveSlot: () => { if (S.selOk === false) return; set({ session: { fac: S.selFac, slot: (S.selSlot || '').split('|')[1] || S.selSlot!, floor: activeF, min: 125 }, view: 'success' }); },
    goRegister: () => set({ tab: 'register', view: 'none', pay: 'none' }),
    // register  (⚠️ 원본 sessFloor/sessSlot 중복 정의 — 뒤 정의가 승리하므로 이것만 유지)
    hasSession: !!S.session, noSession: !S.session, plate: S.plate, parkHM: hm(S.session ? S.session.min : 125),
    sessFloor: S.session ? S.session.floor : 'B1', sessSlot: S.session ? S.session.slot : 'C-03',
    tHipass: carToggles[0], tDiscount: carToggles[1], fontSizes,
    // payment
    baseFeeText: won(baseFee), discountText: won(discount), curFeeText: won(finalFee),
    hasBenefit: !!S.benefit, benefitLabel: S.benefit ? S.benefit.label : '', benefitText: S.benefit ? won(S.benefit.amount) : '',
    hipassBg: S.hipass ? 'var(--ok)' : 'var(--line-strong)', hipassDot: S.hipass ? 'right:.18em' : 'left:.18em', toggleHipass: () => set((s) => ({ hipass: !s.hipass })),
    goBenefits: () => set({ tab: 'benefits', view: 'none', pay: 'none' }),
    closePay: () => { clearTimeout(T.current.feeT); clearTimeout(T.current.feeB); set({ pay: 'none', feeState: null, feeBump: 0 }); },
    doPay: () => {
      if (S.paying || S.feeState === 'loading' || S.feeState === 'fail') return;
      set({ paying: true });
      T.current.payT = setTimeout(() => { set({ paying: false, pay: 'complete', exit: 1800, feeState: null, feeBump: 0 }); pushRec('완료', finalFee); }, 1500);
    },
    feeLoading: S.feeState === 'loading', feeFail: S.feeState === 'fail', feeOk: !S.feeState || S.feeState === 'ok', feeNotOk: S.feeState === 'loading' || S.feeState === 'fail',
    feeSyncText: (() => { const d = new Date(S.feeSync || Date.now()); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ' 기준'; })(),
    feeBumped: !!S.feeBump, retryFee: () => fetchFee(),
    isPaying: !!S.paying,
    mapLoading: !!S.mapLoading, mapReady: !S.mapLoading,
    floorLoading: !!S.floorLoading, floorReady: !S.floorLoading,
    skels: [1, 2, 3], skelRows: [1, 2, 3, 4, 5],
    syncText: S.syncing ? '업데이트 중…' : (S.syncFail ? '갱신 실패 · 다시 시도' : (() => { const m = Math.floor((Date.now() - (S.sync || Date.now())) / 60000); return m < 1 ? '방금 전 기준' : m + '분 전 기준'; })()),
    syncTextStyle: S.syncFail ? 'color:var(--danger);font-weight:var(--wt)' : '',
    doRefresh: () => refresh(),
    refreshSpin: S.syncing ? 'animation:spin .9s linear infinite' : '',
    offline: typeof navigator !== 'undefined' && !navigator.onLine,
    facNone: list.length === 0 && !S.mapLoading,
    resetFilter: () => set({ filter: '전체' }),
    floorFull: !S.floorLoading && countEmpty(selFacRaw.id, activeF) === 0,
    altFloor: (selFacRaw.floors.find((f) => f !== activeF && countEmpty(selFacRaw.id, f) > 0)) || '',
    hasAltFloor: !!selFacRaw.floors.find((f) => f !== activeF && countEmpty(selFacRaw.id, f) > 0),
    noAltFloor: !selFacRaw.floors.find((f) => f !== activeF && countEmpty(selFacRaw.id, f) > 0),
    goAltFloor: () => {
      const alt = selFacRaw.floors.find((f) => f !== activeF && countEmpty(selFacRaw.id, f) > 0);
      if (alt) { set({ floor: alt, selSlot: null, floorLoading: true }); clearTimeout(T.current.afT); T.current.afT = setTimeout(() => set({ floorLoading: false, sync: Date.now() }), 600); }
    },
    payFailed: S.pay === 'failed', payPending: S.pay === 'pending',
    payErrTitle: (PAY_ERRORS[S.payErr] || PAY_ERRORS.card).title, payErrDesc: (PAY_ERRORS[S.payErr] || PAY_ERRORS.card).desc,
    payErrPrimary: (PAY_ERRORS[S.payErr] || PAY_ERRORS.card).primary, payErrSecondary: (PAY_ERRORS[S.payErr] || PAY_ERRORS.card).secondary,
    retryOther: () => set({ pay: 'confirm' }),
    checkHistory: () => { seenTabs.current.history = true; if (!S.liveRec) pushRec('확인 중', finalFee); set({ pay: 'none', tab: 'profile', view: 'history' }); },
    recheck: () => { set({ paying: true, rechk: true }); T.current.rcT = setTimeout(() => { set({ paying: false, rechk: false, pay: 'complete', exit: 1800 }); pushRec('완료', finalFee); }, 1400); },
    payingTitle: S.rechk ? '결제 결과 확인 중' : '결제 처리 중',
    payingDesc: S.rechk ? '카드사에서 승인 내역을 조회하고 있어요' : '천안사랑카드 할인을 적용하고 있어요',
    peekLoading: !!S.mapLoading && S.sheet !== true,
    facCountText: S.mapLoading ? '찾는 중…' : (list.length + '곳'),
    exitClock: clk(S.exit),
    endSession: () => set({ session: null, pay: 'none', tab: 'profile', view: 'history' }),
    // benefits
    news: NEWS.map((n) => { const tc = TAG_COLORS[n.tag] || ['var(--accent-soft)', 'var(--accent)']; return { tag: n.tag, tagBg: tc[0], tagColor: tc[1], title: n.title, date: n.date, summary: n.summary, onOpen: () => set({ news: n }) }; }),
    curNewsTagBg: (TAG_COLORS[(S.news || NEWS[0]).tag] || ['var(--accent-soft)', 'var(--accent)'])[0],
    curNewsTagColor: (TAG_COLORS[(S.news || NEWS[0]).tag] || ['var(--accent-soft)', 'var(--accent)'])[1],
    curNews: S.news || NEWS[0], closeNews: () => set({ news: null }),
    // profile
    userType: S.isCitizen ? '천안 시민' : '방문객',
    recentPays: [
      ...(S.liveRec ? [{ location: S.liveRec.location, date: '오늘 ' + S.liveRec.time, amountText: won(S.liveRec.amount) }] : []),
      ...PAYS.slice(0, 2).map((p) => ({ location: p.location, date: p.date, amountText: won(p.amount) })),
    ].slice(0, 2),
    allPays: [
      ...(S.liveRec ? [{
        location: S.liveRec.location, date: '오늘 ' + S.liveRec.time,
        durationText: hm(S.session ? S.session.min : 125), amountText: won(S.liveRec.amount),
        method: S.liveRec.status as string,
        methodChip: `padding:.2em .5em;border-radius:6px;font-size:.64em;font-weight:var(--wt);color:#fff;background:${S.liveRec.status === '확인 중' ? 'var(--warn)' : S.liveRec.status === '확인 실패' ? 'var(--danger)' : 'var(--ok)'}`,
        note: S.liveRec.status === '확인 중' ? '카드사 승인을 확인하고 있어요. 확정되면 자동으로 갱신되고, 중복 결제되지 않아요.' : S.liveRec.status === '확인 실패' ? '결과를 확인하지 못했어요. 출구 무인정산기에서 정산하거나 고객센터(1522-0000)로 문의해 주세요.' : '',
      }] : []),
      ...PAYS.map((p, i) => { const m = methods[i % methods.length]; return { location: p.location, date: p.date, durationText: hm(p.duration), amountText: won(p.amount), method: m, methodChip: `padding:.2em .5em;border-radius:6px;font-size:.64em;font-weight:var(--wt);color:#fff;background:${methodColor[m]}`, note: '' }; }),
    ],
    goHistory: () => {
      const need = !seenTabs.current.history;
      seenTabs.current.history = true;
      set({ view: 'history', tabLoading: need });
      if (need) { clearTimeout(T.current.tabT); T.current.tabT = setTimeout(() => set({ tabLoading: false }), 550); }
    },
    goProfile: () => set({ view: 'none', tab: 'profile' }),
    editPlate: () => set({ tab: 'register', view: 'none', pay: 'none', plateEdit: true, plateDraft: S.plate, plateErr: false, fsOpen: false }),
    // onboarding
    citizenStyle: `flex:1;text-align:left;border:1.5px solid ${S.isCitizen ? 'var(--ok)' : 'var(--line)'};background:${S.isCitizen ? 'var(--ok-soft)' : 'var(--surface)'};color:${S.isCitizen ? 'var(--ink)' : 'var(--ink-3)'};border-radius:var(--r-card);padding:16px`,
    visitorStyle: `flex:1;text-align:left;border:1.5px solid ${!S.isCitizen ? 'var(--accent)' : 'var(--line)'};background:${!S.isCitizen ? 'var(--accent-soft)' : 'var(--surface)'};color:${!S.isCitizen ? 'var(--ink)' : 'var(--ink-3)'};border-radius:var(--r-card);padding:16px`,
    pickCitizen: () => set({ isCitizen: true }), pickVisitor: () => set({ isCitizen: false }),
    isCitizenPick: S.isCitizen, isVisitorPick: !S.isCitizen,
    citizenIconColor: S.isCitizen ? 'var(--ok)' : 'var(--ink-3)', visitorIconColor: !S.isCitizen ? 'var(--accent)' : 'var(--ink-3)',
    plateDraft: S.plateDraft, plateValid: plateOk, plateHint: !plateOk && !(S.plateErr && S.plateDraft), plateInvalid: !plateOk,
    plateInputStyle: `width:100%;box-sizing:border-box;background:var(--bg);border:1.5px solid ${plateOk ? 'var(--ok)' : (S.plateErr && S.plateDraft ? 'var(--danger)' : 'var(--line-strong)')};border-radius:var(--r-card);padding:.7em .6em;text-align:center;font-family:inherit;font-size:1.5em;font-weight:var(--wt);color:var(--ink);letter-spacing:.02em;outline:none`,
    onPlateInput: (e: ChangeEvent<HTMLInputElement>) => {
      if (comp.current || (e.nativeEvent && (e.nativeEvent as unknown as { isComposing?: boolean }).isComposing)) { set({ plateDraft: e.target.value }); return; }
      applyPlate(e.target);
    },
    onPlateCompStart: () => { comp.current = true; },
    onPlateCompEnd: (e: CompositionEvent<HTMLInputElement>) => { comp.current = false; applyPlate(e.target as HTMLInputElement); },
    onPlateBlur: () => { const d = R.current.plateDraft; set((s) => ({ kb: false, plateErr: (d && !plateOkFn(d)) ? true : s.plateErr })); },
    onPlateFocus: () => set({ kb: true }),
    kbClosed: !S.kb,
    plateBad: !!S.plateErr && !plateOk && !!S.plateDraft,
    startBtnStyle: `background:${plateOk ? 'var(--ink)' : 'var(--line-strong)'};color:${plateOk ? 'var(--surface)' : '#fff'};border:none;border-radius:var(--r-card);padding:1.1em 0;font-size:1em;font-weight:var(--wt);opacity:${plateOk ? '1' : '.65'}`,
    finishOnboarding: () => { if (plateOk) set({ plateConfirm: true, kb: false }); },
    plateConfirmOpen: !!S.plateConfirm,
    plateConfirmText: (S.plateDraft || '').replace(/\s+/g, ' ').trim(),
    confirmPlate: () => { set({ plateConfirm: false, onboarded: true, plate: S.plateDraft.replace(/\s+/g, ' ').trim(), mapLoading: true }); T.current.mapT = setTimeout(() => set({ mapLoading: false }), 1100); },
    cancelPlateConfirm: () => set({ plateConfirm: false }),
    resumeChecking: S.resume === 'checking', resumeFound: S.resume === 'found', resumeOpen: !!S.resume,
    resumeDone: () => { set({ resume: null, pay: 'complete', exit: 1800 }); pushRec('완료', finalFee); },
    resumeLater: () => { set({ resume: null }); pushRec('확인 중', finalFee); },
    plateEditOpen: !!S.plateEdit,
    openPlateEdit: () => set({ plateEdit: true, plateDraft: S.plate, plateErr: false, fsOpen: false }),
    closePlateEdit: () => set({ plateEdit: false }),
    savePlate: () => { if (plateOkFn(S.plateDraft)) set({ plateEdit: false, plate: S.plateDraft.replace(/\s+/g, ' ').trim() }); },
    plateSaveStyle: `flex:1;border:none;border-radius:var(--r-btn);padding:.95em 0;font-size:.9em;font-weight:var(--wt);background:${plateOk ? 'var(--ink)' : 'var(--line-strong)'};color:#fff;opacity:${plateOk ? '1' : '.65'}`,
    // QR
    qrOpen: S.qr, qrRows: buildQrRows(),
    openQR: () => set({ qr: true, fsOpen: false }), closeQR: () => set({ qr: false }),
    scanDone: () => set({ qr: false, benefit: { label: '여행지원 QR 할인', amount: 1000 }, tab: 'payment', view: 'none', pay: 'none' }),
    // 천안사랑카드 연동
    cardOpen: S.cardLink, cardLinkedText: S.cardLinked ? '천안사랑카드 연동 완료' : '천안사랑카드 연동하기',
    openCardLink: () => set({ cardLink: true, fsOpen: false }), closeCard: () => set({ cardLink: false }),
    linkCard: () => set({ cardLink: false, cardLinked: true, benefit: { label: '천안사랑카드 할인', amount: 1000 }, tab: 'payment', view: 'none', pay: 'none' }),
    // 행사 추천 + 길 안내
    eventOpen: S.eventRec, eventFacs, closeEvent: () => set({ eventRec: false }),
    ...navVals,
    onNewsAction: () => { if (S.news && S.news.tag === 'EVENT') set({ news: null, eventRec: true }); else set({ news: null }); },
    // 전역 글자 크기
    fsShow: !S.qr, fsOpen: S.fsOpen, fsOptions, fsBtnColor: S.fsOpen ? 'var(--accent)' : 'var(--ink)',
    fsFloatBtn: !(S.tab === 'home' && S.view === 'none' && S.pay === 'none' && S.onboarded && !S.eventRec && !S.cardLink && !S.news),
    fsPanelGap: (S.tab === 'home' && S.view === 'none' && S.pay === 'none' && S.onboarded && !S.eventRec && !S.cardLink && !S.news) ? '3.1em' : '0em',
    toggleFs: () => set((s) => ({ fsOpen: !s.fsOpen })),
  };
}

export type AppVals = ReturnType<typeof useApp>;
