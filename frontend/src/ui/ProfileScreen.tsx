/** 내 정보 탭 — 원본 isProfile 블록 1:1 */
import { sx } from '../lib/css';
import type { AppVals } from '../logic/useApp';

export function ProfileScreen({ v }: { v: AppVals }) {
  return (
    <div className="nb" style={sx('flex:1;min-height:0;overflow-y:auto;background:var(--bg);animation:fadeIn .25s ease-out')}>
      <div style={sx('padding:16px 20px 8px')}>
        <h2 style={sx('margin:0;font-size:1.25em;font-weight:var(--wt);color:var(--ink)')}>내 정보</h2>
        <p style={sx('margin:5px 0 0;font-size:.82em;font-weight:var(--wb);color:var(--ink-2)')}>차량, 결제수단, 접근성 설정</p>
      </div>
      <div style={sx('padding:12px 20px 28px;display:flex;flex-direction:column;gap:14px')}>
        <div style={sx('background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:18px;box-shadow:var(--shadow)')}>
          <div style={sx('display:flex;align-items:center;gap:12px')}>
            <div style={sx('flex:none;width:3em;height:3em;border-radius:var(--r-btn);background:var(--accent-soft);color:var(--accent);display:flex;align-items:center;justify-content:center')}>
              <svg width="1.4em" height="1.4em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13" /><path d="M5 13h14v4H5z" /></svg>
            </div>
            <div style={sx('flex:1;min-width:0')}>
              <p style={sx('margin:0;font-size:.72em;font-weight:var(--ws);color:var(--ink-3)')}>등록 차량</p>
              <p style={sx('margin:3px 0 0;font-size:1.2em;font-weight:var(--wt);color:var(--ink)')}>{v.plate}</p>
            </div>
            <button onClick={v.editPlate} style={sx('flex:none;background:var(--bg);border:1px solid var(--line-strong);color:var(--ink-2);border-radius:var(--r-btn);padding:.6em .9em;font-size:.78em;font-weight:var(--ws)')}>수정</button>
          </div>
          <div style={sx('display:flex;gap:10px;margin-top:16px')}>
            <div style={sx('flex:1;display:flex;align-items:center;gap:9px;background:var(--ok-soft);border-radius:var(--r-btn);padding:12px')}>
              <div style={sx('flex:none;width:2em;height:2em;border-radius:9px;background:var(--surface);color:var(--ok);display:flex;align-items:center;justify-content:center')}>
                <svg width="1.05em" height="1.05em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-7 9 7" /><path d="M5 10v9h14v-9" /></svg>
              </div>
              <div style={sx('min-width:0')}>
                <p style={sx('margin:0;font-size:.7em;font-weight:var(--ws);color:var(--ok)')}>이용자 유형</p>
                <p style={sx('margin:3px 0 0;font-size:.88em;font-weight:var(--wt);color:var(--ink)')}>{v.userType}</p>
              </div>
            </div>
            <div style={sx('flex:1;display:flex;align-items:center;gap:9px;background:var(--accent-soft);border-radius:var(--r-btn);padding:12px')}>
              <div style={sx('flex:none;width:2em;height:2em;border-radius:9px;background:var(--surface);color:var(--accent);display:flex;align-items:center;justify-content:center')}>
                <svg width="1.05em" height="1.05em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></svg>
              </div>
              <div style={sx('min-width:0')}>
                <p style={sx('margin:0;font-size:.7em;font-weight:var(--ws);color:var(--accent)')}>결제수단</p>
                <p style={sx('margin:3px 0 0;font-size:.88em;font-weight:var(--wt);color:var(--ink)')}>천안사랑카드</p>
              </div>
            </div>
          </div>
        </div>
        <div style={sx('background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:18px;box-shadow:var(--shadow)')}>
          <div style={sx('display:flex;align-items:center;gap:9px;margin-bottom:12px')}>
            <svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"><path d="M4 7V5h16v2" /><path d="M9 20h6" /><path d="M12 5v15" /></svg>
            <span style={sx('font-size:.88em;font-weight:var(--wt);color:var(--ink)')}>글자 크기</span>
          </div>
          <div style={sx('display:grid;grid-template-columns:repeat(3,1fr);gap:8px')}>
            {v.fontSizes.map((fz, i) => <button key={i} onClick={fz.onPick} style={sx(fz.style)}>{fz.label}</button>)}
          </div>
        </div>
        <div style={sx('background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:18px;box-shadow:var(--shadow)')}>
          <div style={sx('display:flex;align-items:center;justify-content:space-between;margin-bottom:12px')}>
            <h3 style={sx('margin:0;font-size:.9em;font-weight:var(--wt);color:var(--ink)')}>최근 이용내역</h3>
            <button onClick={v.goHistory} style={sx('background:none;border:none;color:var(--accent);font-size:.78em;font-weight:var(--ws);padding:0')}>전체 보기 ›</button>
          </div>
          <div style={sx('display:flex;flex-direction:column;gap:8px')}>
            {v.recentPays.map((p, i) => (
              <div key={i} style={sx('display:flex;align-items:center;gap:11px;background:var(--bg);border-radius:var(--r-btn);padding:12px')}>
                <div style={sx('flex:none;width:2.3em;height:2.3em;border-radius:9px;background:var(--surface);color:var(--accent);display:flex;align-items:center;justify-content:center;border:1px solid var(--line)')}>
                  <svg width="1.15em" height="1.15em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
                </div>
                <div style={sx('flex:1;min-width:0')}>
                  <p style={sx('margin:0;font-size:.84em;font-weight:var(--wt);color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{p.location}</p>
                  <p style={sx('margin:3px 0 0;font-size:.72em;font-weight:var(--wb);color:var(--ink-2)')}>{p.date}</p>
                </div>
                <span style={sx('flex:none;font-size:.88em;font-weight:var(--wt);color:var(--ink)')}>{p.amountText}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
