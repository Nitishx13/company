'use client';

import { formatDate, inr, relativeTime } from '@/lib/gmbqyn';
import { useGmbqynService } from '@/lib/gmbqyn/auth-context';
import type { AdminOverview } from '@/lib/gmbqyn';
import { useAsync } from '../../lib/hooks';
import { AppShell } from '../../components/shell';
import { adminNav } from '../../lib/nav';
import {
  BarChart,
  ErrorNote,
  Loading,
  PageHeader,
  Panel,
  PrimaryButton,
  StatCard,
  StatusPill,
  Table,
} from '../../components/ui';

export default function AdminDashboardPage() {
  const service = useGmbqynService();
  const { data, error, loading } = useAsync<AdminOverview>(() => service.getAdminOverview(), []);

  return (
    <AppShell area="admin" items={adminNav} title="Master Admin">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Overview"
          title="Business health"
          description="Revenue, subscribers and the queue of things that need a human decision."
        />

        {loading ? <Loading /> : null}
        {error ? <ErrorNote message={error} /> : null}

        {data ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="MRR" value={inr(data.totals.mrr)} sub={`${inr(data.totals.mrr * 12)} ARR`} accent />
              <StatCard
                label="Collected this month"
                value={inr(data.totals.collected_this_month)}
                sub={`${data.totals.pending_payments} payments pending`}
              />
              <StatCard
                label="Active subscriptions"
                value={data.totals.active_subscriptions}
                sub={`${data.totals.active_businesses} active businesses`}
              />
              <StatCard
                label="Reviews on platform"
                value={data.totals.reviews}
                sub={`${data.totals.open_feedback} open feedback`}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Panel className="lg:col-span-2" title="MRR trend">
                <BarChart data={data.mrr_series} accent="#7b5bff" />
              </Panel>

              <Panel title="Plan mix">
                <div className="space-y-4">
                  {data.plan_split.map((row) => (
                    <div key={row.plan} className="flex items-center justify-between gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm text-white">{row.plan}</p>
                        <p className="text-xs text-chalk-gray">{row.businesses} businesses</p>
                      </div>
                      <p className="font-mono text-sm text-white">{inr(row.revenue)}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Panel
                title="Expiring soon"
                action={
                  <a
                    href="/gmbqyn/admin/subscriptions"
                    className="text-[10px] uppercase tracking-[0.25em] text-chalk-gray hover:text-white"
                  >
                    View all
                  </a>
                }
              >
                {data.expiring_soon.length === 0 ? (
                  <p className="py-6 text-center text-sm text-chalk-gray">Nothing expiring in the next 14 days.</p>
                ) : (
                  <Table headers={['Business', 'Plan', 'Ends', 'Amount']}>
                    {data.expiring_soon.map((subscription) => (
                      <tr key={subscription.id}>
                        <td className="py-4 pr-6 text-white">{subscription.plan?.name ?? `#${subscription.plan_id}`}</td>
                        <td className="py-4 pr-6">
                          <StatusPill value={subscription.status} />
                        </td>
                        <td className="py-4 pr-6 text-chalk-gray">{formatDate(subscription.current_period_end)}</td>
                        <td className="py-4 pr-6 text-white">{inr(subscription.amount)}</td>
                      </tr>
                    ))}
                  </Table>
                )}
              </Panel>

              <Panel
                title="Recent payments"
                action={
                  <a
                    href="/gmbqyn/admin/payments"
                    className="text-[10px] uppercase tracking-[0.25em] text-chalk-gray hover:text-white"
                  >
                    View all
                  </a>
                }
              >
                {data.recent_payments.length === 0 ? (
                  <p className="py-6 text-center text-sm text-chalk-gray">No payments recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {data.recent_payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                        <div className="min-w-0">
                          <p className="truncate text-sm text-white">{payment.business_name ?? `Business #${payment.business_id}`}</p>
                          <p className="text-xs text-chalk-gray">{relativeTime(payment.paid_on)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm text-white">{inr(payment.amount)}</p>
                          <StatusPill value={payment.status} className="mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </div>

            <Panel
              title="Latest reviews across the platform"
              action={
                <a
                  href="/gmbqyn/admin/reviews"
                  className="text-[10px] uppercase tracking-[0.25em] text-chalk-gray hover:text-white"
                >
                  Moderate
                </a>
              }
            >
              {data.recent_reviews.length === 0 ? (
                <p className="py-6 text-center text-sm text-chalk-gray">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {data.recent_reviews.map((review) => (
                    <div key={review.id} className="flex flex-wrap items-start justify-between gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-sm font-semibold text-white">
                            {review.business_name ?? `Business #${review.business_id}`}
                          </span>
                          <StatusPill value={review.status} />
                        </div>
                        {review.comment ? (
                          <p className="mt-2 text-sm leading-relaxed text-chalk-gray">{review.comment}</p>
                        ) : null}
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm text-[#ffb020]">{review.rating} ★</p>
                        <p className="mt-1 text-[10px] text-chalk-gray">{relativeTime(review.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            <div className="grid gap-4 sm:grid-cols-3">
              <PrimaryButton href="/gmbqyn/admin/subscriptions">Create subscription</PrimaryButton>
              <PrimaryButton href="/gmbqyn/admin/payments">Record payment</PrimaryButton>
              <PrimaryButton href="/gmbqyn/admin/settings">Platform settings</PrimaryButton>
            </div>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
