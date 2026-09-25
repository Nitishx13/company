import { PLAN_CATALOGUE } from './plans';
import type {
  Business,
  Feedback,
  Payment,
  Plan,
  Review,
  Settings,
  Subscription,
  User,
} from './types';
import type { AnalyticsPoint } from './types';

export interface MockDb {
  users: User[];
  businesses: Business[];
  plans: Plan[];
  subscriptions: Subscription[];
  payments: Payment[];
  reviews: Review[];
  feedback: Feedback[];
  settings: Settings;
  series: Record<string, AnalyticsPoint[]>;
  counters: Record<string, number>;
}

const DB_KEY = 'gmbqyn_db_v1';

export const DEMO_CUSTOMER = { email: 'customer@gmbqyn.in', password: 'password' };
export const DEMO_ADMIN = { email: 'admin@gmbqyn.in', password: 'password' };

const now = Date.now();
const iso = (daysAgo: number, hour = 10) => {
  const date = new Date(now - daysAgo * 86400000);
  date.setHours(hour, (daysAgo * 7) % 60, 0, 0);
  return date.toISOString();
};
const ahead = (days: number) => new Date(now + days * 86400000).toISOString();

const SEED_BUSINESSES: Array<Omit<Business, 'id' | 'user_id' | 'created_at'> & { user_id?: number }> = [
  {
    name: 'Kanha Sweets & Biryani',
    slug: 'kanha-sweets-biryani',
    category: 'Restaurant',
    description: 'Pure veg thali, sweets and dum biryani since 1994. Two outlets in Nashik.',
    address: '12, Gangotri Park, College Road',
    city: 'Nashik',
    state: 'Maharashtra',
    country: 'India',
    phone: '+91 98220 11455',
    website: 'https://kanhasweets.in',
    logo_url: null,
    google_place_id: 'ChIJN8kanhaNashik',
    google_review_url: 'https://g.page/kanha-sweets',
    rating: 4.6,
    review_count: 218,
    status: 'active',
    review_link_enabled: true,
  },
  {
    name: 'Dr. Mehra Dental Studio',
    slug: 'mehra-dental-studio',
    category: 'Dentist',
    description: 'Painless root canal, implants and smile makeovers.',
    address: '4th Floor, Orchid Plaza, Baner Road',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    phone: '+91 90045 22110',
    website: 'https://mehradental.in',
    logo_url: null,
    google_place_id: 'ChIJMehraDentalPune',
    google_review_url: 'https://g.page/mehra-dental',
    rating: 4.8,
    review_count: 164,
    status: 'active',
    review_link_enabled: true,
  },
  {
    name: 'The Courtyard Cafe',
    slug: 'the-courtyard-cafe',
    category: 'Cafe',
    description: 'Slow brew coffee, work-friendly corners and weekend brunch.',
    address: 'Plot 22, Sector 18, Near Banquet Hall',
    city: 'Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    phone: '+91 98110 44200',
    website: null,
    logo_url: null,
    google_place_id: 'ChIJCourtyardNoida',
    google_review_url: 'https://g.page/courtyard-cafe',
    rating: 4.3,
    review_count: 97,
    status: 'active',
    review_link_enabled: true,
  },
  {
    name: 'Aarogya Skin & Laser',
    slug: 'aarogya-skin-laser',
    category: 'Clinic',
    description: 'Dermatology, laser hair removal and chemical peels.',
    address: 'Shop 8, Cosmos Arcade, Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    phone: '+91 99876 12340',
    website: 'https://aarogya.in',
    logo_url: null,
    google_place_id: null,
    google_review_url: null,
    rating: null,
    review_count: null,
    status: 'pending',
    review_link_enabled: false,
  },
  {
    name: 'Sunrise Fitness Club',
    slug: 'sunrise-fitness-club',
    category: 'Gym',
    description: 'Strength, conditioning and personal training. 24x7 access.',
    address: '1st Floor, Sunrise Plaza, MG Road',
    city: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    phone: '+91 93110 55221',
    website: null,
    logo_url: null,
    google_place_id: 'ChIJSunriseGymIndore',
    google_review_url: 'https://g.page/sunrise-fitness',
    rating: 4.4,
    review_count: 133,
    status: 'active',
    review_link_enabled: true,
  },
  {
    name: 'Bluebell Hotel',
    slug: 'bluebell-hotel',
    category: 'Hotel',
    description: '42 rooms, rooftop restaurant, banquet hall.',
    address: 'NH-52 Bypass, Sanganer',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    phone: '+91 141 400 2200',
    website: 'https://bluebellhotel.in',
    logo_url: null,
    google_place_id: 'ChIJBluebellJaipur',
    google_review_url: 'https://g.page/bluebell-hotel',
    rating: 4.2,
    review_count: 512,
    status: 'active',
    review_link_enabled: true,
  },
];

