'use client';

import { useState } from 'react';
import { formatDate, formatDateTime, isDemoMode } from '@/lib/gmbqyn';
import { messageOf } from '../lib/hooks';
import { useGmbqynAuth, useGmbqynService } from '@/lib/gmbqyn/auth-context';
import { AppShell } from '../components/shell';
import { customerNav } from '../lib/nav';
import { Avatar, ErrorNote, Field, GhostButton, Input, PageHeader, Panel, PrimaryButton, StatCard, StatusPill, SuccessNote } from '../components/ui';

export default function ProfilePage() {
  const service = useGmbqynService();
  const { session, refresh, serviceMode } = useGmbqynAuth();
  const [name, setName] = useState(session?.user.name ?? '');
  const [phone, setPhone] = useState(session?.user.phone ?? '');
  const [email, setEmail] = useState(session?.user.email ?? '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [nextPassword, setNextPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavingProfile(true);
    setProfileError(null);
    try {
      await service.updateProfile({ name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim() || null });
      await refresh();
      setNotice('Profile updated.');
    } catch (err) {
      setProfileError(messageOf(err));
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (nextPassword !== confirmPassword) {
      setPasswordError('The new passwords do not match.');
      return;
    }
    if (nextPassword.length < 8) {
      setPasswordError('Choose a password with at least 8 characters.');
      return;
    }
    setSavingPassword(true);
    setPasswordError(null);
    try {
      await service.changePassword(currentPassword, nextPassword);
      setCurrentPassword('');
      setNextPassword('');
      setConfirmPassword('');
      setNotice('Password changed.');
    } catch (err) {
      setPasswordError(messageOf(err));
    } finally {
      setSavingPassword(false);
    }
  };

  const resetDemo = async () => {
    if (!window.confirm('Reset all demo data back to the original sample businesses, plans and reviews?')) return;
    setSavingProfile(true);
    setProfileError(null);
    try {
      await service.resetDemoData();
      setNotice('Demo data restored.');
      window.location.reload();
    } catch (err) {
      setProfileError(messageOf(err));
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <AppShell area="customer" items={customerNav} title="My Account">
      <div className="space-y-8">
        <PageHeader eyebrow="Account" title="Your account" description="Manage your sign-in details and password." />

        {notice ? <SuccessNote message={notice} /> : null}

        <Panel title="Signed in as">
          <div className="flex flex-wrap items-center gap-5">
            <Avatar name={session?.user.name ?? ''} size={56} />
            <div>
              <p className="text-lg font-semibold text-white">{session?.user.name}</p>
              <p className="text-sm text-chalk-gray">{session?.user.email}</p>
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-3">
              <StatusPill value={session?.user.status ?? 'active'} />
              <StatusPill value={session?.user.role ?? 'customer'} />
            </div>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <StatCard label="Member since" value={formatDate(session?.user.created_at)} />
            <StatCard label="Last sign-in" value={formatDateTime(session?.user.last_login_at)} />
            <StatCard label="Backend" value={serviceMode} sub={isDemoMode() ? 'Demo data, not persisted' : 'Laravel API'} />
          </div>
        </Panel>

        <Panel title="Profile details">
          <form onSubmit={saveProfile} className="space-y-5">
            {profileError ? <ErrorNote message={profileError} /> : null}
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Full name">
                <Input required value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="Phone number">
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
              </Field>
            </div>
            <Field label="Email address" hint="Used for invoices and account notifications.">
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <PrimaryButton type="submit" disabled={savingProfile}>
              {savingProfile ? 'Saving…' : 'Save profile'}
            </PrimaryButton>
          </form>
        </Panel>

        <Panel title="Change password">
          <form onSubmit={savePassword} className="space-y-5">
            {passwordError ? <ErrorNote message={passwordError} /> : null}
            <div className="grid gap-5 md:grid-cols-3">
              <Field label="Current password">
                <Input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </Field>
              <Field label="New password">
                <Input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={nextPassword}
                  onChange={(e) => setNextPassword(e.target.value)}
                />
              </Field>
              <Field label="Confirm new password">
                <Input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Field>
            </div>
            <PrimaryButton type="submit" disabled={savingPassword}>
              {savingPassword ? 'Updating…' : 'Change password'}
            </PrimaryButton>
          </form>
        </Panel>

        {isDemoMode() ? (
          <Panel title="Demo data">
            <p className="text-sm leading-relaxed text-chalk-gray">
              GMBQYN is currently running against the local demo adapter, so everything you see is sample data stored
              in this browser. Connect the Laravel API to move to real, persistent data.
            </p>
            <GhostButton onClick={resetDemo} className="mt-6" disabled={savingProfile}>
              Reset demo data
            </GhostButton>
          </Panel>
        ) : null}
      </div>
    </AppShell>
  );
}
