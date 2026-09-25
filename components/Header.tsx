'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavChild = { href: string; label: string };
type NavLeaf = { type: 'leaf'; href: string; label: string };
type NavParent = { type: 'parent'; label: string; children: NavChild[] };
type NavItem = NavLeaf | NavParent;

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

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  const navLinks: NavItem[] = [
    { type: 'leaf', href: '/', label: 'Home' },
    { type: 'leaf', href: '/about', label: 'About' },
    { type: 'leaf', href: '/services', label: 'Services' },
    { type: 'leaf', href: '/capabilities', label: 'Capabilities' },
    {
      type: 'parent',
      label: 'Product',
      children: [{ href: '/gmbqyn', label: 'GMBQYN' }],
    },
    { type: 'leaf', href: '/contact', label: 'Contact' },
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
            {navLinks.map((link) =>
              link.type === 'leaf' ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-mono text-sm tracking-wider transition-colors duration-300 relative group ${
                    isActive(link.href) ? 'text-chalk-white' : 'text-chalk-gray hover:text-chalk-white'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-chalk-white transition-all duration-300 ${
                      isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              ) : (
                <div key={link.label} className="relative group">
                  <span
                    className={`flex items-center gap-1.5 font-mono text-sm tracking-wider transition-colors duration-300 cursor-default ${
                      link.children.some((child) => isActive(child.href))
                        ? 'text-chalk-white'
                        : 'text-chalk-gray group-hover:text-chalk-white'
                    }`}
                  >
                    {link.label}
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      className="transition-transform duration-300 group-hover:rotate-180"
                    >
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  </span>
                  <div className="absolute left-0 top-full pt-3 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200">
                    <div className="min-w-[220px] bg-chalk-dark/95 backdrop-blur-sm border border-chalk-gray/30 py-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`flex items-center justify-between gap-6 px-4 py-2.5 font-mono text-sm tracking-wider transition-colors duration-300 ${
                            isActive(child.href)
                              ? 'text-chalk-white bg-chalk-gray/10'
                              : 'text-chalk-gray hover:text-chalk-white hover:bg-chalk-gray/10'
                          }`}
                        >
                          {child.label}
                          <span className="text-[10px] tracking-widest opacity-60">↗</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )
            )}
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
            isMenuOpen ? 'max-h-[32rem] mt-6' : 'max-h-0'
          }`}
        >
          <div className="flex flex-col gap-4 py-4 border-t border-chalk-gray/20">
            {navLinks.map((link) =>
              link.type === 'leaf' ? (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-mono text-sm tracking-wider transition-colors duration-300 ${
                    isActive(link.href) ? 'text-chalk-white' : 'text-chalk-gray hover:text-chalk-white'
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <div key={link.label} className="flex flex-col gap-3">
                  <span className="font-mono text-sm tracking-wider text-chalk-gray">{link.label}</span>
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`font-mono text-sm tracking-wider transition-colors duration-300 pl-4 border-l border-chalk-gray/30 ${
                        isActive(child.href)
                          ? 'text-chalk-white border-chalk-white'
                          : 'text-chalk-gray hover:text-chalk-white'
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