const REVIEW_TEXTS: Array<{ title: string; comment: string; min: number }> = [
  { title: 'Excellent service', comment: 'Staff was very polite and the food came out fast. Will come back for sure.', min: 4 },
  { title: 'Very happy with the service', comment: 'Explained everything clearly and did not push any extra treatment.', min: 4 },
  { title: 'Good experience overall', comment: 'Clean place, reasonable price. Only issue is weekend waiting time.', min: 3 },
  { title: 'Loved it', comment: 'My kids enjoyed it and I finally got a proper break. Highly recommended.', min: 5 },
  { title: 'Worth the money', comment: 'Genuinely worth it. The results are visible in just two sessions.', min: 4 },
  { title: 'Nice ambience', comment: 'Perfect for a weekend evening. Music was a bit loud for my taste.', min: 3 },
  { title: 'Highly professional', comment: 'Booked in the morning and got a slot the same week. Very organised.', min: 5 },
  { title: 'Could be better', comment: 'Service was fine but the waiting area needs some work.', min: 2 },
  { title: 'Best in the area', comment: 'Tried three places before coming here. This is the one.', min: 5 },
  { title: 'Decent', comment: 'Nothing to complain about. Standard quality at standard price.', min: 3 },
  { title: 'Fantastic experience', comment: 'The team remembered my name on the second visit. Small thing, big impact.', min: 5 },
  { title: 'Not what I expected', comment: 'Photos online looked different from the actual place.', min: 2 },
];

const REVIEWER_NAMES = [
  'Aarav Mehta', 'Priya Nair', 'Rohit Sharma', 'Sneha Kulkarni', 'Imran Shaikh',
  'Divya Iyer', 'Karan Bedi', 'Meera Joshi', 'Vikram Chauhan', 'Ananya Bose',
  'Rahul Pillai', 'Nidhi Agarwal', 'Suresh Yadav', 'Pooja Rane', 'Aditya Menon',
  'Fatima Sheikh', 'Harsh Vardhan', 'Lakshmi Prasad', 'Manoj Tiwari', 'Zoya Khan',
];

const FEEDBACK_SEED: Array<Pick<Feedback, 'name' | 'category' | 'message'>> = [
  { name: 'Kavita R', category: 'Feature request', message: 'Can we get an option to send automatic WhatsApp reminders to happy customers?' },
  { name: 'Sameer Pawar', category: 'Bug report', message: 'The QR code on my table shows an older logo. Where can I refresh it?' },
  { name: 'Neha', category: 'Billing', message: 'I paid for the yearly plan but my dashboard still shows monthly. Please check.' },
  { name: 'Ajay', category: 'Feature request', message: 'Please add an option to export all reviews as CSV for our records.' },
  { name: 'Ritu Sharma', category: 'Support', message: 'Setup was done in 10 minutes. Just wanted to say the onboarding call was very helpful.' },
  { name: 'Gaurav', category: 'Bug report', message: 'Analytics page takes around 8 seconds to load on my mobile data.' },
];

const MONTH_LABELS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

const buildSeries = (seed: number, base: number, growth: number): AnalyticsPoint[] =>
  MONTH_LABELS.map((label, index) => {
    const views = Math.round(base * (1 + growth * index) + ((seed * (index + 3)) % 40));
    const submissions = Math.round(views * (0.16 + ((seed + index) % 7) / 100));
    return {
      label,
      views,
      submissions,
      clicks: Math.round(views * (0.42 + ((seed * index) % 5) / 100)),
    };
  });

