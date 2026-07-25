/** 여행지원 QR 스캔 오버레이 (z-150) — 원본 qrOpen 블록 1:1 (스캔라인 + 21×21 QR) */
import { sx } from '../lib/css';
import type { AppVals } from '../logic/useApp';

export function QROverlay({ v }: { v: AppVals }) {
  return (
    <div className="nb" style={sx('position:absolute;inset:0;z-index:150;background:#0E1116;display:flex;flex-direction:column;align-items:center;justify-content:safe center;padding:30px;animation:fadeIn .25s;overflow-x:hidden;overflow-y:auto')}>
      <button onClick={v.closeQR} style={sx('position:absolute;top:16px;right:16px;width:2.4em;height:2.4em;border-radius:var(--r-btn);background:rgba(255,255,255,.14);border:none;color:#fff;display:flex;align-items:center;justify-content:center')}><svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
      <p style={sx('margin:0 0 6px;color:#fff;font-size:1em;font-weight:var(--wt)')}>여행지원 QR 스캔</p>
      <p style={sx('margin:0 0 24px;color:rgba(255,255,255,.6);font-size:.78em;font-weight:var(--wb);text-align:center;line-height:1.5')}>관광지·행사장의 QR 코드를<br />사각형 안에 맞춰 주세요</p>
      <div style={sx('position:relative;width:60%;aspect-ratio:1;border-radius:22px;background:rgba(255,255,255,.05)')}>
        <span style={sx('position:absolute;top:0;left:0;width:1.4em;height:1.4em;border-top:3px solid #fff;border-left:3px solid #fff;border-top-left-radius:12px')} />
        <span style={sx('position:absolute;top:0;right:0;width:1.4em;height:1.4em;border-top:3px solid #fff;border-right:3px solid #fff;border-top-right-radius:12px')} />
        <span style={sx('position:absolute;bottom:0;left:0;width:1.4em;height:1.4em;border-bottom:3px solid #fff;border-left:3px solid #fff;border-bottom-left-radius:12px')} />
        <span style={sx('position:absolute;bottom:0;right:0;width:1.4em;height:1.4em;border-bottom:3px solid #fff;border-right:3px solid #fff;border-bottom-right-radius:12px')} />
        <div style={sx('position:absolute;left:8%;right:8%;height:2px;background:var(--accent);box-shadow:0 0 14px 2px var(--accent);animation:scanline 2.2s ease-in-out infinite')} />
      </div>
      <div style={sx('margin-top:26px;background:#fff;border-radius:14px;padding:9px;width:36%;aspect-ratio:1;display:flex;flex-direction:column')}>
        {v.qrRows.map((r, y) => (
          <div key={y} style={sx('flex:1;display:flex')}>
            {r.cells.map((c, x) => <span key={x} style={sx(c.style)} />)}
          </div>
        ))}
      </div>
      <p style={sx('margin:8px 0 0;color:rgba(255,255,255,.55);font-size:.7em;font-weight:var(--wb)')}>내 주차 QR · {v.plate}</p>
      <button onClick={v.scanDone} style={sx('margin-top:22px;background:var(--accent);color:#fff;border:none;border-radius:var(--r-btn);padding:.9em 2.2em;font-size:.9em;font-weight:var(--wt)')}>스캔 완료</button>
    </div>
  );
}
