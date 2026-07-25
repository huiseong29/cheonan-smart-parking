/**
 * 천안 스마트 주차 · 주차장 더미 데이터
 * 실서비스에서는 이 모듈을 실시간 주차/LPR/결제/혜택 데이터 소스로 교체합니다.
 */

export type VehicleType = 'GENERAL' | 'ELECTRIC' | 'DISABLED' | 'PREGNANT' | 'WOMEN';
export type CongestionLevel = 'LOW' | 'NORMAL' | 'MODERATE' | 'HIGH';

export interface ParkingSlot {
  id: string;
  x: number;
  y: number;
  floor: string;
  isOccupied: boolean;
  type: VehicleType;
}

export interface ParkingFacility {
  id: string;
  name: string;
  distance: string;
  totalSpaces: number;
  emptySpaces: number;
  type: 'PUBLIC' | 'PRIVATE';
  congestion: CongestionLevel;
  coords: { x: number; y: number };
  slots: ParkingSlot[];
  pricePer30Min: number;
}

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

export const FACILITIES: ParkingFacility[] = [
  buildFacility(
    { id: 'F1', name: '천안역 서부광장 주차장', distance: '150m', type: 'PUBLIC', congestion: 'NORMAL', coords: { x: 45, y: 55 }, pricePer30Min: 1000 },
    [
      { floor: 'B1', total: 40, empty: 18, special: { DISABLED: 3, ELECTRIC: 5, WOMEN: 4, PREGNANT: 2 } },
      { floor: 'B2', total: 40, empty: 20, special: { DISABLED: 3, ELECTRIC: 5, WOMEN: 4, PREGNANT: 2 } },
    ],
  ),
  buildFacility(
    { id: 'F2', name: '천안역 동부 공영주차장', distance: '450m', type: 'PUBLIC', congestion: 'HIGH', coords: { x: 80, y: 30 }, pricePer30Min: 800 },
    [
      { floor: '1F', total: 50, empty: 0, special: { DISABLED: 4, ELECTRIC: 6, WOMEN: 5, PREGNANT: 2 } },
      { floor: '2F', total: 50, empty: 0, special: { DISABLED: 4, ELECTRIC: 6, WOMEN: 5, PREGNANT: 2 } },
    ],
  ),
  buildFacility(
    { id: 'F3', name: '신부동 터미널 파킹', distance: '1.2km', type: 'PRIVATE', congestion: 'LOW', coords: { x: 20, y: 40 }, pricePer30Min: 2000 },
    [
      { floor: 'B1', total: 50, empty: 34, special: { DISABLED: 3, ELECTRIC: 7, WOMEN: 5, PREGNANT: 2 } },
      { floor: '1F', total: 50, empty: 32, special: { DISABLED: 3, ELECTRIC: 7, WOMEN: 5, PREGNANT: 2 } },
      { floor: '2F', total: 50, empty: 34, special: { DISABLED: 3, ELECTRIC: 7, WOMEN: 5, PREGNANT: 2 } },
    ],
  ),
  buildFacility(
    { id: 'F4', name: '두정역 환승 주차장', distance: '3.8km', type: 'PUBLIC', congestion: 'HIGH', coords: { x: 50, y: 15 }, pricePer30Min: 500 },
    [
      { floor: '1F', total: 60, empty: 3, special: { DISABLED: 5, ELECTRIC: 8, WOMEN: 6, PREGNANT: 2 } },
      { floor: '2F', total: 60, empty: 4, special: { DISABLED: 4, ELECTRIC: 8, WOMEN: 6, PREGNANT: 2 } },
      { floor: '3F', total: 60, empty: 5, special: { DISABLED: 4, ELECTRIC: 9, WOMEN: 6, PREGNANT: 2 } },
      { floor: '4F', total: 60, empty: 4, special: { DISABLED: 4, ELECTRIC: 9, WOMEN: 6, PREGNANT: 2 } },
    ],
  ),
  buildFacility(
    { id: 'F5', name: '불당동 스마트 타워', distance: '5.4km', type: 'PRIVATE', congestion: 'LOW', coords: { x: 30, y: 80 }, pricePer30Min: 1500 },
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
    { id: 'F6', name: '신부5공영주차장', distance: '650m', type: 'PUBLIC', congestion: 'MODERATE', coords: { x: 62, y: 62 }, pricePer30Min: 700 },
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
    { id: 'F7', name: '천안중앙시장 공영주차장', distance: '900m', type: 'PUBLIC', congestion: 'NORMAL', coords: { x: 35, y: 68 }, pricePer30Min: 600 },
    [
      { floor: '1F', total: 45, empty: 12, special: { DISABLED: 3, ELECTRIC: 4, WOMEN: 5, PREGNANT: 2 } },
      { floor: '2F', total: 45, empty: 15, special: { DISABLED: 3, ELECTRIC: 4, WOMEN: 5, PREGNANT: 2 } },
      { floor: '3F', total: 45, empty: 14, special: { DISABLED: 3, ELECTRIC: 4, WOMEN: 5, PREGNANT: 2 } },
    ],
  ),
];

export const HOURLY_RATE = 4000;
