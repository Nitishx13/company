'use client';

import { formatDate, inr } from '@/lib/gmbqyn';
import { useGmbqynService } from '@/lib/gmbqyn/auth-context';
import type { ListResult, Payment } from '@/lib/gmbqyn';
import { useAsync } from '../lib/hooks';
import { AppShell } from '../components/shell';
import { customerNav } from '../lib/nav';
import { EmptyState, ErrorNote, Loading, PageHeader, Panel, StatCard, StatusPill, Table } from '../components/ui';

const METHOD_LABELS: Record<string, string> = {
  cash: 'Cash',
  upi: 'UPI',
  bank_transfer: 'Bank transfer',
  card: 'Card',
  cheque: 'Cheque',
};

export default function InvoicesPage() {
  const service = useGmbqynService();
  const { data, error, loading } = useAsync<ListResult<Payment>>(() => service.getInvoices(), []);

  const payments = data?.data ?? [];
  const paid = payments.filter((payment) => payment.status === 'verified');
  const pending = payments.filter((payment) => payment.status === 'pending');
  const lifetime = paid.reduce((sum, payment) => sum + payment.amount, 0);
  const outstanding = pending.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <AppShell area="customer" items={customerNav} title="Invoices">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Billing history"
          title="Invoices & payments"
          description="Every payment recorded against your account, with the method and reference our team used."
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total paid" value={inr(lifetime)} accent />
          <StatCard label="Outstanding" value={inr(outstanding)} sub={pending.length ? `${pending.length} awaiting verification` : 'All clear'} />
          <StatCard label="Invoices" value={payments.length} />
        </div>

        {error ? <ErrorNote message={error} /> : null}
        {loading ? <Loading /> : null}

        {data && payments.length === 0 ? (
          <Panel>
            <EmptyState
              title="No invoices yet"
              description="Once your subscription is activated and payment is recorded, invoices will appear here."
            />
          </Panel>
        ) : null}

        {payments.length > 0 ? (
          <Panel title="All invoices">
            <Table headers={['Invoice', 'Date', 'Amount', 'Method', 'Reference', 'Status']}>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="py-4 pr-6 font-mono text-white">INV-{String(payment.id).padStart(5, '0')}</td>
                  <td className="py-4 pr-6 text-chalk-gray">{formatDate(payment.paid_on)}</td>
                  <td className="py-4 pr-6 text-white">{inr(payment.amount)}</td>
                  <td className="py-4 pr-6 text-chalk-gray">{METHOD_LABELS[payment.method] ?? payment.method}</td>
                  <td className="py-4 pr-6 font-mono text-xs text-chalk-gray">{payment.reference ?? '—'}</td>
                  <td className="py-4 pr-6">
                    <StatusPill value={payment.status} />
                  </td>
                </tr>
              ))}
            </Table>
          </Panel>
        ) : null}

        {pending.length > 0 ? (
          <Panel title="Payment pending">
            <p className="text-sm leading-relaxed text-chalk-gray">
              We are waiting to verify {inr(outstanding)} across {pending.length} payment
              {pending.length === 1 ? '' : 's'}. Send proof of payment to your account manager and we will mark it
              verified as soon as it clears. Your plan stays active meanwhile.
            </p>
          </Panel>
        ) : null}
      </div>
    </AppShell>
  );
}
