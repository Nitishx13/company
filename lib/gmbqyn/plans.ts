import type { Plan } from './types';

export const PLAN_CATALOGUE: Plan[] = [
  {
    id: 1,
    code: 'starter',
    name: 'Starter',
    tagline: 'For a single outlet just getting its first reviews.',
    price_monthly: 1499,
    price_yearly: 14990,
    currency: 'INR',
    review_link_enabled: true,
    qr_enabled: true,
    qr_custom_branding: false,
    feedback_enabled: false,
    analytics_enabled: false,
    google_sync: false,
    max_reviews_per_month: 100,
    seats: 1,
    sort_order: 1,
    is_active: true,
    features: [
      'Review link with QR code',
      '100 reviews per month',
      'Basic review inbox',
      '1 seat',
    ],
  },
  {
    id: 2,
    code: 'growth',
    name: 'Growth',
    tagline: 'For businesses that live on their Google rating.',
    price_monthly: 2999,
    price_yearly: 29990,
    currency: 'INR',
    review_link_enabled: true,
    qr_enabled: true,
    qr_custom_branding: true,
    feedback_enabled: true,
    analytics_enabled: true,
    google_sync: false,
    max_reviews_per_month: 500,
    seats: 3,
    sort_order: 2,
    is_active: true,
    features: [
      'Everything in Starter',
      'Branded QR codes',
      'Private feedback inbox',
      'Full analytics',
      '500 reviews per month',
      '3 seats',
    ],
  },
  {
    id: 3,
    code: 'scale',
    name: 'Scale',
    tagline: 'For multi-location brands and franchises.',
    price_monthly: 5999,
    price_yearly: 59990,
    currency: 'INR',
    review_link_enabled: true,
    qr_enabled: true,
    qr_custom_branding: true,
    feedback_enabled: true,
    analytics_enabled: true,
    google_sync: true,
    max_reviews_per_month: null,
    seats: 15,
    sort_order: 3,
    is_active: true,
    features: [
      'Everything in Growth',
      'Google review sync',
      'Unlimited reviews',
      'Multi-location support',
      '15 seats',
    ],
  },
];

export const PLAN_BY_CODE: Record<string, Plan> = PLAN_CATALOGUE.reduce(
  (acc, plan) => {
    acc[plan.code] = plan;
    return acc;
  },
  {} as Record<string, Plan>
);

export const CATEGORIES = [
  'Restaurant',
  'Cafe',
  'Hotel',
  'Clinic',
  'Dentist',
  'Salon',
  'Spa',
  'Gym',
  'Real Estate',
  'Automobile',
  'Retail Store',
  'Education',
  'Professional Services',
  'Wedding Venue',
  'Others',
];

export const REVIEW_SOURCES: Array<{ value: string; label: string }> = [
  { value: 'qr', label: 'QR Code' },
  { value: 'link', label: 'Review Link' },
  { value: 'manual', label: 'Manual Entry' },
  { value: 'import', label: 'Imported' },
];

export const planPrice = (plan: Plan, cycle: 'monthly' | 'yearly') =>
  cycle === 'yearly' ? plan.price_yearly : plan.price_monthly;

export const planPricePerMonth = (plan: Plan, cycle: 'monthly' | 'yearly') =>
  cycle === 'yearly' ? Math.round(plan.price_yearly / 12) : plan.price_monthly;
