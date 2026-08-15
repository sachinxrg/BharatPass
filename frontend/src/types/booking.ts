export interface SlotAvailability {
  timeWindow: string;
  displayTime: string;
  available: number;
  total: number;
  booked: number;
}

export interface PskCenter {
  pskId: string;
  name: string;
  city: string;
  state: string;
  dailyCapacity: number;
  rpoCode: string;
}

export interface ReservationResponse {
  appointmentId: string;
  lockExpiry: string;
  status: string;
}
