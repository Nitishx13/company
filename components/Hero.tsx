'use client';

import { useEffect, useRef } from 'react';

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    // Animate letters on load
    const letters = title.querySelectorAll('.letter');
    letters.forEach((letter, index) => {
      setTimeout(() => {
        letter.classList.add('opacity-100', 'translate-y-0');
      }, index * 50);
    });
  }, []);

  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span
        key={index}
        className="letter inline-block opacity-0 translate-y-4 transition-all duration-500"
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Logo/Symbol */}
        <div className="mb-12 flex justify-center">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="animate-float"
          >
            {/* Monolith symbol - a geometric representation */}
            <rect
              x="40"
              y="20"
              width="40"
              height="80"
              className="chalk-line"
              strokeDasharray="240"
              strokeDashoffset="240"
              style={{
                animation: 'draw 2s ease-out forwards',
              }}
            />
            <line
              x1="40"
              y1="60"
              x2="80"
              y2="60"
              className="chalk-line"
              strokeDasharray="40"
              strokeDashoffset="40"
              style={{
                animation: 'draw 2s ease-out 0.5s forwards',
              }}
            />
            <circle
              cx="60"
              cy="60"
              r="35"
              className="chalk-line"
              strokeDasharray="220"
              strokeDashoffset="220"
              style={{
                animation: 'draw 2s ease-out 1s forwards',
              }}
            />
          </svg>
        </div>

        {/* Main heading */}
        <h1
          ref={titleRef}
          className="text-6xl md:text-8xl font-bold mb-6 tracking-tight"
        >
          {splitText('ONYXRY')}
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-chalk-gray mb-8 max-w-3xl mx-auto leading-relaxed">
          We build technology and businesses that elevate human potential —
          <br />
          through design, logic, and deep care.
        </p>

        {/* Divider line */}
        <div className="w-32 h-px bg-chalk-white mx-auto mb-8" />

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#contact"
            className="group relative px-8 py-4 border border-chalk-white hover:bg-chalk-white hover:text-chalk-black transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 font-mono text-sm tracking-wider">
              START A PROJECT
            </span>
            <div className="absolute inset-0 bg-chalk-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          </a>
          <a
            href="#services"
            className="px-8 py-4 text-chalk-gray hover:text-chalk-white transition-colors duration-300 font-mono text-sm tracking-wider"
          >
            EXPLORE SERVICES →
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs text-chalk-gray font-mono tracking-wider">
              SCROLL
            </span>
            <svg width="20" height="30" viewBox="0 0 20 30">
              <line
                x1="10"
                y1="0"
                x2="10"
                y2="20"
                className="chalk-line"
                strokeWidth="1"
              />
              <polyline
                points="5,15 10,20 15,15"
                className="chalk-line"
                strokeWidth="1"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
