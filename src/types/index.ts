export type ApplicationStatus =
  | "PENDING"
  | "IN_REVIEW"
  | "APPROVED"
  | "REJECTED";

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
  role: string;
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
  application_status: ApplicationStatus;
  verification_document: string;
  is_verified: boolean;
  is_active: boolean;
  is_onboarded: boolean;
  is_email_verified: boolean;
  is_mobile_verified: boolean;
}

export interface Admin {
  id: string;
  username: string;
  email: string;
  mobile: string;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: string;
  name: string;
  manufacturer_id: string;
  created_at: Date;
  updated_at: Date;
  product_count?: number;
}

export interface ApplicationHistoryEntry {
  id?: string;
  status: ApplicationStatus;
  message: string | null;
  created_at: string;
  admin?: Admin[] | null;
}

export interface ApplicationStatusData {
  currentStatus: ApplicationStatus | null;
  history: ApplicationHistoryEntry[];
}

export interface Pagination {
  page: number;
  limit: number;
}

export interface Category {
  id: string;
  name: string;
  is_active: boolean;
  manufacturer_id: string;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export interface Product {
  id: string;
  manufacturer_id: string;
  name: string;
  description: string;
  primary_image: string;
  images?: string[];
  sku: string;
  stock: number;
  min_order_quantity: number;
  in_stock: boolean;
  is_active: boolean;
  dealer_price: number;
  regular_price: number;
  unit_id: string;
  unit?: Pick<Unit, "id" | "name">;
  category?: Pick<Category, "id" | "name">;
  category_id: string;
  created_at: string;
  updated_at: string;
}
