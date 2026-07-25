/** 주차 위치 확인 모달 (z-130) — 원본 slotModal 블록 1:1 */
import { sx } from '../lib/css';
import type { AppVals } from '../logic/useApp';

export function SlotModal({ v }: { v: AppVals }) {
  return (
    <div onClick={v.closeSlot} style={sx('position:absolute;inset:0;z-index:130;background:rgba(15,23,42,.4);display:flex;align-items:flex-end;padding:16px;animation:fadeIn .2s')}>
      <div className="nb" style={sx('width:100%;max-height:100%;overflow-y:auto;background:var(--surface);border-radius:var(--r-card);padding:20px;box-shadow:0 -10px 40px rgba(0,0,0,.2);animation:riseIn .25s ease-out')}>
        <div style={sx('display:flex;align-items:flex-start;gap:12px')}>
          <div style={sx(`flex:none;width:3em;height:3em;border-radius:var(--r-btn);background:${v.selTintSoft};color:${v.selTint};display:flex;align-items:center;justify-content:center`)}>
            <svg width="1.4em" height="1.4em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
          </div>
          <div style={sx('min-width:0')}>
            <p style={sx(`margin:0;font-size:.72em;font-weight:var(--ws);color:${v.selTint}`)}>주차 위치 확인</p>
            <h3 style={sx('margin:4px 0 0;font-size:1.15em;font-weight:var(--wt);color:var(--ink)')}>{v.activeFloor} {v.selSlotDisp}</h3>
            <span style={sx(`display:inline-flex;align-items:center;gap:.32em;margin-top:8px;padding:.28em .6em;border-radius:99px;background:${v.selTintSoft};color:${v.selTint};font-size:.72em;font-weight:var(--ws)`)}>
              <span style={sx(`width:.42em;height:.42em;border-radius:99px;background:${v.selSlotDot}`)} />{v.selSlotLabel}
            </span>
          </div>
        </div>
        <div style={sx(`background:${v.selTintSoft};border-radius:var(--r-btn);padding:14px;margin-top:16px`)}>
          <p style={sx(`margin:0;font-size:.82em;font-weight:var(--wb);color:${v.selTintText};line-height:1.55`)}>{v.selSlotDesc}</p>
        </div>
        <div style={sx('display:flex;gap:10px;margin-top:16px')}>
          <button onClick={v.closeSlot} style={sx('flex:1;background:var(--bg);color:var(--ink-2);border:none;border-radius:var(--r-btn);padding:.85em 0;font-size:.86em;font-weight:var(--ws)')}>다시 선택</button>
          {v.selEligible && <button onClick={v.saveSlot} style={sx('flex:1;background:var(--ink);color:var(--surface);border:none;border-radius:var(--r-btn);padding:.85em 0;font-size:.86em;font-weight:var(--wt)')}>주차 위치 저장</button>}
        </div>
      </div>
    </div>
  );
}
