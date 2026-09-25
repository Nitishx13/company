'use client';

import { useState } from 'react';
import { CATEGORIES, PLAN_CATALOGUE, inr, planPrice, planPricePerMonth } from '@/lib/gmbqyn';
import type { BillingCycle } from '@/lib/gmbqyn';
import { PublicPage, SectionHeading } from '../components/public';
import { Card, GhostButton, PrimaryButton } from '../components/ui';

const matrix = [
  { label: 'Permanent review link', values: [true, true, true] },
  { label: 'QR code', values: [true, true, true] },
  { label: 'Branded QR design', values: [false, true, true] },
  { label: 'Private feedback inbox', values: [false, true, true] },
  { label: 'Review analytics', values: [false, true, true] },
  { label: 'Google review sync', values: [false, false, true] },
  { label: 'Multi-location support', values: [false, false, true] },
  { label: 'Reviews per month', values: ['100', '500', 'Unlimited'] },
  { label: 'Seats', values: ['1', '3', '15'] },
  { label: 'Support', values: ['Email', 'Priority email', 'Dedicated'] },
];

export default function PricingPage() {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is there really a free trial?',
      a: 'Yes. Create an account and your plan starts on a 14-day trial with every feature enabled. No card is required, and we only ask for payment when you decide to continue.',
    },
    {
      q: 'How do subscriptions and renewals work?',
      a: 'Subscriptions are billed monthly or yearly. Renewals are processed manually by our team, so you get a reminder and a clear invoice before anything is charged.',
    },
    {
      q: 'Can I use my own branding on the QR code?',
      a: 'Growth and Scale plans let you add your business logo and colours to the QR card, so it blends into your counter, table or invoice.',
    },
    {
      q: 'What happens to my reviews if I cancel?',
      a: 'Your review link and QR stay live so existing customers can still leave a review. You lose access to analytics, the feedback inbox and Google sync.',
    },
    {
      q: 'Do you collect my customers personal data?',
      a: 'We only ask reviewers for a name and optionally an email, used solely to send them to Google. We never sell or share reviewer data.',
    },
  ];

  return (
    <PublicPage>
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-16 text-center md:pt-24">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple plans. Cancel any month."
          description="Start on a free trial, upgrade when reviews start flowing. Every plan includes your review link and QR code."
        />

        <div className="mt-10 inline-flex items-center rounded-full border border-white/15 bg-white/5 p-1">
          {(['monthly', 'yearly'] as BillingCycle[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setCycle(option)}
              aria-pressed={cycle === option}
              className={`rounded-full px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.25em] transition ${
                cycle === option ? 'bg-white text-black' : 'text-chalk-gray hover:text-white'
              }`}
            >
              {option === 'monthly' ? 'Monthly' : 'Yearly · 2 months free'}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {PLAN_CATALOGUE.map((plan) => {
            const perMonth = planPricePerMonth(plan, cycle);
            const total = planPrice(plan, cycle);
            return (
              <Card key={plan.code} className={`flex flex-col ${plan.code === 'growth' ? 'border-white/25' : ''}`}>
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-xl font-semibold text-white">{plan.name}</h2>
                  {plan.code === 'growth' ? (
                    <span className="rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                      Popular
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm text-chalk-gray">{plan.tagline}</p>
                <div className="mt-6">
                  <p className="text-4xl font-bold text-white">
                    {inr(perMonth)}
                    <span className="text-sm font-normal text-chalk-gray">/month</span>
                  </p>
                  <p className="mt-1 text-xs text-chalk-gray">
                    {cycle === 'yearly' ? `${inr(total)} billed once a year` : 'Billed monthly'}
                  </p>
                </div>
                <ul className="mt-7 flex-1 space-y-3 text-sm text-chalk-gray">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span aria-hidden="true" className="text-[#00FFA3]">
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <PrimaryButton href="/gmbqyn/register" className="mt-8 w-full">
                  Start free trial
                </PrimaryButton>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <SectionHeading eyebrow="Compare" title="Every feature, side by side" />
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/15">
                <th className="pb-4 pr-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-chalk-gray">Feature</th>
                {PLAN_CATALOGUE.map((plan) => (
                  <th key={plan.code} className="pb-4 pr-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-chalk-gray">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {matrix.map((row) => (
                <tr key={row.label}>
                  <td className="py-4 pr-6 text-chalk-gray">{row.label}</td>
                  {row.values.map((value, index) => (
                    <td key={index} className="py-4 pr-6 text-white">
                      {typeof value === 'string' ? value : value ? '✓' : '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-20">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" />
        <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
          {faqs.map((faq, index) => (
            <div key={faq.q}>
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                aria-expanded={openFaq === index}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="text-base font-semibold text-white">{faq.q}</span>
                <span aria-hidden="true" className="text-chalk-gray">
                  {openFaq === index ? '−' : '+'}
                </span>
              </button>
              {openFaq === index ? <p className="pb-6 text-sm leading-relaxed text-chalk-gray">{faq.a}</p> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-24">
        <div className="rounded-[36px] border border-white/15 bg-gradient-to-br from-[#ff5f91]/15 to-[#7b5bff]/15 px-8 py-14 text-center">
          <h2 className="text-3xl font-bold text-white">Not sure which plan?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-chalk-gray">
            Start on Starter and move up whenever you need branded QR codes, the feedback inbox or Google sync. We
            help you migrate without losing a single review.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <PrimaryButton href="/gmbqyn/register">Create account</PrimaryButton>
            <GhostButton href="/gmbqyn/login">Sign in</GhostButton>
          </div>
          <p className="mt-8 text-xs text-chalk-gray">Serving businesses across {CATEGORIES.length}+ categories.</p>
        </div>
      </section>
    </PublicPage>
  );
}
