'use client';

const services = [
  {
    title: 'Digital Strategy',
    copy: 'We help you plan carefully aligned digital strategy to deliver against your business objectives.',
  },
  {
    title: 'Web Design',
    copy: 'We design and build responsive websites with CTA funnels that lift conversions and visibility.',
  },
  {
    title: 'E-Commerce Web Design',
    copy: 'Beautiful online stores and strategically-led shopping experiences designed to rank and convert.',
  },
  {
    title: 'Web Development',
    copy: 'Fast, scalable, and secure builds tailored to high-performing brands in B2B and B2C.',
  },
  {
    title: 'Paid Media Advertising',
    copy: 'Hyper-targeted PPC campaigns across Google, Meta, and programmatic channels with transparent ROI.',
  },
  {
    title: 'SEO Services',
    copy: 'Strategic SEO programs that drive consistent traffic, leads, and revenue growth.',
  },
  {
    title: 'Social Media Marketing',
    copy: 'Social campaigns that make people fall in love with and buy from your business.',
  },
  {
    title: 'HubSpot CRM',
    copy: 'Implementations, automations, and revenue operations coaching inside HubSpot.',
  },
  {
    title: 'Mobile App Development',
    copy: 'Cross-platform experiences engineered for speed, polish, and measurable engagement.',
  },
  {
    title: 'Software Development',
    copy: 'Product design and engineering that turns complex workflows into elegant software.',
  },
];

const navItems = [
  'Home',
  'About Us',
  'Digital Strategy',
  'Web Design',
  'E-Commerce',
  'Web Development',
  'B2B Commerce',
  'Paid Media',
  'Advertising',
  'SEO Services',
  'Social Media Marketing',
  'HubSpot CRM',
  'Mobile App Development',
  'Software Development',
  'Case Studies',
  'Free Tools',
  'Technologies',
  'Blog',
  'Engage',
  'Reviews',
  'Sitemap',
  'Book a Discovery Call',
];

export default function Services() {
  return (
    <section id="services" className="relative z-10 min-h-screen py-16 px-6">
      <div className="relative max-w-6xl mx-auto space-y-10">
        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.slice(0, 6).map((service) => (
            <article
              key={service.title}
              className="rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur shadow-[0_15px_35px_rgba(0,0,0,0.35)] hover:border-white/30 transition"
            >
              <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-white/70 leading-relaxed text-sm">{service.copy}</p>
            </article>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.slice(6).map((service) => (
            <article
              key={service.title}
              className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#0b0c12] to-[#05060a] p-8 backdrop-blur shadow-[0_15px_35px_rgba(0,0,0,0.35)] hover:border-white/30 transition"
            >
              <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-white/70 leading-relaxed text-sm">{service.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
