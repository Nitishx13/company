import { PLAN_BY_CODE } from './plans';
import { addDays, addMonths, daysUntil, percent, slugify } from './format';
import { DEMO_ADMIN, DEMO_CUSTOMER, buildSeedDb, loadDb, persistDb, resetDb, type MockDb } from './mock-data';
import { GmbqynApiError } from './api';
import type {
  AdminAnalytics,
  BusinessPayload,
  GmbqynService,
  PaymentPayload,
  PublicBusiness,
  SubscriptionPayload,
} from './service';
import type {
  AnalyticsPoint,
  Business,
  BusinessAnalytics,
  CustomerDashboard,
  Feedback,
  FeedbackStatus,
  GoogleProfile,
  ListResult,
  Payment,
  PaymentStatus,
  Plan,
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

const MOCK_PASSWORD = 'password';
const TOKEN_PREFIX = 'mock.';

const wait = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

const fail: (status: number, message: string, errors?: Record<string, string[]>) => never = (
  status,
  message,
  errors
) => {
  throw new GmbqynApiError(status, message, errors);
};

const readToken = () => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem('gmbqyn_token');
  } catch {
    return null;
  }
};

const userIdFromToken = (token: string | null): number => {
  if (!token || !token.startsWith(TOKEN_PREFIX)) return 0;
  return Number(token.slice(TOKEN_PREFIX.length).split('.')[0]) || 0;
};

const issueToken = (userId: number) => `${TOKEN_PREFIX}${userId}.${Date.now().toString(36)}`;

const nextId = (db: MockDb, key: 'review' | 'payment' | 'business') => {
  db.counters[key] = (db.counters[key] ?? 0) + 1;
  return db.counters[key];
};

const ratingBreakdown = (reviews: Review[]) =>
  [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((review) => review.rating === stars).length,
  }));

const averageRating = (reviews: Review[]) => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};

const monthStart = () => {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
};

const paginate = <T>(rows: T[], page = 1, perPage = 25): ListResult<T> => ({
  data: rows.slice((page - 1) * perPage, page * perPage),
  total: rows.length,
  page,
  per_page: perPage,
});

const publicOrigin = () => {
  if (typeof window === 'undefined') return 'https://pinaqyn.in';
  return window.location.origin;
};

const buildReviewLink = (business: Business, db: MockDb): ReviewLink => {
  const reviews = db.reviews.filter((review) => review.business_id === business.id);
  const series = db.series[String(business.id)] ?? [];
  const views = series.reduce((total, point) => total + point.views, 0);
  const clicks = series.reduce((total, point) => total + point.clicks, 0);
  const submissions = reviews.length;
  return {
    business_id: business.id,
    slug: business.slug,
    url: `${publicOrigin()}/gmbqyn/r/${business.slug}`,
    short_url: `gmbqyn.in/r/${business.slug}`,
    is_active: business.review_link_enabled,
    clicks,
    submissions,
    conversion_rate: clicks > 0 ? percent(submissions, clicks) : 0,
    created_at: business.created_at,
  };
};

const buildSession = (db: MockDb, user: User, token: string): Session => {
  const business = db.businesses.find((row) => row.user_id === user.id) ?? null;
  const subscription = business
    ? db.subscriptions.find((row) => row.business_id === business.id) ?? null
    : null;
  return {
    token,
    user,
    business,
    subscription: subscription ? { ...subscription, plan: db.plans.find((p) => p.id === subscription.plan_id) } : null,
  };
};

/**
 * Local-first adapter used until the Laravel API is deployed.
 *
 * NOTE: this is a development stand-in, not a security boundary. It stores
 * everything in `localStorage` and derives the signed-in user from a token
 * that is simply `mock.<user_id>.<random>`. Real enforcement belongs in the
 * Laravel API — see `gmbqyn/server/API.md`.
 */
