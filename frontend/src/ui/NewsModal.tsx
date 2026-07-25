/** 천안 소식 상세 모달 (z-135) — 원본 newsModal 블록 1:1 */
import { sx } from '../lib/css';
import type { AppVals } from '../logic/useApp';

export function NewsModal({ v }: { v: AppVals }) {
  return (
    <div onClick={v.closeNews} style={sx('position:absolute;inset:0;z-index:135;background:rgba(15,23,42,.4);display:flex;align-items:flex-end;padding:16px;animation:fadeIn .2s')}>
      <div className="nb" style={sx('width:100%;max-height:100%;overflow-y:auto;background:var(--surface);border-radius:var(--r-card);padding:20px;box-shadow:0 -10px 40px rgba(0,0,0,.2);animation:riseIn .25s ease-out')}>
        <div style={sx('display:flex;align-items:flex-start;justify-content:space-between;gap:12px')}>
          <div style={sx('min-width:0')}>
            <span style={sx(`display:inline-block;padding:.3em .55em;border-radius:8px;background:${v.curNewsTagBg};color:${v.curNewsTagColor};font-size:.66em;font-weight:var(--wt)`)}>{v.curNews.tag}</span>
            <h3 style={sx('margin:10px 0 0;font-size:1.12em;font-weight:var(--wt);color:var(--ink);line-height:1.3')}>{v.curNews.title}</h3>
            <p style={sx('margin:6px 0 0;font-size:.74em;font-weight:var(--wb);color:var(--ink-2)')}>{v.curNews.date}</p>
          </div>
          <button onClick={v.closeNews} style={sx('flex:none;width:2.2em;height:2.2em;border-radius:var(--r-btn);background:var(--bg);border:none;color:var(--ink-2);display:flex;align-items:center;justify-content:center')}><svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
        </div>
        <div style={sx('background:var(--bg);border-radius:var(--r-btn);padding:14px;margin-top:16px')}>
          <p style={sx('margin:0;font-size:.84em;font-weight:var(--wt);color:var(--ink)')}>{v.curNews.summary}</p>
          <p style={sx('margin:8px 0 0;font-size:.82em;font-weight:var(--wb);color:var(--ink-2);line-height:1.6')}>{v.curNews.detail}</p>
        </div>
        <div style={sx('background:var(--ok-soft);border-radius:var(--r-btn);padding:14px;margin-top:10px')}>
          <p style={sx('margin:0;font-size:.7em;font-weight:var(--ws);color:var(--ok)')}>연계 혜택</p>
          <p style={sx('margin:4px 0 0;font-size:.84em;font-weight:var(--wt);color:var(--ink)')}>{v.curNews.benefit}</p>
        </div>
        <button onClick={v.onNewsAction} style={sx('width:100%;margin-top:16px;background:var(--ink);color:var(--surface);border:none;border-radius:var(--r-btn);padding:.95em 0;font-size:.88em;font-weight:var(--wt)')}>{v.curNews.actionLabel}</button>
      </div>
    </div>
  );
}
