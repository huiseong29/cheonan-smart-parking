/** 하단 네비게이션 (지도·내 차·결제·혜택·내 정보) — 원본 템플릿 1:1 */
import { sx } from '../lib/css';
import type { AppVals } from '../logic/useApp';

export function BottomNav({ v }: { v: AppVals }) {
  return (
    <div style={sx('flex:none;position:relative;display:flex;background:var(--surface);border-top:1px solid var(--line);padding:8px 8px 22px')}>
      <button onClick={v.nHome.onPick} style={sx(`flex:1;background:none;border:none;padding:6px 0;display:flex;flex-direction:column;align-items:center;gap:3px;color:${v.nHome.color}`)}>
        <svg width="1.35em" height="1.35em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
        <span style={sx(`font-size:.64em;font-weight:${v.nHome.weight}`)}>지도</span>
      </button>
      <button onClick={v.nReg.onPick} style={sx(`flex:1;background:none;border:none;padding:6px 0;display:flex;flex-direction:column;align-items:center;gap:3px;color:${v.nReg.color}`)}>
        <svg width="1.35em" height="1.35em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13" /><path d="M5 13h14v4H5z" /><circle cx="7.5" cy="17" r="1.2" /><circle cx="16.5" cy="17" r="1.2" /></svg>
        <span style={sx(`font-size:.64em;font-weight:${v.nReg.weight}`)}>내 차</span>
      </button>
      <button onClick={v.nPay.onPick} style={sx(`flex:1;background:none;border:none;padding:6px 0;display:flex;flex-direction:column;align-items:center;gap:3px;color:${v.nPay.color}`)}>
        <svg width="1.35em" height="1.35em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></svg>
        <span style={sx(`font-size:.64em;font-weight:${v.nPay.weight}`)}>결제</span>
      </button>
      <button onClick={v.nBen.onPick} style={sx(`flex:1;background:none;border:none;padding:6px 0;display:flex;flex-direction:column;align-items:center;gap:3px;color:${v.nBen.color}`)}>
        <svg width="1.35em" height="1.35em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M5 12v8h14v-8" /><path d="M12 8V4" /><path d="M12 8c-1.5 0-4-.5-4-2.5S10 4 12 8zM12 8c1.5 0 4-.5 4-2.5S14 4 12 8z" /></svg>
        <span style={sx(`font-size:.64em;font-weight:${v.nBen.weight}`)}>혜택</span>
      </button>
      <button onClick={v.nProf.onPick} style={sx(`flex:1;background:none;border:none;padding:6px 0;display:flex;flex-direction:column;align-items:center;gap:3px;color:${v.nProf.color}`)}>
        <svg width="1.35em" height="1.35em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5" /></svg>
        <span style={sx(`font-size:.64em;font-weight:${v.nProf.weight}`)}>내 정보</span>
      </button>
    </div>
  );
}
