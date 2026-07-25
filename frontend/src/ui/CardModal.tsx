/** 천안사랑카드 연동 모달 (z-150) — 원본 cardOpen 블록 1:1 */
import { sx } from '../lib/css';
import type { AppVals } from '../logic/useApp';

export function CardModal({ v }: { v: AppVals }) {
  return (
    <div onClick={v.closeCard} style={sx('position:absolute;inset:0;z-index:150;background:rgba(15,23,42,.4);display:flex;align-items:flex-end;padding:16px;animation:fadeIn .2s')}>
      <div style={sx('width:100%;background:var(--surface);border-radius:var(--r-card);padding:20px;box-shadow:0 -10px 40px rgba(0,0,0,.2);animation:riseIn .25s ease-out')}>
        <div style={sx('display:flex;align-items:center;justify-content:space-between;margin-bottom:16px')}>
          <h3 style={sx('margin:0;font-size:1.08em;font-weight:var(--wt);color:var(--ink)')}>천안사랑카드 연동</h3>
          <button onClick={v.closeCard} style={sx('width:2.2em;height:2.2em;border-radius:var(--r-btn);background:var(--bg);border:none;color:var(--ink-2);display:flex;align-items:center;justify-content:center')}><svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
        </div>
        <div style={sx('background:var(--ok);color:#fff;border-radius:var(--r-card);padding:18px;position:relative;overflow:hidden')}>
          <div style={sx('width:2.4em;height:1.8em;border-radius:5px;background:rgba(255,255,255,.35)')} />
          <p style={sx('margin:20px 0 0;font-size:1.05em;font-weight:var(--wt);letter-spacing:.08em')}>4412 · · · ·　· · · ·　4412</p>
          <div style={sx('display:flex;justify-content:space-between;align-items:flex-end;margin-top:12px')}>
            <span style={sx('font-size:.72em;font-weight:var(--wb);opacity:.85')}>천안사랑 지역화폐</span>
            <span style={sx('font-size:.8em;font-weight:var(--wt)')}>천안사랑카드</span>
          </div>
        </div>
        <div style={sx('background:var(--ok-soft);border-radius:var(--r-btn);padding:12px 14px;margin-top:14px;display:flex;align-items:center;gap:9px')}>
          <svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          <span style={sx('font-size:.8em;font-weight:var(--ws);color:var(--ink)')}>공영주차장 결제 시 <b>10% 추가 할인</b> 자동 적용</span>
        </div>
        <button onClick={v.linkCard} style={sx('width:100%;margin-top:16px;background:var(--ink);color:var(--surface);border:none;border-radius:var(--r-btn);padding:1em 0;font-size:.9em;font-weight:var(--wt)')}>이 카드로 연동하기</button>
      </div>
    </div>
  );
}
