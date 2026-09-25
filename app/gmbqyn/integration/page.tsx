'use client';

import { useState } from 'react';
import { formatDateTime, relativeTime } from '@/lib/gmbqyn';
import { useGmbqynService } from '@/lib/gmbqyn/auth-context';
import type { GoogleProfile } from '@/lib/gmbqyn';
import { useAsync, messageOf } from '../lib/hooks';
import { AppShell } from '../components/shell';
import { customerNav } from '../lib/nav';
import { ErrorNote, Field, GhostButton, Input, Loading, PageHeader, Panel, PrimaryButton, Stars, StatusPill, SuccessNote } from '../components/ui';

export default function IntegrationPage() {
  const service = useGmbqynService();
  const { data, error, loading, reload } = useAsync<GoogleProfile>(() => service.getGoogleProfile(), []);
  const [placeId, setPlaceId] = useState('');
  const [reviewUrl, setReviewUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const connect = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setFormError(null);
    try {
      await service.connectGoogle({ place_id: placeId.trim(), review_url: reviewUrl.trim() || undefined });
      setNotice('Google Business Profile connected. Run a sync to pull in your existing reviews.');
      setPlaceId('');
      setReviewUrl('');
      reload();
    } catch (err) {
      setFormError(messageOf(err));
    } finally {
      setBusy(false);
    }
  };

  const sync = async () => {
    setBusy(true);
    setFormError(null);
    try {
      const result = await service.syncGoogle();
      setNotice(`${result.synced} reviews synced. ${result.message}`);
      reload();
    } catch (err) {
      setFormError(messageOf(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell area="customer" items={customerNav} title="Google Integration">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Integration"
          title="Connect your Google Business Profile"
          description="Pull existing Google reviews into GMBQYN and keep everything in one dashboard. Available on the Scale plan."
          action={
            data?.connected ? (
              <PrimaryButton onClick={sync} disabled={busy}>
                {busy ? 'Syncing…' : 'Sync now'}
              </PrimaryButton>
            ) : undefined
          }
        />

        {notice ? <SuccessNote message={notice} /> : null}
        {formError ? <ErrorNote message={formError} /> : null}
        {error ? <ErrorNote message={error} /> : null}
        {loading ? <Loading /> : null}

        {data ? (
          <>
            <Panel title="Connection status">
              {data.connected ? (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="rounded-full border border-[#00FFA3]/40 bg-[#00FFA3]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00FFA3]">
                      Connected
                    </span>
                    <span className="text-sm text-white">{data.name ?? 'Google Business Profile'}</span>
                  </div>

                  <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { label: 'Place ID', value: data.place_id ?? '—' },
                      { label: 'Rating', value: data.rating ? data.rating.toFixed(1) : '—' },
                      { label: 'Reviews', value: data.review_count ?? 0 },
                      { label: 'Last synced', value: data.last_synced_at ? relativeTime(data.last_synced_at) : 'Never' },
                    ].map((row) => (
                      <div key={row.label}>
                        <dt className="text-[10px] uppercase tracking-[0.3em] text-chalk-gray">{row.label}</dt>
                        <dd className="mt-2 break-all text-sm text-white">{row.value}</dd>
                      </div>
                    ))}
                  </dl>

                  {data.rating ? <Stars value={Math.round(data.rating)} size={18} /> : null}

                  {data.review_url ? (
                    <a
                      href={data.review_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs text-white underline underline-offset-4"
                    >
                      View this listing on Google
                    </a>
                  ) : null}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed text-chalk-gray">
                    Find your Place ID from your Google Business Profile URL — it is the string starting with
                    <span className="font-mono text-white"> ChIJ</span> in the address bar.
                  </p>
                  <form onSubmit={connect} className="space-y-5">
                    <Field label="Google Place ID">
                      <Input
                        required
                        value={placeId}
                        onChange={(e) => setPlaceId(e.target.value)}
                        placeholder="ChIJN1t_tDeuEmsRUsoyG83frY4"
                      />
                    </Field>
                    <Field label="Google review URL (optional)">
                      <Input
                        value={reviewUrl}
                        onChange={(e) => setReviewUrl(e.target.value)}
                        placeholder="https://g.page/…"
                      />
                    </Field>
                    <PrimaryButton type="submit" disabled={busy}>
                      {busy ? 'Connecting…' : 'Connect profile'}
                    </PrimaryButton>
                  </form>
                </div>
              )}
            </Panel>

            {data.pending_reviews.length > 0 ? (
              <Panel title={`Google reviews waiting for import (${data.pending_reviews.length})`}>
                <div className="space-y-4">
                  {data.pending_reviews.map((review) => (
                    <div key={review.id} className="flex flex-wrap items-start justify-between gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-sm font-semibold text-white">{review.customer_name}</span>
                          <StatusPill value={review.status} />
                          <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-chalk-gray">
                            {review.source}
                          </span>
                        </div>
                        {review.comment ? (
                          <p className="mt-2 text-sm leading-relaxed text-chalk-gray">{review.comment}</p>
                        ) : null}
                      </div>
                      <span className="font-mono text-sm text-[#ffb020]">{review.rating} ★</span>
                    </div>
                  ))}
                </div>
              </Panel>
            ) : null}

            {data.sync_log.length > 0 ? (
              <Panel title="Sync history">
                <div className="space-y-3">
                  {data.sync_log.map((entry, index) => (
                    <div key={index} className="flex flex-wrap items-center justify-between gap-3 text-sm">
                      <span className="text-chalk-gray">{entry.message}</span>
                      <span className="font-mono text-xs text-chalk-gray" title={formatDateTime(entry.at)}>
                        +{entry.added} · {relativeTime(entry.at)}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>
            ) : null}

            <Panel title="What you get with Scale">
              <ul className="space-y-3 text-sm text-chalk-gray">
                {data.perks.map((perk) => (
                  <li key={perk} className="flex gap-3">
                    <span aria-hidden="true" className="text-[#00FFA3]">
                      ✓
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>
              <GhostButton href="/gmbqyn/subscription" className="mt-6">
                View plans
              </GhostButton>
            </Panel>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