const buildPayments = (
  businessId: number,
  businessName: string,
  subscriptionId: number,
  amount: number,
  months: number,
  status: Payment['status']
): Payment[] =>
  Array.from({ length: months }).map((_, index) => {
    const daysAgo = index * 30 + 4;
    return {
      id: 0,
      subscription_id: subscriptionId,
      business_id: businessId,
      business_name: businessName,
      amount,
      method: (['upi', 'bank_transfer', 'cash', 'card'] as const)[index % 4],
      reference: `TXN${(businessId * 7717 + index * 31).toString().slice(0, 8)}`,
      status,
      paid_on: iso(daysAgo, 11),
      recorded_by: 2,
      note: null,
      created_at: iso(daysAgo, 11),
    };
  });

export function buildSeedDb(): MockDb {
  const plans: Plan[] = PLAN_CATALOGUE.map((plan) => ({ ...plan }));

  const users: User[] = [
    {
      id: 1,
      name: 'Rohit Deshmukh',
      email: DEMO_CUSTOMER.email,
      phone: '+91 98765 43210',
      role: 'customer',
      status: 'active',
      avatar_url: null,
      created_at: iso(180, 9),
      last_login_at: iso(0, 8),
    },
    {
      id: 2,
      name: 'Pinaqyn Master Admin',
      email: DEMO_ADMIN.email,
      phone: '+91 88828 16805',
      role: 'admin',
      status: 'active',
      avatar_url: null,
      created_at: iso(400, 9),
      last_login_at: iso(0, 7),
    },
  ];

  const businesses: Business[] = SEED_BUSINESSES.map((seed, index) => ({
    ...seed,
    id: index + 1,
    user_id: index === 0 ? 1 : 10 + index,
    created_at: iso(200 - index * 24, 9),
  }));

  const subscriptions: Subscription[] = [
    {
      id: 1,
      business_id: 1,
      plan_id: 2,
      status: 'active',
      billing_cycle: 'monthly',
      amount: plans[1].price_monthly,
      started_at: iso(150, 9),
      current_period_start: iso(22, 9),
      current_period_end: ahead(8),
      cancelled_at: null,
      notes: 'Growth plan, billed monthly via UPI.',
      created_at: iso(150, 9),
    },
    {
      id: 2,
      business_id: 2,
      plan_id: 3,
      status: 'active',
      billing_cycle: 'yearly',
      amount: plans[2].price_yearly,
      started_at: iso(120, 9),
      current_period_start: iso(30, 9),
      current_period_end: ahead(335),
      cancelled_at: null,
      notes: 'Annual contract, invoice raised on WhatsApp.',
      created_at: iso(120, 9),
    },
    {
      id: 3,
      business_id: 3,
      plan_id: 1,
      status: 'past_due',
      billing_cycle: 'monthly',
      amount: plans[0].price_monthly,
      started_at: iso(90, 9),
      current_period_start: iso(38, 9),
      current_period_end: ahead(-8),
      cancelled_at: null,
      notes: 'Payment reminder sent twice.',
      created_at: iso(90, 9),
    },
    {
      id: 4,
      business_id: 4,
      plan_id: 1,
      status: 'trial',
      billing_cycle: 'monthly',
      amount: plans[0].price_monthly,
      started_at: iso(3, 9),
      current_period_start: iso(3, 9),
      current_period_end: ahead(11),
      cancelled_at: null,
      notes: 'Trial started from self-signup.',
      created_at: iso(3, 9),
    },
    {
      id: 5,
      business_id: 5,
      plan_id: 2,
      status: 'active',
      billing_cycle: 'monthly',
      amount: plans[1].price_monthly,
      started_at: iso(60, 9),
      current_period_start: iso(12, 9),
      current_period_end: ahead(18),
      cancelled_at: null,
      notes: null,
      created_at: iso(60, 9),
    },
    {
      id: 6,
      business_id: 6,
      plan_id: 2,
      status: 'cancelled',
      billing_cycle: 'monthly',
      amount: plans[1].price_monthly,
      started_at: iso(200, 9),
      current_period_start: iso(75, 9),
      current_period_end: iso(45, 9),
      cancelled_at: iso(44, 12),
      notes: 'Client moved to an in-house tool.',
      created_at: iso(200, 9),
    },
  ];

  const paymentSeed: Payment[] = [
    ...buildPayments(1, businesses[0].name, 1, plans[1].price_monthly, 5, 'verified'),
    ...buildPayments(2, businesses[1].name, 2, plans[2].price_yearly, 1, 'verified'),
    ...buildPayments(3, businesses[2].name, 3, plans[0].price_monthly, 3, 'verified'),
    ...buildPayments(5, businesses[4].name, 5, plans[1].price_monthly, 2, 'verified'),
    {
      id: 900,
      subscription_id: 3,
      business_id: 3,
      business_name: businesses[2].name,
      amount: plans[0].price_monthly,
      method: 'upi',
      reference: 'TXN77120931',
      status: 'pending',
      paid_on: ahead(-2),
      recorded_by: null,
      note: 'Customer says UPI debited, awaiting confirmation.',
      created_at: iso(2, 14),
    },
  ];

  const payments: Payment[] = paymentSeed.map((payment, index) => ({ ...payment, id: index + 1 }));

  const reviews: Review[] = [];
  let reviewId = 0;
  businesses.forEach((business, businessIndex) => {
    if (business.status === 'pending') return;
    const count = [14, 11, 9, 8, 12][businessIndex] ?? 8;
    for (let i = 0; i < count; i += 1) {
      reviewId += 1;
      const template = REVIEW_TEXTS[(businessIndex * 3 + i) % REVIEW_TEXTS.length];
      const jitter = ((i * 5 + businessIndex) % 5) - 2;
      const rating = Math.min(5, Math.max(1, template.min + (jitter > 1 ? 1 : jitter < -1 ? -1 : 0)));
      const daysAgo = (i * 11 + businessIndex * 4) % 150;
      const isReplied = daysAgo > 6;
      reviews.push({
        id: reviewId,
        business_id: business.id,
        business_name: business.name,
        customer_name: REVIEWER_NAMES[(reviewId * 7) % REVIEWER_NAMES.length],
        customer_email: null,
        customer_phone: null,
        rating,
        title: template.title,
        comment: template.comment,
        source: i % 3 === 0 ? 'qr' : i % 3 === 1 ? 'link' : 'manual',
        status: rating <= 2 ? (i % 2 === 0 ? 'flagged' : 'approved') : 'approved',
        replied_at: isReplied ? iso(daysAgo - 2, 13) : null,
        reply_text: isReplied
          ? 'Thank you for taking the time to write this. We have noted it and our team will get in touch.'
          : null,
        is_public: rating >= 3,
        created_at: iso(daysAgo, 16),
      });
    }
  });

  const feedback: Feedback[] = FEEDBACK_SEED.map((seed, index) => ({
    id: index + 1,
    business_id: (index % businesses.length) + 1,
    business_name: businesses[index % businesses.length].name,
    name: seed.name,
    email: null,
    category: seed.category,
    message: seed.message,
    status: (['new', 'in_progress', 'resolved', 'new', 'resolved', 'new'] as const)[index],
    created_at: iso(index * 2 + 1, 13),
  }));

  const series: Record<string, AnalyticsPoint[]> = {};
  businesses.forEach((business, index) => {
    series[String(business.id)] = buildSeries(index + 3, 220 + index * 60, 0.14);
  });

  return {
    users,
    businesses,
    plans,
    subscriptions,
    payments,
    reviews,
    feedback,
    settings: {
      company_name: 'GMBQYN by Pinaqyn',
      support_email: 'support@gmbqyn.in',
      support_phone: '+91 88828 16805',
      currency: 'INR',
      trial_days: 14,
      auto_renew: true,
      maintenance_mode: false,
      review_reminder_days: 3,
    },
    series,
    counters: { review: reviewId, payment: payments.length, business: businesses.length },
  };
}

export const loadDb = (): MockDb => {
  if (typeof window === 'undefined') return buildSeedDb();
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as MockDb;
      if (parsed && Array.isArray(parsed.businesses) && Array.isArray(parsed.plans)) return parsed;
    }
  } catch {
    /* fall through to seed */
  }
  const seeded = buildSeedDb();
  persistDb(seeded);
  return seeded;
};

export const persistDb = (db: MockDb) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    /* quota or private mode */
  }
};

export const resetDb = () => {
  if (typeof window === 'undefined') return buildSeedDb();
  try {
    window.localStorage.removeItem(DB_KEY);
  } catch {
    /* ignore */
  }
  const seeded = buildSeedDb();
  persistDb(seeded);
  return seeded;
};
