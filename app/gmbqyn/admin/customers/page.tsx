'use client';

import { useState } from 'react';
import { formatDate, formatDateTime } from '@/lib/gmbqyn';
import { useGmbqynService } from '@/lib/gmbqyn/auth-context';
import type { ListResult, User } from '@/lib/gmbqyn';
import { useAsync, messageOf } from '../../lib/hooks';
import { AppShell } from '../../components/shell';
import { adminNav } from '../../lib/nav';
import { Avatar, EmptyState, ErrorNote, Field, Input, Loading, PageHeader, Panel, Select, StatusPill, Table } from '../../components/ui';

export default function AdminCustomersPage() {
  const service = useGmbqynService();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [notice, setNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const state = useAsync<ListResult<User>>(
    () => service.listCustomers({ q: query || undefined, status: status as never }),
    [query, status]
  );

  const setStatusOf = async (user: User, next: 'active' | 'invited' | 'suspended') => {
    try {
      await service.updateCustomerStatus(user.id, next);
      setNotice(`${user.name} is now ${next}.`);
      state.reload();
    } catch (err) {
      setFormError(messageOf(err));
    }
  };

  const remove = async (user: User) => {
    if (!window.confirm(`Delete ${user.name}? Their business and all reviews will be removed.`)) return;
    try {
      await service.deleteCustomer(user.id);
      setNotice(`${user.name} deleted.`);
      state.reload();
    } catch (err) {
      setFormError(messageOf(err));
    }
  };

  return (
    <AppShell area="admin" items={adminNav} title="Customers">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Customers"
          title="Customer accounts"
          description="Suspend accounts for abuse, or clean up sign-ups that never activated."
        />

        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <Field label="Search">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, email, phone…" />
          </Field>
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all" className="bg-black">All statuses</option>
              <option value="active" className="bg-black">Active</option>
              <option value="invited" className="bg-black">Invited</option>
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
            <EmptyState title="No customers found" description="Try a different search or status filter." />
          </Panel>
        ) : null}

        {state.data && state.data.data.length > 0 ? (
          <Panel title={`${state.data.total} customer${state.data.total === 1 ? '' : 's'}`}>
            <Table headers={['Customer', 'Role', 'Phone', 'Joined', 'Last login', 'Status', 'Actions']}>
              {state.data.data.map((user) => (
                <tr key={user.id}>
                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} size={34} />
                      <div>
                        <p className="text-white">{user.name}</p>
                        <p className="text-xs text-chalk-gray">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-6">
                    <StatusPill value={user.role} />
                  </td>
                  <td className="py-4 pr-6 text-chalk-gray">{user.phone ?? '—'}</td>
                  <td className="py-4 pr-6 text-chalk-gray">{formatDate(user.created_at)}</td>
                  <td className="py-4 pr-6 text-chalk-gray">
                    {user.last_login_at ? formatDateTime(user.last_login_at) : 'Never'}
                  </td>
                  <td className="py-4 pr-6">
                    <StatusPill value={user.status} />
                  </td>
                  <td className="py-4 pr-6">
                    <div className="flex flex-wrap gap-2">
                      {user.role !== 'admin' && user.status !== 'suspended' ? (
                        <button
                          type="button"
                          onClick={() => setStatusOf(user, 'suspended')}
                          className="rounded-full border border-[#ff5f91]/30 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#ff5f91] hover:bg-[#ff5f91]/10"
                        >
                          Suspend
                        </button>
                      ) : null}
                      {user.role !== 'admin' && user.status === 'suspended' ? (
                        <button
                          type="button"
                          onClick={() => setStatusOf(user, 'active')}
                          className="rounded-full border border-[#00FFA3]/30 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#00FFA3] hover:bg-[#00FFA3]/10"
                        >
                          Reinstate
                        </button>
                      ) : null}
                      {user.role !== 'admin' ? (
                        <button
                          type="button"
                          onClick={() => remove(user)}
                          className="rounded-full border border-red-400/30 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-red-400 hover:bg-red-400/10"
                        >
                          Delete
                        </button>
                      ) : null}
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
