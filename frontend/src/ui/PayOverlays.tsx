/**
 * 결제 오버레이 5종 — 원본 payConfirm(z-140) · isPaying(z-144) · payFailed(z-143)
 * · payPending(z-143) · payComplete(z-145) 블록 1:1
 */
import { sx } from '../lib/css';
import type { AppVals } from '../logic/useApp';

/** 결제 확인 (요금 실시간 조회 loading/ok/fail + 25초 체류 시 금액 증가 경고) */
export function PayConfirmOverlay({ v }: { v: AppVals }) {
  return (
    <div className="nb" style={sx('position:absolute;inset:0;z-index:140;background:var(--surface);display:flex;flex-direction:column;padding:16px 22px 24px;overflow-y:auto;animation:riseIn .28s ease-out')}>
      <div style={sx('display:flex;align-items:center;justify-content:space-between;margin-bottom:20px')}>
        <button onClick={v.closePay} style={sx('width:2.4em;height:2.4em;border-radius:var(--r-btn);background:var(--bg);border:none;color:var(--ink);display:flex;align-items:center;justify-content:center')}><svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
        <h2 style={sx('margin:0;font-size:1.05em;font-weight:var(--wt);color:var(--ink)')}>결제 확인</h2>
        <span style={sx('width:2.4em')} />
      </div>
      <div style={sx('background:var(--bg);border-radius:var(--r-card);padding:18px')}>
        <div style={sx('display:flex;justify-content:space-between;font-size:.84em;margin-bottom:10px')}><span style={sx('font-weight:var(--wb);color:var(--ink-2)')}>주차장</span><span style={sx('font-weight:var(--wt);color:var(--ink)')}>{v.selFacObj.name}</span></div>
        <div style={sx('display:flex;justify-content:space-between;font-size:.84em')}><span style={sx('font-weight:var(--wb);color:var(--ink-2)')}>주차 시간</span><span style={sx('font-weight:var(--wt);color:var(--ink)')}>{v.parkHM}</span></div>
      </div>
      <div style={sx('padding:18px 4px;display:flex;flex-direction:column;gap:11px')}>
        <div style={sx('display:flex;justify-content:space-between;font-size:.86em')}><span style={sx('font-weight:var(--wb);color:var(--ink-2)')}>기본 요금</span><span style={sx('font-weight:var(--ws);color:var(--ink)')}>{v.baseFeeText}</span></div>
        <div style={sx('display:flex;justify-content:space-between;font-size:.86em')}><span style={sx('font-weight:var(--wb);color:var(--ok)')}>자동 할인</span><span style={sx('font-weight:var(--ws);color:var(--ok)')}>-{v.discountText}</span></div>
        {v.hasBenefit && (
          <div style={sx('display:flex;justify-content:space-between;font-size:.86em')}><span style={sx('font-weight:var(--wb);color:var(--ok)')}>{v.benefitLabel}</span><span style={sx('font-weight:var(--ws);color:var(--ok)')}>-{v.benefitText}</span></div>
        )}
        <div style={sx('height:1px;background:var(--line);margin:6px 0')} />
        <div style={sx('display:flex;align-items:flex-end;justify-content:space-between')}>
          <div>
            <span style={sx('font-size:.95em;font-weight:var(--wt);color:var(--ink)')}>최종 금액</span>
            {v.feeOk && <p style={sx('margin:4px 0 0;font-size:.68em;font-weight:var(--wb);color:var(--ink-3)')}>{v.feeSyncText} 실시간 조회</p>}
          </div>
          {v.feeOk && <span style={sx('font-size:1.7em;font-weight:var(--wt);color:var(--accent)')}>{v.curFeeText}</span>}
          {v.feeLoading && <span style={sx('display:inline-block;width:4.4em;height:1.5em;border-radius:8px;background:var(--line)')} />}
          {v.feeFail && <span style={sx('font-size:1.15em;font-weight:var(--wt);color:var(--ink-3)')}>—</span>}
        </div>
      </div>
      {v.feeBumped && (
        <div style={sx('margin-top:4px;background:rgba(208,131,68,.12);border-radius:var(--r-btn);padding:11px 14px;display:flex;align-items:flex-start;gap:8px')}>
          <span style={sx('flex:none;width:.55em;height:.55em;border-radius:99px;background:var(--warn);margin-top:.35em')} />
          <p style={sx('margin:0;font-size:.76em;font-weight:var(--wb);color:var(--ink);line-height:1.5')}>주차 시간이 늘어 요금이 <strong style={sx('font-weight:var(--wt)')}>{v.curFeeText}</strong>으로 갱신됐어요. 금액을 확인하고 결제해 주세요.</p>
        </div>
      )}
      {v.feeFail && (
        <div style={sx('margin-top:4px;background:var(--bg);border:1px solid var(--line);border-radius:var(--r-card);padding:16px')}>
          <p style={sx('margin:0;font-size:.9em;font-weight:var(--wt);color:var(--ink)')}>요금을 불러오지 못했어요</p>
          <p style={sx('margin:6px 0 0;font-size:.78em;font-weight:var(--wb);color:var(--ink-2);line-height:1.55')}>지하 주차장에서는 통신이 약할 수 있어요. 정확한 요금을 확인해야 앱에서 결제할 수 있습니다.</p>
          <button onClick={v.retryFee} style={sx('width:100%;margin-top:12px;background:var(--ink);color:var(--surface);border:none;border-radius:var(--r-btn);padding:.9em 0;font-size:.86em;font-weight:var(--wt)')}>다시 시도</button>
          <div style={sx('margin-top:12px;padding-top:12px;border-top:1px solid var(--line);display:flex;align-items:flex-start;gap:8px')}>
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={sx('flex:none;margin-top:.1em')}><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></svg>
            <p style={sx('margin:0;font-size:.76em;font-weight:var(--wb);color:var(--ink-2);line-height:1.5')}>앱 결제가 안 되어도 <strong style={sx('font-weight:var(--wt);color:var(--ink)')}>출구 무인정산기·현장 결제</strong>로 나갈 수 있어요.</p>
          </div>
        </div>
      )}
      {v.feeOk && <button onClick={v.doPay} style={sx('margin-top:auto;background:var(--ink);color:var(--surface);border:none;border-radius:var(--r-card);padding:1.1em 0;font-size:.98em;font-weight:var(--wt)')}>{v.curFeeText} 결제하기</button>}
      {v.feeNotOk && <div style={sx('margin-top:auto;background:var(--line-strong);color:#fff;border-radius:var(--r-card);padding:1.1em 0;font-size:.98em;font-weight:var(--wt);text-align:center;opacity:.65')}>결제하기</div>}
    </div>
  );
}

