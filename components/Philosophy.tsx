'use client';

import { useRef } from 'react';

const principles = [
  {
    title: 'Human-First Tech',
    description: 'All solutions serve real human needs, improve well-being, or solve meaningful problems.',
    formula: 'f(x) = human_value',
  },
  {
    title: 'Mathematics + Art',
    description: 'Using mathematical elegance to design smooth, dynamic, and intelligent experiences.',
    formula: '∫ design · logic dx',
  },
  {
    title: 'Monochrome Aesthetic',
    description: 'Clarity, focus, and contrast — like chalk on a blackboard.',
    formula: 'Σ(simplicity)',
  },
  {
    title: 'World-Class Experience',
    description: 'Every pixel, interaction, and flow must feel inevitable, clear, and designed.',
    formula: 'lim(quality → ∞)',
  },
  {
    title: 'Technology with Purpose',
    description: 'We build meaningful systems that help people, not just technology for its own sake.',
    formula: 'purpose ⊃ tech',
  },
];

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative z-10 min-h-screen py-32 px-6 grid-pattern"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-20 text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            Core Principles
          </h2>
          <div className="w-24 h-px bg-chalk-white mx-auto mb-6" />
          <p className="text-xl text-chalk-gray max-w-2xl mx-auto">
            The foundation of everything we create.
            <br />
            Mathematics meets humanity.
          </p>
        </div>

        {/* Principles list */}
        <div className="space-y-12 max-w-4xl mx-auto">
          {principles.map((principle, index) => (
            <div
              key={index}
              className="principle-item opacity-100 translate-x-0 transition-all duration-700"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="border-l-2 border-chalk-white/30 pl-8 py-4 hover:border-chalk-white transition-colors duration-300">
                {/* Formula */}
                <div className="font-mono text-sm text-chalk-gray mb-3">
                  {principle.formula}
                </div>

                {/* Title */}
                <h3 className="text-3xl font-bold mb-3">{principle.title}</h3>

                {/* Description */}
                <p className="text-chalk-gray leading-relaxed text-lg">
                  {principle.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Visual element */}
        <div className="mt-20 flex justify-center">
          <svg width="400" height="200" viewBox="0 0 400 200">
            {/* Mathematical visualization */}
            <path
              d="M 50 100 Q 100 50, 150 100 T 250 100 T 350 100"
              className="chalk-line"
              strokeDasharray="500"
              strokeDashoffset="500"
              style={{
                animation: 'draw 3s ease-out forwards',
              }}
            />
            
            {/* Grid points */}
            {[50, 150, 250, 350].map((x, i) => (
              <circle
                key={i}
                cx={x}
                cy="100"
                r="3"
                fill="#FAFAFA"
                opacity="0"
                style={{
                  animation: `fadeIn 0.5s ease-out ${1 + i * 0.2}s forwards`,
                }}
              />
            ))}
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
}
