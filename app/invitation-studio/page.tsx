'use client';

import Link from 'next/link';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

type LayerBase = {
  id: string;
  name: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  startSec: number;
  endSec: number;
};

type TextLayer = LayerBase & {
  type: 'text';
  text: string;
  color: string;
  fontSize: number;
  fontWeight: number;
  align: 'left' | 'center' | 'right';
};

type ImageLayer = LayerBase & {
  type: 'image';
  src: string;
  width: number;
  height: number;
};

type Layer = TextLayer | ImageLayer;

type Segment = {
  id: string;
  index: number;
  startSec: number;
  endSec: number;
};

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      if (typeof r.result === 'string') resolve(r.result);
      else reject(new Error('Failed to read file'));
    };
    r.onerror = () => reject(new Error('Failed to read file'));
    r.readAsDataURL(file);
  });

const loadImg = async (src: string) => {
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
  return img;
};

export default function InvitationStudioPage() {
  const W = 1080;
  const H = 1920;

  const stageRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const nextMediaInputRef = useRef<HTMLInputElement | null>(null);
  const musicInputRef = useRef<HTMLInputElement | null>(null);

  const [bgColor, setBgColor] = useState('#05060a');
  const [durationSec, setDurationSec] = useState(4);
  const [fps, setFps] = useState(30);
  const [nextMediaSec, setNextMediaSec] = useState(2);

  const [segments, setSegments] = useState<Segment[]>([]);

  const [playheadSec, setPlayheadSec] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playRef = useRef<{ raf: number | null; startedAt: number; basePlayhead: number } | null>(null);

  const [timelineZoom, setTimelineZoom] = useState(1.5);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const snapStepSec = 0.1;

  const timelineViewportRef = useRef<HTMLDivElement | null>(null);
  const timelineContentRef = useRef<HTMLDivElement | null>(null);
  const timelineDragRef = useRef<{
    layerId: string;
    mode: 'move' | 'start' | 'end';
    pointerId: number;
    startClientX: number;
    startSec: number;
    endSec: number;
  } | null>(null);

  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [musicVolume, setMusicVolume] = useState(70);

  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [layers, setLayers] = useState<Layer[]>(() => {
    const id = uid();
    return [
      {
        id,
        type: 'text',
        name: 'Title',
        x: 540,
        y: 320,
        scale: 1,
        rotation: 0,
        opacity: 1,
        startSec: 0,
        endSec: 4,
        text: 'Your Invitation',
        color: '#ffffff',
        fontSize: 76,
        fontWeight: 800,
        align: 'center',
      },
    ];
  });
  const [selectedId, setSelectedId] = useState<string>('');

  const selected = useMemo(() => layers.find((l) => l.id === selectedId) ?? null, [layers, selectedId]);
  const title = useMemo(() => 'Invitation Studio', []);

  const activeSegment = useMemo(() => {
    const t = playheadSec;
    return segments.find((s) => t >= s.startSec && t <= s.endSec) ?? null;
  }, [segments, playheadSec]);

  useEffect(() => {
    if (!selectedId && layers.length > 0) setSelectedId(layers[0].id);
  }, [layers, selectedId]);

  const setLayer = (id: string, patch: Partial<Layer>) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? ({ ...l, ...patch } as Layer) : l)));
  };

  const isLayerActive = (layer: Layer, tSec: number) => {
    const a = clamp(layer.startSec, 0, durationSec);
    const b = clamp(layer.endSec, 0, durationSec);
    const start = Math.min(a, b);
    const end = Math.max(a, b);
    return tSec >= start && tSec <= end;
  };

  const snapTime = (t: number) => {
    if (!snapEnabled) return clamp(t, 0, durationSec);
    const snapped = Math.round(t / snapStepSec) * snapStepSec;
    return clamp(Number(snapped.toFixed(2)), 0, durationSec);
  };

  const secondsToTimelineX = (t: number) => {
    const el = timelineContentRef.current;
    if (!el) return 0;
    const w = el.getBoundingClientRect().width;
    if (w <= 0) return 0;
    return (clamp(t, 0, durationSec) / Math.max(0.001, durationSec)) * w;
  };

  const timelineXToSeconds = (clientX: number) => {
    const viewport = timelineViewportRef.current;
    const content = timelineContentRef.current;
    if (!viewport || !content) return 0;
    const vr = viewport.getBoundingClientRect();
    const contentW = content.getBoundingClientRect().width;
    const xInViewport = clientX - vr.left;
    const xInContent = viewport.scrollLeft + xInViewport;
    const x = clamp(xInContent, 0, contentW);
    return (x / Math.max(1, contentW)) * durationSec;
  };

  const startTimelineDrag = (e: React.PointerEvent, layerId: string, mode: 'move' | 'start' | 'end') => {
    const layer = layers.find((l) => l.id === layerId);
    if (!layer) return;
    setSelectedId(layerId);
    timelineDragRef.current = {
      layerId,
      mode,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startSec: layer.startSec,
      endSec: layer.endSec,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const moveTimelineDrag = (e: React.PointerEvent) => {
    if (!timelineDragRef.current) return;
    if (timelineDragRef.current.pointerId !== e.pointerId) return;
    const el = timelineContentRef.current;
    if (!el) return;
    const w = el.getBoundingClientRect().width;
    if (w <= 0) return;

    const dx = e.clientX - timelineDragRef.current.startClientX;
    const dt = (dx / w) * durationSec;

    const minLen = 0.05;
    if (timelineDragRef.current.mode === 'move') {
      const len = Math.max(minLen, timelineDragRef.current.endSec - timelineDragRef.current.startSec);
      const ns = clamp(timelineDragRef.current.startSec + dt, 0, Math.max(0, durationSec - len));
      const nsSnap = snapTime(ns);
      const neSnap = clamp(nsSnap + len, 0, durationSec);
      setLayer(timelineDragRef.current.layerId, { startSec: nsSnap, endSec: neSnap });
      return;
    }

    if (timelineDragRef.current.mode === 'start') {
      const ne = clamp(timelineDragRef.current.endSec, 0, durationSec);
      const ns = clamp(timelineDragRef.current.startSec + dt, 0, Math.max(0, ne - minLen));
      setLayer(timelineDragRef.current.layerId, { startSec: snapTime(ns) });
      return;
    }

    const ns = clamp(timelineDragRef.current.startSec, 0, durationSec);
    const ne = clamp(timelineDragRef.current.endSec + dt, Math.min(durationSec, ns + minLen), durationSec);
    setLayer(timelineDragRef.current.layerId, { endSec: snapTime(ne) });
  };

  const endTimelineDrag = (e: React.PointerEvent) => {
    if (!timelineDragRef.current) return;
    if (timelineDragRef.current.pointerId !== e.pointerId) return;
    timelineDragRef.current = null;
  };

  useEffect(() => {
    setPlayheadSec((t) => clamp(t, 0, durationSec));
  }, [durationSec]);

  useEffect(() => {
    if (!isPlaying) {
      if (playRef.current?.raf) cancelAnimationFrame(playRef.current.raf);
      playRef.current = null;
      return;
    }

    const startedAt = performance.now();
    const basePlayhead = playheadSec;
    playRef.current = { raf: null, startedAt, basePlayhead };

    const tick = () => {
      if (!playRef.current) return;
      const elapsed = (performance.now() - playRef.current.startedAt) / 1000;
      const next = playRef.current.basePlayhead + elapsed;
      if (next >= durationSec) {
        setPlayheadSec(durationSec);
        setIsPlaying(false);
        return;
      }
      setPlayheadSec(next);
      playRef.current.raf = requestAnimationFrame(tick);
    };

    playRef.current.raf = requestAnimationFrame(tick);
    return () => {
      if (playRef.current?.raf) cancelAnimationFrame(playRef.current.raf);
      playRef.current = null;
    };
  }, [isPlaying, durationSec, playheadSec]);

  const deleteSelected = () => {
    if (!selectedId) return;
    setLayers((prev) => prev.filter((l) => l.id !== selectedId));
    setSelectedId('');
  };

  const addText = () => {
    const id = uid();
    const seg = activeSegment ?? (segments.length > 0 ? segments[segments.length - 1] : null);
    const segStart = seg ? seg.startSec : 0;
    const segEnd = seg ? seg.endSec : durationSec;
    const next: TextLayer = {
      id,
      type: 'text',
      name: `Text ${layers.filter((l) => l.type === 'text').length + 1}`,
      x: 540,
      y: 960,
      scale: 1,
      rotation: 0,
      opacity: 1,
      startSec: segStart,
      endSec: segEnd,
      text: 'Tap to edit',
      color: '#ffffff',
      fontSize: 56,
      fontWeight: 800,
      align: 'center',
    };
    setLayers((prev) => [...prev, next]);
    setSelectedId(id);
  };

  const addImageFromFile = async (file: File) => {
    const src = await readFileAsDataUrl(file);
    const img = await loadImg(src);
    const baseW = 700;
    const ratio = img.height / img.width;
    const id = uid();
    const next: ImageLayer = {
      id,
      type: 'image',
      name: `Image ${layers.filter((l) => l.type === 'image').length + 1}`,
      x: 540,
      y: 960,
      scale: 1,
      rotation: 0,
      opacity: 1,
      startSec: 0,
      endSec: durationSec,
      src,
      width: baseW,
      height: Math.round(baseW * ratio),
    };
    setLayers((prev) => [...prev, next]);
    setSelectedId(id);
  };

  const addNextMediaFromFile = async (file: File) => {
    const src = await readFileAsDataUrl(file);
    const img = await loadImg(src);
    const ratio = img.height / img.width;

    const lastEnd = segments.length > 0 ? segments[segments.length - 1].endSec : layers.reduce((m, l) => Math.max(m, l.endSec), 0);
    const safeLen = clamp(nextMediaSec, 0.5, 15);
    const start = snapTime(lastEnd);
    const end = snapTime(start + safeLen);

    if (end > durationSec) {
      setDurationSec(end);
    }

    const segId = uid();
    const segIndex = segments.length + 1;
    const seg: Segment = { id: segId, index: segIndex, startSec: start, endSec: end };
    setSegments((prev) => [...prev, seg]);

    const bgId = uid();
    const bg: ImageLayer = {
      id: bgId,
      type: 'image',
      name: `Template ${segIndex} Media`,
      x: 540,
      y: 960,
      scale: 1,
      rotation: 0,
      opacity: 1,
      startSec: start,
      endSec: end,
      src,
      width: 1080,
      height: Math.round(1080 * ratio),
    };

    const textId = uid();
    const defaultText: TextLayer = {
      id: textId,
      type: 'text',
      name: `Template ${segIndex} Text`,
      x: 540,
      y: 300,
      scale: 1,
      rotation: 0,
      opacity: 1,
      startSec: start,
      endSec: end,
      text: `Template ${segIndex}`,
      color: '#ffffff',
      fontSize: 72,
      fontWeight: 900,
      align: 'center',
    };

    setLayers((prev) => [...prev, bg, defaultText]);
    setSelectedId(textId);
    setPlayheadSec(start);
  };

  const onPickMusic = (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMusicUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const clearMusic = () =>
    setMusicUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });

  const downloadPreview = () => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = 'invitation-studio.webm';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const stageToDesignCoords = (clientX: number, clientY: number) => {
    const el = stageRef.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    const px = (clientX - r.left) / r.width;
    const py = (clientY - r.top) / r.height;
    return { x: px * W, y: py * H };
  };

  const dragRef = useRef<{
    id: string;
    offX: number;
    offY: number;
    pointerId: number;
  } | null>(null);

  const startDrag = (e: React.PointerEvent, layerId: string) => {
    const layer = layers.find((l) => l.id === layerId);
    if (!layer) return;
    setSelectedId(layerId);
    const p = stageToDesignCoords(e.clientX, e.clientY);
    dragRef.current = {
      id: layerId,
      offX: p.x - layer.x,
      offY: p.y - layer.y,
      pointerId: e.pointerId,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const moveDrag = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    if (dragRef.current.pointerId !== e.pointerId) return;
    const p = stageToDesignCoords(e.clientX, e.clientY);
    const nx = clamp(p.x - dragRef.current.offX, 0, W);
    const ny = clamp(p.y - dragRef.current.offY, 0, H);
    setLayer(dragRef.current.id, { x: nx, y: ny });
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    if (dragRef.current.pointerId !== e.pointerId) return;
    dragRef.current = null;
  };

  const renderFrameToCanvas = async (
    ctx: CanvasRenderingContext2D,
    decodedImages: Record<string, HTMLImageElement>,
    tSec: number
  ) => {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, W, H);

    for (const layer of layers) {
      if (!isLayerActive(layer, tSec)) continue;
      if (layer.opacity <= 0) continue;
      ctx.save();
      ctx.globalAlpha = clamp(layer.opacity, 0, 1);
      ctx.translate(layer.x, layer.y);
      ctx.rotate((layer.rotation * Math.PI) / 180);
      ctx.scale(layer.scale, layer.scale);

      if (layer.type === 'text') {
        ctx.fillStyle = layer.color;
        ctx.textAlign = layer.align;
        ctx.textBaseline = 'middle';
        ctx.font = `${layer.fontWeight} ${layer.fontSize}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial`;
        const x = layer.align === 'left' ? 0 : layer.align === 'right' ? 0 : 0;
        ctx.fillText(layer.text, x, 0);
      }

      if (layer.type === 'image') {
        const img = decodedImages[layer.id];
        if (img) {
          ctx.drawImage(img, -layer.width / 2, -layer.height / 2, layer.width, layer.height);
        }
      }

      ctx.restore();
    }
  };

  const generatePreview = async () => {
    const safeFps = clamp(Math.round(fps), 10, 60);
    const safeSeconds = clamp(durationSec, 1, 300);

    setIsRendering(true);
    setProgress(0);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const decodedImages: Record<string, HTMLImageElement> = {};
      for (const layer of layers) {
        if (layer.type !== 'image') continue;
        decodedImages[layer.id] = await loadImg(layer.src);
      }

      const canvasStream = canvas.captureStream(safeFps);

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
          audioGain.gain.value = clamp(musicVolume, 0, 100) / 100;
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

      if (audioEl) {
        try {
          if (audioCtx?.state === 'suspended') await audioCtx.resume();
          audioEl.currentTime = 0;
          await audioEl.play();
        } catch {
          // ignore
        }
      }

      recorder.start();

      const frameMs = 1000 / safeFps;
      const totalMs = safeSeconds * 1000;
      const start = performance.now();
      let nextTick = start;
      while (true) {
        const now = performance.now();
        const t = now - start;
        if (t >= totalMs) break;

        if (now < nextTick) {
          await new Promise((r) => setTimeout(r, Math.max(0, nextTick - now)));
          continue;
        }
        nextTick += frameMs;

        await renderFrameToCanvas(ctx, decodedImages, t / 1000);
        setProgress(Math.min(1, t / totalMs));
      }

      await renderFrameToCanvas(ctx, decodedImages, safeSeconds);
      await new Promise((r) => setTimeout(r, 150));

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

  const stageLayers = useMemo(() => {
    return layers.map((layer) => {
      if (isPlaying && !isLayerActive(layer, playheadSec)) return null;
      const isSelected = layer.id === selectedId;
      const commonStyle: React.CSSProperties = {
        position: 'absolute',
        left: `${(layer.x / W) * 100}%`,
        top: `${(layer.y / H) * 100}%`,
        transform: `translate(-50%, -50%) rotate(${layer.rotation}deg) scale(${layer.scale})`,
        opacity: layer.opacity,
        touchAction: 'none',
        cursor: 'grab',
        userSelect: 'none',
        outline: isSelected ? '2px solid rgba(255,255,255,0.75)' : '2px solid transparent',
        outlineOffset: '6px',
        borderRadius: '14px',
        padding: '6px 10px',
      };

      if (layer.type === 'text') {
        return (
          <div
            key={layer.id}
            role="button"
            tabIndex={0}
            onPointerDown={(e) => startDrag(e, layer.id)}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onDoubleClick={() => {
              const v = prompt('Edit text', layer.text);
              if (v !== null) setLayer(layer.id, { text: v });
            }}
            style={{
              ...commonStyle,
              color: layer.color,
              fontSize: `${layer.fontSize}px`,
              fontWeight: layer.fontWeight,
              textAlign: layer.align as any,
              whiteSpace: 'pre-wrap',
              background: isSelected ? 'rgba(0,0,0,0.25)' : 'transparent',
            }}
          >
            {layer.text}
          </div>
        );
      }

      return (
        <div
          key={layer.id}
          role="button"
          tabIndex={0}
          onPointerDown={(e) => startDrag(e, layer.id)}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          style={{
            ...commonStyle,
            padding: 0,
            background: isSelected ? 'rgba(0,0,0,0.2)' : 'transparent',
          }}
        >
          <img
            src={layer.src}
            alt=""
            draggable={false}
            style={{
              width: `${(layer.width / W) * 100 * 1}%`,
              maxWidth: 'none',
              height: 'auto',
              display: 'block',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          />
        </div>
      );
    });
  }, [layers, selectedId, isPlaying, playheadSec, durationSec]);

  return (
    <main className="relative min-h-screen overflow-hidden grid-pattern">
      <section className="relative z-10 min-h-screen px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-bold">{title}</h1>
            <div className="w-24 h-px bg-chalk-white mx-auto mt-6 mb-6" />
            <p className="text-lg text-chalk-gray">Add layers, drag on the stage, and export a 9:16 reels video (.webm).</p>
            <div className="mt-4 text-sm text-chalk-gray">
              <Link href="/alpha" className="underline underline-offset-4 hover:text-chalk-white">
                Back to Alpha
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-[28px] border border-white/10 bg-black/50 backdrop-blur p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={addText}
                  disabled={isRendering}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff] px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white disabled:opacity-40"
                >
                  Add Text
                </button>
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isRendering}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/90 transition hover:border-white hover:text-white disabled:opacity-40"
                >
                  Add Image
                </button>
                <button
                  type="button"
                  onClick={() => nextMediaInputRef.current?.click()}
                  disabled={isRendering}
                  className="sm:col-span-2 inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/90 transition hover:border-white hover:text-white disabled:opacity-40"
                >
                  Add Next Media (Extend Video)
                </button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    await addImageFromFile(f);
                    e.target.value = '';
                  }}
                />
                <input
                  ref={nextMediaInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    await addNextMediaFromFile(f);
                    e.target.value = '';
                  }}
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
                <div className="text-xs font-mono uppercase tracking-[0.35em] text-chalk-gray">Project</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">DURATION (SEC)</label>
                    <input
                      type="number"
                      min={1}
                      max={300}
                      value={durationSec}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setDurationSec(v);
                        setLayers((prev) =>
                          prev.map((l) => ({
                            ...l,
                            startSec: clamp(l.startSec, 0, v),
                            endSec: clamp(l.endSec, 0, v),
                          }))
                        );
                      }}
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
                  <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">NEXT MEDIA LENGTH (SEC)</label>
                  <input
                    type="number"
                    min={0.5}
                    max={60}
                    step={0.1}
                    value={nextMediaSec}
                    onChange={(e) => setNextMediaSec(Number(e.target.value))}
                    className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                  />
                  <div className="mt-2 text-xs text-chalk-gray">Used when you click “Add Next Media”. It extends the video.</div>
                </div>

                {segments.length > 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-xs font-mono uppercase tracking-[0.35em] text-chalk-gray">Templates</div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {segments.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setIsPlaying(false);
                            setPlayheadSec(s.startSec);
                          }}
                          className={`rounded-xl border px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.22em] transition ${
                            activeSegment?.id === s.id
                              ? 'border-white/40 bg-white/10 text-white'
                              : 'border-white/15 bg-white/5 text-white/85 hover:border-white/30'
                          }`}
                        >
                          Template {s.index}
                        </button>
                      ))}
                    </div>
                    {activeSegment ? (
                      <div className="mt-3 text-xs text-chalk-gray">
                        Active: Template {activeSegment.index} ({activeSegment.startSec.toFixed(1)}–{activeSegment.endSec.toFixed(1)}s)
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div>
                  <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">BACKGROUND</label>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full" />
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-xs font-mono uppercase tracking-[0.35em] text-chalk-gray">Timeline</div>
                    <button
                      type="button"
                      onClick={() => setIsPlaying((p) => !p)}
                      className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/90 transition hover:border-white hover:text-white"
                    >
                      {isPlaying ? 'Pause' : 'Play'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">ZOOM ({timelineZoom.toFixed(1)}x)</label>
                      <input
                        type="range"
                        min={1}
                        max={4}
                        step={0.1}
                        value={timelineZoom}
                        onChange={(e) => setTimelineZoom(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => setSnapEnabled((v) => !v)}
                        className="w-full inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/90 transition hover:border-white hover:text-white"
                      >
                        Snap: {snapEnabled ? 'On' : 'Off'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">
                      PLAYHEAD ({playheadSec.toFixed(2)}s)
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={Math.max(0.01, durationSec)}
                      step={0.01}
                      value={playheadSec}
                      onChange={(e) => {
                        setIsPlaying(false);
                        setPlayheadSec(Number(e.target.value));
                      }}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="w-full overflow-x-auto" ref={timelineViewportRef}>
                      <div
                        ref={timelineContentRef}
                        className="relative rounded-2xl border border-white/10 bg-black/40 p-3"
                        style={{ width: `${Math.max(360, timelineZoom * 520)}px` }}
                        onPointerDown={(e) => {
                          setIsPlaying(false);
                          if ((e.target as HTMLElement).closest('[data-timeline-bar="1"]')) return;
                          const t = timelineXToSeconds(e.clientX);
                          setPlayheadSec(snapEnabled ? snapTime(t) : t);
                        }}
                      >
                        <div
                          className="absolute top-0 bottom-0 w-px bg-white/70"
                          style={{ left: `${(playheadSec / Math.max(0.001, durationSec)) * 100}%` }}
                        />

                        <div className="space-y-2">
                          {layers.map((l) => {
                          const a = clamp(l.startSec, 0, durationSec);
                          const b = clamp(l.endSec, 0, durationSec);
                          const start = Math.min(a, b);
                          const end = Math.max(a, b);
                          const leftPx = secondsToTimelineX(start);
                          const rightPx = secondsToTimelineX(end);
                          const widthPx = Math.max(6, rightPx - leftPx);
                          const isSelected = l.id === selectedId;
                          const isActive = isLayerActive(l, playheadSec);
                          return (
                            <div key={l.id} className="relative h-9">
                              <div className="absolute inset-0 flex items-center">
                                <div className="w-full h-px bg-white/10" />
                              </div>
                              <div
                                data-timeline-bar="1"
                                role="button"
                                tabIndex={0}
                                onPointerDown={(e) => startTimelineDrag(e, l.id, 'move')}
                                onPointerMove={moveTimelineDrag}
                                onPointerUp={endTimelineDrag}
                                onPointerCancel={endTimelineDrag}
                                className={`absolute top-1 bottom-1 rounded-xl border transition ${
                                  isSelected
                                    ? 'border-white/50 bg-white/15'
                                    : 'border-white/20 bg-white/10 hover:border-white/35'
                                }`}
                                style={{ left: `${leftPx}px`, width: `${widthPx}px` }}
                              >
                                <div
                                  onPointerDown={(e) => startTimelineDrag(e, l.id, 'start')}
                                  onPointerMove={moveTimelineDrag}
                                  onPointerUp={endTimelineDrag}
                                  onPointerCancel={endTimelineDrag}
                                  className="absolute left-0 top-0 bottom-0 w-3 cursor-ew-resize rounded-l-xl border-r border-white/20 bg-black/30"
                                />
                                <div
                                  onPointerDown={(e) => startTimelineDrag(e, l.id, 'end')}
                                  onPointerMove={moveTimelineDrag}
                                  onPointerUp={endTimelineDrag}
                                  onPointerCancel={endTimelineDrag}
                                  className="absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize rounded-r-xl border-l border-white/20 bg-black/30"
                                />
                                <div className="absolute inset-0 flex items-center px-4">
                                  <div className="min-w-0">
                                    <div className="text-[11px] font-semibold text-white/90 truncate">
                                      {l.name}
                                    </div>
                                    <div className="text-[10px] text-white/60">
                                      {l.type} · {start.toFixed(1)}–{end.toFixed(1)}s{isActive ? ' · active' : ''}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                          })}
                        </div>

                        <div className="mt-3 text-[11px] text-white/60">
                          Drag the bar to move. Drag the left/right edges to trim. Tap empty space to seek.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
                <div className="text-xs font-mono uppercase tracking-[0.35em] text-chalk-gray">Music (optional)</div>
                <input
                  ref={musicInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={(e) => onPickMusic(e.target.files?.[0] ?? null)}
                  className="w-full text-sm"
                />
                <div>
                  <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">VOLUME ({musicVolume}%)</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={musicVolume}
                    onChange={(e) => setMusicVolume(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-3">
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

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
                <div className="text-xs font-mono uppercase tracking-[0.35em] text-chalk-gray">Layers</div>
                <div className="space-y-2">
                  {layers
                    .slice()
                    .reverse()
                    .map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setSelectedId(l.id)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                          l.id === selectedId
                            ? 'border-white/35 bg-white/10'
                            : 'border-white/10 bg-white/5 hover:border-white/25'
                        }`}
                      >
                        <div className="text-xs font-mono uppercase tracking-[0.25em] text-chalk-gray">{l.type}</div>
                        <div className="mt-1 text-white/90 font-semibold">{l.name}</div>
                      </button>
                    ))}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={deleteSelected}
                    disabled={!selectedId || isRendering}
                    className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/90 transition hover:border-white hover:text-white disabled:opacity-40"
                  >
                    Delete Selected
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
                <div className="text-xs font-mono uppercase tracking-[0.35em] text-chalk-gray">Selected</div>
                {selected ? (
                  <>
                    <div>
                      <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">NAME</label>
                      <input
                        value={selected.name}
                        onChange={(e) => setLayer(selected.id, { name: e.target.value })}
                        className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">SCALE ({Math.round(selected.scale * 100)}%)</label>
                        <input
                          type="range"
                          min={25}
                          max={250}
                          value={Math.round(selected.scale * 100)}
                          onChange={(e) => setLayer(selected.id, { scale: Number(e.target.value) / 100 })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">OPACITY ({Math.round(selected.opacity * 100)}%)</label>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={Math.round(selected.opacity * 100)}
                          onChange={(e) => setLayer(selected.id, { opacity: Number(e.target.value) / 100 })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">ROTATION ({Math.round(selected.rotation)}°)</label>
                        <input
                          type="range"
                          min={-180}
                          max={180}
                          value={Math.round(selected.rotation)}
                          onChange={(e) => setLayer(selected.id, { rotation: Number(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">START (SEC)</label>
                        <input
                          type="number"
                          min={0}
                          max={durationSec}
                          step={0.1}
                          value={selected.startSec}
                          onChange={(e) => setLayer(selected.id, { startSec: clamp(Number(e.target.value), 0, durationSec) })}
                          className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">END (SEC)</label>
                        <input
                          type="number"
                          min={0}
                          max={durationSec}
                          step={0.1}
                          value={selected.endSec}
                          onChange={(e) => setLayer(selected.id, { endSec: clamp(Number(e.target.value), 0, durationSec) })}
                          className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                        />
                      </div>
                    </div>

                    {selected.type === 'text' ? (
                      <>
                        <div>
                          <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">TEXT</label>
                          <textarea
                            rows={3}
                            value={selected.text}
                            onChange={(e) => setLayer(selected.id, { text: e.target.value })}
                            className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">COLOR</label>
                            <input
                              type="color"
                              value={selected.color}
                              onChange={(e) => setLayer(selected.id, { color: e.target.value })}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">FONT SIZE</label>
                            <input
                              type="number"
                              min={12}
                              max={200}
                              value={selected.fontSize}
                              onChange={(e) => setLayer(selected.id, { fontSize: Number(e.target.value) })}
                              className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                            />
                          </div>
                        </div>
                      </>
                    ) : null}

                    {selected.type === 'image' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">WIDTH</label>
                          <input
                            type="number"
                            min={50}
                            max={1080}
                            value={Math.round(selected.width)}
                            onChange={(e) => {
                              const nw = Number(e.target.value);
                              const ratio = selected.height / selected.width;
                              setLayer(selected.id, { width: nw, height: Math.round(nw * ratio) });
                            }}
                            className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                          />
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className="text-sm text-chalk-gray">Select a layer.</div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={generatePreview}
                  disabled={isRendering}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff] px-10 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_15px_30px_rgba(255,95,145,0.35)] transition hover:shadow-[0_25px_45px_rgba(123,91,255,0.35)] disabled:opacity-40"
                >
                  {isRendering ? `Rendering ${Math.round(progress * 100)}%` : 'Generate Preview'}
                </button>
                <button
                  type="button"
                  onClick={downloadPreview}
                  disabled={!previewUrl || isRendering}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/90 transition hover:border-white hover:text-white disabled:opacity-40"
                >
                  Download
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/50 backdrop-blur p-8">
              <div className="text-xs font-mono uppercase tracking-[0.35em] text-chalk-gray">Stage</div>
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
                    <div
                      ref={stageRef}
                      className="relative w-full overflow-hidden rounded-2xl border border-white/10"
                      style={{ backgroundColor: bgColor }}
                      onPointerDown={(e) => {
                        if (e.target === stageRef.current) setSelectedId('');
                      }}
                    >
                      <div style={{ paddingTop: `${(1920 / 1080) * 100}%` }} />
                      <div className="absolute inset-0">{stageLayers}</div>
                    </div>
                    <div className="mt-3 text-xs text-chalk-gray">Export: 1080×1920 video (.webm)</div>
                    <div className="mt-2 text-xs text-chalk-gray">Tip: Drag layers. Double click text to quick edit.</div>
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
