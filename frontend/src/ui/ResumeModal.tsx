/** 재실행 복구 모달 (z-150/151, checking → found) — 원본 resumeOpen 블록 1:1 */
import { sx } from '../lib/css';
import type { AppVals } from '../logic/useApp';

export function ResumeModal({ v }: { v: AppVals }) {
  return (
    <>
      <div style={sx('position:absolute;inset:0;z-index:150;background:rgba(15,23,42,.45);animation:fadeIn .2s')} />
      <div style={sx('position:absolute;left:18px;right:18px;top:50%;transform:translateY(-50%);z-index:151;background:var(--surface);border-radius:var(--r-card);padding:24px 22px;box-shadow:0 18px 44px rgba(15,23,42,.28);animation:riseIn .28s ease-out;text-align:center')}>
        {v.resumeChecking && (<>
          <div style={sx('width:2.6em;height:2.6em;margin:0 auto;border-radius:99px;border:3px solid var(--line);border-top-color:var(--accent);animation:spin .8s linear infinite')} />
          <h3 style={sx('margin:14px 0 0;font-size:.98em;font-weight:var(--wt);color:var(--ink)')}>지난 결제 결과를 확인하고 있어요</h3>
          <p style={sx('margin:6px 0 0;font-size:.76em;font-weight:var(--wb);color:var(--ink-2)')}>앱이 종료되기 전 진행 중이던 결제가 있어요</p>
        </>)}
        {v.resumeFound && (<>
          <div style={sx('width:2.9em;height:2.9em;margin:0 auto;border-radius:99px;background:var(--ok-soft);display:flex;align-items:center;justify-content:center')}>
            <svg width="1.4em" height="1.4em" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>
          </div>
          <h3 style={sx('margin:14px 0 0;font-size:.98em;font-weight:var(--wt);color:var(--ink)')}>결제가 정상 완료되어 있었어요</h3>
          <p style={sx('margin:6px 0 0;font-size:.76em;font-weight:var(--wb);color:var(--ink-2)')}>중복 결제되지 않았으니 안심하세요</p>
          <div style={sx('margin:14px 0 0;background:var(--bg);border-radius:12px;padding:12px 14px;display:flex;justify-content:space-between;font-size:.8em')}>
            <span style={sx('font-weight:var(--wb);color:var(--ink-2)')}>천안역 서부광장 · 2시간 5분</span>
            <span style={sx('font-weight:var(--wt);color:var(--ink)')}>5,600원</span>
          </div>
          <button onClick={v.resumeDone} style={sx('width:100%;margin-top:14px;background:var(--ink);color:var(--surface);border:none;border-radius:var(--r-btn);padding:.95em 0;font-size:.88em;font-weight:var(--wt)')}>영수증 확인</button>
          <button onClick={v.resumeLater} style={sx('width:100%;margin-top:8px;background:var(--surface);border:1px solid var(--line);color:var(--ink-2);border-radius:var(--r-btn);padding:.85em 0;font-size:.82em;font-weight:var(--ws)')}>나중에 확인하기 · 이용내역에 남겨둘게요</button>
        </>)}
      </div>
    </>
  );
}
