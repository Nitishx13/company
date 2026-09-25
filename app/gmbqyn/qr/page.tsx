'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { drawQrToCanvas, encodeQr } from '@/lib/gmbqyn';
import { useGmbqynService } from '@/lib/gmbqyn/auth-context';
import type { Plan, ReviewLink } from '@/lib/gmbqyn';
import { useAsync, messageOf } from '../lib/hooks';
import { AppShell } from '../components/shell';
import { customerNav } from '../lib/nav';
import {
  ErrorNote,
  Field,
  GhostButton,
  Input,
  Loading,
  PageHeader,
  Panel,
  PrimaryButton,
  Select,
  SuccessNote,
} from '../components/ui';

const TINTS = [
  { id: 'chalk', label: 'Midnight', module: '#0A0A0A', background: '#ffffff', accent: '#ffffff' },
  { id: 'berry', label: 'Berry', module: '#2b0a1c', background: '#fff1f6', accent: '#ff5f91' },
  { id: 'violet', label: 'Violet', module: '#140a2b', background: '#f3f0ff', accent: '#7b5bff' },
  { id: 'mint', label: 'Mint', module: '#04231a', background: '#eafff6', accent: '#00b981' },
];

const SIZES = [
  { value: '512', label: '512 × 512' },
  { value: '1024', label: '1024 × 1024' },
  { value: '2048', label: '2048 × 2048' },
];

