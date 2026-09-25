'use client';

import { useState } from 'react';
import MathBackground from '@/components/MathBackground';

const servicesData = [
  {
    id: 'branding',
    number: '01',
    title: 'Branding & Strategy',
    tagline: 'Clarity. Consistency. Conversion.',
    description:
      'Create a brand that speaks, stands out, and sells. From identity to messaging and guidelines, we build brands that connect and convert.',
    capabilities: [
      'Brand Identity (logo, color palette, typography, tone of voice)',
      'Brand Strategy & Positioning',
      'Brand Guidelines & Style Guides',
      'Rebranding & Brand Refresh',
      'Brand Messaging & Copywriting',
      'Visual Storytelling & Creative Direction',
    ],
    process: [
      'Discovery & Research',
      'Positioning & Messaging',
      'Identity Design',
      'Guidelines & Systems',
      'Launch & Rollout',
      'Ongoing Governance',
    ],
  },
  {
    id: 'web',
    number: '02',
    title: 'Web & Digital Development',
    tagline: 'Fast. Scalable. Beautiful.',
    description:
      'Build a digital experience that works for you and your customers — engineered for speed, SEO, and conversion.',
    capabilities: [
      'Website Design & Development',
      'E-commerce (Shopify, WooCommerce, Webflow)',
      'Landing Page Design',
      'Website Maintenance & Support',
      'Conversion Rate Optimization (CRO)',
      'UX/UI Design',
      'Web App Development',
    ],
    process: [
      'Discovery & Requirements',
      'UX/UI Design',
      'Development & QA',
      'Integrations & Performance',
      'Launch & Handover',
      'Support & Optimization',
    ],
  },
  {
    id: 'marketing',
    number: '03',
    title: 'Digital Marketing & Advertising',
    tagline: 'Reach. Engage. Convert.',
    description:
      'Performance marketing across Google, Meta, TikTok, LinkedIn, and more — with strategy, funnels, and remarketing built-in.',
    capabilities: [
      'Google Ads (Search, Display, Shopping, YouTube)',
      'Meta Ads (Facebook, Instagram)',
      'TikTok, LinkedIn & Pinterest Ads',
      'PPC Campaign Management',
      'Remarketing Campaigns',
      'Marketing Funnel Design',
      'Performance Marketing Strategy',
    ],
    process: [
      'Audit & Strategy',
      'Campaign Setup',
      'Creative & Copy',
      'Tracking & Optimization',
      'Scaling & Iteration',
      'Reporting & Insights',
    ],
  },
  {
    id: 'seo',
    number: '04',
    title: 'Search Engine Optimization (SEO)',
    tagline: 'Get discovered. Stay ahead.',
    description:
      'Technical, on-page, and off-page SEO to help you rank higher and grow compounding organic traffic.',
    capabilities: [
      'On-Page SEO & Technical Optimization',
      'Link Building & Digital PR',
      'Local SEO for Businesses',
      'SEO Audits & Competitor Analysis',
      'Content SEO & Keyword Strategy',
    ],
    process: [
      'Technical & Content Audit',
      'Keyword & Content Strategy',
      'On-page & Technical Fixes',
      'Authority Building (PR & Links)',
      'Measurement & Iteration',
      'Quarterly Growth Plan',
    ],
  },
  {
    id: 'content',
    number: '05',
    title: 'Content & Creative',
    tagline: 'Stories that move people.',
    description:
      'Inspire action through storytelling and design — from blogs and case studies to video and social content.',
    capabilities: [
      'Content Marketing (blogs, articles, case studies)',
      'Social Media Content Creation',
      'Video Marketing & Editing',
      'Photography & Visual Assets',
      'Email Marketing & Automation',
      'Copywriting for Ads & Landing Pages',
    ],
    process: [
      'Editorial Strategy',
      'Production Calendar',
      'Content Creation',
      'Publishing & Distribution',
      'Measurement & Optimization',
      'Repurposing & Scale',
    ],
  },
  {
    id: 'automation',
    number: '06',
    title: 'Tech, AI & Automation',
    tagline: 'Power. Precision. Pinaken.',
    description:
      'Leverage AI and automation to scale with focus and control — from chatbots to CRM and workflow automation.',
    capabilities: [
      'AI Chatbots & Virtual Assistants',
      'Marketing Automation (HubSpot, ActiveCampaign, Klaviyo)',
      'CRM Integration & Workflow Automation',
      'Predictive Analytics & AI Insights',
      'Business Process Automation (Zapier, Make)',
      'AI-Driven Personalization',
      'API Integration & Custom Solutions',
    ],
    process: [
      'Discovery & Systems Audit',
      'Automation Architecture',
      'Build & Integrate',
      'QA & Training',
      'Launch & Monitoring',
      'Continuous Improvement',
    ],
  },
  {
    id: 'analytics',
    number: '07',
    title: 'Analytics & Performance',
    tagline: 'Measure what matters.',
    description:
      'Implementation and dashboards that connect actions to outcomes — so decisions are data-driven.',
    capabilities: [
      'Google Analytics 4 & Tag Manager Setup',
      'Conversion Tracking',
      'A/B Testing & Optimization',
      'Custom KPI Dashboards (Looker Studio)',
      'Data-Driven Strategy & Reporting',
    ],
    process: [
      'KPI Definition',
      'Tracking Architecture',
      'Implementation & QA',
      'Dashboarding & Reporting',
      'Insights & Recommendations',
      'Iteration & Growth Loops',
    ],
  },
];

