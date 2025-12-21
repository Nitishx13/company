'use client';

export default function StickyContactButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
      <a
        href="mailto:pinaqyn@gmail.com"
        className="inline-flex items-center justify-center rounded-full border border-white/20 bg-black/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/90 backdrop-blur transition hover:border-white/50 hover:bg-black/70"
      >
        Email
      </a>
      <a
        href="https://wa.me/918882816805"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_15px_30px_rgba(37,211,102,0.25)] transition hover:shadow-[0_25px_45px_rgba(18,140,126,0.25)]"
      >
        WhatsApp
      </a>
    </div>
  );
}