export const mockService: GmbqynService = {
  mode: 'mock',

  // ---- auth --------------------------------------------------------------
  async register(payload) {
    await wait(420);
    const db = loadDb();
    const email = payload.email.trim().toLowerCase();
    if (db.users.some((user) => user.email.toLowerCase() === email)) {
      fail(422, 'This email is already registered.', { email: ['This email is already registered.'] });
    }
    if (!payload.business_name?.trim()) {
      fail(422, 'Business name is required.', { business_name: ['Business name is required.'] });
    }

    const user: User = {
      id: Math.max(...db.users.map((row) => row.id)) + 1,
      name: payload.name,
      email,
      phone: payload.phone || null,
      role: 'customer',
      status: 'active',
      avatar_url: null,
      created_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
    };
    db.users.push(user);

    const plan = PLAN_BY_CODE[payload.plan_code] ?? db.plans[0];
    const businessId = nextId(db, 'business');
    const slugBase = slugify(payload.business_name) || `business-${businessId}`;
    const business: Business = {
      id: businessId,
      user_id: user.id,
      name: payload.business_name,
      slug: db.businesses.some((row) => row.slug === slugBase) ? `${slugBase}-${businessId}` : slugBase,
      category: payload.category || 'Others',
      description: null,
      address: null,
      city: payload.city || null,
      state: payload.state || null,
      country: payload.country || 'India',
      phone: payload.phone || null,
      website: null,
      logo_url: null,
      google_place_id: null,
      google_review_url: null,
      rating: null,
      review_count: 0,
      status: 'active',
      review_link_enabled: true,
      created_at: new Date().toISOString(),
    };
    db.businesses.push(business);
    db.series[String(businessId)] = [];

    const nowIso = new Date().toISOString();
    const trialDays = db.settings.trial_days || 14;
    db.subscriptions.push({
      id: db.subscriptions.length + 1,
      business_id: businessId,
      plan_id: plan.id,
      plan,
      status: 'trial',
      billing_cycle: payload.billing_cycle,
      amount: payload.billing_cycle === 'yearly' ? plan.price_yearly : plan.price_monthly,
      started_at: nowIso,
      current_period_start: nowIso,
      current_period_end: addDays(nowIso, trialDays),
      cancelled_at: null,
      notes: 'Self-signup. Manual confirmation pending.',
      created_at: nowIso,
    });

    persistDb(db);
    const token = issueToken(user.id);
    if (typeof window !== 'undefined') window.localStorage.setItem('gmbqyn_token', token);
    return buildSession(db, user, token);
  },

  async login(credentials) {
    await wait(360);
    const db = loadDb();
    const email = credentials.email.trim().toLowerCase();
    const user = db.users.find((row) => row.email.toLowerCase() === email);
    if (!user || credentials.password !== MOCK_PASSWORD) {
      fail(401, 'Email or password is incorrect.');
    }
    if (user.status === 'suspended') fail(403, 'This account has been suspended. Contact support.');
    user.last_login_at = new Date().toISOString();
    persistDb(db);
    const token = issueToken(user.id);
    if (typeof window !== 'undefined') window.localStorage.setItem('gmbqyn_token', token);
    return buildSession(db, user, token);
  },

  async logout() {
    await wait(120);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem('gmbqyn_token');
      } catch {
        /* ignore */
      }
    }
  },

  async me() {
    await wait(140);
    const db = loadDb();
    const user = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (!user) fail(401, 'Your session has expired. Please sign in again.');
    return buildSession(db, user, readToken() ?? '');
  },

  async updateProfile(payload) {
    await wait(260);
    const db = loadDb();
    const user = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (!user) fail(401, 'Your session has expired. Please sign in again.');
    if (payload.name !== undefined) user.name = payload.name;
    if (payload.email !== undefined) user.email = payload.email;
    if (payload.phone !== undefined) user.phone = payload.phone;
    if (payload.avatar_url !== undefined) user.avatar_url = payload.avatar_url;
    if (payload.password) user.status = 'active';
    persistDb(db);
    return user;
  },

  async changePassword(current, next) {
    await wait(240);
    if (current !== MOCK_PASSWORD) fail(422, 'Current password is incorrect.');
    if (next.length < 8) fail(422, 'New password must be at least 8 characters.');
  },

  // ---- customer ----------------------------------------------------------
  async getCustomerDashboard() {
    await wait(320);
    const db = loadDb();
    const user = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (!user) fail(401, 'Your session has expired. Please sign in again.');
    const business = db.businesses.find((row) => row.user_id === user.id);
    if (!business) fail(404, 'No business is linked to this account yet.');

    const reviews = db.reviews.filter((row) => row.business_id === business.id);
    const subscriptionRow = db.subscriptions.find((row) => row.business_id === business.id) ?? null;
    const subscription = subscriptionRow
      ? { ...subscriptionRow, plan: db.plans.find((plan) => plan.id === subscriptionRow.plan_id) }
      : null;
    const reviewLink = buildReviewLink(business, db);
    const series = db.series[String(business.id)] ?? [];
    const thisMonth = reviews.filter((row) => row.created_at >= monthStart());
    const limit = subscription?.plan?.max_reviews_per_month ?? null;

    return {
      business,
      subscription,
      review_link: reviewLink,
      totals: {
        total_reviews: reviews.length,
        reviews_this_month: thisMonth.length,
        avg_rating: averageRating(reviews),
        pending_reviews: reviews.filter((row) => row.status === 'pending').length,
        link_views: series.reduce((total, point) => total + point.views, 0),
        qr_scans: reviews.filter((row) => row.source === 'qr').length,
        response_rate: percent(
          reviews.filter((row) => row.replied_at).length,
          reviews.length
        ),
      },
      rating_breakdown: ratingBreakdown(reviews),
      series,
      recent_reviews: [...reviews]
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
        .slice(0, 6),
      open_feedback: db.feedback.filter((row) => row.business_id === business.id && row.status !== 'resolved').length,
      plan_usage: {
        limit,
        used: thisMonth.length,
        percent: limit ? Math.min(100, percent(thisMonth.length, limit)) : 0,
      },
      days_to_renewal: subscription ? daysUntil(subscription.current_period_end) : 0,
    } satisfies CustomerDashboard;
  },

  async getBusiness() {
    await wait(180);
    const db = loadDb();
    const user = db.users.find((row) => row.id === userIdFromToken(readToken()));
    const business = db.businesses.find((row) => row.user_id === user?.id);
    if (!business) fail(404, 'No business is linked to this account yet.');
    return business;
  },

  async updateBusiness(payload: Partial<BusinessPayload>) {
    await wait(300);
    const db = loadDb();
    const user = db.users.find((row) => row.id === userIdFromToken(readToken()));
    const business = db.businesses.find((row) => row.user_id === user?.id);
    if (!business) fail(404, 'No business is linked to this account yet.');
    if (payload.name) business.name = payload.name;
    if (payload.slug) {
      const next = slugify(payload.slug);
      if (!next) fail(422, 'Slug cannot be empty.');
      if (db.businesses.some((row) => row.slug === next && row.id !== business.id)) {
        fail(422, 'That review link is already taken.');
      }
      business.slug = next;
    }
    (['category', 'description', 'address', 'city', 'state', 'country', 'phone', 'website', 'google_place_id', 'google_review_url'] as const).forEach(
      (key) => {
        const value = payload[key];
        if (value !== undefined) {
          (business as unknown as Record<string, unknown>)[key] = value;
        }
      }
    );
    persistDb(db);
    return business;
  },

  async getReviewLink() {
    await wait(200);
    const db = loadDb();
    const user = db.users.find((row) => row.id === userIdFromToken(readToken()));
    const business = db.businesses.find((row) => row.user_id === user?.id);
    if (!business) fail(404, 'No business is linked to this account yet.');
    return buildReviewLink(business, db);
  },

  async updateReviewLink(payload) {
    await wait(260);
    const db = loadDb();
    const user = db.users.find((row) => row.id === userIdFromToken(readToken()));
    const business = db.businesses.find((row) => row.user_id === user?.id);
    if (!business) fail(404, 'No business is linked to this account yet.');
    if (payload.slug !== undefined) {
      const next = slugify(payload.slug);
      if (next) business.slug = next;
    }
    business.review_link_enabled = payload.is_active;
    persistDb(db);
    return buildReviewLink(business, db);
  },

  async resetReviewLink() {
    await wait(260);
    const db = loadDb();
    const user = db.users.find((row) => row.id === userIdFromToken(readToken()));
    const business = db.businesses.find((row) => row.user_id === user?.id);
    if (!business) fail(404, 'No business is linked to this account yet.');
    const base = slugify(business.name) || 'business';
    let candidate = base;
    let suffix = 1;
    while (db.businesses.some((row) => row.slug === candidate && row.id !== business.id)) {
      suffix += 1;
      candidate = `${base}-${suffix}`;
    }
    business.slug = candidate;
    db.series[String(business.id)] = [];
    persistDb(db);
    return buildReviewLink(business, db);
  },

  async listReviews(params) {
    await wait(240);
    const db = loadDb();
    const user = db.users.find((row) => row.id === userIdFromToken(readToken()));
    const business = db.businesses.find((row) => row.user_id === user?.id);
    if (!business) fail(404, 'No business is linked to this account yet.');
    let rows = db.reviews.filter((row) => row.business_id === business.id);
    if (params?.status && params.status !== 'all') rows = rows.filter((row) => row.status === params.status);
    if (params?.q) {
      const q = params.q.toLowerCase();
      rows = rows.filter(
        (row) =>
          row.customer_name.toLowerCase().includes(q) ||
          (row.comment ?? '').toLowerCase().includes(q) ||
          (row.title ?? '').toLowerCase().includes(q)
      );
    }
    rows = [...rows].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    return paginate(rows, 1, 50);
  },

  async createReview(payload) {
    await wait(280);
    const db = loadDb();
    const user = db.users.find((row) => row.id === userIdFromToken(readToken()));
    const business = db.businesses.find((row) => row.user_id === user?.id);
    if (!business) fail(404, 'No business is linked to this account yet.');
    if (!payload.customer_name?.trim()) fail(422, 'Customer name is required.');
    const review: Review = {
      id: nextId(db, 'review'),
      business_id: business.id,
      business_name: business.name,
      customer_name: payload.customer_name,
      customer_email: payload.customer_email ?? null,
      customer_phone: payload.customer_phone ?? null,
      rating: payload.rating,
      title: payload.title ?? null,
      comment: payload.comment ?? null,
      source: payload.source ?? 'manual',
      status: 'approved',
      replied_at: null,
      reply_text: null,
      is_public: payload.rating >= 3,
      created_at: new Date().toISOString(),
    };
    db.reviews.unshift(review);
    business.review_count = (business.review_count ?? 0) + 1;
    const all = db.reviews.filter((row) => row.business_id === business.id);
    business.rating = averageRating(all);
    persistDb(db);
    return review;
  },

  async updateReview(id, payload) {
    await wait(240);
    const db = loadDb();
    const review = db.reviews.find((row) => row.id === id);
    if (!review) fail(404, 'Review not found.');
    if (payload.status !== undefined) review.status = payload.status;
    if (payload.is_public !== undefined) review.is_public = payload.is_public;
    if (payload.title !== undefined) review.title = payload.title;
    if (payload.comment !== undefined) review.comment = payload.comment;
    if (payload.rating !== undefined) review.rating = payload.rating;
    if (payload.reply_text !== undefined) {
      review.reply_text = payload.reply_text;
      review.replied_at = payload.reply_text ? new Date().toISOString() : null;
    }
    persistDb(db);
    return review;
  },

  async deleteReview(id) {
    await wait(200);
    const db = loadDb();
    const index = db.reviews.findIndex((row) => row.id === id);
    if (index === -1) fail(404, 'Review not found.');
    db.reviews.splice(index, 1);
    persistDb(db);
  },

  async listFeedback(params) {
    await wait(220);
    const db = loadDb();
    const user = db.users.find((row) => row.id === userIdFromToken(readToken()));
    const business = db.businesses.find((row) => row.user_id === user?.id);
    if (!business) fail(404, 'No business is linked to this account yet.');
    let rows = db.feedback.filter((row) => row.business_id === business.id);
    if (params?.status && params.status !== 'all') rows = rows.filter((row) => row.status === params.status);
    return paginate([...rows].sort((a, b) => (a.created_at < b.created_at ? 1 : -1)));
  },

  async createFeedback(payload) {
    await wait(220);
    const db = loadDb();
    const user = db.users.find((row) => row.id === userIdFromToken(readToken()));
    const business = db.businesses.find((row) => row.user_id === user?.id);
    if (!business) fail(404, 'No business is linked to this account yet.');
    const feedback: Feedback = {
      id: db.feedback.length + 1,
      business_id: business.id,
      business_name: business.name,
      name: payload.name,
      email: payload.email ?? null,
      category: payload.category ?? 'General',
      message: payload.message,
      status: 'new',
      created_at: new Date().toISOString(),
    };
    db.feedback.unshift(feedback);
    persistDb(db);
    return feedback;
  },

  async getAnalytics(range) {
    await wait(300);
    const db = loadDb();
    const user = db.users.find((row) => row.id === userIdFromToken(readToken()));
    const business = db.businesses.find((row) => row.user_id === user?.id);
    if (!business) fail(404, 'No business is linked to this account yet.');
    const reviews = db.reviews.filter((row) => row.business_id === business.id);
    const months = range === '90d' ? 3 : range === '7d' ? 1 : 6;
    const series = (db.series[String(business.id)] ?? []).slice(-months);
    const link = buildReviewLink(business, db);
    const sources = (['qr', 'link', 'manual', 'import'] as const).map((source) => ({
      source,
      count: reviews.filter((row) => row.source === source).length,
    }));
    return {
      business,
      range,
      totals: {
        link_views: series.reduce((total, point) => total + point.views, 0),
        qr_scans: reviews.filter((row) => row.source === 'qr').length,
        reviews: reviews.length,
        avg_rating: averageRating(reviews),
        pending_reviews: reviews.filter((row) => row.status === 'pending').length,
        conversion_rate: link.conversion_rate,
      },
      rating_breakdown: ratingBreakdown(reviews),
      series,
      sources,
    } satisfies BusinessAnalytics;
  },

  async getGoogleProfile() {
    await wait(280);
    const db = loadDb();
    const user = db.users.find((row) => row.id === userIdFromToken(readToken()));
    const business = db.businesses.find((row) => row.user_id === user?.id);
    if (!business) fail(404, 'No business is linked to this account yet.');
    const reviews = db.reviews.filter((row) => row.business_id === business.id);
    return {
      connected: Boolean(business.google_place_id),
      place_id: business.google_place_id,
      name: business.google_place_id ? business.name : null,
      rating: business.rating,
      review_count: business.review_count,
      review_url: business.google_review_url,
      last_synced_at: business.google_place_id ? addDays(new Date().toISOString(), -1) : null,
      sync_log: business.google_place_id
        ? [
            { at: addDays(new Date().toISOString(), -1), added: 2, message: 'Imported 2 Google reviews.' },
            { at: addDays(new Date().toISOString(), -6), added: 0, message: 'No new reviews found.' },
            { at: addDays(new Date().toISOString(), -12), added: 4, message: 'Imported 4 Google reviews.' },
          ]
        : [],
      pending_reviews: reviews.filter((row) => row.rating <= 2 && row.status !== 'rejected'),
      perks: [
        'Pull fresh ratings from your Google Business Profile',
        'Import existing Google reviews into one inbox',
        'Send customers straight to the Google review form',
        'Keep the GMBQYN rating and the Google rating in sync',
      ],
    } satisfies GoogleProfile;
  },

  async connectGoogle(payload) {
    await wait(340);
    const db = loadDb();
    const user = db.users.find((row) => row.id === userIdFromToken(readToken()));
    const business = db.businesses.find((row) => row.user_id === user?.id);
    if (!business) fail(404, 'No business is linked to this account yet.');
    business.google_place_id = payload.place_id;
    business.google_review_url = payload.review_url ?? business.google_review_url;
    persistDb(db);
    return mockService.getGoogleProfile();
  },

  async syncGoogle() {
    await wait(520);
    const db = loadDb();
    const user = db.users.find((row) => row.id === userIdFromToken(readToken()));
    const business = db.businesses.find((row) => row.user_id === user?.id);
    if (!business?.google_place_id) fail(422, 'Connect your Google Business Profile first.');
    return { synced: 2, message: 'Imported 2 new Google reviews.' };
  },

  async getSubscription() {
    await wait(200);
    const db = loadDb();
    const user = db.users.find((row) => row.id === userIdFromToken(readToken()));
    const business = db.businesses.find((row) => row.user_id === user?.id);
    if (!business) fail(404, 'No business is linked to this account yet.');
    const row = db.subscriptions.find((item) => item.business_id === business.id);
    if (!row) return null;
    return { ...row, plan: db.plans.find((plan) => plan.id === row.plan_id) };
  },

  async requestPlanChange(plan_code, billing_cycle) {
    await wait(360);
    const db = loadDb();
    const user = db.users.find((row) => row.id === userIdFromToken(readToken()));
    const business = db.businesses.find((row) => row.user_id === user?.id);
    if (!business) fail(404, 'No business is linked to this account yet.');
    const plan = db.plans.find((row) => row.code === plan_code);
    if (!plan) fail(422, 'That plan is not available.');
    let row = db.subscriptions.find((item) => item.business_id === business.id);
    const nowIso = new Date().toISOString();
    if (!row) {
      row = {
        id: db.subscriptions.length + 1,
        business_id: business.id,
        plan_id: plan.id,
        status: 'trial',
        billing_cycle,
        amount: billing_cycle === 'yearly' ? plan.price_yearly : plan.price_monthly,
        started_at: nowIso,
        current_period_start: nowIso,
        current_period_end: addDays(nowIso, db.settings.trial_days),
        cancelled_at: null,
        notes: null,
        created_at: nowIso,
      };
      db.subscriptions.push(row);
    } else {
      row.plan_id = plan.id;
      row.billing_cycle = billing_cycle;
      row.amount = billing_cycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
      row.notes = 'Plan change requested. Awaiting manual confirmation from the team.';
    }
    persistDb(db);
    return { ...row, plan };
  },

  async cancelSubscription(reason) {
    await wait(320);
    const db = loadDb();
    const user = db.users.find((row) => row.id === userIdFromToken(readToken()));
    const business = db.businesses.find((row) => row.user_id === user?.id);
    if (!business) fail(404, 'No business is linked to this account yet.');
    const row = db.subscriptions.find((item) => item.business_id === business.id);
    if (!row) fail(404, 'No active subscription found.');
    row.status = 'cancelled';
    row.cancelled_at = new Date().toISOString();
    row.notes = reason || 'Cancelled by customer.';
    persistDb(db);
    return { ...row, plan: db.plans.find((plan) => plan.id === row.plan_id) };
  },

  async getInvoices() {
    await wait(220);
    const db = loadDb();
    const user = db.users.find((row) => row.id === userIdFromToken(readToken()));
    const business = db.businesses.find((row) => row.user_id === user?.id);
    if (!business) fail(404, 'No business is linked to this account yet.');
    const rows = db.payments
      .filter((row) => row.business_id === business.id)
      .sort((a, b) => (a.paid_on < b.paid_on ? 1 : -1));
    return paginate(rows, 1, 50);
  },

  // ---- public review page ------------------------------------------------
  async getPublicBusiness(slug) {
    await wait(300);
    const db = loadDb();
    const business = db.businesses.find((row) => row.slug === slug);
    if (!business) fail(404, 'We could not find that business.');
    if (business.status === 'suspended') fail(403, 'This review page is temporarily unavailable.');
    const reviews = db.reviews.filter((row) => row.business_id === business.id && row.is_public);
    const series = db.series[String(business.id)] ?? [];
    const link = buildReviewLink(business, db);
    const views = series.reduce((total, point) => total + point.views, 0) + 1;
    const clicks = series.reduce((total, point) => total + point.clicks, 0) + 1;
    db.series[String(business.id)] = [
      ...series.slice(0, -1),
      {
        label: series[series.length - 1]?.label ?? 'Now',
        views,
        clicks,
        submissions: reviews.length,
      },
    ];
    persistDb(db);
    return {
      business,
      review_link: link,
      rating_breakdown: ratingBreakdown(reviews),
      recent_reviews: [...reviews]
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
        .slice(0, 6),
    } satisfies PublicBusiness;
  },

  async submitPublicReview(slug, payload) {
    await wait(480);
    const db = loadDb();
    const business = db.businesses.find((row) => row.slug === slug);
    if (!business) fail(404, 'We could not find that business.');
    if (!business.review_link_enabled) fail(403, 'This business is not accepting reviews right now.');
    if (!payload.customer_name?.trim()) fail(422, 'Please tell us your name.');
    if (payload.rating < 1 || payload.rating > 5) fail(422, 'Please pick a rating.');

    const review: Review = {
      id: nextId(db, 'review'),
      business_id: business.id,
      business_name: business.name,
      customer_name: payload.customer_name,
      customer_email: payload.customer_email ?? null,
      customer_phone: null,
      rating: payload.rating,
      title: payload.title ?? null,
      comment: payload.comment ?? null,
      source: 'link',
      status: payload.rating <= 2 ? 'flagged' : 'approved',
      replied_at: null,
      reply_text: null,
      is_public: payload.rating >= 3,
      created_at: new Date().toISOString(),
    };
    db.reviews.unshift(review);
    business.review_count = (business.review_count ?? 0) + 1;
    business.rating = averageRating(db.reviews.filter((row) => row.business_id === business.id));
    persistDb(db);
    return review;
  },

  // ---- master admin ------------------------------------------------------
  async getAdminOverview() {
    await wait(340);
    const db = loadDb();
    const admin = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (admin?.role !== 'admin') fail(403, 'Master admin access required.');

    const activeSubscriptions = db.subscriptions.filter((row) => row.status === 'active' || row.status === 'trial');
    const mrr = activeSubscriptions.reduce((total, row) => {
      if (row.billing_cycle === 'yearly') return total + Math.round(row.amount / 12);
      return total + row.amount;
    }, 0);
    const monthStartIso = monthStart();

    return {
      totals: {
        businesses: db.businesses.length,
        active_businesses: db.businesses.filter((row) => row.status === 'active').length,
        customers: db.users.filter((row) => row.role === 'customer').length,
        active_subscriptions: activeSubscriptions.length,
        mrr,
        collected_this_month: db.payments
          .filter((row) => row.status === 'verified' && row.paid_on >= monthStartIso)
          .reduce((total, row) => total + row.amount, 0),
        pending_payments: db.payments.filter((row) => row.status === 'pending').length,
        reviews: db.reviews.length,
        open_feedback: db.feedback.filter((row) => row.status !== 'resolved').length,
      },
      mrr_series: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((label, index) => ({
        label,
        value: Math.round(mrr * (0.62 + index * 0.08)),
      })),
      plan_split: db.plans.map((plan) => {
        const rows = activeSubscriptions.filter((row) => row.plan_id === plan.id);
        return {
          plan: plan.name,
          businesses: rows.length,
          revenue: rows.reduce((total, row) => total + row.amount, 0),
        };
      }),
      expiring_soon: db.subscriptions
        .filter((row) => {
          const left = daysUntil(row.current_period_end);
          return (row.status === 'active' || row.status === 'trial' || row.status === 'past_due') && left <= 15;
        })
        .sort((a, b) => (a.current_period_end > b.current_period_end ? 1 : -1))
        .slice(0, 6)
        .map((row) => ({ ...row, plan: db.plans.find((plan) => plan.id === row.plan_id) })),
      recent_reviews: [...db.reviews]
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
        .slice(0, 6),
      recent_payments: [...db.payments]
        .sort((a, b) => (a.paid_on < b.paid_on ? 1 : -1))
        .slice(0, 6),
    };
  },

  async getAdminAnalytics(range) {
    await wait(360);
    const db = loadDb();
    const admin = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (admin?.role !== 'admin') fail(403, 'Master admin access required.');
    const months = range === '90d' ? 3 : range === '7d' ? 1 : 6;
    const labels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].slice(-months);
    const active = db.subscriptions.filter((row) => row.status === 'active' || row.status === 'trial');
    const mrr = active.reduce(
      (total, row) => total + (row.billing_cycle === 'yearly' ? Math.round(row.amount / 12) : row.amount),
      0
    );
    const collected = db.payments
      .filter((row) => row.status === 'verified')
      .reduce((total, row) => total + row.amount, 0);

    return {
      range,
      totals: {
        mrr,
        arr: mrr * 12,
        collected,
        outstanding: db.payments
          .filter((row) => row.status === 'pending')
          .reduce((total, row) => total + row.amount, 0),
        churned: db.subscriptions.filter((row) => row.status === 'cancelled').length,
        new_businesses: db.businesses.filter((row) => {
          const created = new Date(row.created_at).getTime();
          return created > new Date(now30()).getTime();
        }).length,
      },
      mrr_series: labels.map((label, index) => ({ label, value: Math.round(mrr * (0.62 + index * 0.08)) })),
      revenue_series: labels.map((label, index) => ({
        label,
        value: Math.round((collected / 6) * (0.7 + index * 0.09)),
      })),
      churn_series: labels.map((label, index) => ({ label, value: Math.max(0, 2 - index % 3) })),
      category_split: db.plans.map((plan) => {
        const rows = active.filter((row) => row.plan_id === plan.id);
        return {
          category: plan.name,
          businesses: rows.length,
          mrr: rows.reduce(
            (total, row) => total + (row.billing_cycle === 'yearly' ? Math.round(row.amount / 12) : row.amount),
            0
          ),
        };
      }),
      top_businesses: db.businesses
        .map((business) => {
          const rows = db.reviews.filter((row) => row.business_id === business.id);
          const sub = db.subscriptions.find((row) => row.business_id === business.id);
          const plan = db.plans.find((row) => row.id === sub?.plan_id);
          return {
            name: business.name,
            mrr: sub && plan ? (sub.billing_cycle === 'yearly' ? Math.round(sub.amount / 12) : sub.amount) : 0,
            reviews: rows.length,
            rating: averageRating(rows),
          };
        })
        .sort((a, b) => b.mrr - a.mrr)
        .slice(0, 6),
    } satisfies AdminAnalytics;
  },

  async listBusinesses(params) {
    await wait(280);
    const admin = loadDb().users.find((row) => row.id === userIdFromToken(readToken()));
    if (admin?.role !== 'admin') fail(403, 'Master admin access required.');
    const db = loadDb();
    let rows = [...db.businesses];
    if (params?.status && params.status !== 'all') rows = rows.filter((row) => row.status === params.status);
    if (params?.q) {
      const q = params.q.toLowerCase();
      rows = rows.filter(
        (row) =>
          row.name.toLowerCase().includes(q) ||
          row.city?.toLowerCase().includes(q) ||
          row.category.toLowerCase().includes(q)
      );
    }
    return paginate(rows.sort((a, b) => (a.created_at < b.created_at ? 1 : -1)));
  },

  async updateBusinessStatus(id, status) {
    await wait(240);
    const db = loadDb();
    const admin = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (admin?.role !== 'admin') fail(403, 'Master admin access required.');
    const business = db.businesses.find((row) => row.id === id);
    if (!business) fail(404, 'Business not found.');
    business.status = status;
    business.review_link_enabled = status === 'active';
    persistDb(db);
    return business;
  },

  async deleteBusiness(id) {
    await wait(240);
    const db = loadDb();
    const admin = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (admin?.role !== 'admin') fail(403, 'Master admin access required.');
    db.businesses = db.businesses.filter((row) => row.id !== id);
    db.reviews = db.reviews.filter((row) => row.business_id !== id);
    db.subscriptions = db.subscriptions.filter((row) => row.business_id !== id);
    db.payments = db.payments.filter((row) => row.business_id !== id);
    delete db.series[String(id)];
    persistDb(db);
  },

  async listCustomers(params) {
    await wait(260);
    const db = loadDb();
    const admin = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (admin?.role !== 'admin') fail(403, 'Master admin access required.');
    let rows = db.users.filter((row) => row.role === 'customer');
    if (params?.status && params.status !== 'all') rows = rows.filter((row) => row.status === params.status);
    if (params?.q) {
      const q = params.q.toLowerCase();
      rows = rows.filter(
        (row) => row.name.toLowerCase().includes(q) || row.email.toLowerCase().includes(q)
      );
    }
    return paginate(
      rows.map((user) => {
        const business = db.businesses.find((row) => row.user_id === user.id);
        return { ...user, business_name: business?.name ?? null } as User;
      })
    );
  },

  async updateCustomerStatus(id, status) {
    await wait(220);
    const db = loadDb();
    const admin = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (admin?.role !== 'admin') fail(403, 'Master admin access required.');
    const user = db.users.find((row) => row.id === id);
    if (!user) fail(404, 'Customer not found.');
    user.status = status;
    persistDb(db);
    return user;
  },

  async deleteCustomer(id) {
    await wait(220);
    const db = loadDb();
    const admin = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (admin?.role !== 'admin') fail(403, 'Master admin access required.');
    db.users = db.users.filter((row) => row.id !== id);
    persistDb(db);
  },

  async listSubscriptions(params) {
    await wait(280);
    const db = loadDb();
    const admin = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (admin?.role !== 'admin') fail(403, 'Master admin access required.');
    let rows = db.subscriptions.map((row) => ({
      ...row,
      plan: db.plans.find((plan) => plan.id === row.plan_id),
      business_name: db.businesses.find((business) => business.id === row.business_id)?.name ?? '—',
    }));
    if (params?.status && params.status !== 'all') rows = rows.filter((row) => row.status === params.status);
    if (params?.q) {
      const q = params.q.toLowerCase();
      rows = rows.filter((row) => row.business_name.toLowerCase().includes(q));
    }
    return paginate(rows);
  },

  async createSubscription(payload: SubscriptionPayload) {
    await wait(300);
    const db = loadDb();
    const admin = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (admin?.role !== 'admin') fail(403, 'Master admin access required.');
    const plan = db.plans.find((row) => row.id === payload.plan_id);
    if (!plan) fail(422, 'Select a valid plan.');
    const row: Subscription = {
      id: db.subscriptions.length + 1,
      business_id: payload.business_id,
      plan_id: plan.id,
      plan,
      status: payload.status,
      billing_cycle: payload.billing_cycle,
      amount: payload.amount,
      started_at: payload.current_period_start,
      current_period_start: payload.current_period_start,
      current_period_end: payload.current_period_end,
      cancelled_at: null,
      notes: payload.notes ?? 'Created manually by master admin.',
      created_at: new Date().toISOString(),
    };
    db.subscriptions.push(row);
    persistDb(db);
    return row;
  },

  async updateSubscription(id, payload) {
    await wait(260);
    const db = loadDb();
    const admin = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (admin?.role !== 'admin') fail(403, 'Master admin access required.');
    const row = db.subscriptions.find((item) => item.id === id);
    if (!row) fail(404, 'Subscription not found.');
    if (payload.plan_id !== undefined) row.plan_id = payload.plan_id;
    if (payload.status !== undefined) row.status = payload.status;
    if (payload.billing_cycle !== undefined) row.billing_cycle = payload.billing_cycle;
    if (payload.amount !== undefined) row.amount = payload.amount;
    if (payload.current_period_start !== undefined) row.current_period_start = payload.current_period_start;
    if (payload.current_period_end !== undefined) row.current_period_end = payload.current_period_end;
    if (payload.notes !== undefined) row.notes = payload.notes;
    const plan = db.plans.find((item) => item.id === row.plan_id);
    persistDb(db);
    return { ...row, plan };
  },

  async cancelSubscriptionAsAdmin(id, reason) {
    await wait(240);
    const db = loadDb();
    const admin = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (admin?.role !== 'admin') fail(403, 'Master admin access required.');
    const row = db.subscriptions.find((item) => item.id === id);
    if (!row) fail(404, 'Subscription not found.');
    row.status = 'cancelled';
    row.cancelled_at = new Date().toISOString();
    row.notes = reason || 'Cancelled by master admin.';
    const business = db.businesses.find((item) => item.id === row.business_id);
    if (business) business.status = 'suspended';
    persistDb(db);
    return { ...row, plan: db.plans.find((plan) => plan.id === row.plan_id) };
  },

  async renewSubscription(id, months) {
    await wait(280);
    const db = loadDb();
    const admin = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (admin?.role !== 'admin') fail(403, 'Master admin access required.');
    const row = db.subscriptions.find((item) => item.id === id);
    if (!row) fail(404, 'Subscription not found.');
    const base = new Date(row.current_period_end) > new Date() ? row.current_period_end : new Date().toISOString();
    row.current_period_start = new Date().toISOString();
    row.current_period_end = addMonths(base, months);
    row.status = 'active';
    const business = db.businesses.find((item) => item.id === row.business_id);
    if (business && business.status === 'suspended') business.status = 'active';
    persistDb(db);
    return { ...row, plan: db.plans.find((plan) => plan.id === row.plan_id) };
  },

  async listPayments(params) {
    await wait(280);
    const db = loadDb();
    const admin = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (admin?.role !== 'admin') fail(403, 'Master admin access required.');
    let rows = db.payments;
    if (params?.status && params.status !== 'all') rows = rows.filter((row) => row.status === params.status);
    if (params?.q) {
      const q = params.q.toLowerCase();
      rows = rows.filter(
        (row) =>
          row.business_name?.toLowerCase().includes(q) ||
          row.reference?.toLowerCase().includes(q)
      );
    }
    return paginate([...rows].sort((a, b) => (a.paid_on < b.paid_on ? 1 : -1)));
  },

  async createPayment(payload: PaymentPayload) {
    await wait(280);
    const db = loadDb();
    const admin = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (admin?.role !== 'admin') fail(403, 'Master admin access required.');
    const business = db.businesses.find((row) => row.id === payload.business_id);
    if (!business) fail(422, 'Select a valid business.');
    const row: Payment = {
      id: nextId(db, 'payment'),
      subscription_id: payload.subscription_id ?? null,
      business_id: business.id,
      business_name: business.name,
      amount: payload.amount,
      method: payload.method,
      reference: payload.reference ?? null,
      status: 'verified',
      paid_on: payload.paid_on,
      recorded_by: admin.id,
      note: payload.note ?? null,
      created_at: new Date().toISOString(),
    };
    db.payments.unshift(row);
    const subscription = db.subscriptions.find((item) => item.id === payload.subscription_id);
    if (subscription && subscription.status !== 'cancelled') subscription.status = 'active';
    persistDb(db);
    return row;
  },

  async updatePaymentStatus(id, status) {
    await wait(220);
    const db = loadDb();
    const admin = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (admin?.role !== 'admin') fail(403, 'Master admin access required.');
    const row = db.payments.find((item) => item.id === id);
    if (!row) fail(404, 'Payment not found.');
    row.status = status;
    if (status === 'verified') {
      const subscription = db.subscriptions.find((item) => item.id === row.subscription_id);
      if (subscription) subscription.status = 'active';
    }
    persistDb(db);
    return row;
  },

  async deletePayment(id) {
    await wait(200);
    const db = loadDb();
    const admin = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (admin?.role !== 'admin') fail(403, 'Master admin access required.');
    db.payments = db.payments.filter((row) => row.id !== id);
    persistDb(db);
  },

  async listAllReviews(params) {
    await wait(280);
    const db = loadDb();
    const admin = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (admin?.role !== 'admin') fail(403, 'Master admin access required.');
    let rows = db.reviews;
    if (params?.status && params.status !== 'all') rows = rows.filter((row) => row.status === params.status);
    if (params?.q) {
      const q = params.q.toLowerCase();
      rows = rows.filter(
        (row) =>
          row.customer_name.toLowerCase().includes(q) ||
          row.business_name?.toLowerCase().includes(q) ||
          (row.comment ?? '').toLowerCase().includes(q)
      );
    }
    return paginate([...rows].sort((a, b) => (a.created_at < b.created_at ? 1 : -1)));
  },

  async moderateReview(id, status) {
    await wait(220);
    const db = loadDb();
    const admin = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (admin?.role !== 'admin') fail(403, 'Master admin access required.');
    const row = db.reviews.find((item) => item.id === id);
    if (!row) fail(404, 'Review not found.');
    row.status = status;
    row.is_public = status === 'approved' && row.rating >= 3;
    persistDb(db);
    return row;
  },

  async listAllFeedback(params) {
    await wait(260);
    const db = loadDb();
    const admin = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (admin?.role !== 'admin') fail(403, 'Master admin access required.');
    let rows = db.feedback;
    if (params?.status && params.status !== 'all') rows = rows.filter((row) => row.status === params.status);
    return paginate([...rows].sort((a, b) => (a.created_at < b.created_at ? 1 : -1)));
  },

  async updateFeedbackStatus(id, status) {
    await wait(200);
    const db = loadDb();
    const admin = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (admin?.role !== 'admin') fail(403, 'Master admin access required.');
    const row = db.feedback.find((item) => item.id === id);
    if (!row) fail(404, 'Feedback not found.');
    row.status = status;
    persistDb(db);
    return row;
  },

  async deleteFeedback(id) {
    await wait(200);
    const db = loadDb();
    const admin = db.users.find((row) => row.id === userIdFromToken(readToken()));
    if (admin?.role !== 'admin') fail(403, 'Master admin access required.');
    db.feedback = db.feedback.filter((row) => row.id !== id);
    persistDb(db);
  },

  async getAdminAnalyticsSeries() {
    await wait(200);
    const db = loadDb();
    return ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((label, index) => ({
      label,
      views: 900 + index * 220,
      submissions: 150 + index * 38,
      clicks: 380 + index * 90,
    })) satisfies AnalyticsPoint[];
  },

  async listPlans() {
    await wait(220);
    return loadDb().plans;
  },

  async savePlan(plan) {
    await wait(280);
    const db = loadDb();
    if (plan.id) {
      const index = db.plans.findIndex((row) => row.id === plan.id);
      if (index === -1) fail(404, 'Plan not found.');
      db.plans[index] = { ...db.plans[index], ...plan } as Plan;
      persistDb(db);
      return db.plans[index];
    }
    const created: Plan = {
      id: db.plans.length + 1,
      code: (plan.code || plan.name).toLowerCase().replace(/\s+/g, '-'),
      name: plan.name,
      tagline: plan.tagline ?? '',
      price_monthly: plan.price_monthly ?? 0,
      price_yearly: plan.price_yearly ?? 0,
      currency: plan.currency ?? 'INR',
      review_link_enabled: plan.review_link_enabled ?? true,
      qr_enabled: plan.qr_enabled ?? true,
      qr_custom_branding: plan.qr_custom_branding ?? false,
      feedback_enabled: plan.feedback_enabled ?? false,
      analytics_enabled: plan.analytics_enabled ?? false,
      google_sync: plan.google_sync ?? false,
      max_reviews_per_month: plan.max_reviews_per_month ?? null,
      seats: plan.seats ?? 1,
      sort_order: plan.sort_order ?? db.plans.length + 1,
      is_active: plan.is_active ?? true,
      features: plan.features ?? [],
    };
    db.plans.push(created);
    persistDb(db);
    return created;
  },

  async deletePlan(id) {
    await wait(220);
    const db = loadDb();
    const inUse = db.subscriptions.some((row) => row.plan_id === id);
    if (inUse) fail(422, 'This plan is used by active subscriptions. Deactivate it instead.');
    db.plans = db.plans.filter((row) => row.id !== id);
    persistDb(db);
  },

  async getSettings() {
    await wait(180);
    return loadDb().settings;
  },

  async updateSettings(payload) {
    await wait(240);
    const db = loadDb();
    db.settings = { ...db.settings, ...payload };
    persistDb(db);
    return db.settings;
  },

  async resetDemoData() {
    await wait(400);
    const db = resetDb();
    return void db;
  },
};

function now30() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString();
}

export const MOCK_ACCOUNTS = {
  customer: { ...DEMO_CUSTOMER, label: 'Customer login' },
  admin: { ...DEMO_ADMIN, label: 'Master admin login' },
};

export { buildSeedDb };
