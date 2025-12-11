'use client';

import MathBackground from '@/components/MathBackground';

export default function BrandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <MathBackground />
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto space-y-6 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Branding & Strategy</p>
          <h1 className="text-4xl font-extrabold text-white">Clarity. Consistency. Momentum.</h1>
          <p className="text-lg text-white/70">
            We craft identities, positioning, and storytelling that help businesses cut through the noise
            and build trust faster.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {[
              'Brand Identity (logo, color palette, typography, tone of voice)',
              'Brand Strategy & Positioning',
              'Brand Guidelines & Governance',
              'Go-to-market launch support',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <p className="text-white/70 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