/** 결제 처리 중 스피너 모달 */
export function PayingModal({ v }: { v: AppVals }) {
  return (
    <div style={sx('position:absolute;inset:0;z-index:144;background:rgba(15,23,32,.45);display:flex;align-items:center;justify-content:center;animation:fadeIn .2s')}>
      <div style={sx('background:var(--surface);border-radius:var(--r-card);padding:26px 30px;display:flex;flex-direction:column;align-items:center;gap:14px;box-shadow:0 16px 40px rgba(16,24,40,.25);min-width:11em')}>
        <svg width="2em" height="2em" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" style={sx('animation:spin .8s linear infinite')}><path d="M21 12a9 9 0 1 1-6.2-8.56"></path></svg>
        <div style={sx('text-align:center')}>
          <p style={sx('margin:0;font-size:.92em;font-weight:var(--wt);color:var(--ink)')}>{v.payingTitle}</p>
          <p style={sx('margin:6px 0 0;font-size:.74em;font-weight:var(--wb);color:var(--ink-3)')}>{v.payingDesc}</p>
          <p style={sx('margin:10px 0 0;font-size:.7em;font-weight:var(--ws);color:var(--ink-3);background:var(--bg);border-radius:8px;padding:.55em .8em')}>결제 중에는 이전 화면으로 돌아갈 수 없어요</p>
        </div>
      </div>
    </div>
  );
}

