'use client';

import { useEffect, useState } from 'react';
import { isDemoMode, laravelBaseUrl } from '@/lib/gmbqyn';
import { useGmbqynService } from '@/lib/gmbqyn/auth-context';
import type { Settings } from '@/lib/gmbqyn';
import { useAsync, messageOf } from '../../lib/hooks';
import { AppShell } from '../../components/shell';
import { adminNav } from '../../lib/nav';
import { ErrorNote, Field, GhostButton, Input, Loading, PageHeader, Panel, PrimaryButton, StatCard, SuccessNote, Toggle } from '../../components/ui';

export default function AdminSettingsPage() {
  const service = useGmbqynService();
  const { data, error, loading, reload, setData } = useAsync<Settings>(() => service.getSettings(), []);
  const [form, setForm] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (data && !form) setForm(data);
  }, [data, form]);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form) return;
    setSaving(true);
    setFormError(null);
    try {
      const updated = await service.updateSettings(form);
      setData(updated);
      setForm(updated);
      setNotice('Settings saved.');
    } catch (err) {
      setFormError(messageOf(err));
    } finally {
      setSaving(false);
    }
  };

  const resetDemo = async () => {
    if (!window.confirm('Reset all demo data? Businesses, reviews, payments and plans return to the original sample set.'))
      return;
    setResetting(true);
    try {
      await service.resetDemoData();
      setNotice('Demo data restored.');
      window.location.reload();
    } catch (err) {
      setFormError(messageOf(err));
    } finally {
      setResetting(false);
    }
  };

  return (
    <AppShell area="admin" items={adminNav} title="Settings">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Configuration"
          title="Platform settings"
          description="Business details used on invoices, plus subscription and moderation defaults."
        />

        {notice ? <SuccessNote message={notice} /> : null}
        {formError ? <ErrorNote message={formError} /> : null}
        {error ? <ErrorNote message={error} /> : null}
        {loading || !form ? <Loading /> : null}

        {form ? (
          <form onSubmit={save} className="space-y-6">
            <Panel title="Business identity">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Company name" hint="Printed on every invoice.">
                  <Input required value={form.company_name} onChange={(e) => set('company_name', e.target.value)} />
                </Field>
                <Field label="Currency">
                  <Input required value={form.currency} onChange={(e) => set('currency', e.target.value.toUpperCase())} />
                </Field>
                <Field label="Support email">
                  <Input type="email" required value={form.support_email} onChange={(e) => set('support_email', e.target.value)} />
                </Field>
                <Field label="Support phone">
                  <Input value={form.support_phone} onChange={(e) => set('support_phone', e.target.value)} />
                </Field>
              </div>
            </Panel>

            <Panel title="Subscriptions">
              <div className="space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Trial length (days)">
                    <Input
                      type="number"
                      min={0}
                      required
                      value={form.trial_days}
                      onChange={(e) => set('trial_days', Number(e.target.value))}
                    />
                  </Field>
                  <Field label="Review reminder (days before renewal)">
                    <Input
                      type="number"
                      min={0}
                      required
                      value={form.review_reminder_days}
                      onChange={(e) => set('review_reminder_days', Number(e.target.value))}
                    />
                  </Field>
                </div>
                <Toggle
                  checked={form.auto_renew}
                  onChange={(next) => set('auto_renew', next)}
                  label="Renew subscriptions automatically"
                  description="Off means every renewal is confirmed by our team, which is how billing works today."
                />
              </div>
            </Panel>

            <Panel title="Operations">
              <div className="space-y-6">
                <Toggle
                  checked={form.maintenance_mode}
                  onChange={(next) => set('maintenance_mode', next)}
                  label="Maintenance mode"
                  description="Blocks new review submissions and sign-ups. Existing dashboards still load."
                />
                <div className="flex flex-wrap gap-3">
                  <PrimaryButton type="submit" disabled={saving}>
                    {saving ? 'Saving…' : 'Save settings'}
                  </PrimaryButton>
                  <GhostButton onClick={() => setForm(data ?? form)} disabled={saving}>
                    Discard changes
                  </GhostButton>
                </div>
              </div>
            </Panel>
          </form>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Backend"
            value={isDemoMode() ? 'Mock' : 'Laravel'}
            sub={laravelBaseUrl() || 'No API URL configured'}
          />
          <StatCard label="Persistence" value={isDemoMode() ? 'Browser' : 'MySQL'} sub={isDemoMode() ? 'localStorage gmbqyn_db_v1' : 'Server-side'} />
          <StatCard
            label="Danger zone"
            value={<GhostButton onClick={resetDemo} disabled={resetting}>{resetting ? 'Resetting…' : 'Reset demo data'}</GhostButton>}
            sub="Only affects demo mode"
          />
        </div>
      </div>
    </AppShell>
  );
}
