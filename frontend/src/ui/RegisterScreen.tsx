/** 내 차 탭 — 원본 isRegister 블록 1:1 (세션 카드 · 번호판 · 차량 유형 · 토글 · 글자 크기) */
import { sx } from '../lib/css';
import type { AppVals } from '../logic/useApp';

export function RegisterScreen({ v }: { v: AppVals }) {
  return (
    <div className="nb" style={sx('flex:1;min-height:0;overflow-y:auto;background:var(--bg);animation:fadeIn .25s ease-out')}>
      <div style={sx('padding:16px 20px 8px')}>
        <h2 style={sx('margin:0;font-size:1.25em;font-weight:var(--wt);color:var(--ink)')}>내 차</h2>
        <p style={sx('margin:5px 0 0;font-size:.82em;font-weight:var(--wb);color:var(--ink-2)')}>주차 현황과 차량 설정</p>
      </div>
      <div style={sx('padding:12px 20px 28px;display:flex;flex-direction:column;gap:14px')}>
        {v.hasSession && (<>
          <div style={sx('background:var(--ink);color:#fff;border-radius:var(--r-card);padding:22px;position:relative;overflow:hidden')}>
            <div style={sx('display:flex;align-items:flex-start;justify-content:space-between;gap:10px')}>
              <div style={sx('min-width:0')}>
                <p style={sx('margin:0;font-size:.75em;font-weight:var(--ws);color:#9fc0ff')}>현재 주차 중</p>
                <h3 style={sx('margin:5px 0 0;font-size:1.2em;font-weight:var(--wt)')}>{v.selFacObj.name}</h3>
              </div>
              <div style={sx('flex:none;width:2.6em;height:2.6em;border-radius:var(--r-btn);background:rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center')}>
                <svg width="1.3em" height="1.3em" viewBox="0 0 24 24" fill="none" stroke="#9fc0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13" /><path d="M5 13h14v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" /><circle cx="7.5" cy="15.5" r=".6" fill="#9fc0ff" /><circle cx="16.5" cy="15.5" r=".6" fill="#9fc0ff" /></svg>
              </div>
            </div>
            <div style={sx('display:flex;gap:22px;margin-top:20px')}>
              <div><p style={sx('margin:0;font-size:.72em;font-weight:var(--ws);opacity:.55')}>주차 위치</p><p style={sx('margin:5px 0 0;font-size:1.15em;font-weight:var(--wt)')}>{v.sessFloor} <span style={sx('color:#9fc0ff')}>{v.sessSlot}</span></p></div>
              <div><p style={sx('margin:0;font-size:.72em;font-weight:var(--ws);opacity:.55')}>주차 시간</p><p style={sx('margin:5px 0 0;font-size:1.15em;font-weight:var(--wt)')}>{v.parkHM}</p></div>
            </div>
            <div style={sx('height:1px;background:rgba(255,255,255,.12);margin:18px 0')} />
            <div style={sx('display:flex;align-items:flex-end;justify-content:space-between')}>
              <div><p style={sx('margin:0;font-size:.72em;font-weight:var(--ws);opacity:.55')}>결제 예정 금액</p><p style={sx('margin:5px 0 0;font-size:1.8em;font-weight:var(--wt)')}>{v.curFeeText}</p></div>
              <button onClick={v.goPayConfirm} style={sx('background:var(--accent);color:#fff;border:none;border-radius:var(--r-btn);padding:.8em 1.3em;font-size:.9em;font-weight:var(--wt)')}>결제하기</button>
            </div>
          </div>
          <div style={sx('background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:16px;box-shadow:var(--shadow);display:flex;align-items:center;gap:12px')}>
            <div style={sx('flex:none;width:2.6em;height:2.6em;border-radius:var(--r-btn);background:var(--accent-soft);color:var(--accent);display:flex;align-items:center;justify-content:center')}>
              <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v4l2.5 1.5" /></svg>
            </div>
            <div>
              <p style={sx('margin:0;font-size:.86em;font-weight:var(--wt);color:var(--ink)')}>결제 후 30분 출차 유예</p>
              <p style={sx('margin:3px 0 0;font-size:.75em;font-weight:var(--wb);color:var(--ink-2)')}>결제 완료 후 30분 내 출차 시 추가 요금 없음</p>
            </div>
          </div>
        </>)}
        {v.noSession && (
          <div style={sx('background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:22px;box-shadow:var(--shadow)')}>
            <div style={sx('background:var(--bg);border-radius:var(--r-btn);padding:22px;text-align:center')}>
              <p style={sx('margin:0;font-size:.74em;font-weight:var(--ws);color:var(--ink-3)')}>등록 차량번호</p>
              <p style={sx('margin:8px 0 0;font-size:1.8em;font-weight:var(--wt);color:var(--ink);letter-spacing:.02em')}>{v.plate}</p>
            </div>
            <p style={sx('margin:16px 0 0;text-align:center;font-size:.82em;font-weight:var(--wb);color:var(--ink-2)')}>현재 주차 중인 내역이 없습니다</p>
            <button onClick={v.goHome} style={sx('width:100%;margin-top:16px;background:var(--ink);color:var(--surface);border:none;border-radius:var(--r-btn);padding:.9em 0;font-size:.9em;font-weight:var(--wt)')}>주차장 찾기</button>
          </div>
        )}
        <div style={sx('background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:16px;box-shadow:var(--shadow);display:flex;align-items:center;justify-content:space-between;gap:10px')}>
          <div>
            <p style={sx('margin:0;font-size:.74em;font-weight:var(--ws);color:var(--ink-3)')}>등록 차량번호</p>
            <p style={sx('margin:4px 0 0;font-size:1.05em;font-weight:var(--wt);color:var(--ink)')}>{v.plate}</p>
          </div>
          <button onClick={v.openPlateEdit} style={sx('flex:none;background:var(--bg);border:1px solid var(--line);color:var(--ink);border-radius:var(--r-btn);padding:.6em 1.1em;font-size:.8em;font-weight:var(--ws)')}>변경</button>
        </div>
        <div style={sx('background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:18px;box-shadow:var(--shadow)')}>
          <div style={sx('display:flex;align-items:center;gap:9px;margin-bottom:12px')}>
            <svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13" /><path d="M5 13h14v4H5z" /></svg>
            <span style={sx('font-size:.88em;font-weight:var(--wt);color:var(--ink)')}>차량 유형</span>
          </div>
          <p style={sx('margin:0 0 7px;font-size:.7em;font-weight:var(--ws);color:var(--ink-3)')}>차량 종류</p>
          <div className="nb" style={sx('display:flex;gap:7px;overflow-x:auto;padding-bottom:2px')}>
            {v.vehChips.map((c, i) => (
              <button key={i} onClick={c.onPick} style={sx(c.style)}>
                <span style={sx(`width:.55em;height:.55em;border-radius:99px;background:${c.dotBg};border:${c.dotBorder};flex:none`)} />{c.label}
              </button>
            ))}
          </div>
          <p style={sx('margin:13px 0 7px;font-size:.7em;font-weight:var(--ws);color:var(--ink-3)')}>추가 조건 · 해당하는 것 모두 선택</p>
          <div className="nb" style={sx('display:flex;gap:7px;overflow-x:auto;padding-bottom:2px')}>
            {v.condChips.map((c, i) => (
              <button key={i} onClick={c.onPick} style={sx(c.style)}>
                {c.on && <svg width=".85em" height=".85em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={sx('flex:none')}><path d="M20 6L9 17l-5-5"></path></svg>}
                {c.off && <span style={sx(`width:.55em;height:.55em;border-radius:99px;background:${c.dotColor};flex:none`)} />}
                {c.label}
                {c.cert && <svg width=".95em" height=".95em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={sx('flex:none;opacity:.85')}><path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z"></path><path d="M9 12l2 2 4-4"></path></svg>}
              </button>
            ))}
          </div>
          <p style={sx('margin:10px 0 0;font-size:.72em;font-weight:var(--wb);color:var(--ink-3)')}>{v.vehSummary}</p>
        </div>
        <div style={sx('background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:18px;box-shadow:var(--shadow);display:flex;flex-direction:column;gap:16px')}>
          <div style={sx('display:flex;align-items:center;justify-content:space-between;gap:12px')}>
            <div style={sx('display:flex;align-items:center;gap:11px;min-width:0')}>
              <div style={sx('flex:none;width:2.4em;height:2.4em;border-radius:var(--r-btn);background:var(--accent-soft);color:var(--accent);display:flex;align-items:center;justify-content:center')}>
                <svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 3L4 14h6l-1 7 9-11h-6z" /></svg>
              </div>
              <div style={sx('min-width:0')}>
                <p style={sx('margin:0;font-size:.85em;font-weight:var(--wt);color:var(--ink)')}>{v.tHipass.title}</p>
                <p style={sx('margin:2px 0 0;font-size:.72em;font-weight:var(--wb);color:var(--ink-2)')}>{v.tHipass.desc}</p>
              </div>
            </div>
            <button onClick={v.tHipass.onToggle} style={sx(`flex:none;width:3.1em;height:1.7em;border-radius:99px;border:none;padding:0;position:relative;background:${v.tHipass.bg};transition:background .18s`)}>
              <span style={sx(`position:absolute;top:.18em;${v.tHipass.dot};width:1.34em;height:1.34em;border-radius:99px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2);transition:all .18s`)} />
            </button>
          </div>
          <div style={sx('display:flex;align-items:center;justify-content:space-between;gap:12px')}>
            <div style={sx('display:flex;align-items:center;gap:11px;min-width:0')}>
              <div style={sx('flex:none;width:2.4em;height:2.4em;border-radius:var(--r-btn);background:var(--ok-soft);color:var(--ok);display:flex;align-items:center;justify-content:center')}>
                <svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 5L5 19" /><circle cx="7.5" cy="7.5" r="2.2" /><circle cx="16.5" cy="16.5" r="2.2" /></svg>
              </div>
              <div style={sx('min-width:0')}>
                <p style={sx('margin:0;font-size:.85em;font-weight:var(--wt);color:var(--ink)')}>{v.tDiscount.title}</p>
                <p style={sx('margin:2px 0 0;font-size:.72em;font-weight:var(--wb);color:var(--ink-2)')}>{v.tDiscount.desc}</p>
              </div>
            </div>
            <button onClick={v.tDiscount.onToggle} style={sx(`flex:none;width:3.1em;height:1.7em;border-radius:99px;border:none;padding:0;position:relative;background:${v.tDiscount.bg};transition:background .18s`)}>
              <span style={sx(`position:absolute;top:.18em;${v.tDiscount.dot};width:1.34em;height:1.34em;border-radius:99px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2);transition:all .18s`)} />
            </button>
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
      </div>
    </div>
  );
}