/** 결제 실패 (card/limit) */
export function PayFailedScreen({ v }: { v: AppVals }) {
  return (
    <div style={sx('position:absolute;inset:0;z-index:143;background:var(--surface);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:36px 28px;text-align:center;animation:fadeIn .25s;overflow:hidden')}>
      <div style={sx('position:relative;width:6.6em;height:6.6em;display:flex;align-items:center;justify-content:center')}>
        <div style={sx('position:absolute;inset:0;border-radius:99em;background:#FCEEEE;opacity:.6')} />
        <div style={sx('position:absolute;inset:1em;border-radius:99em;background:#FCEEEE')} />
        <div style={sx('position:relative;width:4em;height:4em;border-radius:24px;background:var(--danger);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 22px rgba(190,50,50,.3);animation:pop .45s cubic-bezier(.34,1.56,.64,1)')}>
          <svg width="1.8em" height="1.8em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"></path></svg>
        </div>
      </div>
      <h2 style={sx('margin:18px 0 0;font-size:1.35em;font-weight:var(--wt);color:var(--ink)')}>{v.payErrTitle}</h2>
      <p style={sx('margin:10px 0 0;font-size:.82em;font-weight:var(--wb);color:var(--ink-2);line-height:1.6;max-width:26em')}>{v.payErrDesc}</p>
      <div style={sx('width:100%;margin-top:22px;background:var(--bg);border-radius:var(--r-card);padding:14px 18px;display:flex;justify-content:space-between;font-size:.84em')}>
        <span style={sx('font-weight:var(--wb);color:var(--ink-2)')}>결제 시도 금액</span><span style={sx('font-weight:var(--wt);color:var(--ink)')}>{v.curFeeText}</span>
      </div>
      <div style={sx('width:100%;display:flex;flex-direction:column;gap:10px;margin-top:20px')}>
        <button onClick={v.retryOther} style={sx('width:100%;background:var(--ink);color:var(--surface);border:none;border-radius:var(--r-btn);padding:1em 0;font-size:.9em;font-weight:var(--wt)')}>{v.payErrPrimary}</button>
        <button onClick={v.closePay} style={sx('width:100%;background:var(--bg);color:var(--ink-2);border:none;border-radius:var(--r-btn);padding:.9em 0;font-size:.84em;font-weight:var(--ws)')}>{v.payErrSecondary}</button>
        <button onClick={v.closePay} style={sx('background:none;border:none;color:var(--ink-3);font-size:.78em;font-weight:var(--ws);padding:.5em 0')}>나중에 결제하기</button>
      </div>
    </div>
  );
}

/** 결제 지연(승인 미확정) */
export function PayPendingScreen({ v }: { v: AppVals }) {
  return (
    <div style={sx('position:absolute;inset:0;z-index:143;background:var(--surface);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:36px 28px;text-align:center;animation:fadeIn .25s;overflow:hidden')}>
      <div style={sx('position:relative;width:6.6em;height:6.6em;display:flex;align-items:center;justify-content:center')}>
        <div style={sx('position:absolute;inset:0;border-radius:99em;background:#FBF3E3;opacity:.6')} />
        <div style={sx('position:absolute;inset:1em;border-radius:99em;background:#FBF3E3')} />
        <div style={sx('position:relative;width:4em;height:4em;border-radius:24px;background:#C08A2D;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 22px rgba(178,126,36,.3);animation:pop .45s cubic-bezier(.34,1.56,.64,1)')}>
          <svg width="1.8em" height="1.8em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>
        </div>
      </div>
      <h2 style={sx('margin:18px 0 0;font-size:1.35em;font-weight:var(--wt);color:var(--ink)')}>결제 결과를 확인하고 있어요</h2>
      <p style={sx('margin:10px 0 0;font-size:.82em;font-weight:var(--wb);color:var(--ink-2);line-height:1.6;max-width:26em')}>네트워크가 불안정해 응답을 받지 못했어요. 결제가 이미 완료됐을 수 있어요.</p>
      <div style={sx('width:100%;margin-top:22px;background:#FBF3E3;border-radius:var(--r-card);padding:13px 16px;display:flex;align-items:center;gap:10px;text-align:left')}>
        <svg width="1.15em" height="1.15em" viewBox="0 0 24 24" fill="none" stroke="#A5741E" strokeWidth="2.2" strokeLinecap="round" style={sx('flex:none')}><path d="M12 3l9.5 16.5h-19z"></path><path d="M12 10v4"></path><path d="M12 17.5v.01"></path></svg>
        <p style={sx('margin:0;font-size:.76em;font-weight:var(--ws);color:#A5741E;line-height:1.5')}>같은 결제를 바로 다시 시도하면 중복 결제될 수 있어요. 먼저 내역을 확인해 주세요.</p>
      </div>
      <div style={sx('width:100%;margin-top:10px;background:var(--bg);border:1px solid var(--line);border-radius:var(--r-card);padding:13px 16px;display:flex;align-items:flex-start;gap:10px;text-align:left')}>
        <svg width="1.15em" height="1.15em" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={sx('flex:none;margin-top:.1em')}><path d="M4 21V5a2 2 0 0 1 2-2h3v18" /><path d="M9 9h11" /><path d="M20 9v12" /></svg>
        <p style={sx('margin:0;font-size:.76em;font-weight:var(--wb);color:var(--ink-2);line-height:1.55')}>승인이 확인되기 전에는 <strong style={sx('font-weight:var(--wt);color:var(--ink)')}>출구 차단기가 열리지 않을 수 있어요</strong>. 급하다면 출구 무인정산기에서 바로 정산할 수 있어요.</p>
      </div>
      <div style={sx('width:100%;display:flex;flex-direction:column;gap:10px;margin-top:20px')}>
        <button onClick={v.checkHistory} style={sx('width:100%;background:var(--ink);color:var(--surface);border:none;border-radius:var(--r-btn);padding:1em 0;font-size:.9em;font-weight:var(--wt)')}>결제 내역에서 확인</button>
        <button onClick={v.recheck} style={sx('width:100%;background:var(--bg);color:var(--ink);border:none;border-radius:var(--r-btn);padding:.9em 0;font-size:.84em;font-weight:var(--ws)')}>결과 다시 확인</button>
      </div>
    </div>
  );
}

