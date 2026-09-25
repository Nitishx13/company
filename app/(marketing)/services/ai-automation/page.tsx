'use client';

import MathBackground from '@/components/MathBackground';

export default function AutomationPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <MathBackground />
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto space-y-6 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">AI & Automation</p>
          <h1 className="text-4xl font-extrabold text-white">Power. Precision. Pinaken.</h1>
          <p className="text-lg text-white/70">
            Leveraging AI, automation, and systems design to keep your teams focused while delivering connected customer journeys.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {[
              'AI chatbots & assistants',
              'HubSpot, Klaviyo, and ActiveCampaign automation',
              'CRM integration & workflow design',
              'Predictive analytics & AI personalization',
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
