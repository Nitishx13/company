"use client";

import MathBackground from '@/components/MathBackground';

export default function ThankYouPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <MathBackground />
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight neon-text">Thank You</h1>
          <div className="w-24 h-px bg-chalk-white mx-auto mb-8" />
          <p className="text-xl text-chalk-gray leading-relaxed mb-8">
            We7ve received your enquiry. Our team will get back to you soon.
          </p>
          <a
            href="/"
            className="inline-block px-12 py-4 border border-chalk-white hover:bg-chalk-white hover:text-chalk-black transition-all duration-300 font-mono text-sm tracking-wider"
          >
            BACK TO HOME
          </a>
        </div>
      </section>
    </main>
  );
}
