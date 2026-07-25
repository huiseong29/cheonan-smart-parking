/** 주차 위치 저장 완료 화면 (z-110) — 원본 isSuccess 블록 1:1 */
import { sx } from '../lib/css';
import type { AppVals } from '../logic/useApp';

export function SuccessScreen({ v }: { v: AppVals }) {
  return (
    <div style={sx('position:absolute;inset:0;z-index:110;background:var(--surface);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 30px;text-align:center;animation:fadeIn .3s;overflow:hidden')}>
      <div style={sx('position:absolute;top:-110px;left:50%;transform:translateX(-50%);width:340px;height:340px;border-radius:99em;background:var(--accent-soft);opacity:.55;pointer-events:none')} />
      <div style={sx('position:relative;width:7.6em;height:7.6em;display:flex;align-items:center;justify-content:center')}>
        <div style={sx('position:absolute;inset:0;border-radius:99em;background:var(--accent-soft);opacity:.5')} />
        <div style={sx('position:absolute;inset:1.1em;border-radius:99em;background:var(--accent-soft)')} />
        <div style={sx('position:relative;width:4.5em;height:4.5em;border-radius:26px;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 24px rgba(37,99,235,.35);animation:pop .5s cubic-bezier(.34,1.56,.64,1)')}>
          <svg width="2.2em" height="2.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
        </div>
      </div>
      <p style={sx('margin:18px 0 0;font-size:.75em;font-weight:var(--ws);color:var(--accent)')}>주차 위치 저장 완료</p>
      <h2 style={sx('margin:8px 0 0;font-size:1.6em;font-weight:var(--wt);color:var(--ink);line-height:1.2')}>{v.sessFloor} {v.sessSlot}<br />주차 중</h2>
      <p style={sx('margin:14px 0 0;font-size:.84em;font-weight:var(--wb);color:var(--ink-2);line-height:1.5')}>기록된 위치는 '내 차' 탭에서<br />언제든 확인할 수 있어요</p>
      <button onClick={v.goRegister} style={sx('width:100%;margin-top:32px;background:var(--ink);color:var(--surface);border:none;border-radius:var(--r-card);padding:1.1em 0;font-size:.95em;font-weight:var(--wt)')}>내 차 위치 보기</button>
    </div>
  );
}
