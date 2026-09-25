'use client';

import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Philosophy from '@/components/Philosophy';
import MathBackground from '@/components/MathBackground';

export default function Home() {
  const pillars = [
    {
      title: 'Brand mastery',
      body: 'Strategy workshops, messaging architecture, and creative direction that make your story stand out.',
    },
    {
      title: 'Growth systems',
      body: 'Holistic paid, earned, and owned campaigns fueled by data, automation, and audience insights.',
    },
    {
      title: 'Launch excellence',
      body: 'Rapid prototyping, testing, and measurement designed to minimize risk and accelerate market entry.',
    },
  ];

  const caseStudies = [
    {
      title: 'Commerce expansion',
      subtitle: 'Luxury goods retailer',
      metrics: '+92% YoY revenue',
    },
    {
      title: 'Account-based growth',
      subtitle: 'B2B SaaS leader',
      metrics: '32 new enterprise logos',
    },
    {
      title: 'Product launch blitz',
      subtitle: 'Health & wellness',
      metrics: '6-week MVP to market',
    },
  ];

  const testimonials = [
    {
      quote:
        'They shaped our message, automated our funnels, and launched campaigns that scaled in weeks.',
      author: 'Priya N., Founder, Nucleus Labs',
    },
    {
      quote:
        'Insightful strategy, beautiful execution. We hit our revenue targets in the first quarter.',
      author: 'Marco D., COO, Rise Collective',
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden">
      <MathBackground />
      <Hero />
      <Services />
      <Philosophy />

      {/* Momentum section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-12 lg:gap-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 items-center">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur">
              <p className="text-sm font-mono uppercase tracking-[0.4em] text-white/60 mb-4">
                Momentum
              </p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight text-white">
                We turn bold visions into measurable growth, fast.
              </h2>
              <p className="mt-4 text-lg text-white/80 leading-relaxed">
                From brand strategy to data-rich automation, every project is orchestrated to
                clarify your message, accelerate leads, and deliver better customer journeys.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff] px-8 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_15px_30px_rgba(255,95,145,0.35)] transition hover:shadow-[0_25px_45px_rgba(123,91,255,0.35)]"
                >
                  Send me a Proposal
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-white hover:text-white"
                >
                  Book a Discovery Call
                </a>
              </div>
            </div>
            <div className="bg-gradient-to-br from-white/30 via-white/5 to-transparent backdrop-blur-md border border-white/20 rounded-[32px] p-10 shadow-[0_25px_45px_rgba(0,0,0,0.45)]">
              <div className="grid grid-cols-2 gap-6 text-white">
                {[
                  { label: 'Avg. Growth', value: '+48%' },
                  { label: 'Client NPS', value: '92' },
                  { label: 'Average ROI', value: '7.8x' },
                  { label: 'Speed to Launch', value: '4 weeks' },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <p className="text-sm uppercase tracking-[0.3em] text-white/60">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-white/70">
                Real numbers from campaigns, experiences, and automation stacks we’ve shipped for
                growth-stage businesses.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur shadow-[0_15px_45px_rgba(15,23,42,0.6)] hover:border-white/30 transition"
              >
                <h3 className="text-xl font-semibold text-white mb-3">{pillar.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="relative z-10 py-24 px-6 bg-gradient-to-b from-[#05060a]/90 to-transparent">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <p className="text-xs uppercase tracking-[0.6em] text-white/50">Case Studies</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Proof that the strategy works</h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              We partner with bold teams to launch impactful products, reimagine their brands, and drive measurable growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.map((study) => (
              <article
                key={study.title}
                className="relative rounded-[36px] border border-white/10 bg-black/50 p-8 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
              >
                <div className="absolute -top-5 right-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00b4ff] to-[#8c3cff] px-4 py-2 text-[0.55rem] uppercase tracking-[0.4em] text-white">
                  Case Study
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{study.title}</h3>
                <p className="text-sm uppercase tracking-[0.4em] text-white/50 mb-4">{study.subtitle}</p>
                <p className="text-lg text-white/80">{study.metrics}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className="text-xs uppercase tracking-[0.6em] text-white/50">Testimonials</p>
            <h2 className="text-4xl font-bold text-white">Clients that keep coming back</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.author}
                className="h-full rounded-[32px] border border-white/10 bg-gradient-to-br from-[#11141a] to-[#0b0e16] p-8 text-white shadow-[0_25px_55px_rgba(0,0,0,0.65)]"
              >
                <p className="text-lg leading-relaxed text-white/80">{testimonial.quote}</p>
                <p className="mt-6 text-sm uppercase tracking-[0.3em] text-white/60">{testimonial.author}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-28 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center justify-center gap-3 rounded-full border border-white/30 px-6 py-2 text-xs uppercase tracking-[0.5em] text-white/40 mb-6">
            Future-proof growth
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white leading-tight">
            Ready to craft your next digital story?
          </h2>
          <p className="text-lg text-white/70 mb-8">
            Tell us where you want to go, and we’ll design the marketing, product, and automation stack
            to get you there — faster and more confidently than ever before.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-white text-black px-10 py-4 text-xs font-semibold uppercase tracking-[0.4em] transition hover:bg-white/90"
            >
              Start a Project
            </a>
            <a
              href="/capabilities"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-10 py-4 text-xs font-semibold uppercase tracking-[0.4em] text-white/80 transition hover:border-white hover:text-white"
            >
              Download Capabilities
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
