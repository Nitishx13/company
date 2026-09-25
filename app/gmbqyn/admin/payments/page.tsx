'use client';

import { useEffect, useState } from 'react';
import { formatDate, inr } from '@/lib/gmbqyn';
import { useGmbqynService } from '@/lib/gmbqyn/auth-context';
import type { Business, ListResult, Payment, PaymentMethod, PaymentStatus, Subscription } from '@/lib/gmbqyn';
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
  StatCard,
  StatusPill,
  SuccessNote,
  Table,
  Textarea,
} from '../../components/ui';

const METHODS: PaymentMethod[] = ['upi', 'bank_transfer', 'card', 'cash', 'cheque'];
const STATUSES: PaymentStatus[] = ['pending', 'verified', 'failed', 'refunded'];

const METHOD_LABELS: Record<string, string> = {
  upi: 'UPI',
  bank_transfer: 'Bank transfer',
  card: 'Card',
  cash: 'Cash',
  cheque: 'Cheque',
};

export default function AdminPaymentsPage() {
  const service = useGmbqynService();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [form, setForm] = useState({
    business_id: '',
    subscription_id: '',
    amount: '',
    method: 'upi' as PaymentMethod,
    reference: '',
    paid_on: new Date().toISOString().slice(0, 10),
    note: '',
  });

  const state = useAsync<ListResult<Payment>>(
    () => service.listPayments({ status: status as never, q: query || undefined }),
    [status, query]
  );

  useEffect(() => {
    let active = true;
    Promise.all([service.listBusinesses(), service.listSubscriptions()])
      .then(([businessResult, subscriptionResult]) => {
        if (!active) return;
        setBusinesses(businessResult.data);
        setSubscriptions(subscriptionResult.data);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [service]);

  const businessName = (id: number) => businesses.find((b) => b.id === id)?.name ?? `Business #${id}`;

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await service.createPayment({
        business_id: Number(form.business_id),
        subscription_id: form.subscription_id ? Number(form.subscription_id) : null,
        amount: Number(form.amount),
        method: form.method,
        reference: form.reference.trim() || null,
        paid_on: new Date(form.paid_on).toISOString(),
        note: form.note.trim() || null,
      });
      setNotice('Payment recorded.');
      setShowForm(false);
      setForm({ ...form, amount: '', reference: '', note: '' });
      state.reload();
    } catch (err) {
      setFormError(messageOf(err));
    } finally {
      setSaving(false);
    }
  };

  const patch = async (payment: Payment, next: PaymentStatus) => {
    try {
      await service.updatePaymentStatus(payment.id, next);
      setNotice(`Payment marked ${next}.`);
      state.reload();
    } catch (err) {
      setFormError(messageOf(err));
    }
  };

  const remove = async (payment: Payment) => {
    if (!window.confirm('Delete this payment record?')) return;
    try {
      await service.deletePayment(payment.id);
      state.reload();
    } catch (err) {
      setFormError(messageOf(err));
    }
  };

  const payments = state.data?.data ?? [];
  const collected = payments.filter((p) => p.status === 'verified').reduce((sum, p) => sum + p.amount, 0);
  const pendingValue = payments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <AppShell area="admin" items={adminNav} title="Payments">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Payments"
          title="Record what customers pay"
          description="Log UPI transfers, bank credits, card payments and cash. Mark them verified to close the loop."
          action={<PrimaryButton onClick={() => setShowForm((v) => !v)}>{showForm ? 'Close' : 'Record payment'}</PrimaryButton>}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Verified (page)" value={inr(collected)} accent />
          <StatCard label="Pending (page)" value={inr(pendingValue)} />
          <StatCard label="Records" value={payments.length} sub={`${state.data?.total ?? 0} total`} />
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <Field label="Search">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Reference or business…" />
          </Field>
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all" className="bg-black">All statuses</option>
              {STATUSES.map((value) => (
                <option key={value} value={value} className="bg-black">
                  {value}
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
          <Panel title="Record a payment">
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
                <Field label="Subscription (optional)">
                  <Select
                    value={form.subscription_id}
                    onChange={(e) => setForm({ ...form, subscription_id: e.target.value })}
                  >
                    <option value="" className="bg-black">Not linked</option>
                    {subscriptions
                      .filter((subscription) => String(subscription.business_id) === form.business_id)
                      .map((subscription) => (
                        <option key={subscription.id} value={subscription.id} className="bg-black">
                          #{subscription.id} · {subscription.plan?.name ?? 'Plan'} · {inr(subscription.amount)}
                        </option>
                      ))}
                  </Select>
                </Field>
                <Field label="Amount (₹)">
                  <Input
                    required
                    type="number"
                    min={0}
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="2999"
                  />
                </Field>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Method">
                  <Select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value as PaymentMethod })}>
                    {METHODS.map((method) => (
                      <option key={method} value={method} className="bg-black">
                        {METHOD_LABELS[method]}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Paid on">
                  <Input
                    type="date"
                    required
                    value={form.paid_on}
                    onChange={(e) => setForm({ ...form, paid_on: e.target.value })}
                  />
                </Field>
                <Field label="Reference">
                  <Input
                    value={form.reference}
                    onChange={(e) => setForm({ ...form, reference: e.target.value })}
                    placeholder="UPI ref / cheque no."
                  />
                </Field>
              </div>

              <Field label="Note (optional)">
                <Textarea rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
              </Field>

              <div className="flex gap-3">
                <PrimaryButton type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Record payment'}
                </PrimaryButton>
                <GhostButton onClick={() => setShowForm(false)}>Cancel</GhostButton>
              </div>
            </form>
          </Panel>
        ) : null}

        {state.data && payments.length === 0 ? (
          <Panel>
            <EmptyState title="No payments found" description="Record a payment to get started." />
          </Panel>
        ) : null}

        {payments.length > 0 ? (
          <Panel title="Payment ledger">
            <Table headers={['Invoice', 'Business', 'Amount', 'Method', 'Reference', 'Paid on', 'Status', 'Actions']}>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="py-4 pr-6 font-mono text-white">INV-{String(payment.id).padStart(5, '0')}</td>
                  <td className="py-4 pr-6 text-white">
                    {payment.business_name ?? businessName(payment.business_id)}
                  </td>
                  <td className="py-4 pr-6 text-white">{inr(payment.amount)}</td>
                  <td className="py-4 pr-6 text-chalk-gray">{METHOD_LABELS[payment.method] ?? payment.method}</td>
                  <td className="py-4 pr-6 font-mono text-xs text-chalk-gray">{payment.reference ?? '—'}</td>
                  <td className="py-4 pr-6 text-chalk-gray">{formatDate(payment.paid_on)}</td>
                  <td className="py-4 pr-6">
                    <StatusPill value={payment.status} />
                  </td>
                  <td className="py-4 pr-6">
                    <div className="flex flex-wrap gap-2">
                      {payment.status !== 'verified' ? (
                        <button
                          type="button"
                          onClick={() => patch(payment, 'verified')}
                          className="rounded-full border border-[#00FFA3]/30 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#00FFA3] hover:bg-[#00FFA3]/10"
                        >
                          Verify
                        </button>
                      ) : null}
                      {payment.status !== 'failed' ? (
                        <button
                          type="button"
                          onClick={() => patch(payment, 'failed')}
                          className="rounded-full border border-[#ff5f91]/30 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#ff5f91] hover:bg-[#ff5f91]/10"
                        >
                          Fail
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => remove(payment)}
                        className="rounded-full border border-red-400/30 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-red-400 hover:bg-red-400/10"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
          </Panel>
        ) : null}
      </div>
    </AppShell>
  );
}
