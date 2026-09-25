'use client';

import { useState } from 'react';
import { formatDate, relativeTime } from '@/lib/gmbqyn';
import { useGmbqynService } from '@/lib/gmbqyn/auth-context';
import type { ListResult, Review } from '@/lib/gmbqyn';
import { useAsync, messageOf } from '../../lib/hooks';
import { AppShell } from '../../components/shell';
import { adminNav } from '../../lib/nav';
import { EmptyState, ErrorNote, Field, Input, Loading, PageHeader, Panel, Select, Stars, StatusPill, Table, Textarea } from '../../components/ui';

export default function AdminReviewsPage() {
  const service = useGmbqynService();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [notice, setNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Review | null>(null);
  const [reply, setReply] = useState('');

  const state = useAsync<ListResult<Review>>(
    () => service.listAllReviews({ status: status as never, q: query || undefined }),
    [status, query]
  );

  const moderate = async (review: Review, next: 'approved' | 'rejected' | 'flagged' | 'pending') => {
    try {
      await service.moderateReview(review.id, next);
      setNotice(`Review ${next}.`);
      setEditing(null);
      state.reload();
    } catch (err) {
      setFormError(messageOf(err));
    }
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    try {
      await service.updateReview(editing.id, {
        customer_name: editing.customer_name,
        rating: editing.rating,
        title: editing.title,
        comment: editing.comment,
        is_public: editing.is_public,
      });
      setNotice('Review updated.');
      setEditing(null);
      state.reload();
    } catch (err) {
      setFormError(messageOf(err));
    }
  };

  return (
    <AppShell area="admin" items={adminNav} title="All Reviews">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Moderation"
          title="Reviews across every business"
          description="Platform-wide moderation. Approve legitimate reviews, reject spam, and flag anything that needs a second look."
        />

        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <Field label="Search">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Customer, business or text…" />
          </Field>
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all" className="bg-black">All statuses</option>
              <option value="pending" className="bg-black">Pending</option>
              <option value="approved" className="bg-black">Approved</option>
              <option value="flagged" className="bg-black">Flagged</option>
              <option value="rejected" className="bg-black">Rejected</option>
            </Select>
          </Field>
        </div>

        {notice ? <div className="rounded-2xl border border-[#00FFA3]/30 bg-[#00FFA3]/5 px-4 py-3 text-sm text-[#00FFA3]">{notice}</div> : null}
        {formError ? <ErrorNote message={formError} /> : null}
        {state.error ? <ErrorNote message={state.error} /> : null}
        {state.loading ? <Loading /> : null}

        {editing ? (
          <Panel title={`Edit review #${editing.id}`}>
            <form onSubmit={save} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Customer name">
                  <Input
                    value={editing.customer_name}
                    onChange={(e) => setEditing({ ...editing, customer_name: e.target.value })}
                  />
                </Field>
                <Field label="Rating">
                  <Select
                    value={editing.rating}
                    onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value} className="bg-black">
                        {value} star{value > 1 ? 's' : ''}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
              <Field label="Title">
                <Input value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </Field>
              <Field label="Comment">
                <Textarea
                  rows={4}
                  value={editing.comment ?? ''}
                  onChange={(e) => setEditing({ ...editing, comment: e.target.value })}
                />
              </Field>
              <label className="flex items-center gap-3 text-sm text-chalk-gray">
                <input
                  type="checkbox"
                  checked={editing.is_public}
                  onChange={(e) => setEditing({ ...editing, is_public: e.target.checked })}
                  className="accent-[#7b5bff]"
                />
                Visible on the public review page
              </label>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff] px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-full border border-white/20 px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-chalk-gray"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Panel>
        ) : null}

        {state.data && state.data.data.length === 0 ? (
          <Panel>
            <EmptyState title="No reviews found" description="Try another filter." />
          </Panel>
        ) : null}

        {state.data && state.data.data.length > 0 ? (
          <Panel title={`${state.data.total} review${state.data.total === 1 ? '' : 's'}`}>
            <Table headers={['Business', 'Customer', 'Rating', 'Source', 'Status', 'Created', 'Actions']}>
              {state.data.data.map((review) => (
                <tr key={review.id}>
                  <td className="py-4 pr-6 text-white">{review.business_name ?? `#${review.business_id}`}</td>
                  <td className="py-4 pr-6">
                    <p className="text-white">{review.customer_name}</p>
                    {review.comment ? (
                      <p className="max-w-xs truncate text-xs text-chalk-gray">{review.comment}</p>
                    ) : null}
                  </td>
                  <td className="py-4 pr-6">
                    <Stars value={review.rating} />
                  </td>
                  <td className="py-4 pr-6 text-chalk-gray">{review.source}</td>
                  <td className="py-4 pr-6">
                    <StatusPill value={review.status} />
                  </td>
                  <td className="py-4 pr-6 text-chalk-gray" title={formatDate(review.created_at)}>
                    {relativeTime(review.created_at)}
                  </td>
                  <td className="py-4 pr-6">
                    <div className="flex flex-wrap gap-2">
                      {review.status !== 'approved' ? (
                        <button
                          type="button"
                          onClick={() => moderate(review, 'approved')}
                          className="rounded-full border border-[#00FFA3]/30 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#00FFA3] hover:bg-[#00FFA3]/10"
                        >
                          Approve
                        </button>
                      ) : null}
                      {review.status !== 'flagged' ? (
                        <button
                          type="button"
                          onClick={() => moderate(review, 'flagged')}
                          className="rounded-full border border-[#ffb020]/30 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#ffb020] hover:bg-[#ffb020]/10"
                        >
                          Flag
                        </button>
                      ) : null}
                      {review.status !== 'rejected' ? (
                        <button
                          type="button"
                          onClick={() => moderate(review, 'rejected')}
                          className="rounded-full border border-red-400/30 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-red-400 hover:bg-red-400/10"
                        >
                          Reject
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(review);
                          setReply(review.reply_text ?? '');
                        }}
                        className="rounded-full border border-white/20 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-chalk-gray hover:border-white hover:text-white"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
            <Field label="Business reply (visible to the customer)" className="mt-6">
              <Textarea rows={2} value={reply} onChange={(e) => setReply(e.target.value)} />
            </Field>
          </Panel>
        ) : null}
      </div>
    </AppShell>
  );
}
