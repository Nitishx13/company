import type {
  AnalyticsPoint,
  AuthCredentials,
  BillingCycle,
  Business,
  BusinessAnalytics,
  BusinessStatus,
  CustomerDashboard,
  Feedback,
  FeedbackStatus,
  GoogleProfile,
  ListResult,
  Payment,
  PaymentMethod,
  PaymentStatus,
  Plan,
  RegisterPayload,
  Review,
  ReviewLink,
  ReviewStatus,
  Session,
  Settings,
  Subscription,
  SubscriptionStatus,
  User,
  UserStatus,
} from './types';

export interface BusinessPayload {
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
  google_place_id: string | null;
  google_review_url: string | null;
}

export interface SubscriptionPayload {
  business_id: number;
  plan_id: number;
  status: SubscriptionStatus;
  billing_cycle: BillingCycle;
  amount: number;
  current_period_start: string;
  current_period_end: string;
  notes?: string | null;
}

export interface PaymentPayload {
  business_id: number;
  subscription_id?: number | null;
  amount: number;
  method: PaymentMethod;
  reference?: string | null;
  paid_on: string;
  note?: string | null;
}

export interface AdminAnalytics {
  range: string;
  totals: {
    mrr: number;
    arr: number;
    collected: number;
    outstanding: number;
    churned: number;
    new_businesses: number;
  };
  mrr_series: Array<{ label: string; value: number }>;
  revenue_series: Array<{ label: string; value: number }>;
  category_split: Array<{ category: string; businesses: number; mrr: number }>;
  top_businesses: Array<{ name: string; mrr: number; reviews: number; rating: number }>;
  churn_series: Array<{ label: string; value: number }>;
}

export interface PublicBusiness {
  business: Business;
  review_link: ReviewLink;
  rating_breakdown: Array<{ stars: number; count: number }>;
  recent_reviews: Review[];
}

/**
 * The single seam between the GMBQYN UI and its backend.
 *
 * Two implementations ship with this module:
 *  - `laravelService`  -> talks to the PHP/Laravel API over HTTPS
 *  - `mockService`     -> local-first adapter used until that API exists
 *
 * The UI only ever imports `getGmbqynService()`, so swapping one for the
 * other is a one-line change with no component edits.
 */
export interface GmbqynService {
  readonly mode: 'laravel' | 'mock';

  // ---- auth -------------------------------------------------------------
  register(payload: RegisterPayload): Promise<Session>;
  login(credentials: AuthCredentials): Promise<Session>;
  logout(): Promise<void>;
  me(): Promise<Session>;
  updateProfile(payload: Partial<User> & { current_password?: string; password?: string }): Promise<User>;
  changePassword(current: string, next: string): Promise<void>;

  // ---- customer area ----------------------------------------------------
  getCustomerDashboard(): Promise<CustomerDashboard>;
  getBusiness(): Promise<Business>;
  updateBusiness(payload: Partial<BusinessPayload>): Promise<Business>;
  getReviewLink(): Promise<ReviewLink>;
  updateReviewLink(payload: { is_active: boolean; slug?: string }): Promise<ReviewLink>;
  resetReviewLink(): Promise<ReviewLink>;

  listReviews(params?: { status?: ReviewStatus | 'all'; q?: string }): Promise<ListResult<Review>>;
  createReview(payload: Pick<Review, 'customer_name' | 'rating'> & Partial<Review>): Promise<Review>;
  updateReview(id: number, payload: Partial<Review>): Promise<Review>;
  deleteReview(id: number): Promise<void>;

  listFeedback(params?: { status?: FeedbackStatus | 'all' }): Promise<ListResult<Feedback>>;
  createFeedback(payload: Pick<Feedback, 'name' | 'message'> & Partial<Feedback>): Promise<Feedback>;

  getAnalytics(range: string): Promise<BusinessAnalytics>;
  getGoogleProfile(): Promise<GoogleProfile>;
  connectGoogle(payload: { place_id: string; review_url?: string }): Promise<GoogleProfile>;
  syncGoogle(): Promise<{ synced: number; message: string }>;

  getSubscription(): Promise<Subscription | null>;
  requestPlanChange(plan_code: string, billing_cycle: BillingCycle): Promise<Subscription>;
  cancelSubscription(reason?: string): Promise<Subscription>;
  getInvoices(): Promise<ListResult<Payment>>;

  // ---- public review page ----------------------------------------------
  getPublicBusiness(slug: string): Promise<PublicBusiness>;
  submitPublicReview(
    slug: string,
    payload: { customer_name: string; customer_email?: string; rating: number; title?: string; comment?: string }
  ): Promise<Review>;

  // ---- master admin -----------------------------------------------------
  getAdminOverview(): Promise<import('./types').AdminOverview>;
  getAdminAnalytics(range: string): Promise<AdminAnalytics>;

  listBusinesses(params?: { q?: string; status?: BusinessStatus | 'all' }): Promise<ListResult<Business>>;
  updateBusinessStatus(id: number, status: BusinessStatus): Promise<Business>;
  deleteBusiness(id: number): Promise<void>;

  listCustomers(params?: { q?: string; status?: UserStatus | 'all' }): Promise<ListResult<User>>;
  updateCustomerStatus(id: number, status: UserStatus): Promise<User>;
  deleteCustomer(id: number): Promise<void>;

  listSubscriptions(params?: { status?: SubscriptionStatus | 'all'; q?: string }): Promise<ListResult<Subscription>>;
  createSubscription(payload: SubscriptionPayload): Promise<Subscription>;
  updateSubscription(id: number, payload: Partial<SubscriptionPayload>): Promise<Subscription>;
  cancelSubscriptionAsAdmin(id: number, reason?: string): Promise<Subscription>;
  renewSubscription(id: number, months: number): Promise<Subscription>;

  listPayments(params?: { status?: PaymentStatus | 'all'; q?: string }): Promise<ListResult<Payment>>;
  createPayment(payload: PaymentPayload): Promise<Payment>;
  updatePaymentStatus(id: number, status: PaymentStatus): Promise<Payment>;
  deletePayment(id: number): Promise<void>;

  listAllReviews(params?: { status?: ReviewStatus | 'all'; q?: string }): Promise<ListResult<Review>>;
  moderateReview(id: number, status: ReviewStatus): Promise<Review>;

  listAllFeedback(params?: { status?: FeedbackStatus | 'all' }): Promise<ListResult<Feedback>>;
  updateFeedbackStatus(id: number, status: FeedbackStatus): Promise<Feedback>;
  deleteFeedback(id: number): Promise<void>;

  getAdminAnalyticsSeries(): Promise<AnalyticsPoint[]>;

  listPlans(): Promise<Plan[]>;
  savePlan(plan: Partial<Plan> & { name: string }): Promise<Plan>;
  deletePlan(id: number): Promise<void>;

  getSettings(): Promise<Settings>;
  updateSettings(payload: Partial<Settings>): Promise<Settings>;

  resetDemoData(): Promise<void>;
}

const API_URL = (
  process.env.NEXT_PUBLIC_GMBQYN_API_URL ||
  process.env.GMBQYN_API_URL ||
  ''
).replace(/\/$/, '');

export const isLaravelBackend = () => API_URL.length > 0;

export const laravelBaseUrl = () => API_URL;
