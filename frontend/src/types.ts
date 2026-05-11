/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VehicleType = 'GENERAL' | 'ELECTRIC' | 'DISABLED' | 'PREGNANT' | 'WOMEN';
export type PaymentMethod = 'HIPASS' | 'CARD' | 'LOCAL_CURRENCY' | 'QR' | 'APPLE_PAY' | 'FREE_PASS';
export type CongestionLevel = 'LOW' | 'NORMAL' | 'MODERATE' | 'HIGH';

export interface ParkingSlot {
  id: string;
  x: number;
  y: number;
  floor: string;
  isOccupied: boolean;
  isMyCar?: boolean;
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
  coords: { x: number; y: number }; // Relative to map
  slots: ParkingSlot[];
  pricePer30Min: number;
}

export interface PaymentRecord {
  id: string;
  date: string;
  duration: number; // in minutes
  amount: number;
  discountAmount: number;
  plateNumber: string;
  paymentMethod: PaymentMethod;
  location: string;
}

export interface UserVehicle {
  plateNumber: string;
  type: VehicleType;
  registeredAt: string;
  isAutoDiscountEnabled: boolean;
  ktxAlertEnabled: boolean;
  isCitizen: boolean; // 천안 시민 여부
  isHipassEnabled?: boolean;
  linkedCard?: string;
}

export interface ParkingSession {
  isActive: boolean;
  facilityId: string;
  slotId: string;
  floor: string;
  startTime: string;
  isPaid: boolean;
  paidAt?: string;
}

export interface KTXStatus {
  trainNumber: string;
  origin: string;
  destination: string;
  arrivalTime: string;
  status: 'ON_TIME' | 'DELAYED';
}

export interface AppConfig {
  fontSize: 'NORMAL' | 'LARGE' | 'EXTRA_LARGE';
}
