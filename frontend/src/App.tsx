/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, memo, useRef } from 'react';
import { 
  Navigation, 
  Car, 
  CreditCard, 
  History, 
  Zap,
  ChevronRight,
  Clock,
  Wallet,
  ShieldCheck,
  QrCode,
  Bell,
  Search,
  LocateFixed,
  Gift,
  Scan,
  Type,
  Info,
  X,
  MapPin,
  CheckCircle2,
  Ticket,
  Lock,
  Plus,
  Minus,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { MOCK_FACILITIES, MOCK_PAYMENTS, MOCK_VEHICLE, HOURLY_RATE, MOCK_NEWS } from './constants';
import { ParkingSlot, ParkingFacility, ParkingSession, AppConfig, UserVehicle, VehicleType } from './types';

const slotTypeMeta: Record<VehicleType, { label: string; availableClass: string; occupiedClass: string; dotClass: string }> = {
  GENERAL: {
    label: '일반',
    availableClass: 'bg-white border-emerald-500 text-emerald-600',
    occupiedClass: 'bg-slate-300 border-slate-400 text-slate-500 opacity-60',
    dotClass: 'bg-emerald-500',
  },
  ELECTRIC: {
    label: '전기차',
    availableClass: 'bg-violet-50 border-violet-500 text-violet-600',
    occupiedClass: 'bg-violet-100 border-violet-300 text-violet-300 opacity-60',
    dotClass: 'bg-violet-500',
  },
  DISABLED: {
    label: '장애인',
    availableClass: 'bg-blue-50 border-blue-500 text-blue-600',
    occupiedClass: 'bg-blue-100 border-blue-300 text-blue-300 opacity-60',
    dotClass: 'bg-blue-500',
  },
  PREGNANT: {
    label: '임산부',
    availableClass: 'bg-rose-50 border-rose-500 text-rose-600',
    occupiedClass: 'bg-rose-100 border-rose-300 text-rose-300 opacity-60',
    dotClass: 'bg-rose-500',
  },
  WOMEN: {
    label: '여성전용',
    availableClass: 'bg-pink-50 border-pink-500 text-pink-600',
    occupiedClass: 'bg-pink-100 border-pink-300 text-pink-300 opacity-60',
    dotClass: 'bg-pink-500',
  },
};

const slotTypeGuidance: Record<VehicleType, { title: string; description: string; iconClass: string; eyebrowClass: string; badgeClass: string; noticeClass: string }> = {
  GENERAL: {
    title: '일반 주차면',
    description: '일반 차량이 이용할 수 있는 자리입니다. 저장하면 내 차 위치와 요금 계산이 시작됩니다.',
    iconClass: 'bg-emerald-50 text-emerald-600',
    eyebrowClass: 'text-emerald-600',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    noticeClass: 'bg-emerald-50 text-emerald-800 border-emerald-100',
  },
  ELECTRIC: {
    title: '전기차 충전 주차면',
    description: '전기차 충전 또는 전기차 이용 차량에 맞는 자리입니다. 일반 차량은 다른 자리를 선택해 주세요.',
    iconClass: 'bg-violet-50 text-violet-600',
    eyebrowClass: 'text-violet-600',
    badgeClass: 'bg-violet-50 text-violet-700 border-violet-100',
    noticeClass: 'bg-violet-50 text-violet-800 border-violet-100',
  },
  DISABLED: {
    title: '장애인 전용 주차면',
    description: '장애인 주차 가능 표지가 있는 차량만 이용할 수 있습니다. 대상 차량이 아니면 다른 자리를 선택해 주세요.',
    iconClass: 'bg-blue-50 text-blue-600',
    eyebrowClass: 'text-blue-600',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-100',
    noticeClass: 'bg-blue-50 text-blue-800 border-blue-100',
  },
  PREGNANT: {
    title: '임산부 배려 주차면',
    description: '임산부 또는 영유아 동반 차량을 위한 배려 주차면입니다. 해당되는 경우에만 저장해 주세요.',
    iconClass: 'bg-rose-50 text-rose-600',
    eyebrowClass: 'text-rose-600',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-100',
    noticeClass: 'bg-rose-50 text-rose-800 border-rose-100',
  },
  WOMEN: {
    title: '여성전용 주차면',
    description: '여성 운전자를 위한 우선 배려 주차면입니다. 이용 조건을 확인한 뒤 저장해 주세요.',
    iconClass: 'bg-pink-50 text-pink-600',
    eyebrowClass: 'text-pink-600',
    badgeClass: 'bg-pink-50 text-pink-700 border-pink-100',
    noticeClass: 'bg-pink-50 text-pink-800 border-pink-100',
  },
};

// --- Sub-components (extracted for optimization) ---

const CheonanMapBackground = () => (
  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect width="100" height="100" fill="#F1F5F9" />
    <path d="M0,20 L100,30 M0,50 L100,45 M30,0 L25,100 M70,0 L75,100" stroke="#CBD5E1" strokeWidth="0.5" fill="none" opacity="0.4" />
    <rect x="40" y="40" width="20" height="20" fill="#CBD5E1" opacity="0.2" rx="2" />
    <circle cx="50" cy="50" r="1" fill="#94A3B8" opacity="0.5" />
  </svg>
);

const normalizePlateNumber = (value: string) => value.replace(/[\s-]/g, '').toUpperCase();
const isValidPlateNumber = (value: string) => /^(?:[가-힣]{2})?\d{2,3}[가-힣]\d{4}$/.test(normalizePlateNumber(value));

const OnboardingView = ({ 
  vehicle, 
  onUpdateVehicle, 
  onComplete 
}: { 
  vehicle: UserVehicle; 
  onUpdateVehicle: (v: UserVehicle) => void; 
  onComplete: () => void 
}) => {
  const hasPlateInput = vehicle.plateNumber.trim().length > 0;
  const isPlateValid = isValidPlateNumber(vehicle.plateNumber);

  return (
  <motion.div 
    className="fixed inset-0 z-[200] bg-white flex flex-col p-6 sm:p-10 justify-between overflow-y-auto"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
     <div className="space-y-8 sm:space-y-12 mt-6 sm:mt-10">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-100">
          <Car className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-900 leading-[0.9]">
            천안시<br />
            <span className="text-blue-600">스마트 주차</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">단 두 단계로 시작하는 편리한 천안 여행</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
           <div className="space-y-2">
             <p className="text-[10px] font-black tracking-widest text-slate-300">1단계</p>
             <div className="flex gap-2 sm:gap-3">
                <button 
                  onClick={() => onUpdateVehicle({...vehicle, isCitizen: true})}
                  className={`flex-1 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 transition-all text-left ${vehicle.isCitizen ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                >
                  <p className="font-black text-sm sm:text-base">천안 시민</p>
                  <p className="text-[9px] sm:text-[10px] mt-1 opacity-60">지역화폐 자동 할인</p>
                </button>
                <button 
                  onClick={() => onUpdateVehicle({...vehicle, isCitizen: false})}
                  className={`flex-1 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 transition-all text-left ${!vehicle.isCitizen ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                >
                  <p className="font-black text-sm sm:text-base">방문객</p>
                  <p className="text-[9px] sm:text-[10px] mt-1 opacity-60">여행지원 QR 할인</p>
                </button>
             </div>
           </div>

           <div className="space-y-2">
             <p className="text-[10px] font-black tracking-widest text-slate-300">2단계</p>
             <div className="bg-slate-50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col items-center border border-slate-100 focus-within:border-blue-200 focus-within:bg-white transition-colors">
                <input 
                  type="text" 
                  placeholder="차량번호를 입력하세요" 
                  className="w-full h-14 bg-transparent border-0 outline-none appearance-none shadow-none text-center text-xl sm:text-2xl font-black tracking-tight placeholder:text-slate-300 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 uppercase"
                  value={vehicle.plateNumber}
                  onChange={(e) => onUpdateVehicle({...vehicle, plateNumber: e.target.value})}
                />
             </div>
             {hasPlateInput && !isPlateValid && (
               <p className="text-xs sm:text-sm font-bold text-red-500 px-2">
                 차량번호 형식에 맞게 입력해 주세요. 예: 12가 3456 또는 123가 4567
               </p>
             )}
           </div>
        </div>
     </div>

     <button 
      onClick={onComplete}
      disabled={!isPlateValid}
      className="w-full bg-slate-900 text-white font-black py-6 rounded-[2.5rem] disabled:opacity-20 transition-all active:scale-[0.98] shadow-2xl shadow-slate-200 tracking-widest"
     >
        시작하기
     </button>
  </motion.div>
  );
};

const MapMarker = memo(({ 
  facility, 
  isSelected, 
  onClick 
}: { 
  facility: ParkingFacility; 
  isSelected: boolean; 
  onClick: () => void 
}) => (
  <motion.button
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    onClick={onClick}
    className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
    style={{ left: `${facility.coords.x}%`, top: `${facility.coords.y}%` }}
  >
    <div className={`
      relative p-2 rounded-2xl shadow-xl flex items-center justify-center transition-all
      ${facility.emptySpaces === 0 ? 'bg-red-500 scale-110 z-20' : (facility.emptySpaces < 10 ? 'bg-amber-500' : 'bg-emerald-500')}
      ${isSelected ? 'ring-4 ring-white ring-offset-2 scale-110 z-30' : ''}
    `}>
       <span className="text-[10px] font-black text-white px-1 whitespace-nowrap">
         {facility.emptySpaces === 0 ? '만차' : `${facility.emptySpaces}대`}
       </span>
       <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-inherit" />
    </div>
  </motion.button>
));

const BottomSheet = ({ 
  isExpanded, 
  onToggle, 
  selectedFacility, 
  onSelectFacility, 
  onViewDetail,
  filteredFacilities
}: { 
  isExpanded: boolean; 
  onToggle: () => void; 
  selectedFacility: ParkingFacility | null; 
  onSelectFacility: (f: ParkingFacility) => void;
  onViewDetail: () => void;
  filteredFacilities: ParkingFacility[];
}) => (
  <motion.div
    animate={{ height: isExpanded ? '85vh' : (selectedFacility ? '240px' : '100px') }}
    className="fixed bottom-0 inset-x-0 z-[60] bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.15)] rounded-t-[40px] pt-2 overflow-hidden"
  >
    <div className="flex flex-col items-center pb-4 cursor-pointer" onClick={onToggle}>
      <div className="w-10 h-1 bg-slate-200 rounded-full my-3" />
      
      {!isExpanded && selectedFacility && (
        <div className="w-full px-6 sm:px-8 flex justify-between items-center gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">{selectedFacility.name}</h3>
            <div className="flex flex-wrap gap-2 mt-1">
               <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">주차 가능 {selectedFacility.emptySpaces}대</span>
               <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">30분 {selectedFacility.pricePer30Min.toLocaleString()}원</span>
               <span className="text-[9px] font-black text-violet-600 bg-violet-50 px-2 py-0.5 rounded">자동결제 가능</span>
               <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{selectedFacility.distance}</span>
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onViewDetail(); }}
            className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-black text-xs shadow-lg shadow-blue-100 active:scale-95 flex-shrink-0"
          >
            층별 보기
          </button>
        </div>
      )}
      {!isExpanded && !selectedFacility && (
         <h3 className="text-[10px] font-black text-slate-400 tracking-widest py-1">주차장 목록 보기</h3>
      )}
    </div>

    <div className="px-6 pb-32 h-full overflow-y-auto no-scrollbar">
      <div className="space-y-4 pt-2">
        <h4 className="text-[10px] font-black text-slate-300 tracking-[0.2em] mb-4 px-1">주변 주차장</h4>
        {filteredFacilities.map(f => (
          <div 
            key={f.id} 
            className={`p-6 rounded-[32px] border transition-all ${selectedFacility?.id === f.id ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-50/30 shadow-xl' : 'border-slate-100 bg-white hover:border-slate-200'}`}
          >
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <h4 className="text-lg font-black text-slate-900 tracking-tight truncate">{f.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">총 {f.totalSpaces}면 · 현재 {f.emptySpaces}면 이용 가능</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">주차 가능 {f.emptySpaces}대</span>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">30분 {f.pricePer30Min.toLocaleString()}원</span>
                    <span className="text-[10px] font-black text-violet-600 bg-violet-50 px-2 py-0.5 rounded">자동결제 가능</span>
                    <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded">{f.type === 'PUBLIC' ? '지역화폐 할인' : 'QR 할인 가능'}</span>
                    <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{f.distance}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {Array.from(new Set(f.slots.map(slot => slot.floor))).slice(0, 3).map(floor => {
                  const available = f.slots.filter(slot => slot.floor === floor && !slot.isOccupied).length;
                  return (
                    <div key={floor} className="bg-slate-50 rounded-2xl p-3">
                      <p className="text-[9px] font-black text-slate-400 truncate">{floor}</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">{available > 0 ? `${available}대` : '만차'}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {(['DISABLED', 'WOMEN', 'ELECTRIC', 'PREGNANT'] as VehicleType[]).map(type => {
                  const total = f.slots.filter(slot => slot.type === type).length;
                  const available = f.slots.filter(slot => slot.type === type && !slot.isOccupied).length;
                  return (
                    <div key={type} className="bg-white border border-slate-100 rounded-2xl p-2">
                      <div className={`w-2 h-2 rounded-full ${slotTypeMeta[type].dotClass} mb-1`} />
                      <p className="text-[8px] font-black text-slate-500 truncate">{slotTypeMeta[type].label}</p>
                      <p className="text-[10px] font-black text-slate-900">{available}/{total}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => onSelectFacility(f)}
                  className="flex-1 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs tracking-widest active:scale-95 transition-transform"
                >
                  위치 확인
                </button>
                <button 
                  onClick={() => {
                    onSelectFacility(f);
                    onViewDetail();
                  }}
                  className="flex-1 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-xs tracking-widest shadow-lg shadow-blue-100 active:scale-95 transition-transform"
                >
                  층별 보기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const NavigationBar = ({ 
  activeTab, 
  setActiveTab, 
  hasActiveSession, 
  onSetViewState 
}: { 
  activeTab: string; 
  setActiveTab: (t: any) => void; 
  hasActiveSession: boolean; 
  onSetViewState: (s: any) => void;
}) => (
  <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 backdrop-blur-2xl border-t border-slate-100 px-6 sm:px-10 pt-4 pb-8 sm:pb-10 z-[100] flex justify-between items-center rounded-t-[40px] sm:rounded-t-[48px] shadow-2xl">
    {[
      { id: 'home', icon: <Navigation />, label: '지도' },
      { id: 'register', icon: <Car />, label: hasActiveSession ? '주차중' : '내 차' },
      { id: 'payment', icon: <CreditCard />, label: '결제' },
      { id: 'benefits', icon: <Gift />, label: '혜택' },
      { id: 'profile', icon: <Type />, label: '내 정보' },
    ].map((tab) => (
      <button
        key={tab.id}
        onClick={() => { setActiveTab(tab.id); onSetViewState('discovery'); }}
        className={`flex flex-col items-center gap-1.5 group relative transition-all ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-300 hover:text-slate-500'}`}
      >
        <div className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all duration-300 ${activeTab === tab.id ? 'bg-blue-50 scale-105 sm:scale-110 shadow-inner' : 'scale-100 hover:bg-slate-50'}`}>
          {Object.assign({}, tab.icon, { props: { ...tab.icon.props, className: "w-4 h-4 sm:w-5 sm:h-5" } })}
          {tab.id === 'register' && hasActiveSession && <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />}
        </div>
        <span className={`text-[9px] sm:text-[10px] font-black tracking-widest ${activeTab === tab.id ? 'opacity-100' : 'opacity-40'}`}>{tab.label}</span>
        {activeTab === tab.id && <motion.div layoutId="navDot" className="absolute -top-3 w-1.5 h-1.5 bg-blue-600 rounded-full shadow-lg" transition={{ type: "spring", stiffness: 400, damping: 25 }} />}
      </button>
    ))}
  </nav>
);

// --- Main App ---

export default function App() {
  // --- States ---
  const [activeFilter, setActiveFilter] = useState('전체');
  const [activeTab, setActiveTab] = useState<'home' | 'register' | 'payment' | 'benefits' | 'profile' | 'history'>('home');
  const [viewState, setViewState] = useState<'onboarding' | 'discovery' | 'detail' | 'success'>('discovery');
  const [config, setConfig] = useState<AppConfig>({ fontSize: 'NORMAL' });
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<ParkingFacility | null>(null);
  const [activeFloor, setActiveFloor] = useState<string>('B1F');
  const [activeSession, setActiveSession] = useState<ParkingSession | null>(null);
  const [vehicle, setVehicle] = useState<UserVehicle>({ ...MOCK_VEHICLE, plateNumber: '', isCitizen: true, isHipassEnabled: false });
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);
  const [pendingSlotId, setPendingSlotId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'none' | 'confirm' | 'complete'>('none');
  const [appliedBenefit, setAppliedBenefit] = useState<{ label: string; amount: number } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [exitTimer, setExitTimer] = useState(1800); // 30 mins

  // --- Effects ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: any;
    if (paymentStep === 'complete' && exitTimer > 0) {
      interval = setInterval(() => setExitTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [paymentStep, exitTimer]);

  // --- Calculations ---
  const filteredFacilities = useMemo(() => {
    let result = [...MOCK_FACILITIES];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(f => f.name.toLowerCase().includes(query));
    }
    
    switch (activeFilter) {
      case '가까운주차장': 
        return [...result].sort((a, b) => {
          const parseDist = (d: string) => d.includes('km') ? parseFloat(d) * 1000 : parseFloat(d);
          return parseDist(a.distance) - parseDist(b.distance);
        });
      case '공영': 
        return result.filter(f => f.type === 'PUBLIC');
      case '사설': 
        return result.filter(f => f.type === 'PRIVATE');
      case '전기차': 
        return result.filter(f => f.slots.some(s => s.type === 'ELECTRIC')); 
      case '장애인':
        return result.filter(f => f.slots.some(s => s.type === 'DISABLED'));
      case '여성전용':
        return result.filter(f => f.slots.some(s => s.type === 'WOMEN'));
      case '임산부':
        return result.filter(f => f.slots.some(s => s.type === 'PREGNANT'));
      case '빈자리':
        return result.filter(f => f.emptySpaces > 0);
      case '빈자리 많은': 
        return [...result].sort((a, b) => b.emptySpaces - a.emptySpaces);
      default: 
        return result;
    }
  }, [activeFilter, searchQuery]);

  const parkedSessionDuration = useMemo(() => {
    if (!activeSession) return 0;
    const start = new Date(activeSession.startTime);
    return Math.floor((currentTime.getTime() - start.getTime()) / (1000 * 60));
  }, [activeSession, currentTime]);

  const currentFee = useMemo(() => {
    if (!activeSession) return 0;
    const base = Math.floor(parkedSessionDuration * (HOURLY_RATE / 60));
    const discountMultiplier = vehicle.type === 'ELECTRIC' ? 0.5 : (vehicle.type !== 'GENERAL' ? 0.2 : 1.0);
    const citizenDiscount = vehicle.isCitizen ? 0.9 : 1.0;
    return Math.max(0, Math.floor(base * discountMultiplier * citizenDiscount) - (appliedBenefit?.amount || 0));
  }, [parkedSessionDuration, vehicle, appliedBenefit]);

  const pendingSlot = useMemo(() => {
    if (!pendingSlotId || !selectedFacility) return null;
    return selectedFacility.slots.find(slot => slot.id === pendingSlotId) ?? null;
  }, [pendingSlotId, selectedFacility]);

  const pendingSlotGuide = pendingSlot ? slotTypeGuidance[pendingSlot.type] : null;

  const transformRef = useRef<any>(null);

  // --- Handlers ---
  const handleSelectFacility = (f: ParkingFacility) => {
    setSelectedFacility(f);
    if (!f.slots.some(s => s.floor === activeFloor)) {
      setActiveFloor(f.slots[0]?.floor || '1F');
    }
    // Automatically collapse the bottom sheet when a facility is selected from the list
    setIsBottomSheetExpanded(false);

    // Center map on marker with offset
    if (transformRef.current) {
      const { setTransform } = transformRef.current;
      setTimeout(() => {
        const zoomLevel = 2; // Fixed zoom on select for better UX
        const containerHeight = window.innerHeight;
        const containerWidth = window.innerWidth;
        
        // Calculate position
        const posX = (containerWidth / 2) - (f.coords.x * containerWidth / 100 * zoomLevel);
        const posY = (containerHeight * 0.25) - (f.coords.y * containerHeight / 100 * zoomLevel);
        
        setTransform(posX, posY, zoomLevel, 600, "easeOut");
      }, 100);
    }
  };

  const startParking = (slotId: string) => {
    if (!selectedFacility) return;
    setActiveSession({
      isActive: true,
      facilityId: selectedFacility.id,
      slotId,
      floor: activeFloor,
      startTime: new Date().toISOString(),
      isPaid: false
    });
    setPendingSlotId(null);
    setViewState('success');
  };

  const handlePayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaymentStep('complete');
    }, 2000);
  };

  const fontSizeClass = useMemo(() => {
    switch(config.fontSize) {
      case 'LARGE': return 'font-large-scale';
      case 'EXTRA_LARGE': return 'font-extra-large-scale';
      default: return 'font-normal-scale';
    }
  }, [config.fontSize]);

  // --- Render Helpers ---
  const renderDashboard = () => (
    <div className="h-screen relative flex flex-col">
      <div className="flex-1 min-h-0 relative bg-[#E8EDF2] overflow-hidden">
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          initialPositionX={0}
          initialPositionY={0}
          minScale={0.5}
          maxScale={4}
          centerOnInit
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
                <div className="relative w-full h-full min-w-[375px] min-h-[667px] sm:min-w-[500px] sm:min-h-[800px]">
                  {/* Map Graphic */}
                  <CheonanMapBackground />

                  {/* Markers */}
                  {filteredFacilities.map(f => (
                    <MapMarker 
                      key={f.id} 
                      facility={f} 
                      isSelected={selectedFacility?.id === f.id}
                      onClick={() => handleSelectFacility(f)} 
                    />
                  ))}
                </div>
              </TransformComponent>

              {/* Map Floating Controls */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
                <button 
                  onClick={() => setIsBottomSheetExpanded(prev => !prev)}
                  className="w-12 h-12 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center justify-center active:scale-90 transition-transform"
                >
                  {isBottomSheetExpanded ? <Maximize2 className="w-6 h-6" /> : <Minimize2 className="w-6 h-6" />}
                </button>
                <div className="h-px bg-slate-200 my-1 mx-2" />
                <button 
                  onClick={() => zoomIn()}
                  className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
                >
                  <Plus className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => zoomOut()}
                  className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
                >
                  <Minus className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => resetTransform()}
                  className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
                >
                  <LocateFixed className="w-6 h-6" />
                </button>
              </div>
            </>
          )}
        </TransformWrapper>

        {/* Floating Search & Filter */}
        <div className="absolute top-14 inset-x-4 z-20 space-y-3 px-2">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-1.5 flex items-center gap-2 shadow-xl border border-white/20">
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input 
              type="text" 
              placeholder="주차장 어디로 갈까요?" 
              className="flex-1 bg-transparent border-none focus:ring-0 text-xs sm:text-sm font-bold placeholder:text-slate-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white cursor-pointer active:scale-95 transition-transform">
              <Scan className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {['전체', '가까운주차장', '공영', '사설', '전기차', '장애인', '여성전용', '임산부', '빈자리', '빈자리 많은'].map(filter => (
              <button 
                key={filter} 
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap px-4 py-2 border rounded-full text-[10px] font-black shadow-sm transition-all active:scale-95 ${activeFilter === filter ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white/95 backdrop-blur-md border-slate-100 text-slate-600'}`}
              >
                {filter === '빈자리 많은' ? '빈자리 많은 주차장' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Persistent Payment Alert */}
        <AnimatePresence>
          {activeSession && activeTab === 'home' && (
            <motion.button 
              initial={{ y: -20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              onClick={() => setPaymentStep('confirm')}
              className="absolute top-[180px] inset-x-8 z-[25] bg-blue-600 text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center justify-between shadow-2xl pointer-events-auto"
            >
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs font-black truncate">현재 {parkedSessionDuration}분 · {currentFee.toLocaleString()}원</span>
              </div>
              <div className="flex items-center gap-1 font-black text-[9px] sm:text-[10px] tracking-widest bg-white/20 px-2 sm:px-3 py-1.5 rounded-lg active:scale-95 transition-transform ml-2">
                결제 <ChevronRight className="w-3 h-3" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Sheet */}
      <BottomSheet 
        isExpanded={isBottomSheetExpanded}
        onToggle={() => setIsBottomSheetExpanded(!isBottomSheetExpanded)}
        selectedFacility={selectedFacility}
        onSelectFacility={handleSelectFacility}
        onViewDetail={() => setViewState('detail')}
        filteredFacilities={filteredFacilities}
      />
    </div>
  );

  const renderTabs = () => (
    <div className="fixed inset-0 z-40 bg-[#F8F9FA] flex flex-col p-6 sm:p-10 mt-12 pb-32 overflow-y-auto no-scrollbar">
      {activeTab === 'benefits' && (
        <div className="space-y-6 sm:space-y-8">
           <header className="mb-6 sm:mb-10 text-center">
             <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none mb-2">천안 혜택</h2>
             <p className="text-xs sm:text-sm font-medium text-slate-400">시민과 방문객 모두를 위한 감면 혜택</p>
           </header>
           <div className="bg-emerald-600 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10"><Wallet className="w-16 h-16 sm:w-24 sm:h-24" /></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                   <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center"><CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                   <span className="text-[9px] sm:text-[10px] font-black tracking-widest opacity-80">천안 시민 혜택</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tighter leading-tight mb-2">지역화폐 연동 대기 중</h3>
                <p className="text-xs sm:text-sm opacity-80 mb-6 sm:mb-8">천안사랑카드 사용 시 공영주차장 10% 추가 할인이 자동 적용됩니다.</p>
                <button
                  onClick={() => {
                    setAppliedBenefit({ label: '천안사랑카드 할인', amount: 1000 });
                    setActiveTab('payment');
                  }}
                  className="w-full bg-white text-emerald-600 font-black py-4 rounded-2xl text-[10px] sm:text-xs tracking-widest transition-transform active:scale-95"
                >
                  천안사랑카드 연동하기
                </button>
              </div>
           </div>
           <div className="bg-blue-600 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10"><QrCode className="w-16 h-16 sm:w-24 sm:h-24" /></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                   <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center"><Ticket className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                   <span className="text-[9px] sm:text-[10px] font-black tracking-widest opacity-80">방문객 혜택</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tighter leading-tight mb-2">여행지원 QR 할인</h3>
                <p className="text-xs sm:text-sm opacity-80 mb-6 sm:mb-8">관광지 방문 QR을 스캔하면 주차 요금 1,000원을 즉시 할인해드립니다.</p>
                <button
                  onClick={() => {
                    setAppliedBenefit({ label: '여행지원 QR 할인', amount: 1000 });
                    setActiveTab('payment');
                  }}
                  className="w-full bg-white text-blue-600 font-black py-4 rounded-2xl text-[10px] sm:text-xs tracking-widest flex items-center justify-center gap-3 transition-transform active:scale-95"
                >
                  <Scan className="w-4 h-4" /> QR 할인 적용하기
                </button>
              </div>
           </div>

           {appliedBenefit && (
             <div className="bg-white rounded-3xl p-5 border border-emerald-100 flex items-center gap-4">
               <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                 <CheckCircle2 className="w-5 h-5" />
               </div>
               <div>
                 <p className="text-sm font-black text-slate-900">{appliedBenefit.label} 적용됨</p>
                 <p className="text-xs font-bold text-emerald-600">{appliedBenefit.amount.toLocaleString()}원 할인</p>
               </div>
             </div>
           )}

           {/* Cheonan City Info Section */}
           <div className="space-y-6 pt-10">
             <header className="flex justify-between items-end px-2">
                <h3 className="text-xl font-black">천안 소식</h3>
                <span className="text-[10px] font-black text-blue-600">전체 보기</span>
             </header>
             <div className="grid gap-4">
                {MOCK_NEWS.map((news, i) => (
                  <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 flex gap-4 items-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[8px] font-black text-slate-400">{news.tag}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-slate-800 truncate mb-1">{news.title}</p>
                      <p className="text-[10px] font-bold text-slate-400">{news.date}</p>
                    </div>
                  </div>
                ))}
             </div>
           </div>
        </div>
      )}

      {activeTab === 'payment' && (
        <div className="space-y-6 sm:space-y-8 pb-10">
          <header className="mb-6 sm:mb-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none mb-2">결제</h2>
            <p className="text-xs sm:text-sm font-medium text-slate-400">현재 요금, 할인, 자동결제 상태를 확인하세요</p>
          </header>

          {activeSession ? (
            <div className="space-y-5 sm:space-y-6">
              <section className="bg-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-blue-600 tracking-widest mb-2">현재 주차 중</p>
                    <h3 className="text-lg sm:text-2xl font-black text-slate-900 truncate">
                      {MOCK_FACILITIES.find(f => f.id === activeSession.facilityId)?.name}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                      {activeSession.floor} {activeSession.slotId} · {vehicle.plateNumber}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                    <CreditCard className="w-6 h-6" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <p className="text-[10px] font-black text-slate-400 mb-1">주차시간</p>
                    <p className="text-lg font-black text-slate-900">{Math.floor(parkedSessionDuration / 60)}시간 {parkedSessionDuration % 60}분</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <p className="text-[10px] font-black text-slate-400 mb-1">현재 요금</p>
                    <p className="text-lg font-black text-slate-900">{Math.floor(parkedSessionDuration * (HOURLY_RATE / 60)).toLocaleString()}원</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-slate-500">기본 요금</span>
                    <span className="font-black text-slate-900">{Math.floor(parkedSessionDuration * (HOURLY_RATE / 60)).toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-emerald-600">적용 할인</span>
                    <span className="font-black text-emerald-600">-{Math.max(0, Math.floor(parkedSessionDuration * (HOURLY_RATE / 60)) - currentFee).toLocaleString()}원</span>
                  </div>
                  {appliedBenefit && (
                    <div className="flex justify-between text-xs bg-emerald-50 text-emerald-700 rounded-xl px-3 py-2">
                      <span className="font-black">{appliedBenefit.label}</span>
                      <span className="font-black">-{appliedBenefit.amount.toLocaleString()}원</span>
                    </div>
                  )}
                  <div className="h-px bg-slate-100" />
                  <div className="flex justify-between items-end">
                    <span className="text-base font-black text-slate-900">결제 예정 금액</span>
                    <span className="text-3xl sm:text-4xl font-black text-blue-600">{currentFee.toLocaleString()}원</span>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-[28px] sm:rounded-[36px] p-5 sm:p-6 border border-slate-100 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-900">하이패스형 자동결제</p>
                      <p className="text-[10px] font-bold text-slate-400 truncate">차량 번호와 카드로 출차 시 자동 결제</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setVehicle({...vehicle, isHipassEnabled: !vehicle.isHipassEnabled})}
                    className={`w-13 h-7 rounded-full transition-all relative flex-shrink-0 ${vehicle.isHipassEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
                    aria-label="하이패스형 자동결제 설정"
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${vehicle.isHipassEnabled ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-500">결제수단</span>
                  <span className="text-xs font-black text-slate-900 truncate">{vehicle.linkedCard || '등록된 카드 없음'}</span>
                </div>
              </section>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveTab('benefits')}
                  className="py-4 bg-white border border-blue-100 text-blue-600 rounded-2xl font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Gift className="w-4 h-4" /> 할인 입력하기
                </button>
                <button
                  onClick={() => setPaymentStep('confirm')}
                  className="py-4 bg-slate-900 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <CreditCard className="w-4 h-4" /> 결제하기
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 text-center space-y-5">
              <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-400">
                <CreditCard className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">결제할 주차 내역이 없습니다</h3>
                <p className="text-xs font-bold text-slate-400 mt-2">주차 위치를 저장하면 요금과 할인 정보를 확인할 수 있습니다.</p>
              </div>
              <button
                onClick={() => setActiveTab('home')}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs"
              >
                주차장 찾기
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'register' && (
        <div className="space-y-6 sm:space-y-8 pb-10">
           <header className="mb-6 sm:mb-10 text-center">
             <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none mb-2">내 차</h2>
             <p className="text-xs sm:text-sm font-medium text-slate-400">주차 현황 및 차량 설정</p>
           </header>

           {activeSession ? (
             <div className="space-y-4 sm:space-y-6">
               <div className="bg-slate-900 text-white rounded-[32px] sm:rounded-[48px] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 sm:w-48 sm:h-48 bg-blue-600/20 rounded-full blur-3xl opacity-50" />
                  <div className="relative z-10">
                     <div className="flex justify-between items-start mb-6 sm:mb-10">
                        <div className="min-w-0 flex-1">
                           <p className="text-[9px] sm:text-[10px] font-black tracking-[0.2em] text-blue-400 mb-2">현재 주차 중</p>
                           <h3 className="text-xl sm:text-3xl font-black tracking-tighter leading-none truncate">{MOCK_FACILITIES.find(f => f.id === activeSession.facilityId)?.name}</h3>
                        </div>
                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 ml-4"><Car className="w-5 h-5 sm:w-7 sm:h-7 text-blue-400" /></div>
                     </div>
                     <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10">
                        <div>
                           <p className="text-[9px] sm:text-[10px] font-black tracking-widest opacity-40 mb-2">주차 위치</p>
                           <p className="text-lg sm:text-2xl font-black">{activeSession.floor} <span className="text-blue-400">{activeSession.slotId}</span></p>
                        </div>
                        <div>
                           <p className="text-[9px] sm:text-[10px] font-black tracking-widest opacity-40 mb-2">주차 시간</p>
                           <p className="text-lg sm:text-2xl font-mono font-black tabular-nums">{Math.floor(parkedSessionDuration / 60)}시간 {parkedSessionDuration % 60}분</p>
                        </div>
                     </div>
                     <div className="h-px bg-white/10 mb-6 sm:mb-10" />
                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                        <div>
                           <p className="text-[9px] sm:text-[10px] font-black tracking-widest opacity-40 mb-1">결제 예정 금액</p>
                           <p className="text-3xl sm:text-4xl font-black">{currentFee.toLocaleString()}원</p>
                           {vehicle.isHipassEnabled && (
                             <div className="flex items-center gap-1 mt-1">
                               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                               <span className="text-[9px] font-black text-emerald-600 tracking-widest">자동결제 준비 완료</span>
                             </div>
                           )}
                        </div>
                        <button onClick={() => setPaymentStep('confirm')} className="w-full sm:w-auto bg-blue-600 px-6 sm:px-8 py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] font-black text-xs sm:text-sm tracking-widest shadow-xl transition-transform active:scale-95">결제하기</button>
                     </div>
                  </div>
               </div>
               <div className="bg-white rounded-[24px] sm:rounded-[40px] p-5 sm:p-8 border border-slate-100 space-y-6">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-xl sm:rounded-3xl flex items-center justify-center text-slate-400 flex-shrink-0"><Info className="w-6 h-6 sm:w-8 sm:h-8" /></div>
                    <div>
                      <p className="text-xs sm:text-sm font-black">결제 후 30분 출차 유예</p>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-400 mt-1">결제 완료 후 30분 내로 출차하시면 추가 요금이 발생하지 않습니다.</p>
                    </div>
                  </div>
                  
                  <div className="h-px bg-slate-50 w-full" />

                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><ShieldCheck className="w-5 h-5" /></div>
                        <div>
                           <p className="text-[10px] font-black">하이패스 공용차량 등록</p>
                           <p className="text-[9px] text-slate-400 font-bold">전용구역 자동 결제 지원</p>
                        </div>
                     </div>
                     <button 
                        onClick={() => setVehicle({...vehicle, isHipassEnabled: !vehicle.isHipassEnabled})}
                        className={`w-12 h-6 rounded-full transition-all relative ${vehicle.isHipassEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${vehicle.isHipassEnabled ? 'right-1' : 'left-1'}`} />
                      </button>
                  </div>

                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><Ticket className="w-5 h-5" /></div>
                        <div>
                           <p className="text-[10px] font-black">할인 혜택 자동 적용</p>
                           <p className="text-[9px] text-slate-400 font-bold">경차, 저공해, 유공자 등</p>
                        </div>
                     </div>
                     <button 
                        onClick={() => setVehicle({...vehicle, isAutoDiscountEnabled: !vehicle.isAutoDiscountEnabled})}
                        className={`w-12 h-6 rounded-full transition-all relative ${vehicle.isAutoDiscountEnabled ? 'bg-blue-500' : 'bg-slate-200'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${vehicle.isAutoDiscountEnabled ? 'right-1' : 'left-1'}`} />
                      </button>
                  </div>
               </div>
             </div>
           ) : (
             <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm space-y-8">
                <div className="bg-slate-50 rounded-3xl p-8 text-center">
                   <p className="text-[10px] font-black tracking-widest text-slate-300 mb-3">등록 차량번호</p>
                   <p className="text-4xl font-black tracking-tighter text-slate-900 uppercase underline decoration-blue-500/20 underline-offset-8">{vehicle.plateNumber}</p>
                </div>
                <p className="text-center text-xs font-bold text-slate-400">현재 주차 중인 내역이 없습니다.</p>
             </div>
           )}

           <div className="space-y-4">
              <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                 <div className="flex items-center gap-3 min-w-0">
                    <Type className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-bold whitespace-nowrap">글자 크기 설정</span>
                 </div>
                 <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'NORMAL', label: '보통' },
                      { id: 'LARGE', label: '크게' },
                      { id: 'EXTRA_LARGE', label: '매우 크게' },
                    ].map(size => (
                      <button 
                        key={size.id} 
                        onClick={() => setConfig({...config, fontSize: size.id as any})}
                        className={`min-h-12 rounded-xl flex items-center justify-center px-2 text-xs font-black transition-all whitespace-nowrap ${config.fontSize === size.id ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border border-slate-100'}`}
                      >
                        {size.label}
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="space-y-6 sm:space-y-8 pb-10">
          <header className="mb-6 sm:mb-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none mb-2">내 정보</h2>
            <p className="text-xs sm:text-sm font-medium text-slate-400">차량, 결제수단, 접근성 설정</p>
          </header>

          <section className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-100 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                <Car className="w-7 h-7" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 tracking-widest">등록 차량</p>
                <p className="text-2xl font-black text-slate-900 truncate">{vehicle.plateNumber || '차량번호 미등록'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-[10px] font-black text-slate-400 mb-1">이용자 유형</p>
                <p className="text-sm font-black text-slate-900">{vehicle.isCitizen ? '천안 시민' : '방문객'}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-[10px] font-black text-slate-400 mb-1">결제수단</p>
                <p className="text-sm font-black text-slate-900 truncate">{vehicle.linkedCard || '미등록'}</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-100 space-y-5">
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-black text-slate-900">글자 크기</h3>
            </div>
            <div className="grid grid-cols-1 min-[360px]:grid-cols-3 gap-2">
              {[
                { id: 'NORMAL', label: '보통' },
                { id: 'LARGE', label: '크게' },
                { id: 'EXTRA_LARGE', label: '매우 크게' },
              ].map(size => (
                <button 
                  key={size.id} 
                  onClick={() => setConfig({...config, fontSize: size.id as any})}
                  className={`min-h-12 px-2 rounded-2xl flex items-center justify-center text-xs font-black transition-all whitespace-nowrap ${config.fontSize === size.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-100 space-y-4">
            <h3 className="text-sm font-black text-slate-900">최근 이용내역</h3>
            {MOCK_PAYMENTS.slice(0, 2).map(tx => (
              <div key={tx.id} className="flex justify-between items-center gap-4 bg-slate-50 rounded-2xl p-4">
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900 truncate">{tx.location}</p>
                  <p className="text-[10px] font-bold text-slate-400">{tx.date}</p>
                </div>
                <p className="text-sm font-black text-slate-900 flex-shrink-0">{tx.amount.toLocaleString()}원</p>
              </div>
            ))}
          </section>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-8">
           <header className="mb-10 text-center">
             <h2 className="text-3xl font-black tracking-tight leading-none mb-2">이용 내역</h2>
             <p className="text-sm font-medium text-slate-400">주차 및 결제 히스토리</p>
           </header>
           
           <div className="bg-white p-2 rounded-2xl border border-slate-100 flex items-center gap-3">
             <Search className="w-4 h-4 text-slate-400 ml-2" />
             <input 
              type="text" 
              placeholder="장소 또는 날짜 검색" 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
             />
           </div>

           <div className="space-y-4">
              {MOCK_PAYMENTS.filter(tx => tx.location.includes(historySearch) || tx.date.includes(historySearch)).map(tx => (
                <div key={tx.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex justify-between items-center group active:scale-[0.98] transition-all">
                   <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600"><History className="w-6 h-6" /></div>
                      <div>
                         <h4 className="font-black text-slate-900 truncate w-32 tracking-tight">{tx.location}</h4>
                         <p className="text-[10px] font-bold text-slate-400">{tx.date}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="font-black text-slate-900">{tx.amount.toLocaleString()}원</p>
                      <p className="text-[9px] font-black tracking-tighter text-blue-600 opacity-60">결제 완료</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen bg-[#F8F9FA] text-slate-800 font-sans ${fontSizeClass}`}>
      
      {/* Onboarding Overlay */}
      {!isOnboarded && (
        <OnboardingView 
          vehicle={vehicle} 
          onUpdateVehicle={setVehicle} 
          onComplete={() => setIsOnboarded(true)} 
        />
      )}

      {/* Overlays */}
      <AnimatePresence>
        {isPaying && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center">
             <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full mb-6" />
             <h2 className="text-xl font-black text-slate-900">결제 처리 중</h2>
             <p className="text-sm font-medium text-slate-400">자동결제 서버와 연결하고 있습니다.</p>
          </motion.div>
        )}

        {paymentStep === 'complete' && (
           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 z-[300] bg-white flex flex-col items-center justify-center p-8 sm:p-12 text-center">
             <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-500 rounded-[32px] sm:rounded-[40px] flex items-center justify-center text-white mb-6 sm:mb-8 shadow-2xl shadow-emerald-100"><CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" /></div>
             <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter mb-2 sm:mb-3">결제 완료</h2>
             <p className="text-xs sm:text-sm font-bold text-slate-400 mb-8 sm:mb-12 tracking-tight px-4">30분 이내 출차하면 추가 요금이 없습니다.</p>
             <div className="w-full bg-slate-50 rounded-[32px] sm:rounded-[40px] p-8 sm:p-10 space-y-4 sm:space-y-6 relative overflow-hidden border border-slate-100">
                <div className="relative z-10">
                  <p className="text-[9px] sm:text-[10px] font-black tracking-[0.2em] text-blue-600 mb-2">남은 출차 유예 시간</p>
                  <p className="text-5xl sm:text-6xl font-mono font-black text-slate-900 tabular-nums">
                    {Math.floor(exitTimer / 60)}:{String(exitTimer % 60).padStart(2, '0')}
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-slate-500 mt-4">30분 이내 출차하면 추가 요금이 없습니다.</p>
                </div>
             </div>
             <div className="mt-8 sm:mt-12 w-full grid grid-cols-2 gap-3">
               <button
                onClick={() => { setPaymentStep('none'); setActiveTab('home'); setViewState('discovery'); }}
                className="bg-blue-600 text-white font-black py-4 sm:py-5 rounded-2xl tracking-widest shadow-xl transition-transform active:scale-95"
               >
                출구 안내
               </button>
               <button
                onClick={() => { setActiveSession(null); setPaymentStep('none'); setActiveTab('profile'); setViewState('discovery'); }}
                className="bg-white text-slate-900 border border-slate-100 font-black py-4 sm:py-5 rounded-2xl tracking-widest shadow-sm transition-transform active:scale-95"
               >
                영수증 보기
               </button>
               <button
                onClick={() => { setActiveSession(null); setPaymentStep('none'); setActiveTab('profile'); setViewState('discovery'); }}
                className="col-span-2 bg-slate-900 text-white font-black py-5 sm:py-6 rounded-2xl sm:rounded-[2.5rem] tracking-widest shadow-xl transition-transform active:scale-95"
               >
                이용내역 보기
               </button>
             </div>
          </motion.div>
        )}

        {paymentStep === 'confirm' && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 z-[250] bg-white flex flex-col p-6 sm:p-10">
             <div className="flex justify-between items-center mb-8 sm:mb-12">
                <button onClick={() => setPaymentStep('none')} className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-900"><X className="w-5 h-5 sm:w-6 sm:h-6" /></button>
                <h2 className="text-lg sm:text-xl font-black tracking-tight">결제 확인</h2>
                <div className="w-10 h-10 sm:w-12 sm:h-12" />
             </div>
             <div className="space-y-6 sm:space-y-8 flex-1 overflow-y-auto no-scrollbar pb-10">
                <div className="bg-slate-50 rounded-[24px] sm:rounded-[40px] p-6 sm:p-8 space-y-4">
                   <div className="flex justify-between items-center gap-4"><span className="text-[10px] sm:text-xs font-bold text-slate-400">주차장</span><span className="text-xs sm:text-sm font-black truncate">{MOCK_FACILITIES.find(f => f.id === activeSession?.facilityId)?.name}</span></div>
                   <div className="flex justify-between items-center"><span className="text-[10px] sm:text-xs font-bold text-slate-400">주차 시간</span><span className="text-xs sm:text-sm font-black">{Math.floor(parkedSessionDuration / 60)}시간 {parkedSessionDuration % 60}분</span></div>
                   <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={() => {
                          setPaymentStep('none');
                          setActiveTab('benefits');
                        }}
                        className="flex items-center gap-2 text-[10px] font-black text-blue-600 bg-white px-3 py-2 rounded-xl border border-blue-100 active:scale-95 transition-transform"
                      >
                        <Scan className="w-3 h-3" /> 할인 입력하기
                      </button>
                      <button className="flex items-center gap-2 text-[10px] font-black text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-100 active:scale-95 transition-transform">
                        <Gift className="w-3 h-3" /> 쿠폰 선택
                      </button>
                   </div>
                </div>
                <div className="space-y-4 px-2 sm:px-4">
                   <div className="flex justify-between items-center"><span className="text-xs sm:text-sm font-bold text-slate-500">기본 요금</span><span className="text-xs sm:text-sm font-bold">{(Math.floor(parkedSessionDuration * (HOURLY_RATE / 60))).toLocaleString()}원</span></div>
                   <div className="flex justify-between items-center"><span className="text-xs sm:text-sm font-bold text-emerald-600">자동 할인</span><span className="text-xs sm:text-sm font-bold text-emerald-600">-{Math.max(0, Math.floor(parkedSessionDuration * (HOURLY_RATE / 60)) - currentFee - (appliedBenefit?.amount || 0)).toLocaleString()}원</span></div>
                   {appliedBenefit && (
                     <div className="flex justify-between items-center"><span className="text-xs sm:text-sm font-bold text-emerald-600">{appliedBenefit.label}</span><span className="text-xs sm:text-sm font-bold text-emerald-600">-{appliedBenefit.amount.toLocaleString()}원</span></div>
                   )}
                   <div className="h-px bg-slate-100 my-2" />
                   <div className="flex justify-between items-center"><span className="text-base sm:text-lg font-black tracking-tight">최종 금액</span><span className="text-2xl sm:text-3xl font-black text-blue-600">{currentFee.toLocaleString()}원</span></div>
                </div>
                <button onClick={handlePayment} className="w-full bg-slate-900 text-white font-black py-5 sm:py-6 rounded-2xl sm:rounded-[2.5rem] tracking-widest shadow-2xl transition-all active:scale-95">결제하기</button>
             </div>
          </motion.div>
        )}

        {pendingSlotId && selectedFacility && pendingSlot && pendingSlotGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[260] bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 40, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 40, scale: 0.98 }}
              className="w-full max-w-md bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${pendingSlotGuide.iconClass}`}>
                  <MapPin className="w-7 h-7" />
                </div>
                <div className="min-w-0">
                  <p className={`text-[10px] font-black tracking-widest mb-2 ${pendingSlotGuide.eyebrowClass}`}>주차 위치 확인</p>
                  <h3 className="text-xl font-black text-slate-900">{activeFloor} {pendingSlotId}</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 truncate">{selectedFacility.name}</p>
                  <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full border text-[10px] font-black ${pendingSlotGuide.badgeClass}`}>
                    <span className={`w-2 h-2 rounded-full ${slotTypeMeta[pendingSlot.type].dotClass}`} />
                    {pendingSlotGuide.title}
                  </div>
                </div>
              </div>

              <div className={`rounded-2xl p-4 border ${pendingSlotGuide.noticeClass}`}>
                <p className="text-sm font-black mb-1">
                  {pendingSlotGuide.title}을 선택했습니다.
                </p>
                <p className="text-sm font-bold leading-relaxed">
                  {pendingSlotGuide.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPendingSlotId(null)}
                  className="py-4 rounded-2xl bg-slate-100 text-slate-600 font-black text-xs active:scale-95 transition-transform"
                >
                  다시 선택
                </button>
                <button
                  onClick={() => startParking(pendingSlotId)}
                  className="py-4 rounded-2xl bg-slate-900 text-white font-black text-xs active:scale-95 transition-transform"
                >
                  주차 위치 저장
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation & Main Content */}
      <AnimatePresence mode="wait">
        {viewState === 'discovery' && (
          <motion.div key="discovery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-screen">
             {activeTab === 'home' ? renderDashboard() : renderTabs()}
          </motion.div>
        )}

        {viewState === 'success' && (
           <motion.div key="success" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] bg-white flex flex-col items-center justify-center p-12 text-center">
              <div className="w-24 h-24 bg-blue-600 rounded-[40px] flex items-center justify-center text-white mb-8 shadow-2xl"><Navigation className="w-12 h-12" /></div>
              <p className="text-[10px] font-black text-blue-600 tracking-widest mb-2">주차 위치 저장 완료</p>
              <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight leading-none">
                {activeSession?.floor} {activeSession?.slotId}<br />
                주차 중
              </h2>
              <p className="text-sm font-bold text-slate-400 mb-12">기록된 위치 정보는 '내 차' 탭에서<br />언제든 확인할 수 있습니다.</p>
              <div className="w-full space-y-4">
                <button onClick={() => { setViewState('discovery'); setActiveTab('register'); setIsBottomSheetExpanded(false); }} className="w-full bg-slate-900 text-white font-black py-6 rounded-[2.5rem] tracking-widest shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-95">내 차 위치 보기</button>
              </div>
           </motion.div>
        )}

        {viewState === 'detail' && selectedFacility && (
          <motion.div key="detail" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[100] bg-white flex flex-col">
             <header className="px-6 pt-12 pb-6 flex items-center justify-between">
                <button onClick={() => setViewState('discovery')} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 active:scale-90 transition-transform"><X className="w-6 h-6" /></button>
                <div className="text-center">
                  <h2 className="text-lg font-black tracking-tight truncate w-40">{selectedFacility.name}</h2>
                  <p className="text-[10px] font-black text-blue-600 tracking-[0.2em]">{activeFloor} 현황</p>
                </div>
                <div className="w-12 h-12" />
             </header>

             <div className="flex px-6 justify-between items-center mb-4">
                <h3 className="text-sm font-black text-slate-400 tracking-widest">{activeFloor} 층별 지도</h3>
                <button 
                  onClick={() => {
                    const nearest = selectedFacility.slots.find(s => s.floor === activeFloor && !s.isOccupied);
                    if (nearest) setPendingSlotId(nearest.id);
                  }}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black shadow-lg shadow-emerald-100 flex items-center gap-2 active:scale-95 transition-transform"
                >
                  <Navigation className="w-3 h-3" /> 가장 가까운 자리 찾기
                </button>
             </div>

             <div className="flex px-8 gap-2 mb-4 overflow-x-auto no-scrollbar">
                {Array.from(new Set(selectedFacility.slots.map(s => s.floor))).map(floor => (
                  <button key={floor} onClick={() => setActiveFloor(floor)} className={`min-w-[76px] py-3 rounded-2xl font-black text-xs transition-all ${activeFloor === floor ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-50 text-slate-400'}`}>
                    <span className="block">{floor}</span>
                    <span className="block text-[9px] opacity-70 mt-0.5">
                      {selectedFacility.slots.filter(slot => slot.floor === floor && !slot.isOccupied).length}대 가능
                    </span>
                  </button>
                ))}
             </div>

             <div className="mx-6 mb-4 overflow-x-auto no-scrollbar">
                <div className="min-w-max flex items-center gap-2">
                   {(['GENERAL', 'DISABLED', 'WOMEN', 'ELECTRIC', 'PREGNANT'] as VehicleType[]).map(type => (
                    <div key={type} className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 bg-slate-50 px-3 py-2 rounded-full border border-slate-100">
                      <div className={`w-2.5 h-2.5 rounded-full ${slotTypeMeta[type].dotClass}`} /> {slotTypeMeta[type].label}
                    </div>
                   ))}
                </div>
             </div>

             <div className="flex-1 min-h-0 bg-slate-100 mx-6 rounded-[40px] sm:rounded-[56px] p-5 sm:p-8 border-4 border-white shadow-2xl">
                <div className="h-full overflow-y-auto pr-1 no-scrollbar">
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 sm:gap-4 pb-2">
                   {selectedFacility.slots.filter(s => s.floor === activeFloor).map((slot, i) => (
                    (() => {
                      const meta = slotTypeMeta[slot.type];
                      const stateClass = slot.isOccupied
                        ? meta.occupiedClass
                        : pendingSlotId === slot.id
                          ? `${meta.availableClass} ring-4 ring-emerald-100 shadow-lg`
                          : `${meta.availableClass} shadow-md active:scale-95`;
                      return (
                      <button 
                        key={slot.id}
                        disabled={slot.isOccupied}
                        onClick={() => setPendingSlotId(slot.id)}
                        className={`h-16 sm:h-20 rounded-xl sm:rounded-2xl border-b-4 flex flex-col items-center justify-center transition-all ${stateClass}`}
                      >
                         <span className="text-[8px] sm:text-[9px] font-black opacity-40 max-w-full truncate px-1">{slot.id.split('-').slice(-1)[0]}</span>
                         {slot.isOccupied ? <Lock className="w-4 h-4 sm:w-5 sm:h-5" /> : <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />}
                         <span className="text-[8px] font-black mt-1">{meta.label}</span>
                      </button>
                      );
                    })()
                   ))}
                </div>
                </div>
             </div>
             <p className="py-12 text-center text-xs font-bold text-slate-400">빈자리를 선택해 내 차 위치를 저장하세요.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Bar */}
      {viewState !== 'onboarding' && (
        <NavigationBar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasActiveSession={!!activeSession}
          onSetViewState={setViewState}
        />
      )}
    </div>
  );
}
