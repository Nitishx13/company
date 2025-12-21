'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Work', href: '/work' },
      { label: 'Contact', href: '/contact' },
    ],
    services: [
      { label: 'Branding & Strategy', href: '/services/branding' },
      { label: 'Web & Development', href: '/services/web-development' },
      { label: 'Marketing & SEO', href: '/services/marketing' },
      { label: 'AI & Automation', href: '/services/ai-automation' },
    ],
    social: [
      { label: 'LinkedIn', href: 'https://linkedin.com' },
      { label: 'Instagram', href: 'https://instagram.com' },
      { label: 'X', href: 'https://x.com' },
      { label: 'YouTube', href: 'https://youtube.com' },
    ],
  };

  return (
    <footer className="relative z-10 border-t border-chalk-gray/30 mt-32">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <svg
                width="40"
                height="40"
                viewBox="0 0 120 120"
                className="transition-transform duration-300 group-hover:scale-110"
              >
                <rect x="40" y="20" width="40" height="80" className="chalk-line" />
                <line x1="40" y1="60" x2="80" y2="60" className="chalk-line" />
                <circle cx="60" cy="60" r="35" className="chalk-line" />
              </svg>
              <span className="text-xl font-bold tracking-tight group-hover:neon-text transition-all">PINAQYN TECH</span>
            </Link>
            <p className="text-chalk-gray text-sm leading-relaxed mb-6">
              Empowering digital growth through creativity, technology, and AI.
            </p>
            <div className="flex gap-4">
              {footerLinks.social.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-chalk-gray hover:text-chalk-white transition-colors duration-300"
                  aria-label={link.label}
                >
                  <span className="text-xs">{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-mono text-xs tracking-wider text-chalk-gray mb-4">
              COMPANY
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-chalk-gray hover:text-chalk-white transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-mono text-xs tracking-wider text-chalk-gray mb-4">
              SERVICES
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-chalk-gray hover:text-chalk-white transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-mono text-xs tracking-wider text-chalk-gray mb-4">
              GET IN TOUCH
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:pinaqyn@gmail.com"
                  className="text-chalk-gray hover:text-chalk-white transition-colors duration-300 text-sm"
                >
                  pinaqyn@gmail.com
                </a>
              </li>
              <li className="text-chalk-gray text-sm">
                Remote — working globally
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-chalk-gray/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-chalk-gray text-sm">
              © {currentYear} Pinaqyn Tech.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-chalk-gray hover:text-chalk-white transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-chalk-gray hover:text-chalk-white transition-colors duration-300"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-chalk-white/20 to-transparent" />
    </footer>
  );
}
