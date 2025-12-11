'use client';

import MathBackground from '@/components/MathBackground';

export default function MarketingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <MathBackground />
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto space-y-6 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Marketing & SEO</p>
          <h1 className="text-4xl font-extrabold text-white">Reach. Engage. Convert.</h1>
          <p className="text-lg text-white/70">
            High-performing paid, owned, and earned campaigns built on strategy, data, and creative excellence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {[
              'PPC across Google, Meta, TikTok, and LinkedIn',
              'SEO that drives compounding organic growth',
              'Full-funnel marketing automation',
              'Impactful creative for demand generation',
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
