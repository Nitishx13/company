'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useGmbqynAuth } from '@/lib/gmbqyn/auth-context';
import { isDemoMode } from '@/lib/gmbqyn';
import { ErrorNote, Field, GhostButton, Input, PrimaryButton } from '../components/ui';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useGmbqynAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const next = params.get('next');
  const safeNext = next && next.startsWith('/gmbqyn') ? next : null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const session = await login({ email: email.trim(), password });
      const fallback = session.user.role === 'admin' ? '/gmbqyn/admin/dashboard' : '/gmbqyn/dashboard';
      router.push(safeNext ?? fallback);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setPending(false);
    }
  };

  const fill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-16">
      <Link href="/gmbqyn" className="mb-10 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#ff5f91] to-[#7b5bff] text-xs font-bold text-white">
          G
        </span>
        <span className="text-sm font-bold tracking-[0.25em] text-white">GMBQYN</span>
      </Link>

      <h1 className="text-3xl font-bold text-white">Welcome back</h1>
      <p className="mt-2 text-sm text-chalk-gray">Sign in to your dashboard to manage reviews and subscriptions.</p>

      <form onSubmit={submit} className="mt-8 space-y-5">
        {error ? <ErrorNote message={error} /> : null}

        <Field label="Email address">
          <Input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@business.in"
          />
        </Field>

        <Field label="Password">
          <Input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
          />
        </Field>

        <PrimaryButton type="submit" disabled={pending} className="w-full">
          {pending ? 'Signing in…' : 'Sign in'}
        </PrimaryButton>
      </form>

      {isDemoMode() ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-chalk-gray">Demo accounts</p>
          <div className="mt-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => fill('customer@gmbqyn.in')}
              className="rounded-xl border border-white/10 px-4 py-3 text-left text-xs text-chalk-gray transition hover:border-white/30 hover:text-white"
            >
              <span className="block font-mono text-white">customer@gmbqyn.in</span>
              <span>Business dashboard · password</span>
            </button>
            <button
              type="button"
              onClick={() => fill('admin@gmbqyn.in')}
              className="rounded-xl border border-white/10 px-4 py-3 text-left text-xs text-chalk-gray transition hover:border-white/30 hover:text-white"
            >
              <span className="block font-mono text-white">admin@gmbqyn.in</span>
              <span>Master admin · password</span>
            </button>
          </div>
        </div>
      ) : null}

      <p className="mt-8 text-center text-sm text-chalk-gray">
        New to GMBQYN?{' '}
        <Link href="/gmbqyn/register" className="text-white underline underline-offset-4">
          Create an account
        </Link>
      </p>
      <div className="mt-10 text-center">
        <GhostButton href="/gmbqyn">Back to GMBQYN home</GhostButton>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
