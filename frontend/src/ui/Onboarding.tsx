/** 온보딩 오버레이 (z-120) — 이용자 유형 + 차량번호. 입력 중(kb)에는 하단 기능 소개를 숨긴다 */
import { sx } from '../lib/css';
import type { AppVals } from '../logic/useApp';

export function Onboarding({ v }: { v: AppVals }) {
  return (
    <div style={sx('position:absolute;inset:0;z-index:120;background:var(--surface);display:flex;flex-direction:column;padding:28px 24px;animation:fadeIn .3s;overflow:hidden')}>
      <div style={sx('position:absolute;top:-90px;right:-70px;width:260px;height:260px;border-radius:99em;background:var(--accent-soft);opacity:.7;pointer-events:none')} />
      <div style={sx('position:absolute;top:96px;right:-24px;width:120px;height:120px;border-radius:99em;border:1.5px dashed var(--line-strong);opacity:.6;pointer-events:none')} />
      <div style={sx('flex:1;display:flex;flex-direction:column;gap:24px;padding-top:14px;position:relative')}>
        <div style={sx('display:flex;align-items:center;gap:12px')}>
          {/* 서비스 마크 — 파비콘과 동일한 심볼 사용 (SVG 자체 라운드 22%에 맞춰 클리핑) */}
          <img src="/favicon/favicon.svg" alt="천안 스마트 주차" style={sx('width:3.4em;height:3.4em;border-radius:22%;box-shadow:0 8px 20px rgba(11,36,71,.3)')} />
        </div>
        <div>
          <h1 style={sx('margin:0;font-size:1.9em;font-weight:var(--wt);color:var(--ink);line-height:1.15')}>천안시<br /><span style={sx('color:var(--accent)')}>스마트 주차</span></h1>
          <p style={sx('margin:12px 0 0;font-size:.85em;font-weight:var(--wb);color:var(--ink-2)')}>두 단계로 시작하는 편리한 천안 주차</p>
        </div>
        <div style={sx('display:flex;flex-direction:column;gap:18px')}>
          <div>
            <p style={sx('margin:0 0 8px;font-size:.72em;font-weight:var(--wt);color:var(--ink-3)')}>1단계 · 이용자 유형</p>
            <div style={sx('display:flex;gap:10px')}>
              <button onClick={v.pickCitizen} style={sx(v.citizenStyle)}>
                <div style={sx('display:flex;align-items:center;justify-content:space-between')}>
                  <svg width="1.3em" height="1.3em" viewBox="0 0 24 24" fill="none" stroke={v.citizenIconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-7 9 7"></path><path d="M5 10v9h14v-9"></path><path d="M10 19v-5h4v5"></path></svg>
                  {v.isCitizenPick && (
                    <svg width="1.05em" height="1.05em" viewBox="0 0 24 24" fill="var(--ok)" stroke="none"><circle cx="12" cy="12" r="10"></circle><path d="M17 9l-6.2 6L7 11.4" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                  )}
                </div>
                <p style={sx('margin:9px 0 0;font-size:.92em;font-weight:var(--wt)')}>천안 시민</p>
                <p style={sx('margin:4px 0 0;font-size:.72em;font-weight:var(--wb);opacity:.7')}>지역화폐 자동 할인</p>
              </button>
              <button onClick={v.pickVisitor} style={sx(v.visitorStyle)}>
                <div style={sx('display:flex;align-items:center;justify-content:space-between')}>
                  <svg width="1.3em" height="1.3em" viewBox="0 0 24 24" fill="none" stroke={v.visitorIconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M15.5 8.5l-2.2 4.8-4.8 2.2 2.2-4.8z"></path></svg>
                  {v.isVisitorPick && (
                    <svg width="1.05em" height="1.05em" viewBox="0 0 24 24" fill="var(--accent)" stroke="none"><circle cx="12" cy="12" r="10"></circle><path d="M17 9l-6.2 6L7 11.4" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                  )}
                </div>
                <p style={sx('margin:9px 0 0;font-size:.92em;font-weight:var(--wt)')}>방문객</p>
                <p style={sx('margin:4px 0 0;font-size:.72em;font-weight:var(--wb);opacity:.7')}>여행지원 QR 할인</p>
              </button>
            </div>
          </div>
          <div>
            <p style={sx('margin:0 0 8px;font-size:.72em;font-weight:var(--wt);color:var(--ink-3)')}>2단계 · 차량번호</p>
            <input
              value={v.plateDraft}
              onChange={v.onPlateInput}
              onCompositionStart={v.onPlateCompStart}
              onCompositionEnd={v.onPlateCompEnd}
              onFocus={v.onPlateFocus}
              onBlur={v.onPlateBlur}
              placeholder="12가 3456"
              maxLength={10}
              inputMode="text"
              aria-label="차량번호 입력"
              style={sx(v.plateInputStyle)}
            />
            <div style={sx('display:flex;align-items:center;gap:.4em;margin-top:9px;min-height:1.4em')}>
              {v.plateValid && (<>
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                <span style={sx('font-size:.74em;font-weight:var(--ws);color:var(--ok)')}>확인되었습니다</span>
              </>)}
              {v.plateBad && (<>
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.4" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v5" /><path d="M12 16.5v.01" /></svg>
                <span style={sx('font-size:.74em;font-weight:var(--ws);color:var(--danger)')}>차량번호 형식이 아니에요 · 예: 12가 3456</span>
              </>)}
              {v.plateHint && (
                <span style={sx('font-size:.74em;font-weight:var(--wb);color:var(--ink-3)')}>숫자 2~3자리 · 한글 1자 · 숫자 4자리 순서로 입력됩니다</span>
              )}
            </div>
          </div>
        </div>
      </div>
      {v.kbClosed && (
        <div style={sx('display:flex;justify-content:space-between;gap:8px;padding:14px 4px;position:relative')}>
          <div style={sx('display:flex;flex-direction:column;align-items:center;gap:6px;flex:1')}>
            <svg width="1.25em" height="1.25em" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>
            <span style={sx('font-size:.66em;font-weight:var(--ws);color:var(--ink-2);text-align:center')}>실시간<br />빈자리 확인</span>
          </div>
          <div style={sx('width:1px;background:var(--line);flex:none')} />
          <div style={sx('display:flex;flex-direction:column;align-items:center;gap:6px;flex:1')}>
            <svg width="1.25em" height="1.25em" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L5 13h5l-1 9 8-11h-5z"></path></svg>
            <span style={sx('font-size:.66em;font-weight:var(--ws);color:var(--ink-2);text-align:center')}>하이패스형<br />자동결제</span>
          </div>
          <div style={sx('width:1px;background:var(--line);flex:none')} />
          <div style={sx('display:flex;flex-direction:column;align-items:center;gap:6px;flex:1')}>
            <svg width="1.25em" height="1.25em" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="2.2"></circle><circle cx="16" cy="16" r="2.2"></circle><path d="M18 6L6 18"></path></svg>
            <span style={sx('font-size:.66em;font-weight:var(--ws);color:var(--ink-2);text-align:center')}>지역화폐<br />자동 할인</span>
          </div>
        </div>
      )}
      <button onClick={v.finishOnboarding} disabled={v.plateInvalid} style={sx(v.startBtnStyle)}>시작하기</button>
    </div>
  );
}
