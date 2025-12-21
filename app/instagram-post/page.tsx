'use client';

import { useMemo, useRef, useState } from 'react';

export default function InstagramPostGeneratorPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [bgDataUrl, setBgDataUrl] = useState<string | null>(null);
  const [headline, setHeadline] = useState('Results > Everything');
  const [subline, setSubline] = useState('Data-driven strategy. Relentless execution. Measurable outcomes.');
  const [handle, setHandle] = useState('@pinaqyn');
  const [bgOpacityPercent, setBgOpacityPercent] = useState(30);
  const [accent1, setAccent1] = useState('#7b5bff');
  const [accent2, setAccent2] = useState('#ff5f91');
  const [accent3, setAccent3] = useState('#00b5ff');

  const presets = useMemo(
    () => [
      { id: 'ig_post', label: 'Instagram Post (1:1)', w: 1080, h: 1080 },
      { id: 'ig_portrait', label: 'Instagram Portrait (4:5)', w: 1080, h: 1350 },
      { id: 'ig_story', label: 'Story / Reel (9:16)', w: 1080, h: 1920 },
      { id: 'linkedin', label: 'LinkedIn (1.91:1)', w: 1200, h: 628 },
      { id: 'youtube', label: 'YouTube Thumbnail (16:9)', w: 1920, h: 1080 },
    ],
    []
  );
  const [presetId, setPresetId] = useState(presets[0].id);
  const selected = useMemo(() => presets.find((p) => p.id === presetId) ?? presets[0], [presetId, presets]);

  const bgOpacity = Math.min(100, Math.max(0, bgOpacityPercent)) / 100;

  const previewStyle = useMemo(() => {
    return {
      backgroundColor: '#05060a',
    } as const;
  }, []);

  const onFile = async (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null;
      setBgDataUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const drawToCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = selected.w;
    const h = selected.h;

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background base
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#05060a';
    ctx.fillRect(0, 0, w, h);

    // Optional background image
    if (bgDataUrl) {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.max(w / img.width, h / img.height);
          const dw = img.width * scale;
          const dh = img.height * scale;
          const x = (canvas.width - dw) / 2;
          const y = (canvas.height - dh) / 2;

          ctx.save();
          ctx.globalAlpha = bgOpacity;
          ctx.drawImage(img, x, y, dw, dh);
          ctx.restore();
          resolve();
        };
        img.src = bgDataUrl;
      });
    }

    // Subtle gradient overlay
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(0,0,0,0.35)');
    g.addColorStop(0.5, 'rgba(0,0,0,0.15)');
    g.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Accent bars at top
    ctx.fillStyle = accent1;
    ctx.fillRect(0, 0, Math.floor(w * 0.52), 16);
    ctx.fillStyle = accent2;
    ctx.fillRect(Math.floor(w * 0.52), 0, Math.floor(w * 0.30), 16);
    ctx.fillStyle = accent3;
    ctx.fillRect(Math.floor(w * 0.82), 0, w - Math.floor(w * 0.82), 16);

    // Text helpers
    const drawWrapped = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      const words = text.split(/\s+/g);
      const lines: string[] = [];
      let current = '';
      for (const w of words) {
        const test = current ? `${current} ${w}` : w;
        if (ctx.measureText(test).width <= maxWidth) {
          current = test;
        } else {
          if (current) lines.push(current);
          current = w;
        }
      }
      if (current) lines.push(current);

      lines.forEach((ln, idx) => {
        ctx.fillText(ln, x, y + idx * lineHeight);
      });

      return lines.length;
    };

    // Main copy
    const pad = Math.round(Math.min(w, h) * 0.09);
    const maxWidth = w - pad * 2;

    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    const headlineSize = Math.round(Math.min(w, h) * 0.085);
    const headlineLine = Math.round(headlineSize * 1.12);
    const subSize = Math.round(Math.min(w, h) * 0.039);
    const subLine = Math.round(subSize * 1.24);

    ctx.font = `800 ${headlineSize}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial`;
    const headlineLines = drawWrapped(headline, pad, Math.round(h * 0.30), maxWidth, headlineLine);

    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = `500 ${subSize}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial`;
    drawWrapped(subline, pad, Math.round(h * 0.30) + headlineLines * headlineLine + Math.round(subSize * 0.9), maxWidth, subLine);

    // Handle pill
    const pillText = handle.startsWith('@') ? handle : `@${handle}`;
    const handleSize = Math.round(Math.min(w, h) * 0.031);
    ctx.font = `700 ${handleSize}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial`;
    const tw = ctx.measureText(pillText).width;
    const ph = Math.round(handleSize * 1.9);
    const px = pad;
    const py = h - pad - ph;
    const pw = Math.round(tw + handleSize * 1.8);

    // Rounded rect
    const r = 999;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(px + r, py);
    ctx.arcTo(px + pw, py, px + pw, py + ph, r);
    ctx.arcTo(px + pw, py + ph, px, py + ph, r);
    ctx.arcTo(px, py + ph, px, py, r);
    ctx.arcTo(px, py, px + pw, py, r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Handle text
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.fillText(pillText, px + Math.round(handleSize * 0.85), py + Math.round(ph * 0.68));
  };

  const downloadPng = async () => {
    await drawToCanvas();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'instagram-post.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const updatePreview = async () => {
    await drawToCanvas();
  };

  return (
    <main className="relative min-h-screen overflow-hidden grid-pattern">
      <section className="relative z-10 min-h-screen px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-bold">Instagram Post Generator</h1>
            <div className="w-24 h-px bg-chalk-white mx-auto mt-6 mb-6" />
            <p className="text-lg text-chalk-gray">Upload a background image (30% opacity), add text, and download a PNG.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-[28px] border border-white/10 bg-black/50 backdrop-blur p-8 space-y-5">
              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">SIZE</label>
                <select
                  value={presetId}
                  onChange={(e) => setPresetId(e.target.value)}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                >
                  {presets.map((p) => (
                    <option key={p.id} value={p.id} className="bg-black">
                      {p.label} ({p.w}×{p.h})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">BACKGROUND IMAGE</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm"
                />
                <div className="mt-4">
                  <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">BACKGROUND OPACITY ({bgOpacityPercent}%)</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={bgOpacityPercent}
                    onChange={(e) => setBgOpacityPercent(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-3">ACCENT COLORS</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="text-xs text-chalk-gray">Left</div>
                    <input
                      type="color"
                      value={accent1}
                      onChange={(e) => setAccent1(e.target.value)}
                      className="w-full h-10 rounded-lg border border-white/15 bg-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-chalk-gray">Middle</div>
                    <input
                      type="color"
                      value={accent2}
                      onChange={(e) => setAccent2(e.target.value)}
                      className="w-full h-10 rounded-lg border border-white/15 bg-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-chalk-gray">Right</div>
                    <input
                      type="color"
                      value={accent3}
                      onChange={(e) => setAccent3(e.target.value)}
                      className="w-full h-10 rounded-lg border border-white/15 bg-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">HEADLINE</label>
                <input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">SUBLINE</label>
                <textarea
                  rows={3}
                  value={subline}
                  onChange={(e) => setSubline(e.target.value)}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">HANDLE</label>
                <input
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={updatePreview}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/90 transition hover:border-white hover:text-white"
                >
                  Update Preview
                </button>
                <button
                  type="button"
                  onClick={downloadPng}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff] px-10 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_15px_30px_rgba(255,95,145,0.35)] transition hover:shadow-[0_25px_45px_rgba(123,91,255,0.35)]"
                >
                  Download PNG
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/50 backdrop-blur p-8">
              <div className="text-xs font-mono uppercase tracking-[0.35em] text-chalk-gray">Preview</div>
              <div className="mt-5">
                <div
                  className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-[#05060a]"
                  style={previewStyle}
                >
                  <div style={{ paddingTop: `${(selected.h / selected.w) * 100}%` }} />
                  <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-black" style={{ opacity: bgDataUrl ? 0.0 : 0.0 }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.15), rgba(0,0,0,0.55))' }} />

                  {bgDataUrl ? (
                    <div className="absolute inset-0" style={{ backgroundImage: `url(${bgDataUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: bgOpacity }} />
                  ) : null}

                  <div className="absolute top-0 left-0 right-0 h-1.5">
                    <div className="h-full w-[52%] float-left" style={{ backgroundColor: accent1 }} />
                    <div className="h-full w-[30%] float-left" style={{ backgroundColor: accent2 }} />
                    <div className="h-full w-[18%] float-left" style={{ backgroundColor: accent3 }} />
                  </div>

                  <div className="absolute inset-0 p-10 flex flex-col">
                    <div className="mt-10">
                      <div className="text-white/95 font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight whitespace-pre-wrap">
                        {headline}
                      </div>
                      <div className="mt-5 text-white/75 text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                        {subline}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="inline-flex items-center rounded-full border border-white/20 bg-black/40 px-5 py-2.5 text-white/90 font-semibold">
                        {handle.startsWith('@') ? handle : `@${handle}`}
                      </div>
                    </div>
                  </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-chalk-gray">
                  Output size: {selected.w}×{selected.h} PNG.
                </div>
              </div>

              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
