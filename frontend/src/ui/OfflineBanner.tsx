/** 오프라인 배너 (z-300) — 원본 offline 블록 1:1 */
import { sx } from '../lib/css';

export function OfflineBanner() {
  return (
    <div style={sx('position:absolute;top:46px;left:14px;right:14px;z-index:300;background:var(--ink);color:#fff;border-radius:12px;padding:10px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 8px 20px rgba(0,0,0,.25);animation:riseIn .25s ease-out')}>
      <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={sx('flex:none')}><path d="M1 1l22 22"></path><path d="M5 12a11 11 0 0 1 5.2-2.8M2 8.5a15 15 0 0 1 4-2.6M8.5 15.5a6 6 0 0 1 7 0"></path><path d="M12 19.5v.01"></path></svg>
      <div style={sx('min-width:0')}>
        <p style={sx('margin:0;font-size:.8em;font-weight:var(--wt)')}>오프라인 상태예요</p>
        <p style={sx('margin:2px 0 0;font-size:.68em;font-weight:var(--wb);opacity:.75')}>연결되면 자동으로 최신 정보를 불러옵니다</p>
      </div>
    </div>
  );
}
