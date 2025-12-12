export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface ManufacturerUser {
  id: string;
  email: string;
  mobile: string;
}

export interface SessionData {
  userId: string;
  email: string;
  role: string;
  isOnboarded: boolean;
}

export enum Role {
  MANUFACTURER = "MANUFACTURER",
  CUSTOMER = "CUSTOMER",
  DEALER = "DEALER",
  ADMIN = "ADMIN",
}

export interface Unit {
  id: string;
  name: string;
  manufacturer_id: string;
  created_at: Date;
  updated_at: Date;
}
