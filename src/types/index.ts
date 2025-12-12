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

export interface Manufacturer {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  mobile: string;
  company_name: string;
  company_logo: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contact_person: string;
  website: string;
  gst_number: string;
  business_type: string;
  company_description: string;
  verification_document: string;
  is_verified: boolean;
  is_active: boolean;
  is_onboarded: boolean;
  is_email_verified: boolean;
  is_mobile_verified: boolean;
}

export interface Unit {
  id: string;
  name: string;
  manufacturer_id: string;
  created_at: Date;
  updated_at: Date;
}
