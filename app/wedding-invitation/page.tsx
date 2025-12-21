'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

type TemplateId = 'intro' | 'day1' | 'day2' | 'venue';

type InviteFields = {
  brideName: string;
  groomName: string;

  // Colors
  textColor: string;
  labelColor: string;

  // UI accents (preview header bar)
  accent1: string;
  accent2: string;
  accent3: string;

  // Main background
  bgMode: 'gradient' | 'color' | 'image';
  bgColor: string;
  bgImage: string | null;
  bgOpacityPercent: number;

  // Intro text
  hostLine: string;
  inviteLine1: string;
  inviteLine2: string;

  // Date/time + schedule lines (used by day1/day2)
  date: string;
  scheduleLines: string;

  // Venue screen
  venueTitle: string;
  venueAddress: string;
  cta1: string;
  cta2: string;

  // contact (optional)
  rsvpPhone: string;

  // Decorative overlays (optional)
  decoTopImage: string | null;
  decoTopOpacityPercent: number;
  decoTopScalePercent: number;
  decoTopX: number;
  decoTopY: number;

  decoBottomImage: string | null;
  decoBottomOpacityPercent: number;
  decoBottomScalePercent: number;
  decoBottomX: number;
  decoBottomY: number;
};

const defaultFields = (template: TemplateId): InviteFields => {
  if (template === 'intro') {
    return {
      brideName: 'Dhruvang',
      groomName: 'Vidhi',
      textColor: '#f2d37b',
      labelColor: '#072b33',
      accent1: '#0a3a45',
      accent2: '#f2d37b',
      accent3: '#072b33',
      bgMode: 'gradient',
      bgColor: '#0a3a45',
      bgImage: null,
      bgOpacityPercent: 0,
      hostLine: 'Together with their Family',
      inviteLine1: 'Invite you to celebrate',
      inviteLine2: 'the joy of their Wedding events',
      date: '',
      scheduleLines: '',
      venueTitle: '',
      venueAddress: '',
      cta1: 'Find the Direction',
      cta2: 'Call Me',
      rsvpPhone: '+91 99999 99999',
      decoTopImage: null,
      decoTopOpacityPercent: 100,
      decoTopScalePercent: 100,
      decoTopX: 0,
      decoTopY: 0,
      decoBottomImage: null,
      decoBottomOpacityPercent: 100,
      decoBottomScalePercent: 100,
      decoBottomX: 0,
      decoBottomY: 0,
    };
  }

  if (template === 'day1') {
    return {
      brideName: 'Dhruvang',
      groomName: 'Vidhi',
      textColor: '#f2d37b',
      labelColor: '#072b33',
      accent1: '#0a3a45',
      accent2: '#f2d37b',
      accent3: '#072b33',
      bgMode: 'gradient',
      bgColor: '#0a3a45',
      bgImage: null,
      bgOpacityPercent: 0,
      hostLine: 'Together with their Family',
      inviteLine1: 'Invite you to celebrate',
      inviteLine2: 'the joy of their Wedding events',
      date: '',
      scheduleLines: '8:15 am | Ganesh Puja\n12:15 pm | Lunch\n8:30 pm | DJ & Garba',
      venueTitle: '',
      venueAddress: '',
      cta1: 'Find the Direction',
      cta2: 'Call Me',
      rsvpPhone: '+91 99999 99999',
      decoTopImage: null,
      decoTopOpacityPercent: 100,
      decoTopScalePercent: 100,
      decoTopX: 0,
      decoTopY: 0,
      decoBottomImage: null,
      decoBottomOpacityPercent: 100,
      decoBottomScalePercent: 100,
      decoBottomX: 0,
      decoBottomY: 0,
    };
  }

  if (template === 'day2') {
    return {
      brideName: 'Dhruvang',
      groomName: 'Vidhi',
      textColor: '#f2d37b',
      labelColor: '#072b33',
      accent1: '#0a3a45',
      accent2: '#f2d37b',
      accent3: '#072b33',
      bgMode: 'gradient',
      bgColor: '#0a3a45',
      bgImage: null,
      bgOpacityPercent: 0,
      hostLine: 'Together with their Family',
      inviteLine1: 'Invite you to celebrate',
      inviteLine2: 'the joy of their Wedding events',
      date: '',
      scheduleLines: '6:15 am | Jaan Prasthan | Kothmba\n12:15 pm | Lunch\n2:15 pm | Hast Melap',
      venueTitle: '',
      venueAddress: '',
      cta1: 'Find the Direction',
      cta2: 'Call Me',
      rsvpPhone: '+91 99999 99999',
      decoTopImage: null,
      decoTopOpacityPercent: 100,
      decoTopScalePercent: 100,
      decoTopX: 0,
      decoTopY: 0,
      decoBottomImage: null,
      decoBottomOpacityPercent: 100,
      decoBottomScalePercent: 100,
      decoBottomX: 0,
      decoBottomY: 0,
    };
  }

  return {
    brideName: 'Dhruvang',
    groomName: 'Vidhi',
    textColor: '#f2d37b',
    labelColor: '#072b33',
    accent1: '#0a3a45',
    accent2: '#f2d37b',
    accent3: '#072b33',
    bgMode: 'gradient',
    bgColor: '#0a3a45',
    bgImage: null,
    bgOpacityPercent: 0,
    hostLine: 'Together with their Family',
    inviteLine1: 'Invite you to celebrate',
    inviteLine2: 'the joy of their Wedding events',
    date: '',
    scheduleLines: '',
    venueTitle: '',
    venueAddress: '61, Krushnakunj Park Society,\nNew RTO Road,\nVastral, Ahmedabad.',
    cta1: 'Find the Direction',
    cta2: 'Call Me',
    rsvpPhone: '+91 99999 99999',
    decoTopImage: null,
    decoTopOpacityPercent: 100,
    decoTopScalePercent: 100,
    decoTopX: 0,
    decoTopY: 0,
    decoBottomImage: null,
    decoBottomOpacityPercent: 100,
    decoBottomScalePercent: 100,
    decoBottomX: 0,
    decoBottomY: 0,
  };
};

