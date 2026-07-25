/** 탭 전환 스켈레톤 — 원본 템플릿 1:1 (shimmer 1.3s) */
import { sx } from '../lib/css';

/** 원본 shimmer 바 공통 배경 선언 */
const sh = 'background:linear-gradient(90deg,#E8ECF1 25%,#F3F6F9 50%,#E8ECF1 75%);background-size:200% 100%;animation:shimmer 1.3s linear infinite';

export function TabSkeleton() {
  return (
    <div className="nb" style={sx('flex:1;min-height:0;overflow-y:auto;background:var(--bg)')}>
      <div style={sx('padding:16px 20px 8px;display:flex;flex-direction:column;gap:9px')}>
        <div style={sx(`width:5.5em;height:1.25em;border-radius:6px;${sh}`)} />
        <div style={sx(`width:64%;height:.82em;border-radius:6px;${sh}`)} />
      </div>
      <div style={sx('padding:12px 20px 28px;display:flex;flex-direction:column;gap:14px')}>
        <div style={sx('background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:18px;box-shadow:var(--shadow);display:flex;flex-direction:column;gap:11px')}>
          <div style={sx('display:flex;align-items:center;gap:11px')}>
            <div style={sx(`flex:none;width:2.5em;height:2.5em;border-radius:var(--r-btn);${sh}`)} />
            <div style={sx('flex:1;display:flex;flex-direction:column;gap:8px')}>
              <div style={sx(`width:52%;height:.95em;border-radius:6px;${sh}`)} />
              <div style={sx(`width:74%;height:.75em;border-radius:6px;${sh}`)} />
            </div>
          </div>
          <div style={sx(`width:100%;height:2.9em;border-radius:var(--r-btn);${sh}`)} />
        </div>
        <div style={sx('background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:18px;box-shadow:var(--shadow);display:flex;flex-direction:column;gap:10px')}>
          <div style={sx(`width:38%;height:.95em;border-radius:6px;${sh}`)} />
          <div style={sx(`width:88%;height:.78em;border-radius:6px;${sh}`)} />
          <div style={sx(`width:70%;height:.78em;border-radius:6px;${sh}`)} />
        </div>
        <div style={sx('background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:18px;box-shadow:var(--shadow);display:flex;flex-direction:column;gap:10px')}>
          <div style={sx(`width:46%;height:.95em;border-radius:6px;${sh}`)} />
          <div style={sx(`width:82%;height:.78em;border-radius:6px;${sh}`)} />
        </div>
      </div>
    </div>
  );
}
