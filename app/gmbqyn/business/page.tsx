'use client';

import { useEffect, useState } from 'react';
import { CATEGORIES, slugify } from '@/lib/gmbqyn';
import { useGmbqynService } from '@/lib/gmbqyn/auth-context';
import type { Business } from '@/lib/gmbqyn';
import { useAsync, messageOf } from '../lib/hooks';
import { AppShell } from '../components/shell';
import { customerNav } from '../lib/nav';
import { ErrorNote, Field, Input, Loading, PageHeader, Panel, PrimaryButton, Select, StatusPill, SuccessNote, Textarea } from '../components/ui';

type FormState = {
  name: string;
  category: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  website: string;
  google_place_id: string;
  google_review_url: string;
};

const blank: FormState = {
  name: '',
  category: CATEGORIES[0],
  description: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
  phone: '',
  website: '',
  google_place_id: '',
  google_review_url: '',
};

export default function BusinessPage() {
  const service = useGmbqynService();
  const { data, error, loading, reload } = useAsync<Business>(() => service.getBusiness(), []);
  const [form, setForm] = useState<FormState>(blank);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    setForm({
      name: data.name ?? '',
      category: data.category ?? CATEGORIES[0],
      description: data.description ?? '',
      address: data.address ?? '',
      city: data.city ?? '',
      state: data.state ?? '',
      country: data.country ?? 'India',
      phone: data.phone ?? '',
      website: data.website ?? '',
      google_place_id: data.google_place_id ?? '',
      google_review_url: data.google_review_url ?? '',
    });
  }, [data]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await service.updateBusiness({
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim() || null,
        address: form.address.trim() || null,
        city: form.city.trim() || null,
        state: form.state.trim() || null,
        country: form.country.trim() || 'India',
        phone: form.phone.trim() || null,
        website: form.website.trim() || null,
        google_place_id: form.google_place_id.trim() || null,
        google_review_url: form.google_review_url.trim() || null,
      });
      setNotice('Business profile saved.');
      reload();
    } catch (err) {
      setFormError(messageOf(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell area="customer" items={customerNav} title="Business Profile">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Profile"
          title="Your business details"
          description="This information appears on your public review page and in your QR cards."
        />

        {notice ? <SuccessNote message={notice} /> : null}
        {formError ? <ErrorNote message={formError} /> : null}
        {error ? <ErrorNote message={error} /> : null}
        {loading ? <Loading /> : null}

        {data ? (
          <>
            <Panel title="Account state">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-chalk-gray">Status</p>
                  <div className="mt-2">
                    <StatusPill value={data.status} />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-chalk-gray">Review link</p>
                  <p className="mt-2 text-sm text-white">/{data.slug}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-chalk-gray">Suggested slug</p>
                  <p className="mt-2 break-all font-mono text-xs text-chalk-gray">
                    {slugify(form.name) || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-chalk-gray">Rating</p>
                  <p className="mt-2 text-sm text-white">
                    {data.rating ? `${data.rating.toFixed(1)} ★ · ${data.review_count} reviews` : 'No rating yet'}
                  </p>
                </div>
              </div>
            </Panel>

            <Panel title="Details">
              <form onSubmit={save} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Business name">
                    <Input required value={form.name} onChange={(e) => set('name', e.target.value)} />
                  </Field>
                  <Field label="Category">
                    <Select value={form.category} onChange={(e) => set('category', e.target.value)}>
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category} className="bg-black">
                          {category}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>

                <Field label="Description" hint="Shown on your public review page. Two lines is plenty.">
                  <Textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
                </Field>

                <Field label="Street address">
                  <Input value={form.address} onChange={(e) => set('address', e.target.value)} />
                </Field>

                <div className="grid gap-5 md:grid-cols-3">
                  <Field label="City">
                    <Input value={form.city} onChange={(e) => set('city', e.target.value)} />
                  </Field>
                  <Field label="State">
                    <Input value={form.state} onChange={(e) => set('state', e.target.value)} />
                  </Field>
                  <Field label="Country">
                    <Input value={form.country} onChange={(e) => set('country', e.target.value)} />
                  </Field>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Phone">
                    <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" />
                  </Field>
                  <Field label="Website">
                    <Input value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://" />
                  </Field>
                </div>

                <Field label="Google Place ID" hint="Optional — needed only for Google sync on the Scale plan.">
                  <Input value={form.google_place_id} onChange={(e) => set('google_place_id', e.target.value)} />
                </Field>

                <Field label="Google review URL">
                  <Input value={form.google_review_url} onChange={(e) => set('google_review_url', e.target.value)} />
                </Field>

                <PrimaryButton type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </PrimaryButton>
              </form>
            </Panel>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
