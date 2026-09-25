'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { initials, percent } from '@/lib/gmbqyn';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[28px] border border-white/10 bg-black/50 backdrop-blur p-6 ${className}`}>
      {children}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className = '',
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[28px] border border-white/10 bg-black/50 backdrop-blur ${className}`}>
      {title ? (
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-chalk-gray">{title}</h2>
          {action}
        </div>
      ) : null}
      <div className="p-6">{children}</div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.5em] text-chalk-gray">{eyebrow}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-chalk-white">{title}</h1>
        {description ? <p className="max-w-2xl text-sm leading-relaxed text-chalk-gray">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function PrimaryButton({
  children,
  href,
  onClick,
  type = 'button',
  disabled,
  className = '',
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}) {
  const classes = `inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff] px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white shadow-[0_15px_30px_rgba(255,95,145,0.3)] transition hover:shadow-[0_25px_45px_rgba(123,91,255,0.35)] disabled:cursor-not-allowed disabled:opacity-40 ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  href,
  onClick,
  type = 'button',
  disabled,
  className = '',
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}) {
  const classes = `inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/90 transition hover:border-white hover:text-white disabled:cursor-not-allowed disabled:opacity-40 ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
  className = '',
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block font-mono text-xs uppercase tracking-wider text-chalk-gray">{label}</span>
      {children}
      {hint && !error ? <span className="mt-2 block text-xs text-chalk-gray/70">{hint}</span> : null}
      {error ? <span className="mt-2 block text-xs text-red-400">{error}</span> : null}
    </label>
  );
}

export const inputClass =
  'w-full bg-transparent border border-white/15 px-4 py-3 text-sm text-chalk-white placeholder:text-chalk-gray/40 focus:outline-none focus:border-white/40';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ''}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} resize-y ${props.className ?? ''}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${inputClass} ${props.className ?? ''}`}>
      {props.children}
    </select>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <p className="text-sm text-chalk-white">{label}</p>
        {description ? <p className="mt-1 text-xs text-chalk-gray">{description}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-12 shrink-0 rounded-full transition ${
          checked ? 'bg-gradient-to-r from-[#ff5f91] to-[#7b5bff]' : 'bg-white/15'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
            checked ? 'left-6' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}

const TONES: Record<string, string> = {
  active: 'border-[#00FFA3]/40 bg-[#00FFA3]/10 text-[#00FFA3]',
  trial: 'border-[#00b5ff]/40 bg-[#00b5ff]/10 text-[#00b5ff]',
  past_due: 'border-[#ff5f91]/40 bg-[#ff5f91]/10 text-[#ff5f91]',
  expired: 'border-red-400/40 bg-red-400/10 text-red-400',
  cancelled: 'border-white/20 bg-white/5 text-chalk-gray',
  pending: 'border-[#ffb020]/40 bg-[#ffb020]/10 text-[#ffb020]',
  approved: 'border-[#00FFA3]/40 bg-[#00FFA3]/10 text-[#00FFA3]',
  rejected: 'border-red-400/40 bg-red-400/10 text-red-400',
  flagged: 'border-[#ffb020]/40 bg-[#ffb020]/10 text-[#ffb020]',
  verified: 'border-[#00FFA3]/40 bg-[#00FFA3]/10 text-[#00FFA3]',
  failed: 'border-red-400/40 bg-red-400/10 text-red-400',
  refunded: 'border-white/20 bg-white/5 text-chalk-gray',
  new: 'border-[#00b5ff]/40 bg-[#00b5ff]/10 text-[#00b5ff]',
  in_progress: 'border-[#ffb020]/40 bg-[#ffb020]/10 text-[#ffb020]',
  resolved: 'border-[#00FFA3]/40 bg-[#00FFA3]/10 text-[#00FFA3]',
  spam: 'border-white/20 bg-white/5 text-chalk-gray',
  suspended: 'border-red-400/40 bg-red-400/10 text-red-400',
  invited: 'border-white/20 bg-white/5 text-chalk-gray',
  qr: 'border-[#7b5bff]/40 bg-[#7b5bff]/10 text-[#c4b5fd]',
  link: 'border-[#00b5ff]/40 bg-[#00b5ff]/10 text-[#00b5ff]',
  manual: 'border-white/20 bg-white/5 text-chalk-gray',
  import: 'border-[#ffb020]/40 bg-[#ffb020]/10 text-[#ffb020]',
  cash: 'border-white/20 bg-white/5 text-chalk-gray',
  upi: 'border-[#00b5ff]/40 bg-[#00b5ff]/10 text-[#00b5ff]',
  bank_transfer: 'border-[#7b5bff]/40 bg-[#7b5bff]/10 text-[#c4b5fd]',
  card: 'border-[#00FFA3]/40 bg-[#00FFA3]/10 text-[#00FFA3]',
  cheque: 'border-white/20 bg-white/5 text-chalk-gray',
};

export function StatusPill({ value, className = '' }: { value: string; className?: string }) {
  const tone = TONES[value] ?? 'border-white/20 bg-white/5 text-chalk-gray';
  const label = value.replace(/_/g, ' ');
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${tone} ${className}`}
    >
      {label}
    </span>
  );
}

export function StatCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-[28px] border p-6 backdrop-blur ${
        accent
          ? 'border-white/15 bg-gradient-to-br from-[#ff5f91]/10 to-[#7b5bff]/10'
          : 'border-white/10 bg-black/50'
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-chalk-gray">{label}</p>
      <p className="mt-3 text-3xl font-bold text-chalk-white">{value}</p>
      {sub ? <p className="mt-2 text-xs text-chalk-gray">{sub}</p> : null}
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="h-10 w-10 rounded-full border border-white/15" />
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-chalk-white">{title}</p>
      {description ? <p className="max-w-md text-sm text-chalk-gray">{description}</p> : null}
      {action}
    </div>
  );
}

export function Loading({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-4 py-20">
      <span className="h-2 w-2 animate-pulse rounded-full bg-[#7b5bff]" />
      <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff5f91]" />
      <span className="text-xs font-mono uppercase tracking-[0.35em] text-chalk-gray">{label}</span>
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-400/30 bg-red-400/5 px-4 py-3 text-sm text-red-300">{message}</div>
  );
}

export function SuccessNote({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-[#00FFA3]/30 bg-[#00FFA3]/5 px-4 py-3 text-sm text-[#00FFA3]">{message}</div>
  );
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="space-y-2">
      {label ? (
        <div className="flex items-center justify-between text-xs text-chalk-gray">
          <span>{label}</span>
          <span>{clamped}%</span>
        </div>
      ) : null}
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff] transition-all"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z"
            fill={star <= value ? '#ffb020' : 'rgba(255,255,255,0.14)'}
          />
        </svg>
      ))}
    </span>
  );
}

export function StarInput({ value, onChange }: { value: number; onChange: (next: number) => void }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center gap-2" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          onMouseEnter={() => setHover(star)}
          onFocus={() => setHover(star)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <svg width="34" height="34" viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z"
              fill={star <= shown ? '#ffb020' : 'rgba(255,255,255,0.14)'}
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#ff5f91] to-[#7b5bff] font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

export function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-white/10">
            {headers.map((header) => (
              <th key={header} className="pb-3 pr-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-chalk-gray">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">{children}</tbody>
      </table>
    </div>
  );
}

export function BarChart({
  data,
  height = 180,
  accent = '#7b5bff',
}: {
  data: Array<{ label: string; value: number }>;
  height?: number;
  accent?: string;
}) {
  const max = Math.max(1, ...data.map((point) => point.value));
  return (
    <div className="w-full">
      <div className="flex items-end gap-3" style={{ height }}>
        {data.map((point) => (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-[10px] font-mono text-chalk-gray">{point.value}</span>
            <div
              className="w-full rounded-t-md transition-all"
              style={{
                height: `${Math.max(2, percent(point.value, max))}%`,
                background: `linear-gradient(to top, ${accent}, rgba(255,95,145,0.85))`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-3">
        {data.map((point) => (
          <span key={point.label} className="flex-1 text-center text-[10px] font-mono uppercase tracking-wider text-chalk-gray">
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Sparkline({ data, accent = '#7b5bff' }: { data: number[]; accent?: string }) {
  if (data.length < 2) return null;
  const max = Math.max(1, ...data);
  const points = data
    .map((value, index) => `${(index / (data.length - 1)) * 100},${40 - (value / max) * 36}`)
    .join(' ');
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-12 w-full" aria-hidden="true">
      <polyline points={points} fill="none" stroke={accent} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
