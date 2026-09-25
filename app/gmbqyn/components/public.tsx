'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { useGmbqynAuth } from '@/lib/gmbqyn/auth-context';
import { GhostButton, PrimaryButton } from './ui';

const links = [
  { href: '/gmbqyn', label: 'Home' },
  { href: '/gmbqyn/pricing', label: 'Pricing' },
];

export function PublicHeader() {
  const pathname = usePathname();
  const { isAuthenticated, isAdmin } = useGmbqynAuth();
  const [open, setOpen] = useState(false);
  const dashboardHref = isAdmin ? '/gmbqyn/admin/dashboard' : '/gmbqyn/dashboard';

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0A0A0A]/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4">
        <Link href="/gmbqyn" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#ff5f91] to-[#7b5bff] text-xs font-bold text-white">
            G
          </span>
          <span className="text-sm font-bold tracking-[0.25em] text-white">GMBQYN</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs uppercase tracking-[0.25em] transition ${
                pathname === link.href ? 'text-white' : 'text-chalk-gray hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <PrimaryButton href={dashboardHref}>Open dashboard</PrimaryButton>
          ) : (
            <>
              <GhostButton href="/gmbqyn/login">Sign in</GhostButton>
              <PrimaryButton href="/gmbqyn/register">Start free</PrimaryButton>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 text-white md:hidden"
        >
          <span aria-hidden="true">{open ? '✕' : '☰'}</span>
        </button>
      </div>

      {open ? (
        <div className="space-y-4 border-t border-white/10 px-5 py-5 md:hidden">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block text-sm text-chalk-gray">
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3">
            {isAuthenticated ? (
              <PrimaryButton href={dashboardHref} className="flex-1">
                Open dashboard
              </PrimaryButton>
            ) : (
              <>
                <GhostButton href="/gmbqyn/login" className="flex-1">
                  Sign in
                </GhostButton>
                <PrimaryButton href="/gmbqyn/register" className="flex-1">
                  Start free
                </PrimaryButton>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 text-center text-xs text-chalk-gray md:flex-row md:items-center md:justify-between md:text-left">
        <p>© {new Date().getFullYear()} GMBQYN — a Pinaqyn product.</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link href="/gmbqyn/pricing" className="transition hover:text-white">
            Pricing
          </Link>
          <Link href="/gmbqyn/login" className="transition hover:text-white">
            Sign in
          </Link>
          <Link href="/gmbqyn/register" className="transition hover:text-white">
            Create account
          </Link>
          <Link href="/" className="transition hover:text-white">
            Pinaqyn.in
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function PublicPage({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
}) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';
  return (
    <div className={`flex flex-col gap-4 ${alignment}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.5em] text-chalk-gray">{eyebrow}</p>
      <h2 className="max-w-2xl text-3xl font-bold leading-tight text-white md:text-4xl">{title}</h2>
      {description ? <p className="max-w-2xl text-sm leading-relaxed text-chalk-gray">{description}</p> : null}
    </div>
  );
}
