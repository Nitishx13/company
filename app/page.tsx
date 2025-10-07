'use client';

import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Philosophy from '@/components/Philosophy';
import MathBackground from '@/components/MathBackground';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <MathBackground />
      <Hero />
      <Services />
      <Philosophy />
      
      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Something Meaningful?
          </h2>
          <p className="text-xl text-chalk-gray mb-8">
            Let's create technology that matters.
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
