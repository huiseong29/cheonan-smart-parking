/** 층별 상세 오버레이 (z-100, slideL) — 원본 isDetail 블록 1:1 */
import { sx } from '../lib/css';
import type { AppVals } from '../logic/useApp';

export function DetailOverlay({ v }: { v: AppVals }) {
  return (
    <div className="nb" style={sx('position:absolute;inset:0;z-index:100;background:var(--bg);display:flex;flex-direction:column;overflow:hidden;animation:slideL .3s ease-out')}>
      <div style={sx('flex:none;display:flex;align-items:center;gap:12px;padding:12px 18px;background:var(--surface);border-bottom:1px solid var(--line)')}>
        <button onClick={v.goHome} style={sx('flex:none;width:2.4em;height:2.4em;border-radius:var(--r-btn);border:1px solid var(--line);background:var(--surface);display:flex;align-items:center;justify-content:center;color:var(--ink)')}><svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
        <div style={sx('min-width:0')}>
          <h2 style={sx('margin:0;font-size:1.05em;font-weight:var(--wt);color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{v.selFacObj.name}</h2>
          <p style={sx('margin:2px 0 0;font-size:.76em;font-weight:var(--ws);color:var(--ink-2)')}>{v.activeFloor} 주차면 현황</p>
        </div>
      </div>
      <div className="nb" style={sx('flex:1;min-height:0;overflow-y:auto;padding:14px 18px 24px')}>
        <div className="nb" style={sx('display:flex;gap:7px;overflow-x:auto')}>
          {v.floors.map((fl, i) => (
            <button key={i} onClick={fl.onPick} style={sx(fl.style)}>
              <span style={sx('display:block;font-size:.9em;font-weight:var(--wt)')}>{fl.f}</span>
              <span style={sx('display:block;font-size:.72em;font-weight:var(--wb);margin-top:1px;opacity:.8')}>{fl.emptyText}</span>
            </button>
          ))}
        </div>
        <div style={sx('display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:14px;background:var(--accent-soft);border-radius:var(--r-card);padding:12px 14px')}>
          <div style={sx('min-width:0')}>
            <p style={sx('margin:0;font-size:.82em;font-weight:var(--wt);color:var(--accent)')}>가장 가까운 자리</p>
            <p style={sx('margin:3px 0 0;font-size:.74em;font-weight:var(--wb);color:var(--ink-2)')}>{v.vehTypeLabel} 차량 · 이용 가능한 면에서만 추천</p>
          </div>
          <button onClick={v.recommend} style={sx('flex:none;background:var(--accent);color:#fff;border:none;border-radius:var(--r-btn);padding:.62em 1em;font-size:.8em;font-weight:var(--ws)')}>자리 찾기</button>
        </div>
        {v.floorFull && (
          <div style={sx('display:flex;align-items:center;gap:11px;margin-top:12px;background:#FCEEEE;border-radius:var(--r-card);padding:12px 14px')}>
            <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.2" strokeLinecap="round" style={sx('flex:none')}><circle cx="12" cy="12" r="9"></circle><path d="M12 8v5"></path><path d="M12 16.5v.01"></path></svg>
            <div style={sx('flex:1;min-width:0')}>
              <p style={sx('margin:0;font-size:.8em;font-weight:var(--ws);color:var(--danger)')}>이 층은 지금 만차예요</p>
              <p style={sx('margin:2px 0 0;font-size:.68em;font-weight:var(--wb);color:var(--danger);opacity:.75')}>잔여면은 이동 중에도 변동될 수 있어요</p>
            </div>
            {v.hasAltFloor && <button onClick={v.goAltFloor} style={sx('flex:none;background:var(--surface);border:1px solid var(--line-strong);border-radius:var(--r-btn);padding:.55em .9em;font-size:.76em;font-weight:var(--ws);color:var(--ink)')}>{v.altFloor} 보기</button>}
            {v.noAltFloor && <button onClick={v.goHome} style={sx('flex:none;background:var(--surface);border:1px solid var(--line-strong);border-radius:var(--r-btn);padding:.55em .9em;font-size:.76em;font-weight:var(--ws);color:var(--ink)')}>다른 주차장</button>}
          </div>
        )}
        <div style={sx('display:flex;align-items:center;justify-content:space-between;gap:10px;margin:14px 2px 0')}>
          <span style={sx('font-size:.72em;font-weight:var(--ws);color:var(--ink-3)')}>잔여면 실시간 집계</span>
          <button onClick={v.doRefresh} style={sx('display:flex;align-items:center;gap:.4em;background:none;border:none;color:var(--ink-3);font-size:.72em;font-weight:var(--ws);padding:.3em .2em')}>
            <svg width="1.05em" height="1.05em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={sx(v.refreshSpin)}><path d="M21 12a9 9 0 1 1-2.64-6.36"></path><path d="M21 3v6h-6"></path></svg>
            <span style={sx(v.syncTextStyle)}>{v.syncText}</span>
          </button>
        </div>
        <div className="nb" style={sx('display:flex;gap:14px;overflow-x:auto;margin:6px 0 12px;padding:2px')}>
          {v.legend.map((lg, i) => (
            <div key={i} style={sx('display:flex;align-items:center;gap:5px;flex:none')}>
              <span style={sx(`width:.6em;height:.6em;border-radius:99px;background:${lg.color}`)} />
              <span style={sx('font-size:.75em;font-weight:var(--ws);color:var(--ink-2);white-space:nowrap')}>{lg.label}</span>
            </div>
          ))}
        </div>
        <div style={sx('background:#6B7683;border-radius:var(--r-card);padding:10px;box-shadow:var(--shadow)')}>
          <div style={sx('display:flex;align-items:stretch;gap:6px;margin-bottom:8px')}>
            <div style={sx('flex:1;background:rgba(255,255,255,.14);color:#DFF5EA;border-radius:8px;padding:.55em;text-align:center;font-size:.72em;font-weight:var(--wt)')}>진입 ↓</div>
            <div style={sx('flex:1.4;background:rgba(255,255,255,.9);color:var(--ink);border-radius:8px;padding:.55em;text-align:center;font-size:.72em;font-weight:var(--ws)')}>엘리베이터 · 계단</div>
            <div style={sx('flex:1;background:rgba(255,255,255,.14);color:#D9E6FB;border-radius:8px;padding:.55em;text-align:center;font-size:.72em;font-weight:var(--wt)')}>출차 ↑</div>
          </div>
          {v.floorLoading && (
            <div style={sx('display:flex;flex-direction:column;gap:8px;padding:4px 2px 6px')}>
              {v.skelRows.map((k) => <div key={k} style={sx('height:2.6em;border-radius:6px;background:linear-gradient(90deg,rgba(255,255,255,.10) 25%,rgba(255,255,255,.22) 50%,rgba(255,255,255,.10) 75%);background-size:200% 100%;animation:shimmer 1.2s linear infinite')} />)}
              <div style={sx('display:flex;align-items:center;justify-content:center;gap:8px;padding:8px 0 4px')}>
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="2.6" strokeLinecap="round" style={sx('animation:spin .8s linear infinite')}><path d="M21 12a9 9 0 1 1-6.2-8.56"></path></svg>
                <span style={sx('font-size:.76em;font-weight:var(--ws);color:rgba(255,255,255,.85)')}>{v.activeFloor} 주차면 현황을 불러오는 중…</span>
              </div>
            </div>
          )}
          {v.floorReady && (<>
            {v.rows.map((r, ri) => (
              r.isAisle ? (
                <div key={ri} style={sx('display:flex;align-items:center;gap:10px;height:2em;padding:0 6px')}>
                  <span style={sx('flex:1;border-top:2px dashed rgba(255,255,255,.55)')} />
                  <span style={sx('font-size:.72em;font-weight:var(--wt);color:rgba(255,255,255,.85);letter-spacing:.2em')}>{r.arrow}</span>
                  <span style={sx('flex:1;border-top:2px dashed rgba(255,255,255,.55)')} />
                </div>
              ) : (
                <div key={ri} style={sx('display:grid;grid-template-columns:1.5em repeat(6,1fr)')}>
                  <div style={sx('display:flex;align-items:center;justify-content:center;background:#4A545F;color:#fff;border-radius:3px;margin:6px 4px 6px 0')}><span style={sx('font-size:.72em;font-weight:var(--wt)')}>{r.block}</span></div>
                  {r.bays!.map((b) => (
                    <button key={b.id} onClick={b.onPick} className={b.hoverable ? 'hv-bay' : 'hv-bay-none'} style={sx(b.style)}>
                      <span style={sx('font-size:.62em;font-weight:var(--wt);opacity:.9;letter-spacing:.02em')}>{b.num}</span>
                      {b.occupied && (
                        <svg width="1.7em" height="2.6em" viewBox="0 0 24 40" fill="none"><rect x="4" y="3" width="16" height="34" rx="6.5" fill="currentColor" opacity=".9" /><rect x="6.5" y="10" width="11" height="7" rx="2.5" fill="rgba(255,255,255,.4)" /><rect x="6.5" y="26" width="11" height="6" rx="2.5" fill="rgba(255,255,255,.25)" /></svg>
                      )}
                      {b.showLabel && <span style={sx('font-size:.6em;font-weight:var(--wt);line-height:1.1')}>{b.short}</span>}
                      {b.plainOpen && <span style={sx('font-size:.58em;font-weight:var(--wt);color:#fff;background:var(--ok);padding:.2em .6em;border-radius:99px;white-space:nowrap')}>빈자리</span>}
                    </button>
                  ))}
                </div>
              )
            ))}
            <div style={sx('display:flex;align-items:center;gap:10px;height:2em;padding:0 6px')}>
              <span style={sx('flex:1;border-top:2px dashed rgba(255,255,255,.55)')} />
              <span style={sx('font-size:.68em;font-weight:var(--ws);color:rgba(255,255,255,.8)')}>출차 게이트 방면</span>
              <span style={sx('flex:1;border-top:2px dashed rgba(255,255,255,.55)')} />
            </div>
          </>)}
        </div>
        <p style={sx('margin:14px 4px 0;text-align:center;font-size:.78em;font-weight:var(--wb);color:var(--ink-3)')}>차가 없는 빈 면을 눌러 내 차 위치를 저장하세요</p>
      </div>
    </div>
  );
}
