import { NextResponse, type NextRequest } from 'next/server';

const ROLE_COOKIE = 'gmbqyn_role';
const PUBLIC_PREFIXES = ['/gmbqyn/login', '/gmbqyn/register', '/gmbqyn/r/', '/gmbqyn/pricing'];

const isPublic = (pathname: string) =>
  pathname === '/gmbqyn' ||
  PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix));

/**
 * Route-level navigation guard for the GMBQYN module.
 *
 * This only reads a non-sensitive role cookie so the browser avoids flashing
 * protected screens before the session resolves. It is NOT a security
 * boundary — the Laravel API authorises every request, and any real access
 * control must live server-side there.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/gmbqyn') || isPublic(pathname)) return NextResponse.next();

  const role = request.cookies.get(ROLE_COOKIE)?.value;

  if (role === 'admin' && pathname.startsWith('/gmbqyn/admin')) return NextResponse.next();
  if (role === 'customer' && !pathname.startsWith('/gmbqyn/admin')) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = '/gmbqyn/login';
  url.search = `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/gmbqyn/:path*'],
};
