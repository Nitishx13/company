'use client';

import { useEffect, useState } from 'react';
import { addMonths, formatDate, inr } from '@/lib/gmbqyn';
import { useGmbqynService } from '@/lib/gmbqyn/auth-context';
import type { BillingCycle, Business, ListResult, Plan, Subscription, SubscriptionStatus } from '@/lib/gmbqyn';
import { useAsync, messageOf } from '../../lib/hooks';
import { AppShell } from '../../components/shell';
import { adminNav } from '../../lib/nav';
import {
  EmptyState,
  ErrorNote,
  Field,
  GhostButton,
  Input,
  Loading,
  PageHeader,
  Panel,
  PrimaryButton,
  Select,
  StatusPill,
  SuccessNote,
  Table,
  Textarea,
} from '../../components/ui';

const STATUSES: SubscriptionStatus[] = ['trial', 'active', 'past_due', 'expired', 'cancelled'];

export default function AdminSubscriptionsPage() {
  const service = useGmbqynService();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [reason, setReason] = useState('');

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [form, setForm] = useState({
    business_id: '',
    plan_id: '',
    status: 'active' as SubscriptionStatus,
    billing_cycle: 'monthly' as BillingCycle,
    amount: '',
    current_period_start: new Date().toISOString().slice(0, 10),
    current_period_end: addMonths(new Date().toISOString().slice(0, 10), 1).slice(0, 10),
    notes: '',
  });

  const state = useAsync<ListResult<Subscription>>(
    () => service.listSubscriptions({ status: status as never, q: query || undefined }),
    [status, query]
  );

  useEffect(() => {
    let active = true;
    Promise.all([service.listBusinesses(), service.listPlans()])
      .then(([businessResult, planResult]) => {
        if (!active) return;
        setBusinesses(businessResult.data);
        setPlans(planResult);
        if (planResult[0]) setForm((prev) => ({ ...prev, plan_id: String(planResult[0].id), amount: String(planResult[0].price_monthly) }));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [service]);

  const businessName = (businessId: number) =>
    businesses.find((business) => business.id === businessId)?.name ?? `Business #${businessId}`;

  const pickPlan = (planId: string) => {
    const plan = plans.find((item) => String(item.id) === planId);
    setForm((prev) => ({
      ...prev,
      plan_id: planId,
      amount: String(form.billing_cycle === 'yearly' ? plan?.price_yearly ?? 0 : plan?.price_monthly ?? 0),
    }));
  };

  const pickCycle = (cycle: BillingCycle) => {
    const plan = plans.find((item) => String(item.id) === form.plan_id);
    setForm((prev) => ({
      ...prev,
      billing_cycle: cycle,
      amount: String(cycle === 'yearly' ? plan?.price_yearly ?? 0 : plan?.price_monthly ?? 0),
      current_period_end: addMonths(prev.current_period_start, cycle === 'yearly' ? 12 : 1).slice(0, 10),
    }));
  };

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await service.createSubscription({
        business_id: Number(form.business_id),
        plan_id: Number(form.plan_id),
        status: form.status,
        billing_cycle: form.billing_cycle,
        amount: Number(form.amount),
        current_period_start: new Date(form.current_period_start).toISOString(),
        current_period_end: new Date(form.current_period_end).toISOString(),
        notes: form.notes.trim() || null,
      });
      setNotice('Subscription created.');
      setShowForm(false);
      setForm({ ...form, business_id: '', notes: '' });
      state.reload();
    } catch (err) {
      setFormError(messageOf(err));
    } finally {
      setSaving(false);
    }
  };

  const patch = async (subscription: Subscription, changes: Partial<{ status: SubscriptionStatus; current_period_end: string; amount: number }>) => {
    try {
      await service.updateSubscription(subscription.id, changes as never);
      state.reload();
    } catch (err) {
      setFormError(messageOf(err));
    }
  };

  const renew = async (subscription: Subscription) => {
    const months = subscription.billing_cycle === 'yearly' ? 12 : 1;
    await patch(subscription, {
      status: 'active',
      current_period_end: addMonths(subscription.current_period_end, months),
    });
    setNotice('Subscription renewed.');
  };

  const cancelAsAdmin = async (subscription: Subscription) => {
    if (!window.confirm(`Cancel the subscription for ${businessName(subscription.business_id)}?`)) return;
    try {
      await service.cancelSubscriptionAsAdmin(subscription.id, reason.trim() || undefined);
      setNotice('Subscription cancelled.');
      state.reload();
    } catch (err) {
      setFormError(messageOf(err));
    }
  };

  return (
    <AppShell area="admin" items={adminNav} title="Subscriptions">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Subscriptions"
          title="Subscriptions & renewals"
          description="GMBQYN bills manually — activate plans, extend periods and record what the customer paid."
          action={<PrimaryButton onClick={() => setShowForm((v) => !v)}>{showForm ? 'Close' : 'New subscription'}</PrimaryButton>}
        />

        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <Field label="Search">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Business or notes…" />
          </Field>
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all" className="bg-black">All statuses</option>
              {STATUSES.map((value) => (
                <option key={value} value={value} className="bg-black">
                  {value.replace(/_/g, ' ')}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {notice ? <SuccessNote message={notice} /> : null}
        {formError ? <ErrorNote message={formError} /> : null}
        {state.error ? <ErrorNote message={state.error} /> : null}
        {state.loading ? <Loading /> : null}

        {showForm ? (
          <Panel title="New subscription">
            <form onSubmit={create} className="space-y-5">
              {formError ? <ErrorNote message={formError} /> : null}
              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Business">
                  <Select required value={form.business_id} onChange={(e) => setForm({ ...form, business_id: e.target.value })}>
                    <option value="" className="bg-black">Select a business</option>
                    {businesses.map((business) => (
                      <option key={business.id} value={business.id} className="bg-black">
                        {business.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Plan">
                  <Select value={form.plan_id} onChange={(e) => pickPlan(e.target.value)}>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id} className="bg-black">
                        {plan.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Status">
                  <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as SubscriptionStatus })}>
                    {STATUSES.map((value) => (
                      <option key={value} value={value} className="bg-black">
                        {value.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <div className="grid gap-5 md:grid-cols-4">
                <Field label="Billing cycle">
                  <Select value={form.billing_cycle} onChange={(e) => pickCycle(e.target.value as BillingCycle)}>
                    <option value="monthly" className="bg-black">Monthly</option>
                    <option value="yearly" className="bg-black">Yearly</option>
                  </Select>
                </Field>
                <Field label="Amount (₹)">
                  <Input
                    required
                    type="number"
                    min={0}
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  />
                </Field>
                <Field label="Period start">
                  <Input
                    type="date"
                    required
                    value={form.current_period_start}
                    onChange={(e) => setForm({ ...form, current_period_start: e.target.value })}
                  />
                </Field>
                <Field label="Period end">
                  <Input
                    type="date"
                    required
                    value={form.current_period_end}
                    onChange={(e) => setForm({ ...form, current_period_end: e.target.value })}
                  />
                </Field>
              </div>

              <Field label="Notes (optional)">
                <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </Field>

              <div className="flex gap-3">
                <PrimaryButton type="submit" disabled={saving}>
                  {saving ? 'Creating…' : 'Create subscription'}
                </PrimaryButton>
                <GhostButton onClick={() => setShowForm(false)}>Cancel</GhostButton>
              </div>
            </form>
          </Panel>
        ) : null}

        {state.data && state.data.data.length === 0 ? (
          <Panel>
            <EmptyState title="No subscriptions found" description="Try another filter, or create a subscription manually." />
          </Panel>
        ) : null}

        {state.data && state.data.data.length > 0 ? (
          <Panel title={`${state.data.total} subscription${state.data.total === 1 ? '' : 's'}`}>
            <Table headers={['Business', 'Plan', 'Amount', 'Cycle', 'Period', 'Status', 'Actions']}>
              {state.data.data.map((subscription) => (
                <tr key={subscription.id}>
                  <td className="py-4 pr-6 text-white">{businessName(subscription.business_id)}</td>
                  <td className="py-4 pr-6 text-chalk-gray">{subscription.plan?.name ?? `#${subscription.plan_id}`}</td>
                  <td className="py-4 pr-6 text-white">{inr(subscription.amount)}</td>
                  <td className="py-4 pr-6 text-chalk-gray">{subscription.billing_cycle}</td>
                  <td className="py-4 pr-6 text-chalk-gray">
                    {formatDate(subscription.current_period_start)} → {formatDate(subscription.current_period_end)}
                  </td>
                  <td className="py-4 pr-6">
                    <StatusPill value={subscription.status} />
                  </td>
                  <td className="py-4 pr-6">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => renew(subscription)}
                        className="rounded-full border border-[#00FFA3]/30 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#00FFA3] hover:bg-[#00FFA3]/10"
                      >
                        Renew
                      </button>
                      {subscription.status === 'trial' ? (
                        <button
                          type="button"
                          onClick={() => patch(subscription, { status: 'active' })}
                          className="rounded-full border border-white/20 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-chalk-gray hover:border-white hover:text-white"
                        >
                          Activate
                        </button>
                      ) : null}
                      {subscription.status === 'past_due' ? (
                        <button
                          type="button"
                          onClick={() => patch(subscription, { status: 'active' })}
                          className="rounded-full border border-[#00b5ff]/30 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#00b5ff] hover:bg-[#00b5ff]/10"
                        >
                          Mark paid
                        </button>
                      ) : null}
                      {subscription.status !== 'cancelled' && subscription.status !== 'expired' ? (
                        <button
                          type="button"
                          onClick={() => cancelAsAdmin(subscription)}
                          className="rounded-full border border-red-400/30 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-red-400 hover:bg-red-400/10"
                        >
                          Cancel
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
            <Field label="Cancellation reason (optional)" className="mt-6">
              <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why are you cancelling?" />
            </Field>
          </Panel>
        ) : null}
      </div>
    </AppShell>
  );
}
