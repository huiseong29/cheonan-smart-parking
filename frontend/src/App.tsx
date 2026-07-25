/**
 * 천안 스마트 주차 — 서비스 앱 루트.
 * 화면 블록 순서는 z-index 동률 시 스택 순서를 결정하므로 유지한다:
 * HOME → 내 차 → 스켈레톤 → 결제 → 혜택 → 내 정보 → 이용내역
 * → 번호확인/변경 → 복구 → 오프라인 → 네비 → 온보딩 → 층별 → 자격확인 → 자리모달
 * → 저장완료 → 결제확인/처리중/실패/지연/완료 → 소식 → QR → 카드 → 행사 → 글자크기
 */
import { sx } from './lib/css';
import { useApp } from './logic/useApp';
import { BottomNav } from './ui/BottomNav';
import { TabSkeleton } from './ui/TabSkeleton';
import { Onboarding } from './ui/Onboarding';
import { PlateConfirmSheet } from './ui/PlateConfirmSheet';
import { PlateEditSheet } from './ui/PlateEditSheet';
import { ResumeModal } from './ui/ResumeModal';
import { OfflineBanner } from './ui/OfflineBanner';
import { HomeScreen } from './ui/HomeScreen';
import { RegisterScreen } from './ui/RegisterScreen';
import { PaymentScreen } from './ui/PaymentScreen';
import { BenefitsScreen } from './ui/BenefitsScreen';
import { ProfileScreen } from './ui/ProfileScreen';
import { HistoryScreen } from './ui/HistoryScreen';
import { DetailOverlay } from './ui/DetailOverlay';
import { VerifyModal } from './ui/VerifyModal';
import { SlotModal } from './ui/SlotModal';
import { SuccessScreen } from './ui/SuccessScreen';
import { PayConfirmOverlay, PayingModal, PayFailedScreen, PayPendingScreen, PayCompleteScreen } from './ui/PayOverlays';
import { NewsModal } from './ui/NewsModal';
import { QROverlay } from './ui/QROverlay';
import { CardModal } from './ui/CardModal';
import { EventOverlay } from './ui/EventOverlay';
import { FontSizeFloat } from './ui/FontSizeFloat';

export default function App() {
  const v = useApp();

  return (
    <div className="nb" style={sx(v.screenStyle)}>

      {/* ============ HOME (map) ============ */}
      {v.isHome && <HomeScreen v={v} />}

      {/* ============ 내 차 (register) ============ */}
      {v.isRegister && <RegisterScreen v={v} />}

      {/* ============ 탭 전환 스켈레톤 ============ */}
      {v.tabSkeleton && <TabSkeleton />}

      {/* ============ 결제 (payment) ============ */}
      {v.isPayment && <PaymentScreen v={v} />}

      {/* ============ 혜택 (benefits) ============ */}
      {v.isBenefits && <BenefitsScreen v={v} />}

      {/* ============ 내 정보 (profile) ============ */}
      {v.isProfile && <ProfileScreen v={v} />}

      {/* ============ 이용내역 (history) ============ */}
      {v.isHistory && <HistoryScreen v={v} />}

      {v.plateConfirmOpen && <PlateConfirmSheet v={v} />}

      {v.plateEditOpen && <PlateEditSheet v={v} />}

      {v.resumeOpen && <ResumeModal v={v} />}

      {v.offline && <OfflineBanner />}

      {/* Bottom nav */}
      {v.showNav && <BottomNav v={v} />}

      {/* ============ OVERLAYS ============ */}
      {v.isOnboarding && <Onboarding v={v} />}

      {v.isDetail && <DetailOverlay v={v} />}

      {v.verifyOpen && <VerifyModal v={v} />}

      {v.slotModal && <SlotModal v={v} />}

      {v.isSuccess && <SuccessScreen v={v} />}

      {v.payConfirm && <PayConfirmOverlay v={v} />}

      {v.isPaying && <PayingModal v={v} />}

      {v.payFailed && <PayFailedScreen v={v} />}

      {v.payPending && <PayPendingScreen v={v} />}

      {v.payComplete && <PayCompleteScreen v={v} />}

      {v.newsModal && <NewsModal v={v} />}

      {v.qrOpen && <QROverlay v={v} />}

      {v.cardOpen && <CardModal v={v} />}

      {v.eventOpen && <EventOverlay v={v} />}

      {v.fsShow && <FontSizeFloat v={v} />}

    </div>
  );
}
