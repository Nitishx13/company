'use client';

import { formatDate, relativeTime } from '@/lib/gmbqyn';
import { useGmbqynService } from '@/lib/gmbqyn/auth-context';
import type { CustomerDashboard } from '@/lib/gmbqyn';
import { useAsync } from '../lib/hooks';
import { AppShell } from '../components/shell';
import { customerNav } from '../lib/nav';
import {
  BarChart,
  ErrorNote,
  Loading,
  PageHeader,
  Panel,
  PrimaryButton,
  ProgressBar,
  StatCard,
  StatusPill,
  Stars,
} from '../components/ui';

export default function DashboardPage() {
  const service = useGmbqynService();
  const { data, error, loading } = useAsync<CustomerDashboard>(() => service.getCustomerDashboard(), []);

  return (
    <AppShell area="customer" items={customerNav} title="Dashboard">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Overview"
          title="Your reputation at a glance"
          description={data ? `${data.business.name} · ${data.business.city ?? data.business.country}` : 'Loading your business…'}
          action={<PrimaryButton href="/gmbqyn/review-link">Share your link</PrimaryButton>}
        />

        {loading ? <Loading /> : null}
        {error ? <ErrorNote message={error} /> : null}

        {data ? (
          <>
            {data.subscription ? (
              <div className="flex flex-wrap items-center gap-4 rounded-[28px] border border-white/10 bg-black/50 p-5 backdrop-blur">
                <span className="text-sm font-semibold text-white">
                  {data.subscription.plan?.name ?? 'Your plan'}
                </span>
                <StatusPill value={data.subscription.status} />
                <span className="text-xs text-chalk-gray">
                  {data.days_to_renewal > 0
                    ? `Renews in ${data.days_to_renewal} day${data.days_to_renewal === 1 ? '' : 's'}`
                    : `Period ends ${formatDate(data.subscription.current_period_end)}`}
                </span>
                <span className="ml-auto">
                  <PrimaryButton href="/gmbqyn/subscription">Manage plan</PrimaryButton>
                </span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-4 rounded-[28px] border border-[#ffb020]/30 bg-[#ffb020]/5 p-5">
                <span className="text-sm text-[#ffb020]">No active subscription — your trial may have ended.</span>
                <span className="ml-auto">
                  <PrimaryButton href="/gmbqyn/subscription">Choose a plan</PrimaryButton>
                </span>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total reviews"
                value={data.totals.total_reviews}
                sub={`${data.totals.reviews_this_month} this month`}
                accent
              />
              <StatCard
                label="Average rating"
                value={data.totals.avg_rating ? data.totals.avg_rating.toFixed(1) : '—'}
                sub={<Stars value={Math.round(data.totals.avg_rating)} />}
              />
              <StatCard
                label="Link views"
                value={data.totals.link_views}
                sub={`${data.totals.qr_scans} QR scans`}
              />
              <StatCard
                label="Awaiting moderation"
                value={data.totals.pending_reviews}
                sub={`${data.totals.response_rate}% replied`}
              />
            </div>

            {data.plan_usage.limit !== null ? (
              <Panel title="Plan usage">
                <ProgressBar
                  value={data.plan_usage.percent}
                  label={`${data.plan_usage.used} of ${data.plan_usage.limit} reviews collected this month`}
                />
              </Panel>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-3">
              <Panel className="lg:col-span-2" title="Traffic & submissions">
                <BarChart
                  data={data.series.map((point) => ({ label: point.label, value: point.submissions }))}
                  accent="#7b5bff"
                />
              </Panel>

              <Panel title="Rating breakdown">
                <div className="space-y-3">
                  {data.rating_breakdown.map((row) => (
                    <div key={row.stars} className="flex items-center gap-3">
                      <span className="w-8 shrink-0 font-mono text-xs text-chalk-gray">{row.stars}★</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff]"
                          style={{
                            width: `${data.totals.total_reviews > 0 ? (row.count / data.totals.total_reviews) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <span className="w-6 shrink-0 text-right font-mono text-xs text-chalk-gray">{row.count}</span>
                    </div>
                  ))}
                </div>
                {data.open_feedback > 0 ? (
                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-chalk-gray">
                    <span className="font-semibold text-white">{data.open_feedback}</span> private feedback message
                    {data.open_feedback === 1 ? '' : 's'} waiting for you.{' '}
                    <a href="/gmbqyn/feedback" className="text-white underline underline-offset-4">
                      Open inbox
                    </a>
                  </div>
                ) : null}
              </Panel>
            </div>

            <Panel
              title="Recent reviews"
              action={
                <a href="/gmbqyn/reviews" className="text-[10px] uppercase tracking-[0.25em] text-chalk-gray hover:text-white">
                  View all
                </a>
              }
            >
              {data.recent_reviews.length === 0 ? (
                <p className="py-8 text-center text-sm text-chalk-gray">
                  No reviews yet — share your link and QR code to get started.
                </p>
              ) : (
                <div className="space-y-5">
                  {data.recent_reviews.map((review) => (
                    <div key={review.id} className="flex flex-wrap items-start justify-between gap-4 border-b border-white/5 pb-5 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-sm font-semibold text-white">{review.customer_name}</span>
                          <StatusPill value={review.status} />
                        </div>
                        {review.comment ? (
                          <p className="mt-2 text-sm leading-relaxed text-chalk-gray">{review.comment}</p>
                        ) : null}
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm text-[#ffb020]">{review.rating} ★</div>
                        <div className="mt-1 text-[10px] text-chalk-gray">{relativeTime(review.created_at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            <Panel title="Review link performance">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total views" value={data.review_link.clicks} />
                <StatCard label="Submissions" value={data.review_link.submissions} />
                <StatCard label="Conversion" value={`${data.review_link.conversion_rate}%`} />
                <StatCard
                  label="Link status"
                  value={data.review_link.is_active ? 'Active' : 'Paused'}
                  sub={data.review_link.is_active ? 'Accepting reviews' : 'Turn it back on any time'}
                />
              </div>
            </Panel>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
