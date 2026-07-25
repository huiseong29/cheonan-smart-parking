/** 차량번호 변경 바텀시트 (z-150/151) — 원본 plateEditOpen 블록 1:1 */
import { sx } from '../lib/css';
import type { AppVals } from '../logic/useApp';

export function PlateEditSheet({ v }: { v: AppVals }) {
  return (
    <>
      <div onClick={v.closePlateEdit} style={sx('position:absolute;inset:0;z-index:150;background:rgba(15,23,42,.45);animation:fadeIn .2s')} />
      <div className="nb" style={sx('position:absolute;left:0;right:0;bottom:0;z-index:151;max-height:100%;overflow-y:auto;background:var(--surface);border-radius:26px 26px 0 0;padding:22px 22px 26px;box-shadow:var(--sheet-shadow);animation:riseIn .28s ease-out')}>
        <h3 style={sx('margin:0;font-size:1.05em;font-weight:var(--wt);color:var(--ink)')}>차량번호 변경</h3>
        <p style={sx('margin:6px 0 0;font-size:.78em;font-weight:var(--wb);color:var(--ink-2)')}>번호가 틀리면 주차 조회와 자동 결제가 되지 않아요</p>
        <div style={sx('margin-top:16px')}>
          <input
            value={v.plateDraft}
            onChange={v.onPlateInput}
            onCompositionStart={v.onPlateCompStart}
            onCompositionEnd={v.onPlateCompEnd}
            placeholder="12가 3456"
            style={sx(v.plateInputStyle)}
          />
        </div>
        {v.hasSession && (
          <div style={sx('margin-top:12px;background:rgba(208,131,68,.12);border-radius:var(--r-btn);padding:11px 14px;display:flex;align-items:flex-start;gap:8px')}>
            <span style={sx('flex:none;width:.55em;height:.55em;border-radius:99px;background:var(--warn);margin-top:.35em')} />
            <p style={sx('margin:0;font-size:.75em;font-weight:var(--wb);color:var(--ink);line-height:1.55')}>지금 진행 중인 주차 건은 <strong style={sx('font-weight:var(--wt)')}>이전 번호 기준</strong>으로 정산돼요. 문제가 생기면 출구 무인정산기에서 현장 결제할 수 있어요.</p>
          </div>
        )}
        <div style={sx('display:flex;gap:10px;margin-top:16px')}>
          <button onClick={v.closePlateEdit} style={sx('flex:1;background:var(--surface);border:1px solid var(--line);color:var(--ink-2);border-radius:var(--r-btn);padding:.95em 0;font-size:.9em;font-weight:var(--ws)')}>취소</button>
          <button onClick={v.savePlate} style={sx(v.plateSaveStyle)}>저장</button>
        </div>
      </div>
    </>
  );
}
