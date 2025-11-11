import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services | Pinaqyn Tech',
  description: 'Branding, Web & Digital Development, Digital Marketing & SEO, AI & Automation — engineered for performance and impact.',
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
