/** 이용 내역 화면 — 원본 isHistory 블록 1:1 (라이브 결제기록 상태 칩 + note 포함) */
import { sx } from '../lib/css';
import type { AppVals } from '../logic/useApp';

export function HistoryScreen({ v }: { v: AppVals }) {
  return (
    <div className="nb" style={sx('flex:1;min-height:0;overflow-y:auto;background:var(--bg);animation:fadeIn .25s ease-out')}>
      <div style={sx('display:flex;align-items:center;gap:12px;padding:12px 18px 12px;background:var(--surface);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:4')}>
        <button onClick={v.goProfile} style={sx('flex:none;width:2.4em;height:2.4em;border-radius:var(--r-btn);border:1px solid var(--line);background:var(--surface);display:flex;align-items:center;justify-content:center;color:var(--ink)')}><svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg></button>
        <h2 style={sx('margin:0;font-size:1.05em;font-weight:var(--wt);color:var(--ink)')}>이용 내역</h2>
      </div>
      <div style={sx('padding:14px 20px 28px;display:flex;flex-direction:column;gap:10px')}>
        <div style={sx('display:flex;align-items:center;gap:9px;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-btn);padding:10px 13px;box-shadow:var(--shadow)')}>
          <svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <span style={sx('font-size:.84em;font-weight:var(--wb);color:var(--ink-3)')}>장소 또는 날짜 검색</span>
        </div>
        {v.allPays.map((p, i) => (
          <div key={i} style={sx('background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:14px;box-shadow:var(--shadow);display:flex;flex-direction:column;gap:10px')}>
            <div style={sx('display:flex;align-items:center;justify-content:space-between;gap:10px')}>
              <div style={sx('display:flex;align-items:center;gap:11px;min-width:0')}>
                <div style={sx('position:relative;flex:none;width:3.1em;height:3.1em;border-radius:var(--r-btn);background:var(--accent-soft);display:flex;align-items:center;justify-content:center;color:var(--accent)')}>
                  <svg width="1.3em" height="1.3em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
                </div>
                <div style={sx('min-width:0')}>
                  <p style={sx('margin:0;font-size:.88em;font-weight:var(--wt);color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{p.location}</p>
                  <div style={sx('display:flex;align-items:center;gap:6px;margin-top:5px')}>
                    <span style={sx(p.methodChip)}>{p.method}</span>
                    <span style={sx('font-size:.7em;font-weight:var(--wb);color:var(--ink-2)')}>{p.date}</span>
                  </div>
                </div>
              </div>
              <div style={sx('flex:none;text-align:right')}>
                <p style={sx('margin:0;font-size:.95em;font-weight:var(--wt);color:var(--ink)')}>{p.amountText}</p>
                <p style={sx('margin:3px 0 0;font-size:.66em;font-weight:var(--ws);color:var(--ink-3)')}>{p.durationText}</p>
              </div>
            </div>
            {p.note ? (
              <div style={sx('display:flex;align-items:flex-start;gap:7px;background:var(--bg);border-radius:10px;padding:9px 11px')}>
                <span style={sx('flex:none;width:.55em;height:.55em;border-radius:99px;background:var(--warn);margin-top:.3em')} />
                <p style={sx('margin:0;font-size:.72em;font-weight:var(--wb);color:var(--ink-2);line-height:1.5')}>{p.note}</p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
