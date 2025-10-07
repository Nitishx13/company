'use client';

import MathBackground from '@/components/MathBackground';

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <MathBackground />
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            About Onyxry
          </h1>
          <div className="w-32 h-px bg-chalk-white mx-auto mb-8" />
          <p className="text-xl md:text-2xl text-chalk-gray leading-relaxed">
            We are a collective of designers, engineers, and thinkers
            <br />
            building technology that serves humanity.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">Our Mission</h2>
              <div className="w-24 h-px bg-chalk-white mb-6" />
              <p className="text-xl text-chalk-gray leading-relaxed mb-6">
                We believe technology should elevate human potential, not diminish it.
                Every line of code, every pixel, every interaction should serve a
                meaningful purpose.
              </p>
              <p className="text-xl text-chalk-gray leading-relaxed">
                We combine mathematical precision with artistic sensibility to create
                experiences that feel inevitable, clear, and deeply human.
              </p>
            </div>
            <div className="flex justify-center">
              <svg width="400" height="400" viewBox="0 0 400 400">
                <circle cx="200" cy="200" r="150" className="chalk-line" opacity="0.3" />
                <circle cx="200" cy="200" r="100" className="chalk-line" opacity="0.5" />
                <circle cx="200" cy="200" r="50" className="chalk-line" />
                <line x1="200" y1="50" x2="200" y2="350" className="chalk-line" opacity="0.3" />
                <line x1="50" y1="200" x2="350" y2="200" className="chalk-line" opacity="0.3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative z-10 py-32 px-6 grid-pattern">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-16 text-center">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Clarity',
                description: 'We cut through complexity to find elegant solutions. Every decision is intentional, every element has purpose.',
              },
              {
                title: 'Craft',
                description: 'We obsess over details. From typography to timing, we believe excellence lives in the smallest decisions.',
              },
              {
                title: 'Care',
                description: 'We build for people, not metrics. Technology should improve lives, solve real problems, and respect humanity.',
              },
            ].map((value, index) => (
              <div
                key={index}
                className="border border-chalk-gray/30 p-8 hover:border-chalk-white transition-all duration-300"
              >
                <h3 className="text-3xl font-bold mb-4">{value.title}</h3>
                <p className="text-chalk-gray leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Who We Are</h2>
          <div className="w-24 h-px bg-chalk-white mb-12" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-2xl font-bold mb-4">A Global Collective</h3>
              <p className="text-chalk-gray leading-relaxed mb-6">
                We're a remote-first team of specialists from around the world.
                Designers who code. Engineers who design. Thinkers who build.
              </p>
              <p className="text-chalk-gray leading-relaxed">
                We believe the best work happens when diverse perspectives come
                together around shared principles and a common mission.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Our Approach</h3>
              <p className="text-chalk-gray leading-relaxed mb-6">
                We don't follow trends. We study fundamentals — mathematics, physics,
                psychology, design theory — and apply them to create timeless solutions.
              </p>
              <p className="text-chalk-gray leading-relaxed">
                Every project starts with deep listening. We seek to understand not
                just what you want to build, but why it matters.
              </p>
            </div>
          </div>
        </div>
      </section>

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
            GET IN TOUCH
          </a>
        </div>
      </section>
    </main>
  );
}
