/** 혜택 탭 — 원본 isBenefits 블록 1:1 (시민/방문객 혜택 · 적용됨 배너 · 천안 소식) */
import { sx } from '../lib/css';
import type { AppVals } from '../logic/useApp';

export function BenefitsScreen({ v }: { v: AppVals }) {
  return (
    <div className="nb" style={sx('flex:1;min-height:0;overflow-y:auto;background:var(--bg);animation:fadeIn .25s ease-out')}>
      <div style={sx('padding:16px 20px 8px')}>
        <h2 style={sx('margin:0;font-size:1.25em;font-weight:var(--wt);color:var(--ink)')}>천안 혜택</h2>
        <p style={sx('margin:5px 0 0;font-size:.82em;font-weight:var(--wb);color:var(--ink-2)')}>시민과 방문객 모두를 위한 감면</p>
      </div>
      <div style={sx('padding:12px 20px 28px;display:flex;flex-direction:column;gap:14px')}>
        <div style={sx('background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:18px;box-shadow:var(--shadow)')}>
          <div style={sx('display:flex;align-items:center;gap:9px')}>
            <div style={sx('width:2.2em;height:2.2em;border-radius:var(--r-btn);background:var(--ok-soft);color:var(--ok);display:flex;align-items:center;justify-content:center')}><svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg></div>
            <span style={sx('font-size:.75em;font-weight:var(--ws);color:var(--ok)')}>천안 시민 혜택</span>
          </div>
          <h3 style={sx('margin:12px 0 0;font-size:1.06em;font-weight:var(--wt);color:var(--ink)')}>천안사랑카드 연동</h3>
          <p style={sx('margin:6px 0 0;font-size:.82em;font-weight:var(--wb);color:var(--ink-2);line-height:1.55')}>천안사랑카드 사용 시 공영주차장 10% 추가 할인이 자동 적용됩니다.</p>
          <button onClick={v.openCardLink} style={sx('width:100%;margin-top:14px;background:var(--ok);color:#fff;border:none;border-radius:var(--r-btn);padding:.85em 0;font-size:.86em;font-weight:var(--wt)')}>{v.cardLinkedText}</button>
        </div>
        <div style={sx('background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:18px;box-shadow:var(--shadow)')}>
          <div style={sx('display:flex;align-items:center;gap:9px')}>
            <div style={sx('width:2.2em;height:2.2em;border-radius:var(--r-btn);background:var(--accent-soft);color:var(--accent);display:flex;align-items:center;justify-content:center')}><svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><path d="M14 14h6v6" /></svg></div>
            <span style={sx('font-size:.75em;font-weight:var(--ws);color:var(--accent)')}>방문객 혜택</span>
          </div>
          <h3 style={sx('margin:12px 0 0;font-size:1.06em;font-weight:var(--wt);color:var(--ink)')}>여행지원 QR 할인</h3>
          <p style={sx('margin:6px 0 0;font-size:.82em;font-weight:var(--wb);color:var(--ink-2);line-height:1.55')}>관광지 방문 QR을 스캔하면 주차 요금 1,000원을 즉시 할인해 드립니다.</p>
          <button onClick={v.openQR} style={sx('width:100%;margin-top:14px;background:var(--accent);color:#fff;border:none;border-radius:var(--r-btn);padding:.85em 0;font-size:.86em;font-weight:var(--wt);display:flex;align-items:center;justify-content:center;gap:.4em')}>
            <svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><path d="M14 14h6v6" /></svg>QR 스캔하고 할인받기
          </button>
        </div>
        {v.hasBenefit && (
          <div style={sx('background:var(--ok-soft);border:1px solid transparent;border-radius:var(--r-card);padding:14px;display:flex;align-items:center;gap:11px')}>
            <div style={sx('flex:none;width:2.2em;height:2.2em;border-radius:var(--r-btn);background:var(--surface);color:var(--ok);display:flex;align-items:center;justify-content:center')}><svg width="1.05em" height="1.05em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg></div>
            <div>
              <p style={sx('margin:0;font-size:.85em;font-weight:var(--wt);color:var(--ink)')}>{v.benefitLabel} 적용됨</p>
              <p style={sx('margin:2px 0 0;font-size:.76em;font-weight:var(--ws);color:var(--ok)')}>{v.benefitText} 할인</p>
            </div>
          </div>
        )}
        <div style={sx('padding-top:8px')}>
          <h3 style={sx('margin:0 0 12px 2px;font-size:1.05em;font-weight:var(--wt);color:var(--ink)')}>천안 소식</h3>
          <div style={sx('display:flex;flex-direction:column;gap:10px')}>
            {v.news.map((n, i) => (
              <button key={i} onClick={n.onOpen} className="hv-news" style={sx('text-align:left;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:14px;box-shadow:var(--shadow);display:flex;align-items:center;gap:12px')}>
                <span style={sx(`flex:none;padding:.35em .55em;border-radius:8px;background:${n.tagBg};color:${n.tagColor};font-size:.66em;font-weight:var(--wt)`)}>{n.tag}</span>
                <div style={sx('flex:1;min-width:0')}>
                  <p style={sx('margin:0;font-size:.86em;font-weight:var(--wt);color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{n.title}</p>
                  <p style={sx('margin:3px 0 0;font-size:.72em;font-weight:var(--wb);color:var(--ink-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{n.date} · {n.summary}</p>
                </div>
                <svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={sx('flex:none')}><path d="M9 6l6 6-6 6" /></svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
