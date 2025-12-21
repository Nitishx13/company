'use client';

import Link from 'next/link';

const services = [
  {
    title: 'Branding & Strategy',
    description: 'Positioning, messaging, and identity systems that keep teams aligned and customers engaged.',
    href: '/services/branding',
    number: '01',
  },
  {
    title: 'Web & Development',
    description: 'High-performance websites and product experiences engineered for speed, SEO, and conversion.',
    href: '/services/web-development',
    number: '02',
  },
  {
    title: 'Marketing & SEO',
    description: 'Campaigns and compounding acquisition systems built to reach, engage, and convert.',
    href: '/services/marketing',
    number: '03',
  },
  {
    title: 'AI & Automation',
    description: 'Workflows and AI-powered systems that scale operations without sacrificing craft.',
    href: '/services/ai-automation',
    number: '04',
  },
];

export default function Services() {
  return (
    <section id="services" className="relative z-10 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.6em] text-white/50">Services</p>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white">What we build with you</h2>
            <p className="mt-4 text-lg text-white/70 max-w-3xl mx-auto">
              Strategy-first delivery across brand, product, growth, and automation — designed to launch fast and scale cleanly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="group rounded-[32px] border border-white/10 bg-black/50 p-8 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.55)] transition hover:border-white/30"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-sm font-mono uppercase tracking-[0.4em] text-white/50">{service.number}</p>
                    <h3 className="mt-3 text-2xl font-bold text-white">{service.title}</h3>
                    <p className="mt-3 text-sm text-white/70 leading-relaxed">{service.description}</p>
                  </div>
                  <span className="mt-1 text-white/50 transition group-hover:text-white">→</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center">
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-10 py-4 text-xs font-semibold uppercase tracking-[0.4em] text-white/80 transition hover:border-white hover:text-white"
            >
              View all services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
