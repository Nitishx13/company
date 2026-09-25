'use client';

import { useState } from 'react';
import { formatDateTime, relativeTime } from '@/lib/gmbqyn';
import { useGmbqynService } from '@/lib/gmbqyn/auth-context';
import type { Feedback, FeedbackStatus, ListResult } from '@/lib/gmbqyn';
import { useAsync, messageOf } from '../../lib/hooks';
import { AppShell } from '../../components/shell';
import { adminNav } from '../../lib/nav';
import { EmptyState, ErrorNote, Field, Loading, PageHeader, Panel, Select, StatusPill, Table } from '../../components/ui';

export default function AdminFeedbackPage() {
  const service = useGmbqynService();
  const [status, setStatus] = useState('all');
  const [notice, setNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const state = useAsync<ListResult<Feedback>>(
    () => service.listAllFeedback({ status: status as never }),
    [status]
  );

  const patch = async (feedback: Feedback, next: FeedbackStatus) => {
    try {
      await service.updateFeedbackStatus(feedback.id, next);
      setNotice(`Marked ${next.replace(/_/g, ' ')}.`);
      state.reload();
    } catch (err) {
      setFormError(messageOf(err));
    }
  };

  const remove = async (feedback: Feedback) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      await service.deleteFeedback(feedback.id);
      state.reload();
    } catch (err) {
      setFormError(messageOf(err));
    }
  };

  const items = state.data?.data ?? [];

  return (
    <AppShell area="admin" items={adminNav} title="Feedback Inbox">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Feedback"
          title="Messages sent to businesses"
          description="Private feedback customers sent to their business through GMBQYN. Useful for spotting systemic service problems."
        />

        <div className="grid gap-4 md:grid-cols-[220px_1fr]">
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all" className="bg-black">All</option>
              <option value="new" className="bg-black">New</option>
              <option value="in_progress" className="bg-black">In progress</option>
              <option value="resolved" className="bg-black">Resolved</option>
              <option value="spam" className="bg-black">Spam</option>
            </Select>
          </Field>
        </div>

        {notice ? <div className="rounded-2xl border border-[#00FFA3]/30 bg-[#00FFA3]/5 px-4 py-3 text-sm text-[#00FFA3]">{notice}</div> : null}
        {formError ? <ErrorNote message={formError} /> : null}
        {state.error ? <ErrorNote message={state.error} /> : null}
        {state.loading ? <Loading /> : null}

        {state.data && items.length === 0 ? (
          <Panel>
            <EmptyState title="Inbox is empty" description="No private feedback has been submitted yet." />
          </Panel>
        ) : null}

        {items.length > 0 ? (
          <Panel title={`${state.data?.total ?? 0} message${state.data?.total === 1 ? '' : 's'}`}>
            <div className="space-y-5">
              {items.map((feedback) => (
                <article key={feedback.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-semibold text-white">
                          {feedback.business_name ?? `Business #${feedback.business_id}`}
                        </span>
                        <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-chalk-gray">
                          {feedback.category}
                        </span>
                        <StatusPill value={feedback.status} />
                      </div>
                      <p className="mt-1 text-xs text-chalk-gray">
                        from {feedback.name}
                        {feedback.email ? ` · ${feedback.email}` : ''}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-chalk-gray" title={formatDateTime(feedback.created_at)}>
                      {relativeTime(feedback.created_at)}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-chalk-gray">{feedback.message}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {feedback.status !== 'resolved' ? (
                      <button
                        type="button"
                        onClick={() => patch(feedback, 'resolved')}
                        className="rounded-full border border-[#00FFA3]/30 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#00FFA3] hover:bg-[#00FFA3]/10"
                      >
                        Resolve
                      </button>
                    ) : null}
                    {feedback.status !== 'in_progress' ? (
                      <button
                        type="button"
                        onClick={() => patch(feedback, 'in_progress')}
                        className="rounded-full border border-[#ffb020]/30 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#ffb020] hover:bg-[#ffb020]/10"
                      >
                        In progress
                      </button>
                    ) : null}
                    {feedback.status !== 'spam' ? (
                      <button
                        type="button"
                        onClick={() => patch(feedback, 'spam')}
                        className="rounded-full border border-white/20 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-chalk-gray hover:border-white hover:text-white"
                      >
                        Spam
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => remove(feedback)}
                      className="rounded-full border border-red-400/30 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-red-400 hover:bg-red-400/10"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </Panel>
        ) : null}
      </div>
    </AppShell>
  );
}
