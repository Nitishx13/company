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
            About Pinaqyn Tech
          </h1>
          <div className="w-32 h-px bg-chalk-white mx-auto mb-8" />
          <p className="text-xl md:text-2xl text-chalk-gray leading-relaxed">
            We’re a boutique digital agency founded by two passionate creators who
            believe technology and design should work hand in hand.
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
                We help startups and businesses turn ideas into impactful digital experiences —
                combining brand strategy, data-driven marketing, and cutting-edge automation
                to scale with precision.
              </p>
              <p className="text-xl text-chalk-gray leading-relaxed">
                Our approach blends strategic thinking, technical expertise, and AI-driven innovation
                to help brands evolve and thrive in the digital era.
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
          <h2 className="text-5xl md:text-6xl font-bold mb-16 text-center">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Innovation',
                description: 'We embrace change and push creative boundaries to find better ways to solve real problems.',
              },
              {
                title: 'Integrity',
                description: 'We build relationships based on trust and transparency — always doing the right thing for our clients and users.',
              },
              {
                title: 'Impact',
                description: 'We focus on measurable results that matter — creative work backed by data and performance.',
              },
              {
                title: 'Simplicity',
                description: 'We streamline the complex with automation and design clarity — less noise, more signal.',
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
              <h3 className="text-2xl font-bold mb-4">A Boutique Team</h3>
              <p className="text-chalk-gray leading-relaxed mb-6">
                Founded by two creators who blend strategy, design, and engineering — we operate remotely and collaborate globally.
              </p>
              <p className="text-chalk-gray leading-relaxed">
                We bring in the right specialists for each project and keep teams lean, focused, and effective.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Our Approach</h3>
              <p className="text-chalk-gray leading-relaxed mb-6">
                Strategy first. Then design and engineering. We prioritize systems that scale — with clarity and measurable outcomes.
              </p>
              <p className="text-chalk-gray leading-relaxed">
                Every project starts with deep listening. We seek to understand the goals, constraints, and opportunities — then build with precision.
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
