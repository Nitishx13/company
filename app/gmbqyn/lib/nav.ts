import type { NavItem } from '../components/shell';

export const customerNav: NavItem[] = [
  { href: '/gmbqyn/dashboard', label: 'Dashboard', icon: '◈', exact: true },
  { href: '/gmbqyn/reviews', label: 'Reviews', icon: '★' },
  { href: '/gmbqyn/feedback', label: 'Feedback', icon: '✉' },
  { href: '/gmbqyn/analytics', label: 'Analytics', icon: '◴' },
  { href: '/gmbqyn/review-link', label: 'Review Link', icon: '↗' },
  { href: '/gmbqyn/qr', label: 'QR Codes', icon: '▦' },
  { href: '/gmbqyn/integration', label: 'Google Integration', icon: '⌘' },
  { href: '/gmbqyn/subscription', label: 'Subscription', icon: '◆' },
  { href: '/gmbqyn/invoices', label: 'Invoices', icon: '≡' },
  { href: '/gmbqyn/business', label: 'Business Profile', icon: '⌂' },
  { href: '/gmbqyn/profile', label: 'My Account', icon: '☺' },
];

export const adminNav: NavItem[] = [
  { href: '/gmbqyn/admin/dashboard', label: 'Overview', icon: '◈', exact: true },
  { href: '/gmbqyn/admin/analytics', label: 'Analytics', icon: '◴' },
  { href: '/gmbqyn/admin/businesses', label: 'Businesses', icon: '⌂' },
  { href: '/gmbqyn/admin/customers', label: 'Customers', icon: '☺' },
  { href: '/gmbqyn/admin/subscriptions', label: 'Subscriptions', icon: '◆' },
  { href: '/gmbqyn/admin/payments', label: 'Payments', icon: '₹' },
  { href: '/gmbqyn/admin/reviews', label: 'All Reviews', icon: '★' },
  { href: '/gmbqyn/admin/feedback', label: 'Feedback Inbox', icon: '✉' },
  { href: '/gmbqyn/admin/plans', label: 'Plans', icon: '▤' },
  { href: '/gmbqyn/admin/settings', label: 'Settings', icon: '⚙' },
];

export const ANALYTICS_RANGES = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '12m', label: 'Last 12 months' },
];

export const RATING_LABELS = [5, 4, 3, 2, 1];