const templateTitle: Record<TemplateId, string> = {
  intro: 'Template 1 — Intro',
  day1: 'Template 2 — Day 1',
  day2: 'Template 3 — Day 2',
  venue: 'Template 4 — Venue',
};

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

export default function WeddingInvitationPage() {
  const templates = useMemo<TemplateId[]>(() => ['intro', 'day1', 'day2', 'venue'], []);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [dataByTemplate, setDataByTemplate] = useState<Record<TemplateId, InviteFields>>(() => ({
    intro: defaultFields('intro'),
    day1: defaultFields('day1'),
    day2: defaultFields('day2'),
    venue: defaultFields('venue'),
  }));

  const [secondsPerCard, setSecondsPerCard] = useState(2);
  const [fps, setFps] = useState(30);
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [musicVolume, setMusicVolume] = useState(70);

  const musicInputRef = useRef<HTMLInputElement | null>(null);
  const livePreviewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeTemplate = templates[step - 1];
  const activeData = dataByTemplate[activeTemplate];

  const safeFileName = (value: string) =>
    value
      .trim()
      .replace(/[—–]/g, '-')
      .replace(/₹/g, 'INR ')
      .replace(/•/g, '-')
      .replace(/[’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9\-_.]/g, '')
      .slice(0, 64);

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

  const setField = (patch: Partial<InviteFields>) => {
    setDataByTemplate((prev) => ({
      ...prev,
      [activeTemplate]: {
        ...prev[activeTemplate],
        ...patch,
      },
    }));
  };

  const onPickBgImage = async (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = typeof reader.result === 'string' ? reader.result : null;
      setField({ bgImage: url });
    };
    reader.readAsDataURL(file);
  };

  const onPickDecoTop = async (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = typeof reader.result === 'string' ? reader.result : null;
      setField({ decoTopImage: url });
    };
    reader.readAsDataURL(file);
  };

  const onPickDecoBottom = async (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = typeof reader.result === 'string' ? reader.result : null;
      setField({ decoBottomImage: url });
    };
    reader.readAsDataURL(file);
  };

  const removeBgImage = () => setField({ bgImage: null });

  const recordVideoFromTemplates = async () => {
    const w = 1080;
    const h = 1920;
    const safeFps = clamp(Math.round(fps), 10, 60);
    const safeSeconds = clamp(secondsPerCard, 1, 10);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

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

    const bgByTemplate: Record<TemplateId, HTMLImageElement | null> = {
      intro: null,
      day1: null,
      day2: null,
      venue: null,
    };
    const decoTopByTemplate: Record<TemplateId, HTMLImageElement | null> = {
      intro: null,
      day1: null,
      day2: null,
      venue: null,
    };
    const decoBottomByTemplate: Record<TemplateId, HTMLImageElement | null> = {
      intro: null,
      day1: null,
      day2: null,
      venue: null,
    };

    for (const tpl of templates) {
      const d = dataByTemplate[tpl];
      const srcBg = d.bgMode === 'image' ? d.bgImage : null;
      if (srcBg) bgByTemplate[tpl] = await loadImg(srcBg);
      if (d.decoTopImage) decoTopByTemplate[tpl] = await loadImg(d.decoTopImage);
      if (d.decoBottomImage) decoBottomByTemplate[tpl] = await loadImg(d.decoBottomImage);
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
    const totalMs = templates.length * safeSeconds * 1000;
    const fadeMs = Math.min(550, Math.floor(safeSeconds * 1000 * 0.28));
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

      const slideMs = safeSeconds * 1000;
      const idx = Math.min(templates.length - 1, Math.floor(t / slideMs));
      const inSlideT = t - idx * slideMs;
      const isFading = inSlideT >= slideMs - fadeMs && idx < templates.length - 1;

      const aTpl = templates[idx];
      const bTpl = isFading ? templates[idx + 1] : null;
      const fadeT = isFading ? (inSlideT - (slideMs - fadeMs)) / fadeMs : 0;

      const aData = dataByTemplate[aTpl];
      const bData = bTpl ? dataByTemplate[bTpl] : null;

      ctx.clearRect(0, 0, w, h);
      await renderCard(
        ctx,
        w,
        h,
        aTpl,
        aData,
        bgByTemplate[aTpl],
        decoTopByTemplate[aTpl],
        decoBottomByTemplate[aTpl],
        isFading ? 1 - fadeT : 1
      );
      if (bTpl && bData) {
        await renderCard(
          ctx,
          w,
          h,
          bTpl,
          bData,
          bgByTemplate[bTpl],
          decoTopByTemplate[bTpl],
          decoBottomByTemplate[bTpl],
          fadeT
        );
      }

      setProgress(Math.min(1, t / totalMs));
    }

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

    return new Blob(chunks, { type: recorder.mimeType || 'video/webm' });
  };

  const generatePreview = async () => {
    setIsRendering(true);
    setProgress(0);
    try {
      const blob = await recordVideoFromTemplates();
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

  const downloadPreview = () => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `${safeFileName(`${activeData.brideName}-${activeData.groomName}`) || 'wedding-invitation'}.webm`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  function roundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  const drawOverlay = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement | null,
    cardX: number,
    cardY: number,
    scalePercent: number,
    opacityPercent: number,
    offsetX: number,
    offsetY: number
  ) => {
    if (!img) return;
    const s = clamp(scalePercent, 10, 250) / 100;
    const a = clamp(opacityPercent, 0, 100) / 100;
    if (a <= 0) return;
    const dw = img.width * s;
    const dh = img.height * s;
    const x = cardX + offsetX;
    const y = cardY + offsetY;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.drawImage(img, x, y, dw, dh);
    ctx.restore();
  };

  const drawPill = (
    ctx: CanvasRenderingContext2D,
    text: string,
    cx: number,
    cy: number,
    bgColor: string,
    textColor: string
  ) => {
    ctx.save();
    ctx.font = '800 40px ui-serif, Georgia, Times New Roman, serif';
    const tw = ctx.measureText(text).width;
    const padX = 44;
    const w = Math.max(220, tw + padX * 2);
    const h = 78;
    const x = Math.round(cx - w / 2);
    const y = Math.round(cy - h / 2);
    ctx.fillStyle = bgColor;
    roundedRect(ctx, x, y, w, h, 20);
    ctx.fill();
    ctx.fillStyle = textColor;
    ctx.fillText(text, Math.round(cx - tw / 2), Math.round(cy + 14));
    ctx.restore();
  };

  const parseSchedule = (value: string) => {
    const lines = value
      .split(/\n/g)
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 6);
    return lines.map((l) => {
      const parts = l.split('|').map((p) => p.trim());
      if (parts.length >= 3) return { time: parts[0], title: parts[1], subtitle: parts.slice(2).join(' | ') };
      if (parts.length === 2) return { time: parts[0], title: parts[1], subtitle: '' };
      return { time: '', title: l, subtitle: '' };
    });
  };

  const renderCard = async (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    tpl: TemplateId,
    fields: InviteFields,
    bgImg: HTMLImageElement | null,
    decoTopImg: HTMLImageElement | null,
    decoBottomImg: HTMLImageElement | null,
    alpha: number
  ) => {
    const gold = fields.textColor || '#f2d37b';
    const labelColor = fields.labelColor || '#072b33';

    const cardW = 900;
    const cardH = 1680;
    const cardX = Math.round((w - cardW) / 2);
    const cardY = Math.round((h - cardH) / 2);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#05060a';
    ctx.fillRect(0, 0, w, h);

    const bgMode = fields.bgMode || 'gradient';

    ctx.save();
    roundedRect(ctx, cardX, cardY, cardW, cardH, 56);
    ctx.clip();

    if (bgMode === 'color') {
      ctx.fillStyle = fields.bgColor || '#0a3a45';
      ctx.fillRect(cardX, cardY, cardW, cardH);
    } else if (bgMode === 'image') {
      ctx.fillStyle = '#05060a';
      ctx.fillRect(cardX, cardY, cardW, cardH);
      if (bgImg) {
        const scale = Math.max(cardW / bgImg.width, cardH / bgImg.height);
        const dw = bgImg.width * scale;
        const dh = bgImg.height * scale;
        const x = cardX + (cardW - dw) / 2;
        const y = cardY + (cardH - dh) / 2;
        ctx.save();
        ctx.globalAlpha = alpha * clamp(fields.bgOpacityPercent, 0, 100) / 100;
        ctx.drawImage(bgImg, x, y, dw, dh);
        ctx.restore();
      }
    } else {
      const teal = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
      teal.addColorStop(0, '#0a3a45');
      teal.addColorStop(1, '#061f27');
      ctx.fillStyle = teal;
      ctx.fillRect(cardX, cardY, cardW, cardH);
    }

    const shade = ctx.createLinearGradient(0, cardY, 0, cardY + cardH);
    shade.addColorStop(0, 'rgba(0,0,0,0.15)');
    shade.addColorStop(0.55, 'rgba(0,0,0,0.05)');
    shade.addColorStop(1, 'rgba(0,0,0,0.30)');
    ctx.fillStyle = shade;
    ctx.fillRect(cardX, cardY, cardW, cardH);

    drawOverlay(
      ctx,
      decoTopImg,
      cardX,
      cardY,
      fields.decoTopScalePercent,
      fields.decoTopOpacityPercent,
      fields.decoTopX,
      fields.decoTopY
    );
    drawOverlay(
      ctx,
      decoBottomImg,
      cardX,
      cardY,
      fields.decoBottomScalePercent,
      fields.decoBottomOpacityPercent,
      fields.decoBottomX,
      fields.decoBottomY
    );

    ctx.fillStyle = gold;
    ctx.textAlign = 'center';

    if (tpl === 'intro') {
      ctx.font = '700 44px ui-serif, Georgia, Times New Roman, serif';
      ctx.fillText(fields.hostLine || '', cardX + cardW / 2, cardY + 640);

      ctx.font = '900 86px ui-serif, Georgia, Times New Roman, serif';
      ctx.fillText(fields.brideName || '', cardX + cardW / 2, cardY + 780);
      ctx.fillText('&', cardX + cardW / 2, cardY + 885);
      ctx.fillText(fields.groomName || '', cardX + cardW / 2, cardY + 990);

      ctx.font = '700 44px ui-serif, Georgia, Times New Roman, serif';
      ctx.fillText(fields.inviteLine1 || '', cardX + cardW / 2, cardY + 1140);
      ctx.fillText(fields.inviteLine2 || '', cardX + cardW / 2, cardY + 1200);
    }

    if (tpl === 'day1' || tpl === 'day2') {
      if ((fields.date || '').trim()) {
        ctx.save();
        ctx.fillStyle = gold;
        ctx.textAlign = 'center';
        ctx.font = '800 54px ui-serif, Georgia, Times New Roman, serif';
        ctx.fillText(fields.date.trim(), cardX + cardW / 2, cardY + 340);
        ctx.restore();
      }

      const cx = cardX + cardW / 2;
      const topY = cardY + 450;
      const botY = cardY + 1250;
      ctx.strokeStyle = gold;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(cx, topY);
      ctx.lineTo(cx, botY);
      ctx.stroke();
      ctx.fillStyle = gold;
      ctx.beginPath();
      ctx.arc(cx, topY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, botY, 10, 0, Math.PI * 2);
      ctx.fill();

      const items = parseSchedule(fields.scheduleLines || '');
      const slots = [topY + 120, topY + 380, topY + 640];

      ctx.textAlign = 'left';
      for (let i = 0; i < Math.min(3, items.length); i++) {
        const it = items[i];
        const y = slots[i];
        const left = i % 2 === 1;
        const textX = left ? cx - 260 : cx + 70;
        ctx.fillStyle = gold;
        ctx.font = '700 42px ui-serif, Georgia, Times New Roman, serif';
        if (it.time) ctx.fillText(it.time, textX, y - 20);
        ctx.font = '700 44px ui-serif, Georgia, Times New Roman, serif';
        ctx.fillText(it.title, textX, y + 40);
        if (it.subtitle) {
          ctx.font = '700 34px ui-serif, Georgia, Times New Roman, serif';
          ctx.fillText(it.subtitle, textX, y + 90);
        }
      }
      ctx.textAlign = 'center';
    }

    if (tpl === 'venue') {
      if ((fields.venueTitle || '').trim()) {
        drawPill(ctx, fields.venueTitle.trim(), cardX + cardW / 2, cardY + 320, gold, labelColor);
      }
      ctx.fillStyle = gold;
      ctx.font = '700 44px ui-serif, Georgia, Times New Roman, serif';
      const lines = (fields.venueAddress || '')
        .split(/\n/g)
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(0, 6);
      let y = cardY + 520;
      for (const l of lines) {
        ctx.fillText(l, cardX + cardW / 2, y);
        y += 64;
      }

      ctx.fillStyle = labelColor;
      ctx.font = '700 44px ui-serif, Georgia, Times New Roman, serif';
      ctx.fillText('or', cardX + cardW / 2, cardY + 930);

      const btn = (text: string, cy: number) => {
        ctx.save();
        ctx.font = '800 46px ui-serif, Georgia, Times New Roman, serif';
        const tw = ctx.measureText(text).width;
        const bw = Math.max(520, tw + 120);
        const bh = 92;
        const bx = Math.round(cardX + cardW / 2 - bw / 2);
        const by = Math.round(cy - bh / 2);
        ctx.fillStyle = gold;
        roundedRect(ctx, bx, by, bw, bh, 24);
        ctx.fill();
        ctx.fillStyle = labelColor;
        ctx.fillText(text, cardX + cardW / 2, cy + 16);
        ctx.restore();
      };

      btn(fields.cta1 || '', cardY + 1080);
      btn(fields.cta2 || '', cardY + 1220);
    }

    ctx.restore();
    ctx.restore();
  };

  useEffect(() => {
    let cancelled = false;

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

    const paint = async () => {
      const canvas = livePreviewCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = 1080;
      const h = 1920;
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;

      const fields = activeData;
      const bg = fields.bgMode === 'image' && fields.bgImage ? await loadImg(fields.bgImage) : null;
      const top = fields.decoTopImage ? await loadImg(fields.decoTopImage) : null;
      const bot = fields.decoBottomImage ? await loadImg(fields.decoBottomImage) : null;
      if (cancelled) return;

      ctx.clearRect(0, 0, w, h);
      await renderCard(ctx, w, h, activeTemplate, fields, bg, top, bot, 1);
    };

    void paint();
    return () => {
      cancelled = true;
    };
  }, [activeTemplate, activeData]);

  return (
    <main className="relative min-h-screen overflow-hidden grid-pattern">
      <section className="relative z-10 min-h-screen px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-bold">Wedding Invitation</h1>
            <div className="w-24 h-px bg-chalk-white mx-auto mt-6 mb-6" />
            <p className="text-lg text-chalk-gray">Choose a template, fill details, and export a 9:16 invitation video.</p>
            <div className="mt-4 text-sm text-chalk-gray">
              <Link href="/alpha" className="underline underline-offset-4 hover:text-chalk-white">
                Back to Alpha
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-[28px] border border-white/10 bg-black/50 backdrop-blur p-8 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono uppercase tracking-[0.35em] text-chalk-gray">Template</div>
                  <div className="mt-3">
                    <select
                      value={step}
                      onChange={(e) => setStep(Number(e.target.value) as 1 | 2 | 3 | 4)}
                      disabled={isRendering}
                      className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                    >
                      <option value={1}>Intro</option>
                      <option value={2}>Day 1</option>
                      <option value={3}>Day 2</option>
                      <option value={4}>Venue</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">GROOM NAME</label>
                  <input
                    value={activeData.brideName}
                    onChange={(e) => setField({ brideName: e.target.value })}
                    className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">BRIDE NAME</label>
                  <input
                    value={activeData.groomName}
                    onChange={(e) => setField({ groomName: e.target.value })}
                    className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              {activeTemplate === 'intro' ? (
                <>
                  <div>
                    <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">HOST LINE</label>
                    <input
                      value={activeData.hostLine}
                      onChange={(e) => setField({ hostLine: e.target.value })}
                      className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">INVITE LINE 1</label>
                    <input
                      value={activeData.inviteLine1}
                      onChange={(e) => setField({ inviteLine1: e.target.value })}
                      className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">INVITE LINE 2</label>
                    <input
                      value={activeData.inviteLine2}
                      onChange={(e) => setField({ inviteLine2: e.target.value })}
                      className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                    />
                  </div>
                </>
              ) : null}

              {activeTemplate === 'day1' || activeTemplate === 'day2' ? (
                <>
                  <div>
                    <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">DATE</label>
                    <input
                      value={activeData.date}
                      onChange={(e) => setField({ date: e.target.value })}
                      className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">SCHEDULE (one per line, format: time | title | optional subtitle)</label>
                    <textarea
                      rows={5}
                      value={activeData.scheduleLines}
                      onChange={(e) => setField({ scheduleLines: e.target.value })}
                      className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                    />
                  </div>
                </>
              ) : null}

              {activeTemplate === 'venue' ? (
                <>
                  <div>
                    <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">VENUE TITLE</label>
                    <input
                      value={activeData.venueTitle}
                      onChange={(e) => setField({ venueTitle: e.target.value })}
                      className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">ADDRESS (multi-line)</label>
                    <textarea
                      rows={4}
                      value={activeData.venueAddress}
                      onChange={(e) => setField({ venueAddress: e.target.value })}
                      className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">BUTTON 1</label>
                      <input
                        value={activeData.cta1}
                        onChange={(e) => setField({ cta1: e.target.value })}
                        className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">BUTTON 2</label>
                      <input
                        value={activeData.cta2}
                        onChange={(e) => setField({ cta2: e.target.value })}
                        className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                      />
                    </div>
                  </div>
                </>
              ) : null}

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">RSVP PHONE (OPTIONAL)</label>
                <input
                  value={activeData.rsvpPhone}
                  onChange={(e) => setField({ rsvpPhone: e.target.value })}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">TEXT COLOR</label>
                <input
                  type="color"
                  value={activeData.textColor}
                  onChange={(e) => setField({ textColor: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">LABEL COLOR</label>
                <input
                  type="color"
                  value={activeData.labelColor}
                  onChange={(e) => setField({ labelColor: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">BACKGROUND MODE</label>
                <select
                  value={activeData.bgMode}
                  onChange={(e) => setField({ bgMode: e.target.value as 'gradient' | 'color' | 'image' })}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                >
                  <option value="gradient">Gradient</option>
                  <option value="color">Color</option>
                  <option value="image">Image</option>
                </select>
              </div>

              {activeData.bgMode === 'color' ? (
                <div>
                  <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">BACKGROUND COLOR</label>
                  <input
                    type="color"
                    value={activeData.bgColor}
                    onChange={(e) => setField({ bgColor: e.target.value })}
                    className="w-full"
                  />
                </div>
              ) : null}

              {activeData.bgMode === 'image' ? (
                <div>
                  <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">BACKGROUND IMAGE</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onPickBgImage(e.target.files?.[0] ?? null)}
                    className="w-full text-sm"
                  />
                  <div className="mt-3">
                    <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">BACKGROUND OPACITY ({activeData.bgOpacityPercent}%)</label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={activeData.bgOpacityPercent}
                      onChange={(e) => setField({ bgOpacityPercent: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div className="mt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={removeBgImage}
                      disabled={!activeData.bgImage || isRendering}
                      className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/90 transition hover:border-white hover:text-white disabled:opacity-40"
                    >
                      Remove BG
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
                <div className="text-xs font-mono uppercase tracking-[0.35em] text-chalk-gray">Decorations (Upload Leaves)</div>

                <div>
                  <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">TOP DECORATION IMAGE</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onPickDecoTop(e.target.files?.[0] ?? null)}
                    className="w-full text-sm"
                  />
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">TOP OPACITY ({activeData.decoTopOpacityPercent}%)</label>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={activeData.decoTopOpacityPercent}
                        onChange={(e) => setField({ decoTopOpacityPercent: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">TOP SCALE ({activeData.decoTopScalePercent}%)</label>
                      <input
                        type="range"
                        min={10}
                        max={250}
                        value={activeData.decoTopScalePercent}
                        onChange={(e) => setField({ decoTopScalePercent: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">TOP X ({activeData.decoTopX}px)</label>
                      <input
                        type="range"
                        min={-400}
                        max={400}
                        value={activeData.decoTopX}
                        onChange={(e) => setField({ decoTopX: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">TOP Y ({activeData.decoTopY}px)</label>
                      <input
                        type="range"
                        min={-400}
                        max={400}
                        value={activeData.decoTopY}
                        onChange={(e) => setField({ decoTopY: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setField({ decoTopImage: null })}
                      disabled={!activeData.decoTopImage || isRendering}
                      className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/90 transition hover:border-white hover:text-white disabled:opacity-40"
                    >
                      Remove Top
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">BOTTOM DECORATION IMAGE</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onPickDecoBottom(e.target.files?.[0] ?? null)}
                    className="w-full text-sm"
                  />
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">BOTTOM OPACITY ({activeData.decoBottomOpacityPercent}%)</label>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={activeData.decoBottomOpacityPercent}
                        onChange={(e) => setField({ decoBottomOpacityPercent: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">BOTTOM SCALE ({activeData.decoBottomScalePercent}%)</label>
                      <input
                        type="range"
                        min={10}
                        max={250}
                        value={activeData.decoBottomScalePercent}
                        onChange={(e) => setField({ decoBottomScalePercent: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">BOTTOM X ({activeData.decoBottomX}px)</label>
                      <input
                        type="range"
                        min={-400}
                        max={400}
                        value={activeData.decoBottomX}
                        onChange={(e) => setField({ decoBottomX: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">BOTTOM Y ({activeData.decoBottomY}px)</label>
                      <input
                        type="range"
                        min={-1500}
                        max={1500}
                        value={activeData.decoBottomY}
                        onChange={(e) => setField({ decoBottomY: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setField({ decoBottomImage: null })}
                      disabled={!activeData.decoBottomImage || isRendering}
                      className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/90 transition hover:border-white hover:text-white disabled:opacity-40"
                    >
                      Remove Bottom
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">MUSIC (OPTIONAL)</label>
                <input
                  ref={musicInputRef}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">SECONDS / TEMPLATE</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={secondsPerCard}
                    onChange={(e) => setSecondsPerCard(Number(e.target.value))}
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

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="button"
                  onClick={generatePreview}
                  disabled={isRendering}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff] px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-[0_15px_30px_rgba(255,95,145,0.25)] transition hover:shadow-[0_25px_45px_rgba(123,91,255,0.35)] disabled:opacity-40"
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

              {isRendering ? (
                <div className="pt-2">
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff]"
                      style={{ width: `${Math.round(progress * 100)}%` }}
                    />
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
                    <div className="w-[52%]" style={{ backgroundColor: activeData.accent1 }} />
                    <div className="w-[30%]" style={{ backgroundColor: activeData.accent2 }} />
                    <div className="w-[18%]" style={{ backgroundColor: activeData.accent3 }} />
                  </div>
                  <div className="p-4">
                    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
                      <div style={{ paddingTop: `${(1920 / 1080) * 100}%` }} />
                      <canvas
                        ref={livePreviewCanvasRef}
                        className="absolute inset-0 h-full w-full"
                      />
                    </div>
                    <div className="mt-3 text-xs text-chalk-gray">Export: 1080×1920 video (.webm)</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-xs text-chalk-gray">
                Tip: Customize each template using the Template selector. When you’re done, click Generate Preview.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
