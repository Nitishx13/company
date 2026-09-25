import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Pinaqyn Tech',
  description: 'Call, WhatsApp, or email Pinaqyn Tech to discuss your project. We respond within a business day.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
