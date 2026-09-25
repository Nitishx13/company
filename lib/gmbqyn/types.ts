export type Role = 'customer' | 'admin';

export type UserStatus = 'active' | 'invited' | 'suspended';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  status: UserStatus;
  avatar_url: string | null;
  created_at: string;
  last_login_at: string | null;
}

export type BusinessStatus = 'pending' | 'active' | 'suspended';

export interface Business {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  phone: string | null;
  website: string | null;
  logo_url: string | null;
  google_place_id: string | null;
  google_review_url: string | null;
  rating: number | null;
  review_count: number | null;
  status: BusinessStatus;
  review_link_enabled: boolean;
  created_at: string;
}

export type BillingCycle = 'monthly' | 'yearly';

export interface Plan {
  id: number;
  code: string;
  name: string;
  tagline: string;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  review_link_enabled: boolean;
  qr_enabled: boolean;
  qr_custom_branding: boolean;
  feedback_enabled: boolean;
  analytics_enabled: boolean;
  google_sync: boolean;
  max_reviews_per_month: number | null;
  seats: number;
  sort_order: number;
  is_active: boolean;
  features: string[];
}

export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'expired' | 'cancelled';

export interface Subscription {
  id: number;
  business_id: number;
  plan_id: number;
  plan?: Plan;
  status: SubscriptionStatus;
  billing_cycle: BillingCycle;
  amount: number;
  started_at: string;
  current_period_start: string;
  current_period_end: string;
  cancelled_at: string | null;
  notes: string | null;
  created_at: string;
}

export type PaymentMethod = 'cash' | 'upi' | 'bank_transfer' | 'card' | 'cheque';

export type PaymentStatus = 'pending' | 'verified' | 'failed' | 'refunded';

export interface Payment {
  id: number;
  subscription_id: number | null;
  business_id: number;
  business_name?: string;
  amount: number;
  method: PaymentMethod;
  reference: string | null;
  status: PaymentStatus;
  paid_on: string;
  recorded_by: number | null;
  note: string | null;
  created_at: string;
}

export type ReviewSource = 'qr' | 'link' | 'manual' | 'import';
export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

export interface Review {
  id: number;
  business_id: number;
  business_name?: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  rating: number;
  title: string | null;
  comment: string | null;
  source: ReviewSource;
  status: ReviewStatus;
  replied_at: string | null;
  reply_text: string | null;
  is_public: boolean;
  created_at: string;
}

export type FeedbackStatus = 'new' | 'in_progress' | 'resolved' | 'spam';

export interface Feedback {
  id: number;
  business_id: number;
  business_name?: string;
  name: string;
  email: string | null;
  category: string;
  message: string;
  status: FeedbackStatus;
  created_at: string;
}

export interface ReviewLink {
  business_id: number;
  slug: string;
  url: string;
  short_url: string;
  is_active: boolean;
  clicks: number;
  submissions: number;
  conversion_rate: number;
  created_at: string;
}

export interface AnalyticsPoint {
  label: string;
  views: number;
  submissions: number;
  clicks: number;
}

export interface BusinessAnalytics {
  business: Business;
  range: string;
  totals: {
    link_views: number;
    qr_scans: number;
    reviews: number;
    avg_rating: number;
    pending_reviews: number;
    conversion_rate: number;
  };
  rating_breakdown: Array<{ stars: number; count: number }>;
  series: AnalyticsPoint[];
  sources: Array<{ source: ReviewSource; count: number }>;
}

export interface CustomerDashboard {
  business: Business;
  subscription: Subscription | null;
  review_link: ReviewLink;
  totals: {
    total_reviews: number;
    reviews_this_month: number;
    avg_rating: number;
    pending_reviews: number;
    link_views: number;
    qr_scans: number;
    response_rate: number;
  };
  rating_breakdown: Array<{ stars: number; count: number }>;
  series: AnalyticsPoint[];
  recent_reviews: Review[];
  open_feedback: number;
  plan_usage: {
    limit: number | null;
    used: number;
    percent: number;
  };
  days_to_renewal: number;
}

export interface GoogleProfile {
  connected: boolean;
  place_id: string | null;
  name: string | null;
  rating: number | null;
  review_count: number | null;
  review_url: string | null;
  last_synced_at: string | null;
  sync_log: Array<{ at: string; added: number; message: string }>;
  pending_reviews: Review[];
  perks: string[];
}

export interface Settings {
  company_name: string;
  support_email: string;
  support_phone: string;
  currency: string;
  trial_days: number;
  auto_renew: boolean;
  maintenance_mode: boolean;
  review_reminder_days: number;
}

export interface ListResult<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}

export interface AdminOverview {
  totals: {
    businesses: number;
    active_businesses: number;
    customers: number;
    active_subscriptions: number;
    mrr: number;
    collected_this_month: number;
    pending_payments: number;
    reviews: number;
    open_feedback: number;
  };
  mrr_series: Array<{ label: string; value: number }>;
  plan_split: Array<{ plan: string; businesses: number; revenue: number }>;
  expiring_soon: Subscription[];
  recent_reviews: Review[];
  recent_payments: Payment[];
}

export interface Session {
  token: string;
  user: User;
  business: Business | null;
  subscription: Subscription | null;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  business_name: string;
  category: string;
  city: string;
  state: string;
  country: string;
  plan_code: string;
  billing_cycle: BillingCycle;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}
