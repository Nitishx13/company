import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work | Pinaqyn Tech',
  description: 'A selection of projects across AI, design, development, and automation — technology built with purpose.',
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
