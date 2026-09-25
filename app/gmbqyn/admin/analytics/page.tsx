'use client';

import { useState } from 'react';
import { inr } from '@/lib/gmbqyn';
import { useGmbqynService } from '@/lib/gmbqyn/auth-context';
import type { AdminAnalytics } from '@/lib/gmbqyn/service';
import { useAsync } from '../../lib/hooks';
import { AppShell } from '../../components/shell';
import { ANALYTICS_RANGES, adminNav } from '../../lib/nav';
import { BarChart, ErrorNote, Loading, PageHeader, Panel, ProgressBar, StatCard } from '../../components/ui';

export default function AdminAnalyticsPage() {
  const service = useGmbqynService();
  const [range, setRange] = useState('30d');
  const { data, error, loading } = useAsync<AdminAnalytics>(() => service.getAdminAnalytics(range), [range]);

  return (
    <AppShell area="admin" items={adminNav} title="Admin Analytics">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Analytics"
          title="Platform performance"
          description="Recurring revenue, collections, churn and where the money comes from."
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
              <StatCard label="MRR" value={inr(data.totals.mrr)} accent />
              <StatCard label="ARR" value={inr(data.totals.arr)} />
              <StatCard label="Collected" value={inr(data.totals.collected)} />
              <StatCard label="Outstanding" value={inr(data.totals.outstanding)} />
              <StatCard label="Churned" value={inr(data.totals.churned)} sub="Lost MRR in range" />
              <StatCard label="New businesses" value={data.totals.new_businesses} />
            </div>

            <Panel title="MRR trend">
              <BarChart data={data.mrr_series} accent="#7b5bff" />
            </Panel>

            <Panel title="Revenue collected">
              <BarChart data={data.revenue_series} accent="#ff5f91" />
            </Panel>

            <div className="grid gap-6 lg:grid-cols-2">
              <Panel title="Revenue by category">
                <div className="space-y-4">
                  {data.category_split.map((row) => {
                    const max = Math.max(1, ...data.category_split.map((item) => item.mrr));
                    return (
                      <div key={row.category}>
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className="text-chalk-gray">
                            {row.category} <span className="opacity-60">({row.businesses})</span>
                          </span>
                          <span className="font-mono text-white">{inr(row.mrr)}</span>
                        </div>
                        <ProgressBar value={Math.round((row.mrr / max) * 100)} />
                      </div>
                    );
                  })}
                </div>
              </Panel>

              <Panel title="Churn">
                <BarChart data={data.churn_series} accent="#ff5f91" />
              </Panel>
            </div>

            <Panel title="Top businesses by MRR">
              <div className="space-y-4">
                {data.top_businesses.map((row, index) => (
                  <div key={row.name} className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-chalk-gray">{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <p className="text-sm text-white">{row.name}</p>
                        <p className="text-xs text-chalk-gray">
                          {row.reviews} reviews · {row.rating ? row.rating.toFixed(1) : '—'} ★
                        </p>
                      </div>
                    </div>
                    <p className="font-mono text-sm text-white">{inr(row.mrr)}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
