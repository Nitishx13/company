'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/work', label: 'Work' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-chalk-dark/95 backdrop-blur-sm border-b border-chalk-gray/20' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <svg
              width="40"
              height="40"
              viewBox="0 0 120 120"
              className="transition-transform duration-300 group-hover:scale-110"
            >
              <rect
                x="40"
                y="20"
                width="40"
                height="80"
                className="chalk-line"
              />
              <line
                x1="40"
                y1="60"
                x2="80"
                y2="60"
                className="chalk-line"
              />
              <circle
                cx="60"
                cy="60"
                r="35"
                className="chalk-line"
              />
            </svg>
            <span className="text-xl font-bold tracking-tight group-hover:neon-text transition-all">PINAQYN TECH</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono text-sm tracking-wider transition-colors duration-300 relative group ${
                  pathname === link.href ? 'text-chalk-white' : 'text-chalk-gray hover:text-chalk-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-chalk-white transition-all duration-300 ${
                    pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-px bg-chalk-white transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`w-6 h-px bg-chalk-white transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`w-6 h-px bg-chalk-white transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-96 mt-6' : 'max-h-0'
          }`}
        >
          <div className="flex flex-col gap-4 py-4 border-t border-chalk-gray/20">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`font-mono text-sm tracking-wider transition-colors duration-300 ${
                  pathname === link.href ? 'text-chalk-white' : 'text-chalk-gray hover:text-chalk-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
