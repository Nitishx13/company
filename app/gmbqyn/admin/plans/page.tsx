'use client';

import { useState } from 'react';
import { inr } from '@/lib/gmbqyn';
import { useGmbqynService } from '@/lib/gmbqyn/auth-context';
import type { Plan } from '@/lib/gmbqyn';
import { useAsync, messageOf } from '../../lib/hooks';
import { AppShell } from '../../components/shell';
import { adminNav } from '../../lib/nav';
import {
  EmptyState,
  ErrorNote,
  Field,
  GhostButton,
  Input,
  Loading,
  PageHeader,
  Panel,
  PrimaryButton,
  StatusPill,
  SuccessNote,
  Table,
  Textarea,
  Toggle,
} from '../../components/ui';

const FEATURES = [
  'review_link_enabled',
  'qr_enabled',
  'qr_custom_branding',
  'feedback_enabled',
  'analytics_enabled',
  'google_sync',
] as const;

const FEATURE_LABELS: Record<string, string> = {
  review_link_enabled: 'Review link',
  qr_enabled: 'QR codes',
  qr_custom_branding: 'Branded QR',
  feedback_enabled: 'Feedback inbox',
  analytics_enabled: 'Analytics',
  google_sync: 'Google sync',
};

export default function AdminPlansPage() {
  const service = useGmbqynService();
  const [editing, setEditing] = useState<Plan | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Partial<Plan>>({});
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const state = useAsync<Plan[]>(() => service.listPlans(), []);

  const startCreate = () => {
    setCreating(true);
    setEditing(null);
    setForm({
      name: '',
      code: '',
      tagline: '',
      price_monthly: 0,
      price_yearly: 0,
      currency: 'INR',
      seats: 1,
      max_reviews_per_month: null,
      sort_order: (state.data?.length ?? 0) + 1,
      is_active: true,
      features: [],
    });
  };

  const startEdit = (plan: Plan) => {
    setCreating(false);
    setEditing(plan);
    setForm({ ...plan });
  };

  const close = () => {
    setCreating(false);
    setEditing(null);
    setForm({});
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name) return;
    setSaving(true);
    setFormError(null);
    try {
      await service.savePlan({ ...form, name: form.name });
      setNotice(editing ? 'Plan updated.' : 'Plan created.');
      close();
      state.reload();
    } catch (err) {
      setFormError(messageOf(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (plan: Plan) => {
    if (!window.confirm(`Delete the ${plan.name} plan? Existing subscriptions are not changed.`)) return;
    try {
      await service.deletePlan(plan.id);
      setNotice(`${plan.name} deleted.`);
      state.reload();
    } catch (err) {
      setFormError(messageOf(err));
    }
  };

  const toggleFeature = (key: string, current: boolean) =>
    setForm((prev) => ({ ...prev, [key]: !current }));

  return (
    <AppShell area="admin" items={adminNav} title="Plans">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Catalogue"
          title="Plans & pricing"
          description="What customers can buy. Changes here apply to new subscriptions immediately."
          action={<PrimaryButton onClick={startCreate}>{creating ? 'Close' : 'New plan'}</PrimaryButton>}
        />

        {notice ? <SuccessNote message={notice} /> : null}
        {formError ? <ErrorNote message={formError} /> : null}
        {state.error ? <ErrorNote message={state.error} /> : null}
        {state.loading ? <Loading /> : null}

        {creating || editing ? (
          <Panel title={editing ? `Edit ${editing.name}` : 'Create a plan'}>
            <form onSubmit={save} className="space-y-5">
              {formError ? <ErrorNote message={formError} /> : null}
              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Name">
                  <Input required value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </Field>
                <Field label="Code" hint="Lowercase, no spaces.">
                  <Input
                    required
                    value={form.code ?? ''}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                  />
                </Field>
                <Field label="Sort order">
                  <Input
                    type="number"
                    value={form.sort_order ?? 1}
                    onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                  />
                </Field>
              </div>

              <Field label="Tagline">
                <Input value={form.tagline ?? ''} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
              </Field>

              <div className="grid gap-5 md:grid-cols-4">
                <Field label="Monthly (₹)">
                  <Input
                    type="number"
                    min={0}
                    required
                    value={form.price_monthly ?? 0}
                    onChange={(e) => setForm({ ...form, price_monthly: Number(e.target.value) })}
                  />
                </Field>
                <Field label="Yearly (₹)">
                  <Input
                    type="number"
                    min={0}
                    required
                    value={form.price_yearly ?? 0}
                    onChange={(e) => setForm({ ...form, price_yearly: Number(e.target.value) })}
                  />
                </Field>
                <Field label="Seats">
                  <Input
                    type="number"
                    min={1}
                    value={form.seats ?? 1}
                    onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })}
                  />
                </Field>
                <Field label="Max reviews / month" hint="Blank means unlimited.">
                  <Input
                    type="number"
                    min={0}
                    value={form.max_reviews_per_month ?? ''}
                    onChange={(e) =>
                      setForm({ ...form, max_reviews_per_month: e.target.value === '' ? null : Number(e.target.value) })
                    }
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {FEATURES.map((key) => (
                  <Toggle
                    key={key}
                    checked={Boolean(form[key])}
                    onChange={() => toggleFeature(key, Boolean(form[key]))}
                    label={FEATURE_LABELS[key]}
                  />
                ))}
                <Toggle
                  checked={form.is_active ?? true}
                  onChange={(next) => setForm({ ...form, is_active: next })}
                  label="Available for purchase"
                />
              </div>

              <Field label="Feature bullets" hint="One per line.">
                <Textarea
                  rows={5}
                  value={(form.features ?? []).join('\n')}
                  onChange={(e) =>
                    setForm({ ...form, features: e.target.value.split('\n').map((line) => line.trim()).filter(Boolean) })
                  }
                />
              </Field>

              <div className="flex gap-3">
                <PrimaryButton type="submit" disabled={saving}>
                  {saving ? 'Saving…' : editing ? 'Save changes' : 'Create plan'}
                </PrimaryButton>
                <GhostButton onClick={close}>Cancel</GhostButton>
              </div>
            </form>
          </Panel>
        ) : null}

        {state.data && state.data.length === 0 ? (
          <Panel>
            <EmptyState title="No plans yet" description="Create your first plan to start selling." />
          </Panel>
        ) : null}

        {state.data && state.data.length > 0 ? (
          <Panel title="Plan catalogue">
            <Table headers={['Plan', 'Monthly', 'Yearly', 'Seats', 'Reviews', 'Status', 'Actions']}>
              {state.data.map((plan) => (
                <tr key={plan.id}>
                  <td className="py-4 pr-6">
                    <p className="text-white">{plan.name}</p>
                    <p className="font-mono text-xs text-chalk-gray">{plan.code}</p>
                  </td>
                  <td className="py-4 pr-6 text-white">{inr(plan.price_monthly)}</td>
                  <td className="py-4 pr-6 text-white">{inr(plan.price_yearly)}</td>
                  <td className="py-4 pr-6 text-chalk-gray">{plan.seats}</td>
                  <td className="py-4 pr-6 text-chalk-gray">
                    {plan.max_reviews_per_month ?? '∞'}
                  </td>
                  <td className="py-4 pr-6">
                    <StatusPill value={plan.is_active ? 'active' : 'cancelled'} />
                  </td>
                  <td className="py-4 pr-6">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(plan)}
                        className="rounded-full border border-white/20 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-chalk-gray hover:border-white hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(plan)}
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
