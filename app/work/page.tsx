'use client';

import MathBackground from '@/components/MathBackground';
import Image from 'next/image';

const project = {
  name: 'Digntag.in',
  href: 'https://digntag.in',
  screenshotSrc: '/digntag.png',
  description:
    'Digntag.in is a smart digital visiting card platform that helps businesses share profiles instantly with a tap, QR, or link.',
};

export default function WorkPage() {
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
            Selected project
          </p>

          <div className="mt-12 text-left">
            <div className="rounded-[32px] border border-white/10 bg-black/50 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
              <div className="relative aspect-video bg-black/40">
                <Image
                  src={project.screenshotSrc}
                  alt={`${project.name} screenshot`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 900px"
                  priority
                />
              </div>

              <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.6em] text-white/50">Project</p>
                    <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">{project.name}</h2>
                    <p className="mt-4 text-lg text-white/70 leading-relaxed">{project.description}</p>
                  </div>

                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff] px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_15px_30px_rgba(255,95,145,0.35)] transition hover:shadow-[0_25px_45px_rgba(123,91,255,0.35)]"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
