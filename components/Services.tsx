'use client';

import { useEffect, useRef, useState } from 'react';

const services = [
  {
    id: '01',
    title: 'Branding & Strategy',
    description: 'Build a powerful brand that connects and converts with clarity, consistency, and purpose.',
    icon: (
      <svg width="60" height="60" viewBox="0 0 60 60">
        <rect x="12" y="12" width="36" height="36" className="chalk-line" />
        <line x1="12" y1="30" x2="48" y2="30" className="chalk-line" />
        <circle cx="22" cy="22" r="2" fill="#FAFAFA" />
        <circle cx="28" cy="22" r="2" fill="#FAFAFA" />
      </svg>
    ),
  },
  {
    id: '02',
    title: 'Web & Digital Development',
    description: 'Fast, scalable, beautiful websites and web apps engineered for performance and impact.',
    icon: (
      <svg width="60" height="60" viewBox="0 0 60 60">
        <rect x="10" y="15" width="40" height="30" className="chalk-line" />
        <line x1="10" y1="25" x2="50" y2="25" className="chalk-line" />
        <line x1="20" y1="40" x2="40" y2="40" className="chalk-line" />
      </svg>
    ),
  },
  {
    id: '03',
    title: 'Digital Marketing & SEO',
    description: 'Performance-focused campaigns across Google, Meta, and more — with measurable ROI.',
    icon: (
      <svg width="60" height="60" viewBox="0 0 60 60">
        <path d="M12 40 L26 28 L34 34 L48 20" className="chalk-line" />
        <circle cx="26" cy="28" r="2" fill="#FAFAFA" />
        <circle cx="34" cy="34" r="2" fill="#FAFAFA" />
        <circle cx="48" cy="20" r="2" fill="#FAFAFA" />
      </svg>
    ),
  },
  {
    id: '04',
    title: 'AI & Automation',
    description: 'Smart systems that save time, cut costs, and drive growth with precision.',
    icon: (
      <svg width="60" height="60" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="18" className="chalk-line" />
        <line x1="30" y1="12" x2="30" y2="48" className="chalk-line" />
        <line x1="12" y1="30" x2="48" y2="30" className="chalk-line" />
      </svg>
    ),
  },
];

export default function Services() {
  const [activeService, setActiveService] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    const serviceCards = sectionRef.current?.querySelectorAll('.service-card');
    serviceCards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative z-10 min-h-screen py-32 px-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-20">
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            What We Do
          </h2>
          <div className="w-24 h-px bg-chalk-white mb-6" />
          <p className="text-xl text-chalk-gray max-w-2xl">
            Creative. Data-Driven. Automated.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="service-card opacity-0 translate-y-8 transition-all duration-700 group"
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setActiveService(service.id)}
              onMouseLeave={() => setActiveService(null)}
            >
              <div className="border border-chalk-gray/30 p-8 hover:border-chalk-white transition-all duration-300 relative overflow-hidden">
                {/* Background effect */}
                <div
                  className={`absolute inset-0 bg-chalk-white/5 transform transition-transform duration-500 ${
                    activeService === service.id ? 'scale-100' : 'scale-0'
                  }`}
                  style={{ transformOrigin: 'top left' }}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-6xl font-mono text-chalk-gray/30 group-hover:text-chalk-gray/50 transition-colors">
                      {service.id}
                    </span>
                    <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                      {service.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-4 group-hover:glow-text transition-all">
                    {service.title}
                  </h3>

                  <p className="text-chalk-gray leading-relaxed">
                    {service.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="mt-6 flex items-center gap-2 text-sm font-mono text-chalk-gray group-hover:text-chalk-white transition-colors">
                    <span>LEARN MORE</span>
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <line
                        x1="5"
                        y1="10"
                        x2="15"
                        y2="10"
                        className="chalk-line"
                        strokeWidth="1"
                      />
                      <polyline
                        points="11,6 15,10 11,14"
                        className="chalk-line"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