export default function ServicesPage() {
  const [activeService, setActiveService] = useState<string | null>(null);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <MathBackground />
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            Our Services
          </h1>
          <div className="w-32 h-px bg-chalk-white mx-auto mb-8" />
          <p className="text-xl md:text-2xl text-chalk-gray leading-relaxed">
            Creative. Data-Driven. Automated.
            <br />
            Built with focus and precision.
          </p>
        </div>
      </section>

      {/* Services Detail Sections */}
      {servicesData.map((service, index) => (
        <section
          key={service.id}
          id={service.id}
          className={`relative z-10 py-32 px-6 ${index % 2 === 1 ? 'grid-pattern' : ''}`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Left Column */}
              <div>
                <div className="text-6xl font-mono text-chalk-gray/30 mb-4">
                  {service.number}
                </div>
                <h2 className="text-5xl md:text-6xl font-bold mb-4">
                  {service.title}
                </h2>
                <p className="text-2xl text-chalk-gray mb-8">{service.tagline}</p>
                <div className="w-24 h-px bg-chalk-white mb-8" />
                <p className="text-xl text-chalk-gray leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Right Column */}
              <div className="space-y-12">
                {/* Capabilities */}
                <div>
                  <h3 className="font-mono text-sm tracking-wider text-chalk-gray mb-6">
                    CAPABILITIES
                  </h3>
                  <ul className="space-y-3">
                    {service.capabilities.map((capability, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-chalk-gray hover:text-chalk-white transition-colors"
                      >
                        <span className="text-chalk-white mt-1">→</span>
                        <span>{capability}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Process */}
                <div>
                  <h3 className="font-mono text-sm tracking-wider text-chalk-gray mb-6">
                    OUR PROCESS
                  </h3>
                  <div className="space-y-3">
                    {service.process.map((step, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 text-chalk-gray hover:text-chalk-white transition-colors"
                      >
                        <span className="font-mono text-xs text-chalk-gray/50">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Let's Discuss Your Project
          </h2>
          <p className="text-xl text-chalk-gray mb-8">
            Every project starts with a conversation.
          </p>
          <a
            href="/contact"
            className="inline-block px-12 py-4 border border-chalk-white hover:bg-chalk-white hover:text-chalk-black transition-all duration-300 font-mono text-sm tracking-wider"
          >
            START A PROJECT
          </a>
        </div>
      </section>
    </main>
  );
}
