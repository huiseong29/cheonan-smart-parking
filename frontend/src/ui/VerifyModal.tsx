/** 자격 확인 모달 (전기차·장애인·임산부, z-135) — 원본 verifyOpen 블록 1:1 */
import { sx } from '../lib/css';
import type { AppVals } from '../logic/useApp';

export function VerifyModal({ v }: { v: AppVals }) {
  return (
    <div onClick={v.closeVerify} style={sx('position:absolute;inset:0;z-index:135;background:rgba(15,23,42,.4);display:flex;align-items:flex-end;padding:16px;animation:fadeIn .2s')}>
      <div onClick={v.stopProp} className="nb" style={sx('width:100%;max-height:100%;overflow-y:auto;background:var(--surface);border-radius:var(--r-card);padding:20px;box-shadow:0 -10px 40px rgba(0,0,0,.2);animation:riseIn .25s ease-out')}>
        <div style={sx('display:flex;align-items:flex-start;gap:12px')}>
          <div style={sx(`flex:none;width:3em;height:3em;border-radius:var(--r-btn);background:${v.vSoft};color:${v.vColor};display:flex;align-items:center;justify-content:center`)}>
            <svg width="1.4em" height="1.4em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z"></path><path d="M9 12l2 2 4-4"></path></svg>
          </div>
          <div style={sx('min-width:0')}>
            <p style={sx(`margin:0;font-size:.72em;font-weight:var(--ws);color:${v.vColor}`)}>자격 확인</p>
            <h3 style={sx('margin:4px 0 0;font-size:1.15em;font-weight:var(--wt);color:var(--ink)')}>{v.vTitle}</h3>
          </div>
        </div>
        <div style={sx('background:var(--bg);border-radius:var(--r-btn);padding:14px;margin-top:16px')}>
          <p style={sx('margin:0;font-size:.82em;font-weight:var(--wb);color:var(--ink-2);line-height:1.55')}>{v.vDesc}</p>
          <div style={sx('display:flex;align-items:center;gap:.5em;margin-top:10px;padding-top:10px;border-top:1px solid var(--line)')}>
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"></rect><path d="M9 12l2 2 4-4"></path></svg>
            <span style={sx('font-size:.74em;font-weight:var(--ws);color:var(--ink-2)')}>확인 방법 · {v.vSource}</span>
          </div>
        </div>
        <p style={sx('margin:12px 0 0;font-size:.7em;font-weight:var(--wb);color:var(--ink-3);line-height:1.5')}>확인을 위해 최소한의 정보만 조회하며, 조회 내용은 저장되지 않습니다.</p>
        {v.vLoading && (
          <div style={sx('display:flex;align-items:center;justify-content:center;gap:.6em;margin-top:16px;padding:.95em 0;background:var(--bg);border-radius:var(--r-btn)')}>
            <span style={sx(`width:1em;height:1em;border-radius:99px;border:2.5px solid var(--line-strong);border-top-color:${v.vColor};animation:spin .7s linear infinite;display:inline-block`)} />
            <span style={sx('font-size:.84em;font-weight:var(--ws);color:var(--ink-2)')}>확인 중입니다…</span>
          </div>
        )}
        {v.vIdle && (
          <div style={sx('display:flex;gap:10px;margin-top:16px')}>
            <button onClick={v.closeVerify} style={sx('flex:1;background:var(--bg);color:var(--ink-2);border:none;border-radius:var(--r-btn);padding:.85em 0;font-size:.86em;font-weight:var(--ws)')}>다음에 하기</button>
            <button onClick={v.runVerify} style={sx(`flex:1.4;background:${v.vColor};color:#fff;border:none;border-radius:var(--r-btn);padding:.85em 0;font-size:.86em;font-weight:var(--wt)`)}>동의하고 확인하기</button>
          </div>
        )}
      </div>
    </div>
  );
}
