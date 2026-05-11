import { ParkingSlot, PaymentRecord, UserVehicle, KTXStatus, ParkingFacility, VehicleType } from './types';

type FloorPlan = {
  floor: string;
  total: number;
  empty: number;
  special?: Partial<Record<VehicleType, number>>;
};

const typeLabelPrefix: Record<VehicleType, string> = {
  GENERAL: 'A',
  ELECTRIC: 'E',
  DISABLED: 'D',
  PREGNANT: 'P',
  WOMEN: 'W',
};

const buildFloorSlots = (facilityCode: string, plan: FloorPlan): ParkingSlot[] => {
  const specialEntries = Object.entries(plan.special ?? {}) as Array<[VehicleType, number]>;
  const typedSlots: VehicleType[] = [];

  specialEntries.forEach(([type, count]) => {
    for (let i = 0; i < count; i += 1) typedSlots.push(type);
  });

  while (typedSlots.length < plan.total) typedSlots.push('GENERAL');

  return typedSlots.slice(0, plan.total).map((type, index) => {
    const number = index + 1;
    const row = Math.floor(index / 10);
    const column = index % 10;

    return {
      id: `${facilityCode}-${plan.floor}-${typeLabelPrefix[type]}${String(number).padStart(2, '0')}`,
      x: column,
      y: row,
      floor: plan.floor,
      isOccupied: index >= plan.empty,
      type,
    };
  });
};

const buildFacility = (
  facility: Omit<ParkingFacility, 'slots' | 'emptySpaces' | 'totalSpaces'>,
  floors: FloorPlan[],
): ParkingFacility => {
  const slots = floors.flatMap((floor) => buildFloorSlots(facility.id, floor));

  return {
    ...facility,
    totalSpaces: slots.length,
    emptySpaces: slots.filter((slot) => !slot.isOccupied).length,
    slots,
  };
};

export const MOCK_FACILITIES: ParkingFacility[] = [
  buildFacility(
    {
      id: 'F1',
      name: '천안역 서부광장 주차장',
      distance: '150m',
      type: 'PUBLIC',
      congestion: 'NORMAL',
      coords: { x: 45, y: 55 },
      pricePer30Min: 1000,
    },
    [
      { floor: 'B1', total: 40, empty: 18, special: { DISABLED: 3, ELECTRIC: 5, WOMEN: 4, PREGNANT: 2 } },
      { floor: 'B2', total: 40, empty: 20, special: { DISABLED: 3, ELECTRIC: 5, WOMEN: 4, PREGNANT: 2 } },
    ],
  ),
  buildFacility(
    {
      id: 'F2',
      name: '천안역 동부 공영주차장',
      distance: '450m',
      type: 'PUBLIC',
      congestion: 'HIGH',
      coords: { x: 80, y: 30 },
      pricePer30Min: 800,
    },
    [
      { floor: '1F', total: 50, empty: 0, special: { DISABLED: 4, ELECTRIC: 6, WOMEN: 5, PREGNANT: 2 } },
      { floor: '2F', total: 50, empty: 0, special: { DISABLED: 4, ELECTRIC: 6, WOMEN: 5, PREGNANT: 2 } },
    ],
  ),
  buildFacility(
    {
      id: 'F3',
      name: '신부동 터미널 파킹',
      distance: '1.2km',
      type: 'PRIVATE',
      congestion: 'LOW',
      coords: { x: 20, y: 40 },
      pricePer30Min: 2000,
    },
    [
      { floor: 'B1', total: 50, empty: 34, special: { DISABLED: 3, ELECTRIC: 7, WOMEN: 5, PREGNANT: 2 } },
      { floor: '1F', total: 50, empty: 32, special: { DISABLED: 3, ELECTRIC: 7, WOMEN: 5, PREGNANT: 2 } },
      { floor: '2F', total: 50, empty: 34, special: { DISABLED: 3, ELECTRIC: 7, WOMEN: 5, PREGNANT: 2 } },
    ],
  ),
  buildFacility(
    {
      id: 'F4',
      name: '두정역 환승 주차장',
      distance: '3.8km',
      type: 'PUBLIC',
      congestion: 'HIGH',
      coords: { x: 50, y: 15 },
      pricePer30Min: 500,
    },
    [
      { floor: '1F', total: 60, empty: 3, special: { DISABLED: 5, ELECTRIC: 8, WOMEN: 6, PREGNANT: 2 } },
      { floor: '2F', total: 60, empty: 4, special: { DISABLED: 4, ELECTRIC: 8, WOMEN: 6, PREGNANT: 2 } },
      { floor: '3F', total: 60, empty: 5, special: { DISABLED: 4, ELECTRIC: 9, WOMEN: 6, PREGNANT: 2 } },
      { floor: '4F', total: 60, empty: 4, special: { DISABLED: 4, ELECTRIC: 9, WOMEN: 6, PREGNANT: 2 } },
    ],
  ),
  buildFacility(
    {
      id: 'F5',
      name: '불당동 스마트 타워',
      distance: '5.4km',
      type: 'PRIVATE',
      congestion: 'LOW',
      coords: { x: 30, y: 80 },
      pricePer30Min: 1500,
    },
    [
      { floor: 'B1', total: 60, empty: 34, special: { DISABLED: 4, ELECTRIC: 10, WOMEN: 6, PREGNANT: 2 } },
      { floor: '1F', total: 60, empty: 31, special: { DISABLED: 4, ELECTRIC: 10, WOMEN: 6, PREGNANT: 2 } },
      { floor: '2F', total: 60, empty: 32, special: { DISABLED: 4, ELECTRIC: 11, WOMEN: 6, PREGNANT: 2 } },
      { floor: '3F', total: 60, empty: 30, special: { DISABLED: 3, ELECTRIC: 11, WOMEN: 6, PREGNANT: 2 } },
      { floor: '4F', total: 60, empty: 30, special: { DISABLED: 3, ELECTRIC: 12, WOMEN: 5, PREGNANT: 2 } },
      { floor: '5F', total: 60, empty: 30, special: { DISABLED: 3, ELECTRIC: 12, WOMEN: 5, PREGNANT: 2 } },
    ],
  ),
  buildFacility(
    {
      id: 'F6',
      name: '신부5공영주차장',
      distance: '650m',
      type: 'PUBLIC',
      congestion: 'MODERATE',
      coords: { x: 62, y: 62 },
      pricePer30Min: 700,
    },
    [
      { floor: '1F', total: 48, empty: 6, special: { DISABLED: 4, ELECTRIC: 5, WOMEN: 5, PREGNANT: 2 } },
      { floor: '2F', total: 48, empty: 7, special: { DISABLED: 3, ELECTRIC: 6, WOMEN: 5, PREGNANT: 2 } },
      { floor: '3F', total: 48, empty: 9, special: { DISABLED: 3, ELECTRIC: 6, WOMEN: 5, PREGNANT: 2 } },
      { floor: '4F', total: 48, empty: 12, special: { DISABLED: 3, ELECTRIC: 7, WOMEN: 5, PREGNANT: 2 } },
      { floor: '5F', total: 48, empty: 8, special: { DISABLED: 3, ELECTRIC: 7, WOMEN: 5, PREGNANT: 2 } },
      { floor: '6F', total: 48, empty: 6, special: { DISABLED: 3, ELECTRIC: 7, WOMEN: 5, PREGNANT: 2 } },
      { floor: '7F', total: 48, empty: 5, special: { DISABLED: 3, ELECTRIC: 7, WOMEN: 5, PREGNANT: 2 } },
    ],
  ),
  buildFacility(
    {
      id: 'F7',
      name: '천안중앙시장 공영주차장',
      distance: '900m',
      type: 'PUBLIC',
      congestion: 'NORMAL',
      coords: { x: 35, y: 68 },
      pricePer30Min: 600,
    },
    [
      { floor: '1F', total: 45, empty: 12, special: { DISABLED: 3, ELECTRIC: 4, WOMEN: 5, PREGNANT: 2 } },
      { floor: '2F', total: 45, empty: 15, special: { DISABLED: 3, ELECTRIC: 4, WOMEN: 5, PREGNANT: 2 } },
      { floor: '3F', total: 45, empty: 14, special: { DISABLED: 3, ELECTRIC: 4, WOMEN: 5, PREGNANT: 2 } },
    ],
  ),
];

