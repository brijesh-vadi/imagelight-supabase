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
}

export interface ManufacturerApplication {
  id: string;
  manufacturer_id: string;

  status: ApplicationStatus;
  current_status_since: string;

  admin_feedback: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;

  submission_count: number;
  last_submitted_at: string;

  created_at: string;
  updated_at: string;
}

export interface TimelineEntry {
  title: string;
  description: string;
  timestamp: string;
  icon: React.ComponentType;
  dotColor: string;
  isCurrent: boolean;
}

export interface ApplicationStatusHistory {
  id: string;
  application_id: string;

  status: ApplicationStatus;
  message: string | null;
  changed_by_role: Role.ADMIN | Role.MANUFACTURER;
  changed_by: string | null;

  created_at: string;

  admin?: Admin[] | null;
}
