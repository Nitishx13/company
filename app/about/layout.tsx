import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Pinaqyn Tech',
  description: 'Learn about Pinaqyn Tech — a boutique digital agency blending strategy, design, and engineering. Our mission, values, and approach.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
