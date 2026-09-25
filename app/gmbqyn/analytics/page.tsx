'use client';

import { useState } from 'react';
import { percent } from '@/lib/gmbqyn';
import { useGmbqynService } from '@/lib/gmbqyn/auth-context';
import type { BusinessAnalytics } from '@/lib/gmbqyn';
import { useAsync, messageOf } from '../lib/hooks';
import { AppShell } from '../components/shell';
import { ANALYTICS_RANGES, customerNav } from '../lib/nav';
import { BarChart, ErrorNote, Loading, PageHeader, Panel, PrimaryButton, ProgressBar, StatCard } from '../components/ui';

const SOURCE_LABELS: Record<string, string> = {
  qr: 'QR code',
  link: 'Review link',
  manual: 'Manual entry',
  import: 'Google import',
};

export default function AnalyticsPage() {
  const service = useGmbqynService();
  const [range, setRange] = useState('30d');
  const { data, error, loading } = useAsync<BusinessAnalytics>(() => service.getAnalytics(range), [range]);

  const maxRating = data ? Math.max(1, ...data.rating_breakdown.map((row) => row.count)) : 1;
  const maxSource = data ? Math.max(1, ...data.sources.map((row) => row.count)) : 1;

  return (
    <AppShell area="customer" items={customerNav} title="Analytics">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Analytics"
          title="Where your reviews come from"
          description="Track views, QR scans and submissions so you know which channel is actually working."
          action={
            <div className="flex flex-wrap gap-2">
              {ANALYTICS_RANGES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setRange(item.value)}
                  aria-pressed={range === item.value}
                  className={`rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition ${
                    range === item.value
                      ? 'border-white bg-white text-black'
                      : 'border-white/15 text-chalk-gray hover:border-white/40 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          }
        />

        {loading ? <Loading /> : null}
        {error ? <ErrorNote message={error} /> : null}

        {data ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard label="Link views" value={data.totals.link_views} accent />
              <StatCard label="QR scans" value={data.totals.qr_scans} />
              <StatCard label="Reviews collected" value={data.totals.reviews} />
              <StatCard label="Average rating" value={data.totals.avg_rating ? data.totals.avg_rating.toFixed(1) : '—'} />
              <StatCard label="Conversion rate" value={`${data.totals.conversion_rate}%`} sub="Views to reviews" />
              <StatCard label="Pending moderation" value={data.totals.pending_reviews} />
            </div>

            <Panel title="Submissions over time">
              <BarChart data={data.series.map((point) => ({ label: point.label, value: point.submissions }))} />
            </Panel>

            <div className="grid gap-6 lg:grid-cols-2">
              <Panel title="Link views vs submissions">
                <div className="space-y-5">
                  {data.series.slice(-8).map((point) => (
                    <div key={point.label} className="flex items-center gap-4">
                      <span className="w-12 shrink-0 font-mono text-xs text-chalk-gray">{point.label}</span>
                      <div className="flex-1 space-y-1">
                        <ProgressBar value={percent(point.views, Math.max(1, ...data.series.map((s) => s.views)))} />
                        <ProgressBar value={percent(point.submissions, Math.max(1, ...data.series.map((s) => s.submissions)))} />
                      </div>
                      <div className="w-16 shrink-0 text-right font-mono text-xs text-white">
                        {point.views}/{point.submissions}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-6 text-[10px] uppercase tracking-[0.2em] text-chalk-gray">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#7b5bff]" /> Views
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#ff5f91]" /> Submissions
                  </span>
                </div>
              </Panel>

              <Panel title="Sources">
                <div className="space-y-4">
                  {data.sources.map((row) => (
                    <div key={row.source}>
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-chalk-gray">{SOURCE_LABELS[row.source] ?? row.source}</span>
                        <span className="font-mono text-white">{row.count}</span>
                      </div>
                      <ProgressBar value={percent(row.count, maxSource)} />
                    </div>
                  ))}
                </div>
                {data.sources.length === 0 ? (
                  <p className="py-6 text-center text-sm text-chalk-gray">No source data for this range yet.</p>
                ) : null}
              </Panel>
            </div>

            <Panel title="Rating distribution">
              <div className="space-y-4">
                {data.rating_breakdown.map((row) => (
                  <div key={row.stars} className="flex items-center gap-4">
                    <span className="w-12 shrink-0 font-mono text-xs text-chalk-gray">{row.stars} ★</span>
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff]"
                        style={{ width: `${percent(row.count, maxRating)}%` }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right font-mono text-xs text-white">{row.count}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="What to do next">
              <div className="grid gap-4 md:grid-cols-3">
                {data.sources.every((row) => row.count === 0) ? (
                  <p className="text-sm text-chalk-gray">Share your link and print QR codes to start collecting reviews.</p>
                ) : (
                  <>
                    {data.totals.pending_reviews > 0 ? (
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <p className="text-sm font-semibold text-white">
                          {data.totals.pending_reviews} reviews waiting
                        </p>
                        <p className="mt-2 text-xs text-chalk-gray">
                          Approve them so they appear on your public review page.
                        </p>
                        <PrimaryButton href="/gmbqyn/reviews" className="mt-4">
                          Moderate now
                        </PrimaryButton>
                      </div>
                    ) : null}
                    {data.totals.avg_rating > 0 && data.totals.avg_rating < 4 ? (
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <p className="text-sm font-semibold text-white">Rating is below 4 stars</p>
                        <p className="mt-2 text-xs text-chalk-gray">
                          Reply to every recent review — businesses that respond see ratings recover faster.
                        </p>
                        <PrimaryButton href="/gmbqyn/reviews" className="mt-4">
                          Reply to reviews
                        </PrimaryButton>
                      </div>
                    ) : null}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <p className="text-sm font-semibold text-white">Top channel</p>
                      <p className="mt-2 text-xs text-chalk-gray">
                        {SOURCE_LABELS[data.sources.slice().sort((a, b) => b.count - a.count)[0].source]} is driving
                        the most reviews. Double down on it.
                      </p>
                      <PrimaryButton href="/gmbqyn/qr" className="mt-4">
                        Print more QR codes
                      </PrimaryButton>
                    </div>
                  </>
                )}
              </div>
            </Panel>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
