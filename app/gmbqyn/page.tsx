import Link from 'next/link';
import { PLAN_CATALOGUE, planPrice, planPricePerMonth } from '@/lib/gmbqyn';
import { PublicPage, SectionHeading } from './components/public';
import { Card, GhostButton, PrimaryButton, Stars } from './components/ui';

const pillars = [
  {
    icon: '↗',
    title: 'One link, every channel',
    body: 'A permanent review URL for WhatsApp, Instagram, Google, your billbook, and every card you hand out.',
  },
  {
    icon: '▦',
    title: 'QR codes that sell',
    body: 'A trackable QR code with your branding. Scans convert into reviews the moment a customer is in store.',
  },
  {
    icon: '★',
    title: 'Reviews in one inbox',
    body: 'Every review lands in a single place with its source, rating and reply status. Nothing gets lost.',
  },
  {
    icon: '✉',
    title: 'Private feedback channel',
    body: 'Unhappy customers share the truth with you instead of the public internet. You fix it before it spreads.',
  },
  {
    icon: '◴',
    title: 'Analytics that mean something',
    body: 'Views, scans, submissions and conversion rate — per source, per week, per month.',
  },
  {
    icon: '⌘',
    title: 'Google sync on Scale',
    body: 'Pull existing Google reviews into GMBQYN and keep your listing in one dashboard.',
  },
];

const steps = [
  { step: '01', title: 'Create your account', body: 'Tell us your business and pick a plan. You are live in under two minutes.' },
  { step: '02', title: 'Share your link & QR', body: 'Put the link in your signature and the QR on your table, counter or invoice.' },
  { step: '03', title: 'Reply, analyse, grow', body: 'Watch ratings climb, reply to every review and watch traffic by source.' },
];

export default function GmbqynLandingPage() {
  return (
    <PublicPage>
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-16 text-center md:pt-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-chalk-gray">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00FFA3]" />
          Google reviews, on autopilot
        </span>
        <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-bold leading-[1.1] text-white md:text-6xl">
          Turn happy customers into
          <span className="bg-gradient-to-r from-[#ff5f91] to-[#7b5bff] bg-clip-text text-transparent"> five-star reviews</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-chalk-gray">
          GMBQYN gives Indian businesses a review link, a branded QR code, a private feedback inbox and clear
          analytics — so your Google rating grows without chasing anyone for a review.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <PrimaryButton href="/gmbqyn/register">Start free trial</PrimaryButton>
          <GhostButton href="/gmbqyn/pricing">See pricing</GhostButton>
        </div>
        <div className="mt-8 flex items-center justify-center gap-3 text-xs text-chalk-gray">
          <Stars value={5} />
          <span>No card required · cancel anytime</span>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/40">
        <div className="mx-auto grid max-w-6xl gap-px bg-white/10 px-5 py-0 md:grid-cols-3">
          {[
            { value: '3.2x', label: 'more reviews per month' },
            { value: '68%', label: 'average scan-to-review rate' },
            { value: '4 min', label: 'to set up your QR code' },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#0A0A0A] px-6 py-10 text-center">
              <p className="text-4xl font-bold text-white">{stat.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-chalk-gray">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading
          eyebrow="What you get"
          title="Everything a local business needs to own its reputation"
          description="No agency retainers, no complicated setup. Open an account and your review link is live."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <Card key={pillar.title} className="transition hover:border-white/20">
              <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-2xl bg-white/5 text-lg text-white">
                {pillar.icon}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-chalk-gray">{pillar.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/40">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <SectionHeading eyebrow="How it works" title="Three steps, then it runs itself" />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((item) => (
              <div key={item.step} className="rounded-[28px] border border-white/10 bg-[#0A0A0A] p-8">
                <p className="font-mono text-xs tracking-[0.4em] text-[#7b5bff]">{item.step}</p>
                <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-chalk-gray">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading
          eyebrow="Pricing"
          title="Straightforward plans that scale with you"
          description="Every plan includes your review link and QR code. Upgrade whenever you outgrow it."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PLAN_CATALOGUE.map((plan) => (
            <Card key={plan.code} className={plan.code === 'growth' ? 'border-white/25' : ''}>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                {plan.code === 'growth' ? (
                  <span className="rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                    Popular
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-sm text-chalk-gray">{plan.tagline}</p>
              <p className="mt-6 text-3xl font-bold text-white">
                {planPricePerMonth(plan, 'monthly').toLocaleString('en-IN')}
                <span className="text-sm font-normal text-chalk-gray">/mo</span>
              </p>
              <p className="mt-1 text-xs text-chalk-gray">
                or {planPrice(plan, 'yearly').toLocaleString('en-IN')} billed yearly
              </p>
              <ul className="mt-6 space-y-3 text-sm text-chalk-gray">
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
                Choose {plan.name}
              </PrimaryButton>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-24">
        <div className="rounded-[36px] border border-white/15 bg-gradient-to-br from-[#ff5f91]/15 to-[#7b5bff]/15 px-8 py-14 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Your next five-star review is one scan away</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-chalk-gray">
            Start a free trial, print your QR code and start collecting reviews today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <PrimaryButton href="/gmbqyn/register">Create free account</PrimaryButton>
            <Link href="/gmbqyn/login" className="text-xs uppercase tracking-[0.25em] text-chalk-gray hover:text-white">
              Already have an account?
            </Link>
          </div>
        </div>
      </section>
    </PublicPage>
  );
}
