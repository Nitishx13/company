'use client';

export default function Hero() {
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20">
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#11141a] via-[#0b0d13] to-[#010203]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(80,115,255,0.2), transparent 50%), radial-gradient(circle at 80% 10%, rgba(255,0,128,0.25), transparent 45%)',
          filter: 'blur(0.5px)',
        }}
        aria-hidden="true"
      />
      <div className="relative max-w-6xl w-full space-y-10 text-center">
        <div className="space-y-6 px-6">
          <p className="text-sm font-mono uppercase tracking-[0.8em] text-white/60">
            A digital marketing agency
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
            A digital marketing agency for{' '}
            <span className="bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              businesses
            </span>{' '}
            looking for{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              serious growth
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-base md:text-lg text-white/80 leading-relaxed">
            Request a free review of your website and digital marketing. We’ll show you how to hit
            your business’s revenue goals and dominate your competitors with a results-driven agency.
          </p>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:justify-center sm:items-center">
          <a
            href="/contact"
            className="relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_15px_30px_rgba(255,95,145,0.4)] transition hover:shadow-[0_25px_40px_rgba(123,91,255,0.35)]"
          >
            Send me a Proposal
          </a>
          <a
            href="#services"
            className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:border-white hover:text-white"
          >
            Book a Discovery Call
          </a>
        </div>

        <div className="mx-auto max-w-3xl border border-white/10 rounded-3xl bg-white/5 px-10 py-12 backdrop-blur space-y-6">
          <p className="text-xs uppercase tracking-[0.5em] text-white/50 mb-3">Partner Integrations</p>
          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
            <span>WooCommerce</span>
            <span>Klavyio</span>
            <span>Mailchimp</span>
            <span>Adobe Commerce</span>
            <span>HubSpot</span>
          </div>
        </div>

      </div>
    </section>
  );
}
