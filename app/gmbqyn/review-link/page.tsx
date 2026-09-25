'use client';

import { useState } from 'react';
import { formatDate, percent } from '@/lib/gmbqyn';
import { useGmbqynService } from '@/lib/gmbqyn/auth-context';
import type { ReviewLink } from '@/lib/gmbqyn';
import { useAsync, messageOf } from '../lib/hooks';
import { AppShell } from '../components/shell';
import { customerNav } from '../lib/nav';
import { ErrorNote, Field, GhostButton, Input, Loading, PageHeader, Panel, PrimaryButton, StatCard, SuccessNote, Toggle } from '../components/ui';

export default function ReviewLinkPage() {
  const service = useGmbqynService();
  const { data, error, loading, reload } = useAsync<ReviewLink>(() => service.getReviewLink(), []);
  const [draft, setDraft] = useState<{ is_active: boolean; slug: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    setSaving(true);
    setFormError(null);
    try {
      await service.updateReviewLink({ is_active: draft.is_active, slug: draft.slug || undefined });
      setNotice('Review link updated.');
      setDraft(null);
      reload();
    } catch (err) {
      setFormError(messageOf(err));
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!window.confirm('Generate a new link? The old link and its QR codes will stop working.')) return;
    setSaving(true);
    try {
      await service.resetReviewLink();
      setNotice('New review link generated.');
      reload();
    } catch (err) {
      setFormError(messageOf(err));
    } finally {
      setSaving(false);
    }
  };

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setFormError('Clipboard is blocked in this browser — copy the link manually.');
    }
  };

  const form = draft ?? (data ? { is_active: data.is_active, slug: data.slug } : null);

  return (
    <AppShell area="customer" items={customerNav} title="Review Link">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Distribution"
          title="Your permanent review link"
          description="This link never changes. Put it in your WhatsApp bio, email signature, Google business profile and on every invoice."
        />

        {loading ? <Loading /> : null}
        {error ? <ErrorNote message={error} /> : null}
        {notice ? <SuccessNote message={notice} /> : null}

        {data && form ? (
          <>
            <Panel title="Your link">
              <div className="space-y-5">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-chalk-gray">Short link</p>
                  <p className="mt-2 break-all font-mono text-lg text-white">{data.short_url}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <PrimaryButton onClick={() => copy('Short link', data.short_url)}>
                      {copied === 'Short link' ? 'Copied' : 'Copy short link'}
                    </PrimaryButton>
                    <GhostButton onClick={() => copy('Full URL', data.url)}>
                      {copied === 'Full URL' ? 'Copied' : 'Copy full URL'}
                    </GhostButton>
                    <GhostButton href={`/gmbqyn/r/${data.slug}`}>Preview page</GhostButton>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-white">Open in new tab</span>
                  <a
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-right font-mono text-xs text-chalk-gray underline underline-offset-4"
                  >
                    {data.url}
                  </a>
                </div>
              </div>
            </Panel>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total views" value={data.clicks} accent />
              <StatCard label="Submissions" value={data.submissions} />
              <StatCard label="Conversion rate" value={`${data.conversion_rate}%`} sub="Views to reviews" />
              <StatCard label="Created" value={formatDate(data.created_at)} />
            </div>

            <Panel title="Performance">
              <div className="space-y-3">
                {[
                  { label: 'Visitors who opened the link', value: data.clicks },
                  { label: 'Visitors who submitted a review', value: data.submissions },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-4">
                    <span className="w-56 shrink-0 text-xs text-chalk-gray">{row.label}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff]"
                        style={{ width: `${percent(row.value, Math.max(1, data.clicks))}%` }}
                      />
                    </div>
                    <span className="w-12 shrink-0 text-right font-mono text-xs text-white">{row.value}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Settings">
              <form onSubmit={save} className="space-y-6">
                {formError ? <ErrorNote message={formError} /> : null}

                <Toggle
                  checked={form.is_active}
                  onChange={(next) => setDraft({ ...form, is_active: next })}
                  label="Accept new reviews"
                  description="When paused, the page still loads but submissions are refused."
                />

                <Field label="Link slug" hint="Letters, numbers and dashes. Changing it breaks existing QR codes.">
                  <Input
                    value={form.slug}
                    onChange={(event) => setDraft({ ...form, slug: event.target.value.toLowerCase() })}
                    placeholder="kanha-coffee"
                  />
                </Field>

                <div className="flex flex-wrap gap-3">
                  <PrimaryButton type="submit" disabled={saving || !draft}>
                    {saving ? 'Saving…' : 'Save changes'}
                  </PrimaryButton>
                  <GhostButton onClick={reset} disabled={saving}>
                    Generate new link
                  </GhostButton>
                  <PrimaryButton href="/gmbqyn/qr">Get QR codes</PrimaryButton>
                </div>
              </form>
            </Panel>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
