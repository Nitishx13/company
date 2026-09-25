'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/gmbqyn';
import { useGmbqynService } from '@/lib/gmbqyn/auth-context';
import type { Business, ListResult } from '@/lib/gmbqyn';
import { useAsync, messageOf } from '../../lib/hooks';
import { AppShell } from '../../components/shell';
import { adminNav } from '../../lib/nav';
import { EmptyState, ErrorNote, Field, Input, Loading, PageHeader, Panel, PrimaryButton, Select, StatusPill, Table } from '../../components/ui';

export default function AdminBusinessesPage() {
  const service = useGmbqynService();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [notice, setNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const state = useAsync<ListResult<Business>>(
    () => service.listBusinesses({ q: query || undefined, status: status as never }),
    [query, status]
  );

  const setStatusOf = async (business: Business, next: 'pending' | 'active' | 'suspended') => {
    try {
      await service.updateBusinessStatus(business.id, next);
      setNotice(`${business.name} is now ${next}.`);
      state.reload();
    } catch (err) {
      setFormError(messageOf(err));
    }
  };

  const remove = async (business: Business) => {
    if (
      !window.confirm(
        `Delete ${business.name}? This removes their reviews, subscription and payment history permanently.`
      )
    )
      return;
    try {
      await service.deleteBusiness(business.id);
      setNotice(`${business.name} deleted.`);
      state.reload();
    } catch (err) {
      setFormError(messageOf(err));
    }
  };

  return (
    <AppShell area="admin" items={adminNav} title="Businesses">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Businesses"
          title="Every business on GMBQYN"
          description="Activate new sign-ups, suspend accounts that need attention, or remove them entirely."
        />

        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <Field label="Search">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, city, email…" />
          </Field>
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all" className="bg-black">All statuses</option>
              <option value="pending" className="bg-black">Pending</option>
              <option value="active" className="bg-black">Active</option>
              <option value="suspended" className="bg-black">Suspended</option>
            </Select>
          </Field>
        </div>

        {notice ? <div className="rounded-2xl border border-[#00FFA3]/30 bg-[#00FFA3]/5 px-4 py-3 text-sm text-[#00FFA3]">{notice}</div> : null}
        {formError ? <ErrorNote message={formError} /> : null}
        {state.error ? <ErrorNote message={state.error} /> : null}
        {state.loading ? <Loading /> : null}

        {state.data && state.data.data.length === 0 ? (
          <Panel>
            <EmptyState title="No businesses found" description="Try a different search or status filter." />
          </Panel>
        ) : null}

        {state.data && state.data.data.length > 0 ? (
          <Panel title={`${state.data.total} business${state.data.total === 1 ? '' : 'es'}`}>
            <Table headers={['Business', 'Category', 'Location', 'Rating', 'Status', 'Created', 'Actions']}>
              {state.data.data.map((business) => (
                <tr key={business.id}>
                  <td className="py-4 pr-6">
                    <p className="text-white">{business.name}</p>
                    <p className="font-mono text-xs text-chalk-gray">/{business.slug}</p>
                  </td>
                  <td className="py-4 pr-6 text-chalk-gray">{business.category}</td>
                  <td className="py-4 pr-6 text-chalk-gray">
                    {[business.city, business.state].filter(Boolean).join(', ') || business.country}
                  </td>
                  <td className="py-4 pr-6 text-white">
                    {business.rating ? `${business.rating.toFixed(1)} ★ · ${business.review_count}` : '—'}
                  </td>
                  <td className="py-4 pr-6">
                    <StatusPill value={business.status} />
                  </td>
                  <td className="py-4 pr-6 text-chalk-gray">{formatDate(business.created_at)}</td>
                  <td className="py-4 pr-6">
                    <div className="flex flex-wrap gap-2">
                      {business.status !== 'active' ? (
                        <PrimaryButton
                          onClick={() => setStatusOf(business, 'active')}
                          className="px-4 py-1.5 text-[9px]"
                        >
                          Activate
                        </PrimaryButton>
                      ) : (
                        <PrimaryButton
                          onClick={() => setStatusOf(business, 'suspended')}
                          className="px-4 py-1.5 text-[9px]"
                        >
                          Suspend
                        </PrimaryButton>
                      )}
                      <a
                        href={`/gmbqyn/r/${business.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-white/20 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-chalk-gray hover:border-white hover:text-white"
                      >
                        View
                      </a>
                      <button
                        type="button"
                        onClick={() => remove(business)}
                        className="rounded-full border border-red-400/30 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-red-400 hover:bg-red-400/10"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
          </Panel>
        ) : null}
      </div>
    </AppShell>
  );
}