/** 결제 완료 (출차 유예 30분 카운트다운) */
export function PayCompleteScreen({ v }: { v: AppVals }) {
  return (
    <div style={sx('position:absolute;inset:0;z-index:145;background:var(--surface);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:36px 28px;text-align:center;animation:fadeIn .3s;overflow:hidden')}>
      <div style={sx('position:absolute;top:-110px;left:50%;transform:translateX(-50%);width:340px;height:340px;border-radius:99em;background:var(--ok-soft);opacity:.55;pointer-events:none')} />
      <div style={sx('position:relative;width:7.4em;height:7.4em;display:flex;align-items:center;justify-content:center')}>
        <div style={sx('position:absolute;inset:0;border-radius:99em;background:var(--ok-soft);opacity:.5')} />
        <div style={sx('position:absolute;inset:1.1em;border-radius:99em;background:var(--ok-soft)')} />
        <div style={sx('position:relative;width:4.4em;height:4.4em;border-radius:26px;background:var(--ok);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 24px rgba(16,145,90,.32);animation:pop .5s cubic-bezier(.34,1.56,.64,1)')}>
          <svg width="2.1em" height="2.1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
      </div>
      <h2 style={sx('margin:18px 0 0;font-size:1.5em;font-weight:var(--wt);color:var(--ink)')}>결제 완료</h2>
      <p style={sx('margin:8px 0 0;font-size:.82em;font-weight:var(--wb);color:var(--ink-2)')}>30분 이내 출차하면 추가 요금이 없어요</p>
      <div style={sx('width:100%;margin-top:22px;background:var(--bg);border-radius:var(--r-card);padding:22px')}>
        <p style={sx('margin:0;font-size:.72em;font-weight:var(--ws);color:var(--accent)')}>남은 출차 유예 시간</p>
        <p style={sx('margin:8px 0 0;font-size:2.8em;font-weight:var(--wt);color:var(--ink);font-variant-numeric:tabular-nums')}>{v.exitClock}</p>
      </div>
      <div style={sx('width:100%;margin-top:12px;background:var(--bg);border-radius:var(--r-card);padding:15px 18px;display:flex;flex-direction:column;gap:8px;text-align:left')}>
        <div style={sx('display:flex;justify-content:space-between;font-size:.8em')}><span style={sx('font-weight:var(--wb);color:var(--ink-3)')}>차량번호</span><span style={sx('font-weight:var(--wt);color:var(--ink)')}>{v.plate}</span></div>
        <div style={sx('display:flex;justify-content:space-between;font-size:.8em')}><span style={sx('font-weight:var(--wb);color:var(--ink-3)')}>주차장</span><span style={sx('font-weight:var(--wt);color:var(--ink)')}>{v.selFacObj.name}</span></div>
        <div style={sx('display:flex;justify-content:space-between;font-size:.8em')}><span style={sx('font-weight:var(--wb);color:var(--ink-3)')}>이용 시간</span><span style={sx('font-weight:var(--wt);color:var(--ink)')}>{v.parkHM}</span></div>
        <div style={sx('display:flex;justify-content:space-between;font-size:.8em')}><span style={sx('font-weight:var(--wb);color:var(--ink-3)')}>결제 금액</span><span style={sx('font-weight:var(--wt);color:var(--ink)')}>{v.curFeeText}</span></div>
        <p style={sx('margin:2px 0 0;font-size:.68em;font-weight:var(--wb);color:var(--ink-3)')}>내 차 정보가 맞는지 확인해 주세요 · 영수증은 이용내역에 보관됩니다</p>
      </div>
      <div style={sx('width:100%;display:flex;gap:10px;margin-top:22px')}>
        <button onClick={v.goHome} style={sx('flex:1;background:var(--accent);color:#fff;border:none;border-radius:var(--r-btn);padding:1em 0;font-size:.88em;font-weight:var(--wt)')}>출구 안내</button>
        <button onClick={v.endSession} style={sx('flex:1;background:var(--surface);color:var(--ink);border:1px solid var(--line-strong);border-radius:var(--r-btn);padding:1em 0;font-size:.88em;font-weight:var(--ws)')}>이용내역 보기</button>
      </div>
    </div>
  );
}
