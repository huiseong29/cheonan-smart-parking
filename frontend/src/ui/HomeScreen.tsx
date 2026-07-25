/** 지도 홈 — 원본 isHome 블록 1:1 (지도 SVG · 검색/필터 · 마커 · 바텀시트 · 길안내 · 주차중 배너) */
import { sx } from '../lib/css';
import type { AppVals } from '../logic/useApp';

/** 바텀시트 스켈레톤 shimmer 공통 배경 */
const sh = 'background:linear-gradient(90deg,var(--bg) 25%,#EDF1F5 50%,var(--bg) 75%);background-size:200% 100%;animation:shimmer 1.3s linear infinite';

export function HomeScreen({ v }: { v: AppVals }) {
  return (
    <div style={sx('position:relative;flex:1;min-height:0')}>
      {/* 지도 배경 SVG */}
      <div style={sx('position:absolute;inset:0;background:var(--bg);overflow:hidden')}>
        <svg width="100%" height="100%" viewBox="0 0 396 700" preserveAspectRatio="xMidYMid slice" style={sx('display:block')}>
          <rect width="396" height="700" fill="var(--bg)" />
          <g stroke="var(--line)" strokeWidth="10" opacity="0.55" fill="none"><path d="M-20 210 H420" /><path d="M-20 470 H420" /><path d="M120 -20 V720" /><path d="M280 -20 V720" /></g>
          <g fill="var(--line)" opacity="0.28"><rect x="18" y="24" width="82" height="150" rx="6" /><rect x="150" y="30" width="100" height="140" rx="6" /><rect x="300" y="24" width="80" height="150" rx="6" /><rect x="18" y="250" width="82" height="180" rx="6" /><rect x="300" y="250" width="80" height="180" rx="6" /><rect x="150" y="500" width="100" height="150" rx="6" /></g>
          <path d="M-20 360 C90 320 150 420 210 380 C280 335 330 420 420 380" stroke="var(--accent)" strokeWidth="7" fill="none" opacity="0.16" />
          {v.navOn && (<>
            <path d={v.navPath} stroke="#fff" strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d={v.navPath} stroke="var(--accent)" strokeWidth="5.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 12" style={sx('animation:navdash 1.2s linear infinite')} />
            <circle cx={v.navSx} cy={v.navSy} r="9" fill="var(--accent)" stroke="#fff" strokeWidth="3.5" />
          </>)}
        </svg>
      </div>

      {/* 검색 + QR + 글자크기 + 필터 칩 */}
      <div style={sx('position:absolute;top:8px;left:16px;right:16px;z-index:20;display:flex;flex-direction:column;gap:9px')}>
        <div style={sx('display:flex;align-items:stretch;gap:8px')}>
          <div style={sx('flex:1;min-width:0;display:flex;align-items:center;gap:9px;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:11px 13px;box-shadow:var(--shadow)')}>
            <svg width="1.15em" height="1.15em" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            <span style={sx('flex:1;font-size:.9em;font-weight:var(--wb);color:var(--ink-3)')}>어디로 갈까요?</span>
            <button onClick={v.openQR} style={sx('display:flex;align-items:center;gap:.3em;background:var(--accent-soft);border:none;border-radius:9px;padding:.4em .6em;color:var(--accent);font-size:.72em;font-weight:var(--wt)')}><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><path d="M14 14h6v6" /></svg>QR</button>
          </div>
          <button onClick={v.toggleFs} aria-label="글자 크기 설정" style={sx(`flex:none;width:2.6em;align-self:flex-start;height:2.6em;border-radius:99px;background:var(--surface);border:1px solid var(--line-strong);box-shadow:var(--shadow);color:${v.fsBtnColor};display:flex;align-items:center;justify-content:center`)}><span style={sx('font-size:.86em;font-weight:var(--wt)')}>가</span><span style={sx('font-size:.56em;font-weight:var(--wt);margin-left:1px')}>＋</span></button>
        </div>
        <div className="nb" style={sx('display:flex;gap:7px;overflow-x:auto;padding-bottom:2px')}>
          {v.filters.map((f, i) => <button key={i} onClick={f.onPick} style={sx(f.style)}>{f.label}</button>)}
        </div>
      </div>

      {/* 지도 로딩 스피너 */}
      {v.mapLoading && (
        <div style={sx('position:absolute;left:50%;top:38%;transform:translate(-50%,-50%);z-index:6;display:flex;align-items:center;gap:9px;background:var(--surface);border:1px solid var(--line);border-radius:99px;padding:.65em 1.1em;box-shadow:0 6px 18px rgba(16,24,40,.12);animation:fadeIn .25s')}>
          <svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" style={sx('animation:spin .8s linear infinite')}><path d="M21 12a9 9 0 1 1-6.2-8.56"></path></svg>
          <span style={sx('font-size:.82em;font-weight:var(--ws);color:var(--ink-2)')}>주변 주차장을 찾는 중…</span>
        </div>
      )}

      {/* 마커 (pinDrop stagger, style-hover → hv-marker) */}
      {v.mapReady && v.markers.map((m, i) => (
        <button key={i} onClick={m.onPick} className="hv-marker" style={sx(`position:absolute;left:${m.x}%;top:${m.y}%;transform:translate(-50%,-100%);z-index:${m.z};border:none;background:none;padding:0;transition:transform .15s ease;animation:pinDrop .45s cubic-bezier(.34,1.4,.64,1) backwards;animation-delay:${m.delay}`)}>
          <div style={sx(m.pinStyle)}>{m.text}</div>
          <div style={sx(`width:.6em;height:.6em;background:${m.color};transform:rotate(45deg);margin:-.35em auto 0;border-radius:1px`)} />
        </button>
      ))}

      {/* 바텀시트 */}
      <div style={sx(v.sheetStyle)}>
        <div onClick={v.toggleSheet} style={sx('padding:9px 0 4px;display:flex;justify-content:center')}><div style={sx('width:38px;height:4px;border-radius:99px;background:var(--line-strong)')} /></div>
        {v.peekLoading && (
          <div style={sx('padding:4px 20px 20px;display:flex;align-items:center;gap:12px')}>
            <div style={sx('flex:1;display:flex;flex-direction:column;gap:9px')}><div style={sx(`width:62%;height:1.05em;border-radius:6px;${sh}`)} /><div style={sx(`width:84%;height:.8em;border-radius:6px;${sh}`)} /></div>
            <div style={sx(`flex:none;width:6.2em;height:2.6em;border-radius:var(--r-btn);${sh}`)} />
          </div>
        )}
        {v.sheetPeekShow && (
          <div style={sx('padding:4px 20px 20px;display:flex;align-items:center;gap:12px')}>
            <div style={sx('flex:1;min-width:0')}>
              <div style={sx('display:flex;align-items:center;gap:8px')}>
                <h3 style={sx('margin:0;font-size:1.06em;font-weight:var(--wt);color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{v.selFacObj.name}</h3>
                <span style={sx(v.selFacObj.statusChip)}><span style={sx(`width:.42em;height:.42em;border-radius:99px;background:${v.selFacObj.statusColor}`)} />{v.selFacObj.statusLabel}</span>
              </div>
              <p style={sx('margin:5px 0 0;font-size:.82em;font-weight:var(--wb);color:var(--ink-2)')}>여유 {v.selFacObj.empty}면 · 30분 {v.selFacObj.priceText} · {v.selFacObj.distText}</p>
            </div>
            <button onClick={v.openDetail} style={sx('flex:none;background:var(--accent);color:#fff;border:none;border-radius:var(--r-btn);padding:.7em 1.1em;font-size:.85em;font-weight:var(--ws)')}>층별 보기</button>
          </div>
        )}
        {v.sheetList && (
          <div className="nb" style={sx('padding:2px 18px 24px;overflow-y:auto;max-height:calc(100% - 30px)')}>
            <div style={sx('display:flex;align-items:center;justify-content:space-between;margin:6px 4px 12px')}>
              <p style={sx('margin:0;font-size:.8em;font-weight:var(--ws);color:var(--ink-3)')}>주변 주차장 {v.facCountText}</p>
              <button onClick={v.doRefresh} style={sx('display:flex;align-items:center;gap:.4em;background:none;border:none;color:var(--ink-3);font-size:.74em;font-weight:var(--ws);padding:.35em .2em')}>
                <svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={sx(v.refreshSpin)}><path d="M21 12a9 9 0 1 1-2.64-6.36"></path><path d="M21 3v6h-6"></path></svg>
                <span style={sx(v.syncTextStyle)}>{v.syncText}</span>
              </button>
            </div>
            {v.mapLoading && (
              <div style={sx('display:flex;flex-direction:column;gap:12px')}>
                {v.skels.map((k) => (
                  <div key={k} style={sx('background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:16px;box-shadow:var(--shadow)')}>
                    <div style={sx('display:flex;justify-content:space-between;gap:10px')}><div style={sx(`width:55%;height:1.05em;border-radius:6px;${sh}`)} /><div style={sx(`width:4.2em;height:1.4em;border-radius:99px;${sh}`)} /></div>
                    <div style={sx(`width:78%;height:.8em;border-radius:6px;margin-top:10px;${sh}`)} />
                    <div style={sx('display:flex;gap:8px;margin-top:14px')}><div style={sx(`flex:1;height:2.5em;border-radius:var(--r-btn);${sh}`)} /><div style={sx(`flex:1;height:2.5em;border-radius:var(--r-btn);${sh}`)} /></div>
                  </div>
                ))}
              </div>
            )}
            {v.facNone && (
              <div style={sx('padding:30px 20px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px')}>
                <div style={sx('width:3.2em;height:3.2em;border-radius:99px;background:var(--bg);border:1px solid var(--line);display:flex;align-items:center;justify-content:center')}><svg width="1.4em" height="1.4em" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg></div>
                <div><p style={sx('margin:0;font-size:.9em;font-weight:var(--wt);color:var(--ink)')}>조건에 맞는 주차장이 없어요</p><p style={sx('margin:5px 0 0;font-size:.78em;font-weight:var(--wb);color:var(--ink-2)')}>필터를 바꾸거나 초기화해 보세요</p></div>
                <button onClick={v.resetFilter} style={sx('background:var(--surface);border:1px solid var(--line-strong);border-radius:var(--r-btn);padding:.6em 1.3em;font-size:.82em;font-weight:var(--ws);color:var(--ink)')}>필터 초기화</button>
              </div>
            )}
            {v.mapReady && (
              <div style={sx('display:flex;flex-direction:column;gap:12px')}>
                {v.facilities.map((f, i) => (
                  <div key={i} className="hv-card" style={sx('background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:16px;box-shadow:var(--shadow);transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease')}>
                    <div style={sx('display:flex;align-items:flex-start;justify-content:space-between;gap:10px')}>
                      <div style={sx('min-width:0')}>
                        <h4 style={sx('margin:0;font-size:1.02em;font-weight:var(--wt);color:var(--ink)')}>{f.name}</h4>
                        <p style={sx('margin:4px 0 0;font-size:.8em;font-weight:var(--wb);color:var(--ink-2)')}>{f.typeLabel} · {f.floorsText} · 총 {f.total}면 · {f.distText}</p>
                      </div>
                      <span style={sx(f.statusChip)}><span style={sx(`width:.42em;height:.42em;border-radius:99px;background:${f.statusColor}`)} />{f.statusLabel}</span>
                    </div>
                    <div style={sx('display:flex;align-items:baseline;gap:10px;margin-top:12px')}>
                      <span style={sx('font-size:1.5em;font-weight:var(--wt);color:var(--ink)')}>{f.empty}<span style={sx('font-size:.5em;font-weight:var(--ws);color:var(--ink-2);margin-left:.15em')}>면 여유</span></span>
                      <span style={sx('font-size:.85em;font-weight:var(--wb);color:var(--ink-2);margin-left:auto')}>30분 {f.priceText}</span>
                    </div>
                    <p style={sx('margin:9px 0 0;font-size:.76em;font-weight:var(--wb);color:var(--ink-3)')}>특수면 · {f.specialText}</p>
                    <div style={sx('display:flex;gap:8px;margin-top:13px')}>
                      <button onClick={f.onSelect} style={sx('flex:1;background:var(--surface);color:var(--ink);border:1px solid var(--line-strong);border-radius:var(--r-btn);padding:.72em 0;font-size:.85em;font-weight:var(--ws)')}>지도에서 보기</button>
                      <button onClick={f.onDetail} style={sx('flex:1;background:var(--accent);color:#fff;border:none;border-radius:var(--r-btn);padding:.72em 0;font-size:.85em;font-weight:var(--ws)')}>층별 보기</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 길 안내 패널 */}
      {v.navOn && (
        <div style={sx('position:absolute;left:16px;right:16px;bottom:110px;z-index:40;background:var(--ink);color:#fff;border-radius:var(--r-card);padding:14px 16px;box-shadow:0 10px 30px rgba(16,24,40,.35);animation:riseIn .3s ease-out')}>
          <div style={sx('display:flex;align-items:center;gap:12px')}>
            <div style={sx('flex:none;width:2.6em;height:2.6em;border-radius:var(--r-btn);background:var(--accent);display:flex;align-items:center;justify-content:center')}><svg width="1.3em" height="1.3em" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-7-7 18-2.5-8.5z" /></svg></div>
            <div style={sx('flex:1;min-width:0')}>
              <p style={sx('margin:0;font-size:.72em;font-weight:var(--ws);color:#9fc0ff')}>길 안내 중</p>
              <p style={sx('margin:3px 0 0;font-size:.95em;font-weight:var(--wt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{v.navFacName}</p>
            </div>
            <button onClick={v.navEnd} style={sx('flex:none;background:rgba(255,255,255,.14);color:#fff;border:none;border-radius:var(--r-btn);padding:.6em .9em;font-size:.78em;font-weight:var(--ws)')}>종료</button>
          </div>
          <div style={sx('display:flex;gap:10px;margin-top:12px')}>
            <div style={sx('flex:1;background:rgba(255,255,255,.08);border-radius:var(--r-btn);padding:9px 12px')}><p style={sx('margin:0;font-size:.66em;font-weight:var(--ws);opacity:.6')}>남은 거리</p><p style={sx('margin:3px 0 0;font-size:1em;font-weight:var(--wt)')}>{v.navDist}</p></div>
            <div style={sx('flex:1;background:rgba(255,255,255,.08);border-radius:var(--r-btn);padding:9px 12px')}><p style={sx('margin:0;font-size:.66em;font-weight:var(--ws);opacity:.6')}>도착 예정</p><p style={sx('margin:3px 0 0;font-size:1em;font-weight:var(--wt)')}>{v.navEta}</p></div>
            <button onClick={v.navArrive} style={sx('flex:1;background:var(--accent);color:#fff;border:none;border-radius:var(--r-btn);font-size:.82em;font-weight:var(--wt)')}>도착 · 층별</button>
          </div>
        </div>
      )}

      {/* 주차 중 배너 */}
      {v.sessionOnMap && (
        <button onClick={v.goPayConfirm} style={sx('position:absolute;top:118px;left:16px;right:16px;z-index:40;background:var(--accent);color:#fff;border:none;border-radius:14px;padding:.8em 1em;display:flex;align-items:center;justify-content:space-between;box-shadow:0 8px 20px rgba(37,99,235,.3);animation:riseIn .3s ease-out')}>
          <span style={sx('display:flex;align-items:center;gap:.5em;font-size:.85em;font-weight:var(--ws)')}><svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>주차 중 {v.parkMin}분 · {v.curFeeText}</span>
          <span style={sx('font-size:.8em;font-weight:var(--wt);background:rgba(255,255,255,.2);padding:.35em .7em;border-radius:8px')}>결제 ›</span>
        </button>
      )}
    </div>
  );
}
