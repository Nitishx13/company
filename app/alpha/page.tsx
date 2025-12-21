"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export default function AlphaToolsPage() {
  const expectedCode = 'alpha9899';
  const storageKey = useMemo(() => 'pinaqyn_alpha_access_v1', []);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved === '1') setIsUnlocked(true);
    } catch {
      // ignore
    }
  }, [storageKey]);

  const submit = () => {
    if (code.trim() !== expectedCode) {
      setError('Invalid code');
      return;
    }
    setError(null);
    setIsUnlocked(true);
    try {
      sessionStorage.setItem(storageKey, '1');
    } catch {
      // ignore
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden grid-pattern">
      <section className="relative z-10 min-h-screen px-6 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-bold">Alpha</h1>
            <div className="w-24 h-px bg-chalk-white mx-auto mt-6 mb-6" />
            <p className="text-lg text-chalk-gray">Internal tools.</p>
          </div>

          {isUnlocked ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                href="/proposal"
                className="group rounded-[28px] border border-white/10 bg-black/50 backdrop-blur p-8 transition hover:border-white/25"
              >
                <div className="text-xs font-mono uppercase tracking-[0.35em] text-chalk-gray">Tool</div>
                <div className="mt-3 text-2xl font-bold text-chalk-white">Proposal Generator</div>
                <div className="mt-3 text-sm text-chalk-gray">Create a single-page proposal PDF for any client.</div>
                <div className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white shadow-[0_15px_30px_rgba(255,95,145,0.25)]">
                  Open
                </div>
              </Link>

              <Link
                href="/letterhead"
                className="group rounded-[28px] border border-white/10 bg-black/50 backdrop-blur p-8 transition hover:border-white/25"
              >
                <div className="text-xs font-mono uppercase tracking-[0.35em] text-chalk-gray">Tool</div>
                <div className="mt-3 text-2xl font-bold text-chalk-white">Letterhead</div>
                <div className="mt-3 text-sm text-chalk-gray">Header + footer with one big content box (PDF).</div>
                <div className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white shadow-[0_15px_30px_rgba(255,95,145,0.25)]">
                  Open
                </div>
              </Link>

              <Link
                href="/instagram-post"
                className="group rounded-[28px] border border-white/10 bg-black/50 backdrop-blur p-8 transition hover:border-white/25"
              >
                <div className="text-xs font-mono uppercase tracking-[0.35em] text-chalk-gray">Tool</div>
                <div className="mt-3 text-2xl font-bold text-chalk-white">Instagram Post Generator</div>
                <div className="mt-3 text-sm text-chalk-gray">Upload background (30% opacity), add text, and download PNG.</div>
                <div className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white shadow-[0_15px_30px_rgba(255,95,145,0.25)]">
                  Open
                </div>
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      {!isUnlocked ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-[28px] border border-white/10 bg-black/70 backdrop-blur p-8">
            <div className="text-xs font-mono uppercase tracking-[0.35em] text-chalk-gray">Access</div>
            <div className="mt-3 text-2xl font-bold text-chalk-white">Enter code</div>
            <div className="mt-3 text-sm text-chalk-gray">This page is hidden. Enter the alpha code to continue.</div>

            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit();
              }}
              className="mt-6 w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
              placeholder="Enter code"
              autoFocus
            />

            {error ? <div className="mt-3 text-sm text-red-400">{error}</div> : null}

            <button
              type="button"
              onClick={submit}
              className="mt-6 w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff] px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_15px_30px_rgba(255,95,145,0.35)] transition hover:shadow-[0_25px_45px_rgba(123,91,255,0.35)]"
            >
              Unlock
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
