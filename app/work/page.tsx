'use client';

import { useState } from 'react';
import MathBackground from '@/components/MathBackground';

const projects = [
  {
    id: 1,
    title: 'Neural Interface Platform',
    client: 'NeuroTech Labs',
    category: 'AI Development',
    year: '2024',
    description: 'Built an ethical AI system for brain-computer interface research, ensuring transparency and user privacy.',
    tags: ['AI', 'Ethics', 'Healthcare'],
    image: null, // Placeholder for future images
  },
  {
    id: 2,
    title: 'Sustainable Finance App',
    client: 'GreenVest',
    category: 'UX/UI Design',
    year: '2024',
    description: 'Designed an intuitive investment platform that makes sustainable finance accessible to everyone.',
    tags: ['FinTech', 'Design System', 'Mobile'],
  },
  {
    id: 3,
    title: 'Data Visualization Suite',
    client: 'Research Institute',
    category: 'Animation',
    year: '2023',
    description: 'Created interactive mathematical visualizations for complex scientific data using WebGL and Three.js.',
    tags: ['WebGL', 'Data Viz', 'Education'],
  },
  {
    id: 4,
    title: 'E-Commerce Platform',
    client: 'Artisan Collective',
    category: 'Systems Architecture',
    year: '2023',
    description: 'Architected a scalable marketplace connecting artisans with conscious consumers worldwide.',
    tags: ['E-Commerce', 'Cloud', 'API'],
  },
  {
    id: 5,
    title: 'Mental Health Companion',
    client: 'Mindful Tech',
    category: 'UX/UI Design',
    year: '2023',
    description: 'Designed a compassionate mental health app focused on accessibility and user well-being.',
    tags: ['Healthcare', 'Accessibility', 'Mobile'],
  },
  {
    id: 6,
    title: 'Climate Data Dashboard',
    client: 'Environmental NGO',
    category: 'AI Development',
    year: '2023',
    description: 'Built predictive models and visualizations for climate change impact assessment.',
    tags: ['AI', 'Data Science', 'Impact'],
  },
];

const categories = ['All', 'AI Development', 'UX/UI Design', 'Animation', 'Systems Architecture'];

export default function WorkPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <MathBackground />
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            Our Work
          </h1>
          <div className="w-32 h-px bg-chalk-white mx-auto mb-8" />
          <p className="text-xl md:text-2xl text-chalk-gray leading-relaxed">
            Projects that make a difference.
            <br />
            Technology built with purpose and care.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 border font-mono text-sm tracking-wider transition-all duration-300 ${
                  selectedCategory === category
                    ? 'border-chalk-white bg-chalk-white text-chalk-black'
                    : 'border-chalk-gray/30 text-chalk-gray hover:border-chalk-white hover:text-chalk-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="group border border-chalk-gray/30 hover:border-chalk-white transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Project Image Placeholder */}
                <div className="aspect-video bg-chalk-black/50 border-b border-chalk-gray/30 flex items-center justify-center relative overflow-hidden">
                  <svg width="100" height="100" viewBox="0 0 100 100" className="opacity-20">
                    <circle cx="50" cy="50" r="30" className="chalk-line" />
                    <line x1="20" y1="50" x2="80" y2="50" className="chalk-line" />
                    <line x1="50" y1="20" x2="50" y2="80" className="chalk-line" />
                  </svg>
                  <div className="absolute inset-0 bg-chalk-white/5 transform scale-0 group-hover:scale-100 transition-transform duration-500" />
                </div>

                {/* Project Info */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-chalk-gray tracking-wider">
                      {project.category}
                    </span>
                    <span className="font-mono text-xs text-chalk-gray">
                      {project.year}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mb-2 group-hover:glow-text transition-all">
                    {project.title}
                  </h3>

                  <p className="text-chalk-gray text-sm mb-4">{project.client}</p>

                  <p className="text-chalk-gray leading-relaxed mb-6">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 border border-chalk-gray/30 font-mono text-xs text-chalk-gray"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies CTA */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Want to See More?
          </h2>
          <p className="text-xl text-chalk-gray mb-8">
            We'd love to share detailed case studies and discuss how we can help with your project.
          </p>
          <a
            href="/contact"
            className="inline-block px-12 py-4 border border-chalk-white hover:bg-chalk-white hover:text-chalk-black transition-all duration-300 font-mono text-sm tracking-wider"
          >
            GET IN TOUCH
          </a>
        </div>
      </section>
    </main>
  );
}
