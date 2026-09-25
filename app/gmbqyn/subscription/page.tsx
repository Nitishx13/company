'use client';

import { useState } from 'react';
import { daysUntil, formatDate, inr } from '@/lib/gmbqyn';
import type { BillingCycle, Plan, Subscription } from '@/lib/gmbqyn';
import { useAsync, messageOf } from '../lib/hooks';
import { useGmbqynAuth, useGmbqynService } from '@/lib/gmbqyn/auth-context';
import { AppShell } from '../components/shell';
import { customerNav } from '../lib/nav';
import { ErrorNote, Field, GhostButton, Loading, PageHeader, Panel, PrimaryButton, StatusPill, SuccessNote, Textarea } from '../components/ui';

export default function SubscriptionPage() {
  const service = useGmbqynService();
  const { refresh, applySubscription } = useGmbqynAuth();
  const current = useAsync<Subscription | null>(() => service.getSubscription(), []);
  const plans = useAsync<Plan[]>(() => service.listPlans(), []);
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const finish = async (subscription: Subscription, message: string) => {
    applySubscription(subscription);
    setNotice(message);
    await refresh();
    current.reload();
  };

  const changePlan = async (plan: Plan) => {
    if (!window.confirm(`Switch to the ${plan.name} plan on ${cycle} billing? Our team will confirm the new amount.`)) return;
    setBusy(true);
    setFormError(null);
    try {
      const subscription = await service.requestPlanChange(plan.code, cycle);
      await finish(subscription, `Plan change to ${plan.name} requested. We will confirm shortly.`);
    } catch (err) {
      setFormError(messageOf(err));
    } finally {
      setBusy(false);
    }
  };

  const cancel = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!window.confirm('Cancel your subscription? Your review link stays live until the period ends.')) return;
    setBusy(true);
    setFormError(null);
    try {
      const subscription = await service.cancelSubscription(reason.trim() || undefined);
      await finish(subscription, 'Subscription cancelled. It stays active until the end of the paid period.');
    } catch (err) {
      setFormError(messageOf(err));
    } finally {
      setBusy(false);
    }
  };

  const active = current.data && current.data.status !== 'cancelled' && current.data.status !== 'expired';
  const currentPlanId = current.data?.plan_id;

  return (
    <AppShell area="customer" items={customerNav} title="Subscription">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Billing"
          title="Your subscription"
          description="Subscriptions are activated and renewed manually by our team, so you always know exactly what you are paying for."
          action={
            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 p-1">
              {(['monthly', 'yearly'] as BillingCycle[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCycle(option)}
                  aria-pressed={cycle === option}
                  className={`rounded-full px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] transition ${
                    cycle === option ? 'bg-white text-black' : 'text-chalk-gray'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          }
        />

        {notice ? <SuccessNote message={notice} /> : null}
        {formError ? <ErrorNote message={formError} /> : null}
        {current.error ? <ErrorNote message={current.error} /> : null}
        {current.loading || plans.loading ? <Loading /> : null}

        {current.data ? (
          <Panel title="Current plan">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-xl font-semibold text-white">{current.data.plan?.name ?? 'Custom plan'}</span>
                <StatusPill value={current.data.status} />
                <span className="text-sm text-chalk-gray">
                  {inr(current.data.amount)} / {current.data.billing_cycle === 'yearly' ? 'year' : 'month'}
                </span>
              </div>

              <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Started', value: formatDate(current.data.started_at) },
                  { label: 'Current period', value: formatDate(current.data.current_period_start) },
                  { label: 'Renews / ends', value: formatDate(current.data.current_period_end) },
                  {
                    label: 'Days remaining',
                    value: String(Math.max(0, daysUntil(current.data.current_period_end))),
                  },
                ].map((row) => (
                  <div key={row.label}>
                    <dt className="text-[10px] uppercase tracking-[0.3em] text-chalk-gray">{row.label}</dt>
                    <dd className="mt-2 text-sm text-white">{row.value}</dd>
                  </div>
                ))}
              </dl>

              {current.data.notes ? (
                <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-chalk-gray">
                  {current.data.notes}
                </p>
              ) : null}
            </div>
          </Panel>
        ) : null}

        {!current.loading && !current.data ? (
          <Panel>
            <p className="py-6 text-center text-sm text-chalk-gray">
              You have no subscription yet. Pick a plan below to get started.
            </p>
          </Panel>
        ) : null}

        <div className="grid gap-6 md:grid-cols-3">
          {plans.data?.map((plan) => {
            const isCurrent = plan.id === currentPlanId;
            const price = cycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
            return (
              <Panel key={plan.code} className={isCurrent ? 'border-white/30' : ''}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  {isCurrent ? <StatusPill value="active" /> : null}
                </div>
                <p className="mt-2 text-sm text-chalk-gray">{plan.tagline}</p>
                <p className="mt-5 text-3xl font-bold text-white">
                  {inr(price)}
                  <span className="text-sm font-normal text-chalk-gray">/{cycle === 'yearly' ? 'yr' : 'mo'}</span>
                </p>
                <ul className="mt-5 space-y-2 text-xs text-chalk-gray">
                  {plan.features.slice(0, 4).map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span aria-hidden="true" className="text-[#00FFA3]">
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <PrimaryButton
                  className="mt-6 w-full"
                  disabled={busy || isCurrent}
                  onClick={() => changePlan(plan)}
                >
                  {isCurrent ? 'Current plan' : `Switch to ${plan.name}`}
                </PrimaryButton>
              </Panel>
            );
          })}
        </div>

        {active ? (
          <Panel title="Cancel subscription">
            <form onSubmit={cancel} className="space-y-5">
              <p className="text-sm leading-relaxed text-chalk-gray">
                {`Your plan stays active until ${
                  current.data ? formatDate(current.data.current_period_end) : 'the end of the period'
                }. Your review link and QR codes keep working until then. Renewals are processed manually, so a cancellation stops future billing.`}
              </p>
              <Field label="Reason (optional)" hint="This helps us improve — tell us what did not work.">
                <Textarea
                  rows={3}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Too expensive, missing a feature, switching tools…"
                />
              </Field>
              <div className="flex flex-wrap gap-3">
                <GhostButton type="submit" disabled={busy}>
                  {busy ? 'Working…' : 'Cancel my subscription'}
                </GhostButton>
              </div>
            </form>
          </Panel>
        ) : null}

        <Panel title="What happens next">
          <ol className="space-y-4 text-sm text-chalk-gray">
            <li>1. Choose a plan above and confirm the billing cycle.</li>
            <li>2. Our team activates the subscription and sends you a payment request.</li>
            <li>3. Pay by UPI, bank transfer or card — we record it against your account.</li>
            <li>4. Renewals happen monthly or yearly, with a reminder before anything is charged.</li>
          </ol>
          <div className="mt-6">
            <GhostButton href="/gmbqyn/invoices">View invoices</GhostButton>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
