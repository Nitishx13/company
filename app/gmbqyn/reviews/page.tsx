'use client';

import { useState } from 'react';
import { useAsync, messageOf } from '../lib/hooks';
import { AppShell } from '../components/shell';
import { customerNav } from '../lib/nav';
import { EmptyState, ErrorNote, Field, GhostButton, Input, Loading, PageHeader, Panel, PrimaryButton, Select, Textarea } from '../components/ui';
import type { Review } from '@/lib/gmbqyn';
import { useGmbqynService } from '@/lib/gmbqyn/auth-context';

const emptyDraft = { customer_name: '', customer_email: '', rating: 5, title: '', comment: '', source: 'manual' as const };

export default function ReviewsPage() {
  const service = useGmbqynService();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [draft, setDraft] = useState(emptyDraft);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [editing, setEditing] = useState<Review | null>(null);
  const [reply, setReply] = useState('');

  const state = useAsync(() => service.listReviews({ status: status as never, q: query || undefined }), [status, query]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await service.updateReview(editing.id, {
          customer_name: draft.customer_name,
          customer_email: draft.customer_email || null,
          rating: draft.rating,
          title: draft.title || null,
          comment: draft.comment || null,
        });
        setNotice('Review updated.');
      } else {
        await service.createReview({ ...draft });
        setNotice('Review added.');
      }
      setDraft(emptyDraft);
      setShowForm(false);
      setEditing(null);
      state.reload();
    } catch (err) {
      setFormError(messageOf(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (review: Review) => {
    if (!window.confirm('Delete this review? This cannot be undone.')) return;
    try {
      await service.deleteReview(review.id);
      state.reload();
    } catch (err) {
      setNotice(messageOf(err));
    }
  };

  const setStatusOf = async (review: Review, next: 'approved' | 'rejected' | 'flagged') => {
    try {
      await service.updateReview(review.id, { status: next });
      state.reload();
    } catch (err) {
      setNotice(messageOf(err));
    }
  };

  const sendReply = async (review: Review) => {
    if (reply.trim().length < 2) return;
    try {
      await service.updateReview(review.id, { reply_text: reply.trim() });
      setReply('');
      state.reload();
    } catch (err) {
      setNotice(messageOf(err));
    }
  };

  return (
    <AppShell area="customer" items={customerNav} title="Reviews">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Review inbox"
          title="Every review, in one place"
          description="Reviews collected from your link, QR codes and Google sync all land here. Moderate, reply and export."
          action={
            <PrimaryButton
              onClick={() => {
                setEditing(null);
                setDraft(emptyDraft);
                setShowForm((v) => !v);
              }}
            >
              {showForm ? 'Close' : 'Add review'}
            </PrimaryButton>
          }
        />

        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <Field label="Search">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by customer name or text…"
            />
          </Field>
          <Field label="Status">
            <Select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all" className="bg-black">All statuses</option>
              <option value="pending" className="bg-black">Pending</option>
              <option value="approved" className="bg-black">Approved</option>
              <option value="flagged" className="bg-black">Flagged</option>
              <option value="rejected" className="bg-black">Rejected</option>
            </Select>
          </Field>
        </div>

        {notice ? <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-chalk-gray">{notice}</div> : null}

        {showForm ? (
          <Panel title={editing ? 'Edit review' : 'Add a review manually'}>
            <form onSubmit={save} className="space-y-5">
              {formError ? <ErrorNote message={formError} /> : null}
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Customer name">
                  <Input
                    required
                    value={draft.customer_name}
                    onChange={(e) => setDraft({ ...draft, customer_name: e.target.value })}
                  />
                </Field>
                <Field label="Customer email">
                  <Input
                    type="email"
                    value={draft.customer_email}
                    onChange={(e) => setDraft({ ...draft, customer_email: e.target.value })}
                  />
                </Field>
              </div>
              <div className="grid gap-5 md:grid-cols-[1fr_140px_160px]">
                <Field label="Review text">
                  <Textarea
                    rows={3}
                    value={draft.comment}
                    onChange={(e) => setDraft({ ...draft, comment: e.target.value })}
                  />
                </Field>
                <Field label="Rating">
                  <Select
                    value={draft.rating}
                    onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })}
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value} className="bg-black">
                        {value} star{value > 1 ? 's' : ''}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Source">
                  <Select
                    value={draft.source}
                    onChange={(e) => setDraft({ ...draft, source: e.target.value as typeof draft.source })}
                  >
                    <option value="manual" className="bg-black">Manual</option>
                    <option value="link" className="bg-black">Review link</option>
                    <option value="qr" className="bg-black">QR code</option>
                    <option value="import" className="bg-black">Imported</option>
                  </Select>
                </Field>
              </div>
              <div className="flex gap-3">
                <PrimaryButton type="submit" disabled={saving}>
                  {saving ? 'Saving…' : editing ? 'Save changes' : 'Add review'}
                </PrimaryButton>
                <GhostButton
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                >
                  Cancel
                </GhostButton>
              </div>
            </form>
          </Panel>
        ) : null}

        {state.loading ? <Loading /> : null}
        {state.error ? <ErrorNote message={state.error} /> : null}

        {state.data && state.data.data.length === 0 ? (
          <Panel>
            <EmptyState
              title="No reviews found"
              description="Share your review link and QR code, or add a review manually to get started."
              action={
                <PrimaryButton href="/gmbqyn/review-link">Get your link</PrimaryButton>
              }
            />
          </Panel>
        ) : null}

        <div className="space-y-4">
          {state.data?.data.map((review) => (
            <Panel key={review.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-semibold text-white">{review.customer_name}</span>
                    <span className="font-mono text-xs text-chalk-gray">
                      {new Date(review.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-chalk-gray">
                      {review.source}
                    </span>
                  </div>
                  {review.title ? <p className="mt-2 text-sm font-semibold text-white">{review.title}</p> : null}
                  {review.comment ? <p className="mt-2 text-sm leading-relaxed text-chalk-gray">{review.comment}</p> : null}
                </div>
                <div className="text-right text-sm font-mono text-[#ffb020]">{review.rating} ★</div>
              </div>

              {review.reply_text ? (
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-chalk-gray">Your reply</p>
                  <p className="mt-2 text-sm text-chalk-gray">{review.reply_text}</p>
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStatusOf(review, 'approved')}
                  className="rounded-full border border-[#00FFA3]/30 px-4 py-2 text-[10px] uppercase tracking-wider text-[#00FFA3] hover:bg-[#00FFA3]/10"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setStatusOf(review, 'flagged')}
                  className="rounded-full border border-[#ffb020]/30 px-4 py-2 text-[10px] uppercase tracking-wider text-[#ffb020] hover:bg-[#ffb020]/10"
                >
                  Flag
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(review);
                    setDraft({
                      customer_name: review.customer_name,
                      customer_email: review.customer_email ?? '',
                      rating: review.rating,
                      title: review.title ?? '',
                      comment: review.comment ?? '',
                      source: 'manual',
                    });
                    setShowForm(true);
                  }}
                  className="rounded-full border border-white/20 px-4 py-2 text-[10px] uppercase tracking-wider text-chalk-gray hover:border-white hover:text-white"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(review)}
                  className="rounded-full border border-red-400/30 px-4 py-2 text-[10px] uppercase tracking-wider text-red-400 hover:bg-red-400/10"
                >
                  Delete
                </button>
              </div>

              <div className="mt-4 flex gap-3">
                <Input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write a public reply…"
                />
                <GhostButton onClick={() => sendReply(review)} className="shrink-0">
                  Reply
                </GhostButton>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
