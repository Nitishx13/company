export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-hidden grid-pattern">
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-32">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-14">
            <h1 className="text-6xl md:text-8xl font-bold mb-6">Contact</h1>
            <div className="w-24 h-px bg-chalk-white mx-auto mb-6" />
            <p className="text-xl text-chalk-gray leading-relaxed">
              Reach us directly via email or WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="mailto:pinaqyn@gmail.com"
              className="rounded-[32px] border border-chalk-gray/30 bg-black/40 p-10 backdrop-blur transition-colors hover:border-chalk-white"
            >
              <div className="font-mono text-xs tracking-wider text-chalk-gray mb-3">EMAIL</div>
              <div className="text-2xl font-semibold">pinaqyn@gmail.com</div>
              <div className="mt-4 text-chalk-gray text-sm">Tap to email us</div>
            </a>

            <a
              href="https://wa.me/918882816805"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[32px] border border-chalk-gray/30 bg-black/40 p-10 backdrop-blur transition-colors hover:border-chalk-white"
            >
              <div className="font-mono text-xs tracking-wider text-chalk-gray mb-3">WHATSAPP</div>
              <div className="text-2xl font-semibold">+91 8882816805</div>
              <div className="mt-4 text-chalk-gray text-sm">Tap to chat on WhatsApp</div>
            </a>
          </div>

          <div className="mt-8 text-center text-chalk-gray text-sm">
            Prefer another number? WhatsApp us at{' '}
            <a
              href="https://wa.me/919958571141"
              target="_blank"
              rel="noopener noreferrer"
              className="text-chalk-white hover:underline"
            >
              +91 9958571141
            </a>
            .
          </div>
        </div>
      </section>
    </main>
  );
}
