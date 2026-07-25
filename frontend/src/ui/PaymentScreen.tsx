/** 결제 탭 — 원본 isPayment 블록 1:1 (요금 명세 · 하이패스 토글 · 빈 상태) */
import { sx } from '../lib/css';
import type { AppVals } from '../logic/useApp';

export function PaymentScreen({ v }: { v: AppVals }) {
  return (
    <div className="nb" style={sx('flex:1;min-height:0;overflow-y:auto;background:var(--bg);animation:fadeIn .25s ease-out')}>
      <div style={sx('padding:16px 20px 8px')}>
        <h2 style={sx('margin:0;font-size:1.25em;font-weight:var(--wt);color:var(--ink)')}>결제</h2>
        <p style={sx('margin:5px 0 0;font-size:.82em;font-weight:var(--wb);color:var(--ink-2)')}>현재 요금과 할인을 확인하세요</p>
      </div>
      {v.hasSession && (
        <div style={sx('padding:12px 20px 28px;display:flex;flex-direction:column;gap:14px')}>
          <div style={sx('background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:18px;box-shadow:var(--shadow)')}>
            <div style={sx('display:flex;align-items:center;justify-content:space-between;gap:10px')}>
              <div style={sx('min-width:0')}>
                <p style={sx('margin:0;font-size:.78em;font-weight:var(--ws);color:var(--accent)')}>현재 주차 중</p>
                <h3 style={sx('margin:4px 0 0;font-size:1.06em;font-weight:var(--wt);color:var(--ink)')}>{v.selFacObj.name}</h3>
                <p style={sx('margin:4px 0 0;font-size:.78em;font-weight:var(--wb);color:var(--ink-2)')}>{v.sessFloor} {v.sessSlot} · {v.plate}</p>
              </div>
              <div style={sx('flex:none;width:2.8em;height:2.8em;border-radius:var(--r-btn);background:var(--accent-soft);color:var(--accent);display:flex;align-items:center;justify-content:center')}>
                <svg width="1.3em" height="1.3em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></svg>
              </div>
            </div>
            <div style={sx('display:flex;gap:10px;margin-top:16px')}>
              <div style={sx('flex:1;background:var(--bg);border-radius:var(--r-btn);padding:12px')}><p style={sx('margin:0;font-size:.72em;font-weight:var(--ws);color:var(--ink-3)')}>주차 시간</p><p style={sx('margin:4px 0 0;font-size:1.02em;font-weight:var(--wt);color:var(--ink)')}>{v.parkHM}</p></div>
              <div style={sx('flex:1;background:var(--bg);border-radius:var(--r-btn);padding:12px')}><p style={sx('margin:0;font-size:.72em;font-weight:var(--ws);color:var(--ink-3)')}>기본 요금</p><p style={sx('margin:4px 0 0;font-size:1.02em;font-weight:var(--wt);color:var(--ink)')}>{v.baseFeeText}</p></div>
            </div>
            <div style={sx('height:1px;background:var(--line);margin:16px 0')} />
            <div style={sx('display:flex;flex-direction:column;gap:9px')}>
              <div style={sx('display:flex;justify-content:space-between;font-size:.85em')}><span style={sx('font-weight:var(--wb);color:var(--ink-2)')}>기본 요금</span><span style={sx('font-weight:var(--ws);color:var(--ink)')}>{v.baseFeeText}</span></div>
              <div style={sx('display:flex;justify-content:space-between;font-size:.85em')}><span style={sx('font-weight:var(--wb);color:var(--ok)')}>적용 할인</span><span style={sx('font-weight:var(--ws);color:var(--ok)')}>-{v.discountText}</span></div>
              {v.hasBenefit && (
                <div style={sx('display:flex;justify-content:space-between;font-size:.82em;background:var(--ok-soft);color:var(--ok);border-radius:8px;padding:.5em .7em')}><span style={sx('font-weight:var(--ws)')}>{v.benefitLabel}</span><span style={sx('font-weight:var(--wt)')}>-{v.benefitText}</span></div>
              )}
            </div>
            <div style={sx('height:1px;background:var(--line);margin:14px 0')} />
            <div style={sx('display:flex;align-items:flex-end;justify-content:space-between')}>
              <span style={sx('font-size:.92em;font-weight:var(--wt);color:var(--ink)')}>결제 예정</span>
              <span style={sx('font-size:1.9em;font-weight:var(--wt);color:var(--accent);letter-spacing:-.02em')}>{v.curFeeText}</span>
            </div>
          </div>
          <div style={sx('background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:16px;box-shadow:var(--shadow);display:flex;align-items:center;justify-content:space-between;gap:12px')}>
            <div style={sx('display:flex;align-items:center;gap:11px;min-width:0')}>
              <div style={sx('flex:none;width:2.6em;height:2.6em;border-radius:var(--r-btn);background:var(--ok-soft);color:var(--ok);display:flex;align-items:center;justify-content:center')}>
                <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg>
              </div>
              <div style={sx('min-width:0')}>
                <p style={sx('margin:0;font-size:.88em;font-weight:var(--wt);color:var(--ink)')}>하이패스형 자동결제</p>
                <p style={sx('margin:3px 0 0;font-size:.74em;font-weight:var(--wb);color:var(--ink-2)')}>출차 시 정산기 없이 자동 결제</p>
              </div>
            </div>
            <button onClick={v.toggleHipass} style={sx(`flex:none;width:3.1em;height:1.7em;border-radius:99px;border:none;padding:0;position:relative;background:${v.hipassBg};transition:background .18s`)}>
              <span style={sx(`position:absolute;top:.18em;${v.hipassDot};width:1.34em;height:1.34em;border-radius:99px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2);transition:all .18s`)} />
            </button>
          </div>
          <div style={sx('display:flex;gap:10px')}>
            <button onClick={v.goBenefits} style={sx('flex:1;background:var(--surface);border:1px solid var(--accent);color:var(--accent);border-radius:var(--r-btn);padding:.95em 0;font-size:.88em;font-weight:var(--ws);display:flex;align-items:center;justify-content:center;gap:.4em')}>
              <svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M5 12v8h14v-8" /><path d="M12 8V4" /></svg>할인 입력
            </button>
            <button onClick={v.goPayConfirm} style={sx('flex:1;background:var(--ink);color:var(--surface);border:none;border-radius:var(--r-btn);padding:.95em 0;font-size:.88em;font-weight:var(--wt)')}>결제하기</button>
          </div>
        </div>
      )}
      {v.noSession && (
        <div style={sx('padding:12px 20px')}>
          <div style={sx('background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:28px 22px;box-shadow:var(--shadow);text-align:center')}>
            <div style={sx('width:3.4em;height:3.4em;margin:0 auto;border-radius:var(--r-btn);background:var(--bg);color:var(--ink-3);display:flex;align-items:center;justify-content:center')}>
              <svg width="1.6em" height="1.6em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></svg>
            </div>
            <h3 style={sx('margin:16px 0 0;font-size:1.02em;font-weight:var(--wt);color:var(--ink)')}>결제할 주차 내역이 없습니다</h3>
            <p style={sx('margin:8px 0 0;font-size:.8em;font-weight:var(--wb);color:var(--ink-2)')}>주차 위치를 저장하면 요금과 할인을 확인할 수 있어요</p>
            <button onClick={v.goHome} style={sx('width:100%;margin-top:18px;background:var(--ink);color:var(--surface);border:none;border-radius:var(--r-btn);padding:.9em 0;font-size:.9em;font-weight:var(--wt)')}>주차장 찾기</button>
          </div>
        </div>
      )}
    </div>
  );
}
