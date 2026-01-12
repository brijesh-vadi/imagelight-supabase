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

export interface DealerUser {
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

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
}

export enum PaymentStatus {
  UNPAID = "UNPAID",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  PAID = "PAID",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED",
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
  application_history?: ApplicationHistoryEntry[];
  prodcuts?: Product[];
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

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parent_id?: string | null;
  level: number;
  category_type: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  // Relations
  parent?: Category;
  children?: Category[];
  product_count?: number;
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
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
  category?: Pick<Category, "id" | "name"> & {
    parent?: Pick<Category, "id" | "name"> | null;
  };
  manufacturer?: Pick<Manufacturer, "id" | "company_name" | "company_logo"> & {
    city?: string | null;
    state?: string | null;
  };
  category_id: string;
  created_at: string;
  updated_at: string;
}

export interface Dealer {
  id: string;
  email: string;
  mobile: string;
  is_email_verified: boolean;
  is_mobile_verified: boolean;
  is_onboarded: boolean;
  is_active: boolean;
  company_name: string;
  company_logo: string;
  contact_person: string | null;
  gst_number: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  verification_document: string | null;
  created_at: string;
  updated_at: string;
}

export interface DealerApplicationHistoryEntry {
  id?: string;
  status: ApplicationStatus;
  message: string | null;
  created_at: string;
  updated_at?: string;
  approver?: Manufacturer | null;
}

export interface DealerApplicationStatusData {
  currentStatus: ApplicationStatus | null;
  history: DealerApplicationHistoryEntry[];
}

export interface CartItem {
  id: string;
  dealerId: string;
  productId: string;
  quantity: number;
  addedAt: string;
  updatedAt: string;

  product?: Product;
}

export interface Order {
  id: string;
  dealer_id: string;
  manufacturer_id: string;
  order_number: string;
  invoice_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total_amount: number;
  shipping_address: string | null;
  billing_address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  dealer?: Dealer;
  manufacturer?: Manufacturer;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  subtotal: number;
  status?: "ACTIVE" | "CANCELLED";
  cancelled_by?: "DEALER" | "MANUFACTURER";
  created_at: string;
  product?: Product;
}
