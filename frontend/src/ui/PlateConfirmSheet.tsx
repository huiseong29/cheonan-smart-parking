/** "이 차량이 맞나요?" 확인 바텀시트 (z-130/131) — 원본 템플릿 1:1 */
import { sx } from '../lib/css';
import type { AppVals } from '../logic/useApp';

export function PlateConfirmSheet({ v }: { v: AppVals }) {
  return (
    <>
      <div style={sx('position:absolute;inset:0;z-index:130;background:rgba(15,23,42,.45);animation:fadeIn .2s')} />
      <div style={sx('position:absolute;left:0;right:0;bottom:0;z-index:131;background:var(--surface);border-radius:22px 22px 0 0;padding:24px 22px 26px;animation:riseIn .28s ease-out')}>
        <h3 style={sx('margin:0;font-size:1.05em;font-weight:var(--wt);color:var(--ink)')}>이 차량이 맞나요?</h3>
        <p style={sx('margin:6px 0 0;font-size:.78em;font-weight:var(--wb);color:var(--ink-2)')}>번호가 틀리면 주차 조회와 자동 결제가 되지 않아요</p>
        <div style={sx('margin:18px 0;background:var(--bg);border:1.5px solid var(--line-strong);border-radius:var(--r-card);padding:18px;text-align:center;font-size:1.5em;font-weight:var(--wt);color:var(--ink);letter-spacing:.04em;font-variant-numeric:tabular-nums')}>{v.plateConfirmText}</div>
        <div style={sx('display:flex;flex-direction:column;gap:10px')}>
          <button onClick={v.confirmPlate} style={sx('width:100%;background:var(--ink);color:var(--surface);border:none;border-radius:var(--r-btn);padding:1em 0;font-size:.92em;font-weight:var(--wt)')}>맞아요, 시작하기</button>
          <button onClick={v.cancelPlateConfirm} style={sx('width:100%;background:var(--bg);color:var(--ink-2);border:none;border-radius:var(--r-btn);padding:.9em 0;font-size:.86em;font-weight:var(--ws)')}>다시 입력할게요</button>
        </div>
        <p style={sx('margin:12px 0 0;text-align:center;font-size:.7em;font-weight:var(--wb);color:var(--ink-3)')}>나중에 내 차 탭에서 언제든 바꿀 수 있어요</p>
      </div>
    </>
  );
}