export default function QrPage() {
  const service = useGmbqynService();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tint, setTint] = useState(TINTS[0]);
  const [size, setSize] = useState('1024');
  const [caption, setCaption] = useState('');
  const [branding, setBranding] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const link = useAsync<ReviewLink>(() => service.getReviewLink(), []);
  const business = useAsync(() => service.getBusiness(), []);
  const plans = useAsync<Plan[]>(() => service.listPlans(), []);

  const url = link.data?.url ?? '';
  const matrix = useMemo(() => (url ? encodeQr(url) : null), [url]);
  const plan = plans.data?.find((item) => item.code === 'growth') ?? null;
  const canBrand = branding && (plan?.qr_custom_branding ?? false);

  useEffect(() => {
    if (!matrix || !canvasRef.current) return;
    drawQrToCanvas(canvasRef.current, matrix, {
      size: Number(size),
      dark: tint.module,
      light: tint.background,
      accent: tint.accent,
      showLogo: canBrand,
      logoText: business.data?.name?.slice(0, 2).toUpperCase() ?? 'G',
    });
  }, [matrix, size, tint, canBrand, business.data?.name]);

  const download = (format: 'png' | 'svg' | 'print') => {
    if (!matrix || !canvasRef.current) return;
    if (format === 'svg') {
      const rect = 8;
      const cells: string[] = [];
      for (let y = 0; y < matrix.size; y += 1) {
        for (let x = 0; x < matrix.size; x += 1) {
          if (matrix.isDark(x, y)) cells.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
        }
      }
      const side = matrix.size + rect * 2;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${side * 8}" height="${side * 8}" viewBox="0 0 ${side} ${side}"><rect width="${side}" height="${side}" fill="${tint.background}"/><g fill="${tint.module}">${cells.join('')}</g></svg>`;
      downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), `gmbqyn-qr-${matrix.size}.svg`);
      return;
    }
    if (format === 'print') {
      window.print();
      return;
    }
    canvasRef.current.toBlob((blob) => {
      if (blob) downloadBlob(blob, `gmbqyn-qr-${size}.png`);
    }, 'image/png');
  };

  const downloadBlob = (blob: Blob, name: string) => {
    const url_ = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url_;
    anchor.download = name;
    anchor.click();
    URL.revokeObjectURL(url_);
    setNotice('Downloaded.');
    window.setTimeout(() => setNotice(null), 2000);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setNotice('Review link copied.');
      window.setTimeout(() => setNotice(null), 2000);
    } catch {
      setError('Clipboard blocked — copy the link manually.');
    }
  };

  if (link.loading || business.loading) return <AppShell area="customer" items={customerNav} title="QR Codes"><Loading /></AppShell>;

  return (
    <AppShell area="customer" items={customerNav} title="QR Codes">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Print & share"
          title="QR codes for your counter"
          description="Print these for tables, reception desks, billing invoices and packaging. Each scan is tracked as a source in your analytics."
          action={<PrimaryButton href="/gmbqyn/review-link">Edit link</PrimaryButton>}
        />

        {notice ? <SuccessNote message={notice} /> : null}
        {error ? <ErrorNote message={error} /> : null}
        {link.error ? <ErrorNote message={link.error} /> : null}

        {matrix ? (
          <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
            <Panel title="Preview">
              <div className="flex flex-col items-center gap-6">
                <div className="rounded-[28px] border border-white/10 p-6" style={{ background: tint.background }}>
                  <canvas ref={canvasRef} className="h-64 w-64 sm:h-72 sm:w-72" aria-label="QR code for your review link" />
                  {canBrand ? (
                    <div className="mt-5 text-center">
                      <p className="text-sm font-semibold" style={{ color: tint.module }}>
                        {caption || business.data?.name}
                      </p>
                      <p className="mt-1 text-[11px]" style={{ color: tint.module, opacity: 0.65 }}>
                        Scan to leave a review
                      </p>
                    </div>
                  ) : null}
                </div>
                <p className="break-all text-center font-mono text-[11px] text-chalk-gray">{url}</p>
              </div>
            </Panel>

            <div className="space-y-6">
              <Panel title="Download">
                <div className="grid gap-3 sm:grid-cols-3">
                  <PrimaryButton onClick={() => download('png')}>PNG</PrimaryButton>
                  <GhostButton onClick={() => download('svg')}>SVG</GhostButton>
                  <GhostButton onClick={() => download('print')}>Print</GhostButton>
                </div>
                <Field label="Resolution" className="mt-5">
                  <Select value={size} onChange={(event) => setSize(event.target.value)}>
                    {SIZES.map((item) => (
                      <option key={item.value} value={item.value} className="bg-black">
                        {item.label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <GhostButton onClick={copy} className="mt-5 w-full">
                  Copy review link
                </GhostButton>
              </Panel>

              <Panel title="Design">
                <div className="space-y-6">
                  <div>
                    <p className="mb-3 font-mono text-xs uppercase tracking-wider text-chalk-gray">Colour</p>
                    <div className="flex flex-wrap gap-3">
                      {TINTS.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setTint(option)}
                          aria-pressed={tint.id === option.id}
                          className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-xs transition ${
                            tint.id === option.id ? 'border-white/40 text-white' : 'border-white/10 text-chalk-gray'
                          }`}
                        >
                          <span
                            className="h-6 w-6 rounded-lg"
                            style={{ background: option.background, boxShadow: `inset 0 0 0 3px ${option.accent}` }}
                          />
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-3 text-sm text-chalk-gray">
                      <input
                        type="checkbox"
                        checked={branding}
                        disabled={!plan?.qr_custom_branding}
                        onChange={(event) => setBranding(event.target.checked)}
                        className="accent-[#7b5bff]"
                      />
                      Add your business name to the card
                    </label>
                    {plan && !plan.qr_custom_branding ? (
                      <p className="text-xs text-[#ffb020]">
                        Branded QR cards are available on the Growth plan and above.{' '}
                        <a href="/gmbqyn/subscription" className="underline underline-offset-4">
                          Upgrade
                        </a>
                      </p>
                    ) : null}
                  </div>

                  {canBrand ? (
                    <Field label="Caption under the code">
                      <Input value={caption} onChange={(event) => setCaption(event.target.value)} placeholder={business.data?.name} />
                    </Field>
                  ) : null}
                </div>
              </Panel>

              <Panel title="Printing tips">
                <ul className="space-y-3 text-sm leading-relaxed text-chalk-gray">
                  <li>Print at least 4 × 4 cm so phones can lock on from a distance.</li>
                  <li>Keep the code on a light, matte surface — glossy paper causes glare.</li>
                  <li>Put one at the billing counter and one on the table bill; those two placements drive most scans.</li>
                  <li>Add a line of text: “Scan to tell us how we did” works far better than a bare code.</li>
                </ul>
              </Panel>
            </div>
          </div>
        ) : (
          <Panel>
            <p className="py-10 text-center text-sm text-chalk-gray">
              Create a review link first, then come back to generate QR codes.
            </p>
            <div className="flex justify-center">
              <PrimaryButton href="/gmbqyn/review-link">Set up my link</PrimaryButton>
            </div>
          </Panel>
        )}
      </div>
    </AppShell>
  );
}
