'use client';

import { useState } from 'react';
import MathBackground from '@/components/MathBackground';

const servicesData = [
  {
    id: 'ai',
    number: '01',
    title: 'Ethical AI Development',
    tagline: 'Intelligence with Integrity',
    description: 'We build AI systems that serve humanity with transparency, fairness, and purpose. No black boxes. No bias. Just intelligent solutions that respect human values.',
    capabilities: [
      'AI Strategy & Consulting',
      'Custom Model Development',
      'Ethical AI Frameworks',
      'Bias Detection & Mitigation',
      'Natural Language Processing',
      'Computer Vision Solutions',
    ],
    process: [
      'Discovery & Ethics Assessment',
      'Data Strategy & Preparation',
      'Model Architecture & Training',
      'Testing & Validation',
      'Deployment & Monitoring',
      'Continuous Improvement',
    ],
  },
  {
    id: 'design',
    number: '02',
    title: 'Advanced UX/UI Design',
    tagline: 'Logic Meets Beauty',
    description: 'We create interfaces that feel inevitable. Every interaction is intentional, every flow is optimized, every pixel serves a purpose.',
    capabilities: [
      'User Research & Testing',
      'Information Architecture',
      'Interaction Design',
      'Design Systems',
      'Prototyping & Animation',
      'Accessibility Design',
    ],
    process: [
      'Research & Discovery',
      'User Personas & Journeys',
      'Wireframing & Architecture',
      'Visual Design & Prototyping',
      'User Testing & Iteration',
      'Design System Documentation',
    ],
  },
  {
    id: 'animation',
    number: '03',
    title: 'Mathematical Animations',
    tagline: 'Motion with Meaning',
    description: 'We use parametric curves, fractals, and geometry-driven motion to create animations that feel intelligent and purposeful. Every movement is calculated, every transition is smooth.',
    capabilities: [
      'Parametric Animation Systems',
      'WebGL & Three.js Experiences',
      'SVG Path Animations',
      'Canvas-based Visualizations',
      'Motion Design Systems',
      'Interactive Data Viz',
    ],
    process: [
      'Concept & Mathematical Modeling',
      'Prototyping & Experimentation',
      'Performance Optimization',
      'Integration & Testing',
      'Documentation & Handoff',
      'Ongoing Support',
    ],
  },
  {
    id: 'architecture',
    number: '04',
    title: 'Systems Architecture',
    tagline: 'Built to Scale',
    description: 'We design holistic systems that grow with your business. From technical infrastructure to organizational processes, we build foundations that last.',
    capabilities: [
      'Technical Architecture',
      'API Design & Development',
      'Cloud Infrastructure',
      'Database Design',
      'Microservices Architecture',
      'DevOps & CI/CD',
    ],
    process: [
      'Requirements Analysis',
      'Architecture Design',
      'Technology Selection',
      'Implementation Planning',
      'Migration & Deployment',
      'Monitoring & Optimization',
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
            We build technology with purpose.
            <br />
            Every service is designed to elevate human potential.
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
