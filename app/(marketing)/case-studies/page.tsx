'use client';

import MathBackground from '@/components/MathBackground';

const caseStudies = [
  {
    title: 'Commerce expansion',
    subtitle: 'Luxury goods retailer',
    metrics: '+92% YoY revenue',
    impact: 'Modernized e-commerce stack, storytelling, and loyalty programs.',
  },
  {
    title: 'Account-based growth',
    subtitle: 'B2B SaaS leader',
    metrics: '32 new enterprise logos',
    impact: 'Aligned sales-marketing CRM automation with executive thought leadership.',
  },
  {
    title: 'Product launch blitz',
    subtitle: 'Health & wellness',
    metrics: '6-week MVP to market',
    impact: 'Built a conversion-first site, automated nurture flows, and launched paid media.',
  },
];

export default function CaseStudiesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <MathBackground />
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <p className="text-xs uppercase tracking-[0.6em] text-white/50">Case Studies</p>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white">Real results for ambitious teams.</h1>
            <p className="text-lg text-white/70">
              We partner with ambitious brands to plan, build, and scale immersive digital experiences that land measurable growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((study) => (
              <article
                key={study.title}
                className="rounded-[32px] border border-white/10 bg-black/50 p-8 backdrop-blur shadow-[0_30px_70px_rgba(0,0,0,0.7)]"
              >
                <p className="text-xs uppercase tracking-[0.4em] text-white/50 mb-3">{study.subtitle}</p>
                <h2 className="text-2xl font-bold text-white mb-2">{study.title}</h2>
                <p className="text-xl text-white/70 mb-4">{study.metrics}</p>
                <p className="text-white/60 leading-relaxed">{study.impact}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
