/** 행사 추천 주차장 (z-150, slideL) — 원본 eventOpen 블록 1:1 */
import { sx } from '../lib/css';
import type { AppVals } from '../logic/useApp';

export function EventOverlay({ v }: { v: AppVals }) {
  return (
    <div className="nb" style={sx('position:absolute;inset:0;z-index:150;background:var(--bg);display:flex;flex-direction:column;overflow:hidden;animation:slideL .3s ease-out')}>
      <div style={sx('flex:none;display:flex;align-items:center;gap:12px;padding:12px 18px;background:var(--surface);border-bottom:1px solid var(--line)')}>
        <button onClick={v.closeEvent} style={sx('flex:none;width:2.4em;height:2.4em;border-radius:var(--r-btn);border:1px solid var(--line);background:var(--surface);display:flex;align-items:center;justify-content:center;color:var(--ink)')}><svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg></button>
        <div>
          <h2 style={sx('margin:0;font-size:1.05em;font-weight:var(--wt);color:var(--ink)')}>행사 추천 주차장</h2>
          <p style={sx('margin:2px 0 0;font-size:.74em;font-weight:var(--ws);color:var(--ink-2)')}>흥타령춤축제 기간 무료 개방</p>
        </div>
      </div>
      <div className="nb" style={sx('flex:1;min-height:0;overflow-y:auto;padding:14px 18px 24px;display:flex;flex-direction:column;gap:12px')}>
        {v.eventFacs.map((f, i) => (
          <div key={i} style={sx('background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:16px;box-shadow:var(--shadow)')}>
            <div style={sx('display:flex;align-items:flex-start;justify-content:space-between;gap:10px')}>
              <div style={sx('min-width:0')}>
                <h4 style={sx('margin:0;font-size:1em;font-weight:var(--wt);color:var(--ink)')}>{f.name}</h4>
                {/* ⚠️ 원본 버그 재현: f.empty가 undefined라 "여유 면"으로 표시됨 */}
                <p style={sx('margin:4px 0 0;font-size:.78em;font-weight:var(--wb);color:var(--ink-2)')}>여유 {f.empty}면 · {f.distText}</p>
              </div>
              <span style={sx('flex:none;padding:.3em .6em;border-radius:99px;background:var(--ok-soft);color:var(--ok);font-size:.68em;font-weight:var(--wt)')}>기간 무료</span>
            </div>
            <div style={sx('display:flex;gap:8px;margin-top:13px')}>
              <button onClick={f.onDetail} style={sx('flex:1;background:var(--surface);color:var(--ink);border:1px solid var(--line-strong);border-radius:var(--r-btn);padding:.72em 0;font-size:.84em;font-weight:var(--ws)')}>층별 보기</button>
              <button onClick={f.onNav} style={sx('flex:1;background:var(--accent);color:#fff;border:none;border-radius:var(--r-btn);padding:.72em 0;font-size:.84em;font-weight:var(--ws);display:flex;align-items:center;justify-content:center;gap:.35em')}>
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-7-7 18-2.5-8.5z" /></svg>길 안내
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
