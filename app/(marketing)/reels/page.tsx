
'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';

export default function ReelsGeneratorPage() {
  const [images, setImages] = useState<(string | null)[]>(Array.from({ length: 30 }, () => null));
  const [title, setTitle] = useState('PINAQYN TECH');
  const [secondsPerImage, setSecondsPerImage] = useState(2);
  const [fps, setFps] = useState(30);
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [musicVolume, setMusicVolume] = useState(70);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filledCount = useMemo(() => images.filter(Boolean).length, [images]);

  const pdfSafe = (value: string) =>
    value
      .replace(/→/g, '->')
      .replace(/[—–]/g, '-')
      .replace(/₹/g, 'INR ')
      .replace(/•/g, '-')
      .replace(/[’]/g, "'")
      .replace(/[“”]/g, '"');

  const readFilesAsDataUrls = async (files: FileList) => {
    const list = Array.from(files).slice(0, 30);
    const data = await Promise.all(
      list.map(
        (f) =>
          new Promise<string>((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => {
              if (typeof r.result === 'string') resolve(r.result);
              else reject(new Error('Failed to read file'));
            };
            r.onerror = () => reject(new Error('Failed to read file'));
            r.readAsDataURL(f);
          })
      )
    );

    setImages((prev) => {
      const next = [...prev];
      for (let i = 0; i < 30; i++) next[i] = data[i] ?? null;
      return next;
    });
  };

  const onPickFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    await readFilesAsDataUrls(files);
  };

  const onPickMusic = (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMusicUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const clearAll = () => setImages(Array.from({ length: 30 }, () => null));
  const clearMusic = () =>
    setMusicUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });

  const renderFrame = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    imgA: HTMLImageElement | null,
    alphaA: number,
    imgB: HTMLImageElement | null,
    alphaB: number
  ) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#05060a';
    ctx.fillRect(0, 0, w, h);

    const drawLayer = (img: HTMLImageElement | null, a: number) => {
      if (!img || a <= 0) return;
      const scale = Math.max(w / img.width, h / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    // Draw both layers for crossfade
    drawLayer(imgA, alphaA);
    drawLayer(imgB, alphaB);

    // overlays
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(0,0,0,0.25)');
    g.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // top bars
    ctx.fillStyle = '#7b5bff';
    ctx.fillRect(0, 0, Math.floor(w * 0.52), 16);
    ctx.fillStyle = '#ff5f91';
    ctx.fillRect(Math.floor(w * 0.52), 0, Math.floor(w * 0.30), 16);
    ctx.fillStyle = '#00b5ff';
    ctx.fillRect(Math.floor(w * 0.82), 0, w - Math.floor(w * 0.82), 16);

    // footer brand
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '700 34px ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial';
    ctx.fillText(pdfSafe(title), 70, h - 70);
  };

  const recordVideo = async (frames: (string | null)[]) => {
    const w = 1080;
    const h = 1920;
    const safeFps = Math.min(60, Math.max(10, Math.round(fps)));
    const safeSeconds = Math.min(10, Math.max(1, secondsPerImage));

    const safeFrames = frames.filter(Boolean) as string[];
    if (safeFrames.length === 0) return null;

    // Preload & decode images (fixes blank frames on some browsers)
    const decoded: HTMLImageElement[] = [];
    for (const src of safeFrames) {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      try {
        if ('decode' in img) await img.decode();
      } catch {
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      }
      decoded.push(img);
    }

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const canvasStream = canvas.captureStream(safeFps);

    // Optional music track muxed into the recording stream
    let audioEl: HTMLAudioElement | null = null;
    let audioCtx: AudioContext | null = null;
    let audioDest: MediaStreamAudioDestinationNode | null = null;
    let audioGain: GainNode | null = null;
    try {
      if (musicUrl) {
        audioEl = document.createElement('audio');
        audioEl.src = musicUrl;
        audioEl.loop = false;
        audioEl.preload = 'auto';

        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioCtx.createMediaElementSource(audioEl);
        audioGain = audioCtx.createGain();
        audioGain.gain.value = Math.min(1, Math.max(0, musicVolume / 100));
        audioDest = audioCtx.createMediaStreamDestination();

        source.connect(audioGain);
        audioGain.connect(audioDest);
      }
    } catch {
      audioEl = null;
      audioCtx = null;
      audioDest = null;
      audioGain = null;
    }

    const stream = new MediaStream();
    canvasStream.getTracks().forEach((t) => stream.addTrack(t));
    if (audioDest) audioDest.stream.getAudioTracks().forEach((t) => stream.addTrack(t));
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';

    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    const stopped = new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
    });

    // Start audio playback (best-effort)
    if (audioEl) {
      try {
        if (audioCtx?.state === 'suspended') await audioCtx.resume();
        audioEl.currentTime = 0;
        await audioEl.play();
      } catch {
        // ignore autoplay/codec errors; recording will still work without audio
      }
    }

    recorder.start();

    // Render continuously at FPS with a crossfade transition
    const frameMs = 1000 / safeFps;
    const totalMs = decoded.length * safeSeconds * 1000;
    const fadeMs = Math.min(450, Math.floor(safeSeconds * 1000 * 0.25));

    const start = performance.now();
    let nextTick = start;
    while (true) {
      const now = performance.now();
      const t = now - start;
      if (t >= totalMs) break;

      // throttle to target fps
      if (now < nextTick) {
        await new Promise((r) => setTimeout(r, Math.max(0, nextTick - now)));
        continue;
      }
      nextTick += frameMs;

      const slideMs = safeSeconds * 1000;
      const idx = Math.min(decoded.length - 1, Math.floor(t / slideMs));
      const inSlideT = t - idx * slideMs;
      const isFading = inSlideT >= slideMs - fadeMs && idx < decoded.length - 1;

      const aImg = decoded[idx] ?? null;
      const bImg = isFading ? decoded[idx + 1] ?? null : null;
      const fadeT = isFading ? (inSlideT - (slideMs - fadeMs)) / fadeMs : 0;

      renderFrame(ctx, w, h, aImg, isFading ? 1 - fadeT : 1, bImg, isFading ? fadeT : 0);

      setProgress(Math.min(1, t / totalMs));
    }

    // hold last frame briefly
    renderFrame(ctx, w, h, decoded[decoded.length - 1] ?? null, 1, null, 0);
    await new Promise((r) => setTimeout(r, 200));

    recorder.stop();
    await stopped;

    if (audioEl) {
      try {
        audioEl.pause();
      } catch {
        // ignore
      }
    }
    if (audioCtx) {
      try {
        await audioCtx.close();
      } catch {
        // ignore
      }
    }

    const blob = new Blob(chunks, { type: recorder.mimeType || 'video/webm' });
    return blob;
  };

  const generateVideo = async () => {
    const nameBase = pdfSafe(title).replace(/\s+/g, '-');
    const picked = images.filter(Boolean) as string[];
    if (picked.length === 0) return;

    setIsRendering(true);
    setProgress(0);
    try {
      const blob = await recordVideo(picked);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    } finally {
      setIsRendering(false);
      setProgress(0);
    }
  };

  const downloadFromPreview = () => {
    if (!previewUrl) return;
    const nameBase = pdfSafe(title).replace(/\s+/g, '-');
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `${nameBase}-reels.webm`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <main className="relative min-h-screen overflow-hidden grid-pattern">
      <section className="relative z-10 min-h-screen px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-bold">Reels Generator</h1>
            <div className="w-24 h-px bg-chalk-white mx-auto mt-6 mb-6" />
            <p className="text-lg text-chalk-gray">Upload up to 30 images and export a 9:16 reels video.</p>
            <div className="mt-4 text-sm text-chalk-gray">
              <Link href="/alpha" className="underline underline-offset-4 hover:text-chalk-white">Back to Alpha</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-[28px] border border-white/10 bg-black/50 backdrop-blur p-8 space-y-5">
              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">BRAND / FILE NAME</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">MUSIC (OPTIONAL)</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => onPickMusic(e.target.files?.[0] ?? null)}
                  className="w-full text-sm"
                />
                <div className="mt-3">
                  <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">MUSIC VOLUME ({musicVolume}%)</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={musicVolume}
                    onChange={(e) => setMusicVolume(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="mt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={clearMusic}
                    disabled={!musicUrl || isRendering}
                    className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/90 transition hover:border-white hover:text-white disabled:opacity-40"
                  >
                    Remove Music
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-chalk-gray">
                Exports a single reels video using your seconds-per-image setting.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">SECONDS / IMAGE</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={secondsPerImage}
                    onChange={(e) => setSecondsPerImage(Number(e.target.value))}
                    className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">FPS</label>
                  <input
                    type="number"
                    min={10}
                    max={60}
                    value={fps}
                    onChange={(e) => setFps(Number(e.target.value))}
                    className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">UPLOAD IMAGES (MAX 30)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => onPickFiles(e.target.files)}
                  className="w-full text-sm"
                />
                <div className="mt-2 text-xs text-chalk-gray">Selected: {filledCount}/30</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={generateVideo}
                  disabled={isRendering}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff] px-10 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_15px_30px_rgba(255,95,145,0.35)] transition hover:shadow-[0_25px_45px_rgba(123,91,255,0.35)]"
                >
                  {isRendering ? 'Rendering…' : 'Generate Preview'}
                </button>

                <button
                  type="button"
                  onClick={downloadFromPreview}
                  disabled={!previewUrl || isRendering}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/90 transition hover:border-white hover:text-white disabled:opacity-40"
                >
                  Download Video
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  disabled={isRendering}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/90 transition hover:border-white hover:text-white"
                >
                  Clear
                </button>
              </div>

              {isRendering ? (
                <div className="pt-2">
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff]" style={{ width: `${Math.round(progress * 100)}%` }} />
                  </div>
                  <div className="mt-2 text-xs text-chalk-gray">{Math.round(progress * 100)}%</div>
                </div>
              ) : null}
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/50 backdrop-blur p-8">
              <div className="text-xs font-mono uppercase tracking-[0.35em] text-chalk-gray">Preview</div>
              <div className="mt-5">
                {previewUrl ? (
                  <div className="mb-6">
                    <div className="text-xs text-chalk-gray mb-2">Video preview</div>
                    <video
                      src={previewUrl}
                      controls
                      playsInline
                      className="w-full max-w-[420px] mx-auto rounded-3xl border border-white/10 bg-black"
                    />
                  </div>
                ) : null}
                <div className="w-full max-w-[420px] mx-auto rounded-3xl overflow-hidden border border-white/10 bg-[#05060a]">
                  <div className="h-2 flex">
                    <div className="w-[52%] bg-[#7b5bff]" />
                    <div className="w-[30%] bg-[#ff5f91]" />
                    <div className="w-[18%] bg-[#00b5ff]" />
                  </div>
                  <div className="p-4">
                    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
                      <div style={{ paddingTop: `${(1920 / 1080) * 100}%` }} />
                      <div className="absolute inset-0 grid grid-cols-5 gap-2 p-3">
                        {images.slice(0, 30).map((src, idx) => (
                          <div key={idx} className="rounded-lg overflow-hidden bg-white/5 border border-white/10">
                            {src ? <img src={src} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full" />}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-chalk-gray">Export: 1080×1920 video (.webm)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
