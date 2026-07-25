/** 전역 글자 크기 플로팅 버튼 + 패널 (z-320) — 원본 fsShow 블록 1:1 */
import { sx } from '../lib/css';
import type { AppVals } from '../logic/useApp';

export function FontSizeFloat({ v }: { v: AppVals }) {
  return (
    <div style={sx('position:absolute;top:44px;right:14px;z-index:320;display:flex;flex-direction:column;align-items:flex-end;gap:8px')}>
      {v.fsFloatBtn && (
        <button onClick={v.toggleFs} aria-label="글자 크기 설정" style={sx(`display:flex;align-items:center;justify-content:center;width:2.6em;height:2.6em;border-radius:99px;background:var(--surface);border:1px solid var(--line-strong);box-shadow:var(--shadow);color:${v.fsBtnColor}`)}>
          <span style={sx('font-size:.86em;font-weight:var(--wt)')}>가</span><span style={sx('font-size:.56em;font-weight:var(--wt);margin-left:1px')}>＋</span>
        </button>
      )}
      {v.fsOpen && (
        <div style={sx(`background:var(--surface);border:1px solid var(--line);border-radius:14px;box-shadow:var(--sheet-shadow);padding:10px;width:9.6em;animation:riseIn .2s ease-out;margin-top:${v.fsPanelGap}`)}>
          <p style={sx('margin:0 0 8px;font-size:.64em;font-weight:var(--wt);color:var(--ink-3);text-align:center')}>글자 크기</p>
          <div style={sx('display:flex;flex-direction:column;gap:6px')}>
            {v.fsOptions.map((o, i) => <button key={i} onClick={o.onPick} style={sx(o.style)}>{o.label}</button>)}
          </div>
        </div>
      )}
    </div>
  );
}
