import type { Metadata } from 'next';
import { GmbqynAuthProvider } from '@/lib/gmbqyn/auth-context';

export const metadata: Metadata = {
  title: {
    default: 'GMBQYN — Google reviews, on autopilot',
    template: '%s · GMBQYN',
  },
  description:
    'Collect Google reviews on autopilot. Shareable review links, branded QR codes, private feedback inbox and review analytics for Indian businesses.',
  robots: { index: true, follow: true },
};

export default function GmbqynLayout({ children }: { children: React.ReactNode }) {
  return (
    <GmbqynAuthProvider>
      <div className="relative min-h-screen bg-[#0A0A0A] text-chalk-white">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(70rem 40rem at 12% -10%, rgba(123,91,255,0.18), transparent 60%),' +
              'radial-gradient(50rem 32rem at 92% 4%, rgba(255,95,145,0.14), transparent 60%)',
          }}
        />
        <div className="relative">{children}</div>
      </div>
    </GmbqynAuthProvider>
  );
}
