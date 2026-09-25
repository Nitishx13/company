'use client';

import { useState } from 'react';
import { formatDateTime, relativeTime } from '@/lib/gmbqyn';
import { useGmbqynService } from '@/lib/gmbqyn/auth-context';
import type { Feedback } from '@/lib/gmbqyn';
import { useAsync, messageOf } from '../lib/hooks';
import { AppShell } from '../components/shell';
import { customerNav } from '../lib/nav';
import { EmptyState, ErrorNote, Field, Input, Loading, PageHeader, Panel, PrimaryButton, Select, StatusPill, Textarea } from '../components/ui';

const CATEGORIES = ['Complaint', 'Suggestion', 'Appreciation', 'Bug', 'Other'];

export default function FeedbackPage() {
  const service = useGmbqynService();
  const [status, setStatus] = useState('all');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const state = useAsync(() => service.listFeedback({ status: status as never }), [status]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await service.createFeedback({ name: name.trim(), email: email.trim() || null, category, message: message.trim() });
      setName('');
      setEmail('');
      setMessage('');
      setNotice('Feedback saved to your inbox.');
      state.reload();
    } catch (err) {
      setFormError(messageOf(err));
    } finally {
      setSaving(false);
    }
  };

  const group = (items: Feedback[]) => {
    const open = items.filter((item) => item.status === 'new' || item.status === 'in_progress');
    const closed = items.filter((item) => item.status === 'resolved' || item.status === 'spam');
    return { open, closed };
  };

  const renderList = (items: Feedback[], empty: string) =>
    items.length === 0 ? (
      <p className="py-6 text-center text-sm text-chalk-gray">{empty}</p>
    ) : (
      <div className="space-y-4">
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-white">{item.name}</span>
                <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-chalk-gray">
                  {item.category}
                </span>
                <StatusPill value={item.status} />
              </div>
              <span className="text-[10px] font-mono text-chalk-gray" title={formatDateTime(item.created_at)}>
                {relativeTime(item.created_at)}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-chalk-gray">{item.message}</p>
            {item.email ? <p className="mt-3 font-mono text-xs text-chalk-gray">{item.email}</p> : null}
          </article>
        ))}
      </div>
    );

  const open = state.data ? group(state.data.data).open : [];
  const closed = state.data ? group(state.data.data).closed : [];

  return (
    <AppShell area="customer" items={customerNav} title="Feedback">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Private channel"
          title="Feedback inbox"
          description="Customers can send honest, private feedback instead of a public review. Nothing here is shown on your public page."
        />

        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div />
          <Field label="Status">
            <Select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all" className="bg-black">All</option>
              <option value="new" className="bg-black">New</option>
              <option value="in_progress" className="bg-black">In progress</option>
              <option value="resolved" className="bg-black">Resolved</option>
              <option value="spam" className="bg-black">Spam</option>
            </Select>
          </Field>
        </div>

        {notice ? <div className="rounded-2xl border border-[#00FFA3]/30 bg-[#00FFA3]/5 px-4 py-3 text-sm text-[#00FFA3]">{notice}</div> : null}
        {state.error ? <ErrorNote message={state.error} /> : null}
        {state.loading ? <Loading /> : null}

        {state.data && state.data.data.length === 0 ? (
          <Panel>
            <EmptyState
              title="Inbox is empty"
              description="Share your feedback link on receipts or your website so customers can raise concerns privately."
            />
          </Panel>
        ) : null}

        {open.length > 0 ? (
          <Panel title={`Needs attention (${open.length})`}>{renderList(open, 'Nothing open.')}</Panel>
        ) : null}
        {closed.length > 0 ? <Panel title={`Closed (${closed.length})`}>{renderList(closed, 'Nothing closed.')}</Panel> : null}

        <Panel title="Log incoming feedback">
          <form onSubmit={save} className="space-y-5">
            {formError ? <ErrorNote message={formError} /> : null}
            <div className="grid gap-5 md:grid-cols-3">
              <Field label="Customer name">
                <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Rohit Verma" />
              </Field>
              <Field label="Email (optional)">
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>
              <Field label="Category">
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map((item) => (
                    <option key={item} value={item} className="bg-black">
                      {item}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Message">
              <Textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What did the customer say?"
              />
            </Field>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save feedback'}
            </PrimaryButton>
          </form>
        </Panel>
      </div>
    </AppShell>
  );
}