export const MOCK_PAYMENTS: PaymentRecord[] = [
  {
    id: 'TX-1004',
    date: '2026-05-10 14:30',
    duration: 125,
    amount: 8500,
    discountAmount: 4000,
    plateNumber: '123가 4567',
    paymentMethod: 'HIPASS',
    location: '천안역 서부광장 주차장',
  },
  {
    id: 'TX-1003',
    date: '2026-05-08 09:15',
    duration: 45,
    amount: 3200,
    discountAmount: 1300,
    plateNumber: '123가 4567',
    paymentMethod: 'CARD',
    location: '천안역 동부 공영주차장',
  },
  {
    id: 'TX-1002',
    date: '2026-05-05 18:40',
    duration: 210,
    amount: 12000,
    discountAmount: 2000,
    plateNumber: '123가 4567',
    paymentMethod: 'APPLE_PAY',
    location: '신부동 터미널 파킹',
  },
  {
    id: 'TX-1001',
    date: '2026-05-01 11:20',
    duration: 60,
    amount: 4000,
    discountAmount: 4000,
    plateNumber: '123가 4567',
    paymentMethod: 'FREE_PASS',
    location: '천안시청 주차장',
  },
];

export const MOCK_VEHICLE: UserVehicle = {
  plateNumber: '123가 4567',
  type: 'GENERAL',
  registeredAt: '2026-01-01',
  isAutoDiscountEnabled: true,
  ktxAlertEnabled: true,
  isCitizen: true,
  isHipassEnabled: true,
  linkedCard: '천안사랑카드 (4412)',
};

export const MOCK_KTX: KTXStatus = {
  trainNumber: 'KTX 021',
  origin: '서울',
  destination: '부산',
  arrivalTime: '14:45',
  status: 'ON_TIME',
};

export const MOCK_NEWS = [
  { tag: 'EVENT', title: '흥타령춤축제 주차장 무료 개방 안내', date: '2026.05.20' },
  { tag: 'NOTICE', title: '천안역 서부광장 스마트 정산기 교체 공사', date: '2026.05.15' },
  { tag: 'CITY', title: '천안시 청년 주차 지원 사업 신청 안내', date: '2026.05.11' },
  { tag: 'NEW', title: '불당동 스마트 타워 신규 오픈 이벤트', date: '2026.05.08' },
];

export const HOURLY_RATE = 4000;
export const CONGESTION_LEVEL = 'MODERATE';
