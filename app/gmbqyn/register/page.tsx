'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useGmbqynAuth } from '@/lib/gmbqyn/auth-context';
import { CATEGORIES, PLAN_CATALOGUE, inr, planPricePerMonth } from '@/lib/gmbqyn';
import type { BillingCycle, RegisterPayload } from '@/lib/gmbqyn';
import { ErrorNote, Field, GhostButton, Input, PrimaryButton, Select, SuccessNote } from '../components/ui';

const STEPS = ['Your account', 'Your business', 'Your plan'] as const;

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useGmbqynAuth();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState<RegisterPayload>({
    name: '',
    email: '',
    phone: '',
    password: '',
    business_name: '',
    category: CATEGORIES[0],
    city: '',
    state: '',
    country: 'India',
    plan_code: 'growth',
    billing_cycle: 'monthly',
  });

  const set = <K extends keyof RegisterPayload>(key: K, value: RegisterPayload[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const accountValid = form.name.trim().length > 1 && /\S+@\S+\.\S+/.test(form.email) && form.password.length >= 8;
  const businessValid = form.business_name.trim().length > 1 && form.city.trim().length > 1 && form.state.trim().length > 1;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await register({ ...form, email: form.email.trim().toLowerCase() });
      setDone(true);
      router.push('/gmbqyn/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create your account.');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <Link href="/gmbqyn" className="mb-10 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#ff5f91] to-[#7b5bff] text-xs font-bold text-white">
          G
        </span>
        <span className="text-sm font-bold tracking-[0.25em] text-white">GMBQYN</span>
      </Link>

      <h1 className="text-3xl font-bold text-white">Create your account</h1>
      <p className="mt-2 text-sm text-chalk-gray">14-day free trial. No card required.</p>

      <ol className="mt-10 flex items-center gap-3">
        {STEPS.map((label, index) => (
          <li key={label} className="flex flex-1 flex-col gap-2">
            <span
              className={`h-1 rounded-full ${index <= step ? 'bg-gradient-to-r from-[#ff5f91] to-[#7b5bff]' : 'bg-white/10'}`}
            />
            <span className={`text-[10px] uppercase tracking-[0.25em] ${index <= step ? 'text-white' : 'text-chalk-gray'}`}>
              {label}
            </span>
          </li>
        ))}
      </ol>

      {done ? <SuccessNote message="Account created — taking you to your dashboard." /> : null}

      <form onSubmit={submit} className="mt-10 space-y-6 rounded-[28px] border border-white/10 bg-black/50 p-7 backdrop-blur">
        {error ? <ErrorNote message={error} /> : null}

        {step === 0 ? (
          <div className="space-y-5">
            <Field label="Your name">
              <Input required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Aarav Sharma" />
            </Field>
            <Field label="Email address">
              <Input
                type="email"
                required
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="you@business.in"
              />
            </Field>
            <Field label="Phone number">
              <Input
                required
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="+91 98765 43210"
              />
            </Field>
            <Field label="Password" hint="At least 8 characters.">
              <Input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                placeholder="••••••••"
              />
            </Field>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-5">
            <Field label="Business name">
              <Input
                required
                value={form.business_name}
                onChange={(e) => set('business_name', e.target.value)}
                placeholder="Kanha Coffee House"
              />
            </Field>
            <Field label="Category">
              <Select value={form.category} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category} className="bg-black">
                    {category}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="City">
                <Input required value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Indore" />
              </Field>
              <Field label="State">
                <Input required value={form.state} onChange={(e) => set('state', e.target.value)} placeholder="Madhya Pradesh" />
              </Field>
            </div>
            <Field label="Country">
              <Input value={form.country} onChange={(e) => set('country', e.target.value)} />
            </Field>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-5">
            <Field label="Billing cycle">
              <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 p-1">
                {(['monthly', 'yearly'] as BillingCycle[]).map((cycle) => (
                  <button
                    key={cycle}
                    type="button"
                    onClick={() => set('billing_cycle', cycle)}
                    aria-pressed={form.billing_cycle === cycle}
                    className={`rounded-full px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] transition ${
                      form.billing_cycle === cycle ? 'bg-white text-black' : 'text-chalk-gray'
                    }`}
                  >
                    {cycle}
                  </button>
                ))}
              </div>
            </Field>

            <div className="space-y-3">
              {PLAN_CATALOGUE.map((plan) => (
                <label
                  key={plan.code}
                  className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition ${
                    form.plan_code === plan.code ? 'border-white/40 bg-white/5' : 'border-white/10 hover:border-white/25'
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={plan.code}
                    checked={form.plan_code === plan.code}
                    onChange={() => set('plan_code', plan.code)}
                    className="mt-1.5 accent-[#7b5bff]"
                  />
                  <span className="flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-white">{plan.name}</span>
                      <span className="text-sm font-semibold text-white">
                        {inr(planPricePerMonth(plan, form.billing_cycle))}
                        <span className="text-xs font-normal text-chalk-gray">/mo</span>
                      </span>
                    </span>
                    <span className="mt-1 block text-xs text-chalk-gray">{plan.tagline}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-4 pt-2">
          <GhostButton onClick={() => (step === 0 ? router.push('/gmbqyn/login') : setStep((s) => s - 1))}>
            {step === 0 ? 'Back to sign in' : 'Back'}
          </GhostButton>
          {step < 2 ? (
            <PrimaryButton
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 0 ? !accountValid : !businessValid}
            >
              Continue
            </PrimaryButton>
          ) : (
            <PrimaryButton type="submit" disabled={pending}>
              {pending ? 'Creating account…' : 'Create account'}
            </PrimaryButton>
          )}
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-chalk-gray">
        Already registered?{' '}
        <Link href="/gmbqyn/login" className="text-white underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
