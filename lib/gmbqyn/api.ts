import { laravelBaseUrl, type GmbqynService } from './service';
import type {
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
import type {
  AdminAnalytics,
  BusinessPayload,
  PaymentPayload,
  PublicBusiness,
  SubscriptionPayload,
} from './service';

const TOKEN_KEY = 'gmbqyn_token';
const PREFIX = '/api/v1';

export class GmbqynApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'GmbqynApiError';
    this.status = status;
    this.errors = errors;
  }
}

const readToken = () => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const writeToken = (token: string | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage blocked */
  }
};

const qs = (params?: Record<string, string | number | undefined | null>) => {
  if (!params) return '';
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  });
  const str = search.toString();
  return str ? `?${str}` : '';
};

const unwrap = <T>(payload: unknown): T => {
  if (payload && typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)) {
    return (payload as { data: T }).data;
  }
  return payload as T;
};

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {}
): Promise<T> {
  const { method = 'GET', body, auth = true } = options;
  const token = auth ? readToken() : null;
  const url = `${laravelBaseUrl()}${PREFIX}${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: 'no-store',
    });
  } catch {
    throw new GmbqynApiError(0, 'Cannot reach the GMBQYN API. Check your connection.');
  }

  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const record = (payload ?? {}) as {
      message?: string;
      error?: string;
      errors?: Record<string, string[]>;
    };
    if (response.status === 401) writeToken(null);
    throw new GmbqynApiError(
      response.status,
      record.message || record.error || `Request failed (${response.status})`,
      record.errors
    );
  }

  return unwrap<T>(payload);
}

const patch = <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body });
const post = <T>(path: string, body?: unknown, auth = true) =>
  request<T>(path, { method: 'POST', body, auth });
const put = <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body });
const del = <T = null>(path: string) => request<T>(path, { method: 'DELETE' });

/**
 * Laravel/PHP adapter. Expects a token-authenticated JSON API rooted at
 * `{LARAVEL_URL}/api/v1` that returns a `{ data, message }` envelope —
 * see `gmbqyn/server/API.md` for the full endpoint contract.
 */
export const laravelService: GmbqynService = {
  mode: 'laravel',

  // ---- auth
  register: (payload: RegisterPayload) =>
    post<Session>('/auth/register', payload, false).then((session) => {
      writeToken(session.token);
      return session;
    }),
  login: (credentials: AuthCredentials) =>
    post<Session>('/auth/login', credentials, false).then((session) => {
      writeToken(session.token);
      return session;
    }),
  logout: async () => {
    try {
      await post<null>('/auth/logout');
    } finally {
      writeToken(null);
    }
  },
  me: () => request<Session>('/auth/me'),
  updateProfile: (payload) => patch<User>('/auth/profile', payload),
  changePassword: async (current, next) => {
    await post<null>('/auth/password', { current_password: current, password: next });
  },

  // ---- customer
  getCustomerDashboard: () => request<CustomerDashboard>('/customer/dashboard'),
  getBusiness: () => request<Business>('/customer/business'),
  updateBusiness: (payload: Partial<BusinessPayload>) => patch<Business>('/customer/business', payload),
  getReviewLink: () => request<ReviewLink>('/customer/review-link'),
  updateReviewLink: (payload) => patch<ReviewLink>('/customer/review-link', payload),
  resetReviewLink: () => post<ReviewLink>('/customer/review-link/reset'),
  listReviews: (params) => request<ListResult<Review>>(`/customer/reviews${qs(params)}`),
  createReview: (payload) => post<Review>('/customer/reviews', payload),
  updateReview: (id, payload) => patch<Review>(`/customer/reviews/${id}`, payload),
  deleteReview: (id) => del(`/customer/reviews/${id}`),
  listFeedback: (params) => request<ListResult<Feedback>>(`/customer/feedback${qs(params)}`),
  createFeedback: (payload) => post<Feedback>('/customer/feedback', payload),
  getAnalytics: (range) => request<BusinessAnalytics>(`/customer/analytics${qs({ range })}`),
  getGoogleProfile: () => request<GoogleProfile>('/customer/google'),
  connectGoogle: (payload) => post<GoogleProfile>('/customer/google/connect', payload),
  syncGoogle: () => post<{ synced: number; message: string }>('/customer/google/sync'),
  getSubscription: () => request<Subscription | null>('/customer/subscription'),
  requestPlanChange: (plan_code: string, billing_cycle: BillingCycle) =>
    post<Subscription>('/customer/subscription/change', { plan_code, billing_cycle }),
  cancelSubscription: (reason) => post<Subscription>('/customer/subscription/cancel', { reason }),
  getInvoices: () => request<ListResult<Payment>>('/customer/invoices'),

  // ---- public
  getPublicBusiness: (slug: string) => request<PublicBusiness>(`/public/businesses/${slug}`),
  submitPublicReview: (slug, payload) =>
    post<Review>(`/public/businesses/${slug}/reviews`, payload, false),

  // ---- master admin
  getAdminOverview: () => request<import('./types').AdminOverview>('/admin/overview'),
  getAdminAnalytics: (range) => request<AdminAnalytics>(`/admin/analytics${qs({ range })}`),
  listBusinesses: (params) => request<ListResult<Business>>(`/admin/businesses${qs(params)}`),
  updateBusinessStatus: (id, status: BusinessStatus) =>
    patch<Business>(`/admin/businesses/${id}/status`, { status }),
  deleteBusiness: (id) => del(`/admin/businesses/${id}`),
  listCustomers: (params) => request<ListResult<User>>(`/admin/customers${qs(params)}`),
  updateCustomerStatus: (id, status: UserStatus) => patch<User>(`/admin/customers/${id}/status`, { status }),
  deleteCustomer: (id) => del(`/admin/customers/${id}`),
  listSubscriptions: (params) => request<ListResult<Subscription>>(`/admin/subscriptions${qs(params)}`),
  createSubscription: (payload: SubscriptionPayload) => post<Subscription>('/admin/subscriptions', payload),
  updateSubscription: (id, payload) => patch<Subscription>(`/admin/subscriptions/${id}`, payload),
  cancelSubscriptionAsAdmin: (id, reason) => post<Subscription>(`/admin/subscriptions/${id}/cancel`, { reason }),
  renewSubscription: (id, months) => post<Subscription>(`/admin/subscriptions/${id}/renew`, { months }),
  listPayments: (params) => request<ListResult<Payment>>(`/admin/payments${qs(params)}`),
  createPayment: (payload: PaymentPayload) => post<Payment>('/admin/payments', payload),
  updatePaymentStatus: (id, status: PaymentStatus) => patch<Payment>(`/admin/payments/${id}/status`, { status }),
  deletePayment: (id) => del(`/admin/payments/${id}`),
  listAllReviews: (params) => request<ListResult<Review>>(`/admin/reviews${qs(params)}`),
  moderateReview: (id, status: ReviewStatus) => patch<Review>(`/admin/reviews/${id}/status`, { status }),
  listAllFeedback: (params) => request<ListResult<Feedback>>(`/admin/feedback${qs(params)}`),
  updateFeedbackStatus: (id, status: FeedbackStatus) => patch<Feedback>(`/admin/feedback/${id}/status`, { status }),
  deleteFeedback: (id) => del(`/admin/feedback/${id}`),
  getAdminAnalyticsSeries: () => request<import('./types').AnalyticsPoint[]>('/admin/series'),
  listPlans: () => request<Plan[]>('/admin/plans'),
  savePlan: (plan) => (plan.id ? put<Plan>(`/admin/plans/${plan.id}`, plan) : post<Plan>('/admin/plans', plan)),
  deletePlan: (id) => del(`/admin/plans/${id}`),
  getSettings: () => request<Settings>('/admin/settings'),
  updateSettings: (payload) => patch<Settings>('/admin/settings', payload),
  resetDemoData: () => post<void>('/admin/demo/reset'),
};

export { TOKEN_KEY };
