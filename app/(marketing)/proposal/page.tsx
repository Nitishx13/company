'use client';

import { useMemo, useState } from 'react';

export default function ProposalGeneratorPage() {
  const today = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const [clientName, setClientName] = useState('Client Name');
  const [clientCompany, setClientCompany] = useState('Client Company');
  const [proposalTitle, setProposalTitle] = useState('Growth Proposal');
  const [proposalDate, setProposalDate] = useState(today);

  const [summary, setSummary] = useState(
    'A focused growth plan designed to generate measurable outcomes through strategy, execution, and optimization.'
  );
  const [scope, setScope] = useState(
    'Brand & messaging alignment\nLanding page optimization\nPerformance campaign setup\nTracking & dashboards\nWeekly reporting + iteration'
  );
  const [timeline, setTimeline] = useState('4 weeks (Discovery -> Build -> Launch -> Optimize)');
  const [investment, setInvestment] = useState('₹XX,XXX / month');
  const [terms, setTerms] = useState('50% upfront • 50% on delivery • Monthly retainer billed in advance');

  const downloadPdf = async () => {
    const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');

    const pdfSafe = (value: string) =>
      value
        .replace(/→/g, '->')
        .replace(/[—–]/g, '-')
        .replace(/₹/g, 'INR ')
        .replace(/•/g, '-')
        .replace(/[’]/g, "'")
        .replace(/[“”]/g, '"');

    const wrapText = (text: string, font: any, size: number, maxWidth: number) => {
      const words = pdfSafe(text).split(/\s+/g);
      const lines: string[] = [];
      let current = '';
      for (const word of words) {
        const test = current ? `${current} ${word}` : word;
        const w = font.widthOfTextAtSize(test, size);
        if (w <= maxWidth) {
          current = test;
          continue;
        }
        if (current) lines.push(current);
        current = word;
      }
      if (current) lines.push(current);
      return lines;
    };

    const doc = await PDFDocument.create();
    const page = doc.addPage([612, 792]);

    const width = page.getWidth();
    const height = page.getHeight();

    const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

    const bg = rgb(0.04, 0.05, 0.07);
    const white = rgb(0.98, 0.98, 0.98);
    const muted = rgb(0.72, 0.74, 0.78);
    const soft = rgb(0.86, 0.88, 0.9);
    const accentPink = rgb(1, 0.37, 0.57);
    const accentPurple = rgb(0.48, 0.36, 1);
    const accentCyan = rgb(0.0, 0.71, 1);

    const drawBox = (opts: {
      x: number;
      y: number;
      w: number;
      h: number;
      stripe: { r: number; g: number; b: number };
      label: string;
      body: string;
    }) => {
      page.drawRectangle({ x: opts.x, y: opts.y, width: opts.w, height: opts.h, color: rgb(0.07, 0.08, 0.1) });
      page.drawRectangle({ x: opts.x, y: opts.y + opts.h - 5, width: opts.w, height: 5, color: rgb(opts.stripe.r, opts.stripe.g, opts.stripe.b) });
      page.drawText(pdfSafe(opts.label.toUpperCase()), { x: opts.x + 18, y: opts.y + opts.h - 24, size: 9, font: fontBold, color: muted });

      const bodyFontSize = 12;
      const leading = 16;
      const maxWidth = opts.w - 36;
      const rawLines = opts.body
        .split('\n')
        .flatMap((ln) => (ln.trim() ? wrapText(ln, fontRegular, bodyFontSize, maxWidth) : ['']));

      const maxLines = Math.floor((opts.h - 44) / leading);
      let cursorY = opts.y + opts.h - 46;
      for (let i = 0; i < rawLines.length && i < maxLines; i++) {
        const ln = rawLines[i];
        if (ln === '') {
          cursorY -= leading;
          continue;
        }
        page.drawText(ln, { x: opts.x + 18, y: cursorY, size: bodyFontSize, font: fontRegular, color: white });
        cursorY -= leading;
      }
    };

    page.drawRectangle({ x: 0, y: 0, width, height, color: bg });

    // Accent header bars
    page.drawRectangle({ x: 0, y: height - 14, width: width * 0.52, height: 14, color: accentPurple });
    page.drawRectangle({ x: width * 0.52, y: height - 14, width: width * 0.30, height: 14, color: accentPink });
    page.drawRectangle({ x: width * 0.82, y: height - 14, width: width * 0.18, height: 14, color: accentCyan });

    const marginX = 54;

    // Header
    page.drawText(pdfSafe('PINAQYN TECH'), { x: marginX, y: height - 70, size: 10, font: fontBold, color: muted });
    page.drawText(pdfSafe('PROPOSAL'), { x: marginX + 122, y: height - 70, size: 10, font: fontBold, color: muted });

    // Title
    const titleLines = wrapText(proposalTitle, fontBold, 30, width - marginX * 2);
    const titleY = height - 124;
    titleLines.slice(0, 2).forEach((ln, idx) => {
      page.drawText(ln, { x: marginX, y: titleY - idx * 34, size: 30, font: fontBold, color: white });
    });

    // Meta
    const metaY = titleY - 78;
    page.drawText(pdfSafe(`Prepared for: ${clientName}${clientCompany ? ` (${clientCompany})` : ''}`), {
      x: marginX,
      y: metaY,
      size: 12,
      font: fontRegular,
      color: soft,
    });
    page.drawText(pdfSafe(`Date: ${proposalDate}`), {
      x: marginX,
      y: metaY - 18,
      size: 12,
      font: fontRegular,
      color: soft,
    });

    // Summary (wrapped)
    const summaryLines = wrapText(summary, fontRegular, 12, width - marginX * 2);
    const summaryY = metaY - 54;
    page.drawText(pdfSafe('SUMMARY'), { x: marginX, y: summaryY + 18, size: 9, font: fontBold, color: muted });
    summaryLines.slice(0, 3).forEach((ln, idx) => {
      page.drawText(ln, { x: marginX, y: summaryY - idx * 16, size: 12, font: fontRegular, color: soft });
    });

    // Boxes
    const bottomContactY = 70;
    const contactH = 62;
    const contactY = bottomContactY;

    const boxGap = 18;
    const boxW = (width - marginX * 2 - boxGap) / 2;

    const boxesTop = 300;
    const boxH = 170;

    drawBox({ x: marginX, y: boxesTop, w: boxW, h: boxH, stripe: { r: 1, g: 0.37, b: 0.57 }, label: 'Scope', body: scope });
    drawBox({ x: marginX + boxW + boxGap, y: boxesTop, w: boxW, h: boxH, stripe: { r: 0.48, g: 0.36, b: 1 }, label: 'Timeline', body: timeline });

    const box2Top = boxesTop - (boxH + 18);
    drawBox({ x: marginX, y: box2Top, w: boxW, h: boxH, stripe: { r: 0.0, g: 0.71, b: 1 }, label: 'Investment', body: investment });
    drawBox({ x: marginX + boxW + boxGap, y: box2Top, w: boxW, h: boxH, stripe: { r: 1, g: 0.37, b: 0.57 }, label: 'Terms', body: terms });

    // Contact bar
    page.drawRectangle({ x: marginX, y: contactY, width: width - marginX * 2, height: contactH, color: rgb(0.06, 0.07, 0.09) });
    page.drawRectangle({ x: marginX, y: contactY + contactH - 4, width: width - marginX * 2, height: 4, color: accentCyan });
    page.drawText(pdfSafe('CONTACT'), { x: marginX + 18, y: contactY + 38, size: 10, font: fontBold, color: muted });
    page.drawText(pdfSafe('pinaqyn@gmail.com'), { x: marginX + 18, y: contactY + 18, size: 14, font: fontBold, color: white });
    page.drawText(pdfSafe('+91 8882816805 (WhatsApp)'), { x: marginX + 300, y: contactY + 18, size: 14, font: fontBold, color: white });

    // Footer note
    page.drawText(pdfSafe('Generated from pinaqyn.tech/proposal'), {
      x: marginX,
      y: 34,
      size: 9,
      font: fontRegular,
      color: muted,
    });

    const pdfBytes = await doc.save();
    const pdfBytesCopy = Uint8Array.from(pdfBytes);
    const blob = new Blob([pdfBytesCopy.buffer as ArrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `Proposal-${pdfSafe(clientName).replace(/\s+/g, '-')}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="relative min-h-screen overflow-hidden grid-pattern">
      <section className="relative z-10 min-h-screen px-6 pt-32 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-7xl font-bold">Proposal Generator</h1>
            <div className="w-24 h-px bg-chalk-white mx-auto mt-6 mb-6" />
            <p className="text-lg text-chalk-gray">
              Fill details and download a single-page proposal PDF with your letterhead style.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-[28px] border border-white/10 bg-black/50 backdrop-blur p-8 space-y-5">
              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">CLIENT NAME</label>
                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">CLIENT COMPANY</label>
                <input
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">PROPOSAL TITLE</label>
                <input
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">DATE</label>
                <input
                  value={proposalDate}
                  onChange={(e) => setProposalDate(e.target.value)}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">SUMMARY</label>
                <textarea
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/50 backdrop-blur p-8 space-y-5">
              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">SCOPE (one per line)</label>
                <textarea
                  rows={6}
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">TIMELINE</label>
                <input
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">INVESTMENT</label>
                <input
                  value={investment}
                  onChange={(e) => setInvestment(e.target.value)}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">TERMS</label>
                <input
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <button
                type="button"
                onClick={downloadPdf}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff] px-10 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_15px_30px_rgba(255,95,145,0.35)] transition hover:shadow-[0_25px_45px_rgba(123,91,255,0.35)]"
              >
                Download Proposal PDF
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
