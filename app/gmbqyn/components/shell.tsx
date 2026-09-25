'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { useGmbqynAuth } from '@/lib/gmbqyn/auth-context';
import { isDemoMode } from '@/lib/gmbqyn';
import { Avatar, Loading } from './ui';

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
  badge?: number;
}

export function AppShell({
  area,
  items,
  title,
  children,
}: {
  area: 'customer' | 'admin';
  items: NavItem[];
  title: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isAdmin, isLoading, logout, serviceMode } = useGmbqynAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isLoading || !session) return;
    if (area === 'admin' && !isAdmin) router.replace('/gmbqyn/dashboard');
    if (area === 'customer' && isAdmin) router.replace('/gmbqyn/admin/dashboard');
  }, [area, isAdmin, isLoading, router, session]);

  if (isLoading) return <Loading label="Restoring session" />;
  if (!session) {
    if (typeof window !== 'undefined') window.location.replace(`/gmbqyn/login?next=${encodeURIComponent(pathname)}`);
    return <Loading label="Redirecting to sign in" />;
  }

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

  const nav = (
    <nav className="flex flex-col gap-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(item) ? 'page' : undefined}
          className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
            isActive(item)
              ? 'bg-white/10 text-white'
              : 'text-chalk-gray hover:bg-white/5 hover:text-white'
          }`}
        >
          <span aria-hidden="true" className="w-5 text-center text-base leading-none opacity-80">
            {item.icon}
          </span>
          <span className="flex-1">{item.label}</span>
          {typeof item.badge === 'number' && item.badge > 0 ? (
            <span className="rounded-full bg-[#ff5f91] px-2 py-0.5 text-[10px] font-semibold text-white">
              {item.badge}
            </span>
          ) : null}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      {open ? (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[290px] flex-col gap-6 border-r border-white/10 bg-black/80 p-6 backdrop-blur transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Link href="/gmbqyn" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#ff5f91] to-[#7b5bff] text-sm font-bold text-white">
            G
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-[0.2em] text-white">GMBQYN</span>
            <span className="block text-[10px] uppercase tracking-[0.3em] text-chalk-gray">
              {area === 'admin' ? 'Master Admin' : 'Dashboard'}
            </span>
          </span>
        </Link>

        {nav}

        <div className="mt-auto space-y-4">
          {session.business ? (
            <Link
              href={area === 'admin' ? `/gmbqyn/admin/businesses?q=${session.business.name}` : '/gmbqyn/dashboard'}
              className="block rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-chalk-gray">Signed in</p>
              <p className="mt-2 truncate text-sm font-semibold text-white">{session.business.name}</p>
              <p className="truncate text-xs text-chalk-gray">{session.user.email}</p>
            </Link>
          ) : null}

          <button
            type="button"
            onClick={logout}
            className="w-full rounded-2xl border border-white/15 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-chalk-gray transition hover:border-white/40 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-[290px]">
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-white/10 bg-[#0A0A0A]/85 px-5 py-4 backdrop-blur lg:px-10">
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 text-white lg:hidden"
          >
            <span aria-hidden="true">☰</span>
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{title}</p>
            <p className="truncate text-xs text-chalk-gray">{session.user.name}</p>
          </div>
          <Link
            href={area === 'admin' ? '/gmbqyn' : '/gmbqyn/dashboard'}
            className="hidden rounded-full border border-white/15 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-chalk-gray transition hover:text-white sm:inline-flex"
          >
            {area === 'admin' ? 'Customer view' : 'Back to site'}
          </Link>
          {isDemoMode() ? (
            <span className="hidden rounded-full border border-[#ffb020]/40 bg-[#ffb020]/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ffb020] sm:inline-flex">
              Demo · {serviceMode}
            </span>
          ) : null}
          <Avatar name={session.user.name} size={36} />
        </header>

        <main className="flex-1 px-5 py-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
