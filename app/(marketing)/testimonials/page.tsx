'use client';

import MathBackground from '@/components/MathBackground';

const testimonials = [
  {
    quote:
      'They shaped our message, automated our funnels, and launched campaigns that scaled in weeks.',
    author: 'Priya N., Founder, Nucleus Labs',
  },
  {
    quote:
      'Insightful strategy, beautiful execution. We hit our revenue targets in the first quarter.',
    author: 'Marco D., COO, Rise Collective',
  },
];

export default function TestimonialsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <MathBackground />
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className="text-xs uppercase tracking-[0.6em] text-white/50">Testimonials</p>
            <h1 className="text-5xl font-extrabold text-white">Clients that keep coming back</h1>
            <p className="text-lg text-white/70">
              Measurable results meet craftsmanship — here’s what partners say about working with us.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.author}
                className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#11141a] to-[#0b0e16] p-8 text-white shadow-[0_25px_55px_rgba(0,0,0,0.65)]"
              >
                <p className="text-lg leading-relaxed text-white/80">{testimonial.quote}</p>
                <p className="mt-6 text-sm uppercase tracking-[0.3em] text-white/60">{testimonial.author}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
