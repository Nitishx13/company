'use client';

export default function CapabilitiesPage() {
  const downloadPdf = async () => {
    const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');

    const pdfSafe = (value: string) =>
      value
        .replace(/→/g, '->')
        .replace(/[—–]/g, '-')
        .replace(/[’]/g, "'")
        .replace(/[“”]/g, '"');

    const doc = await PDFDocument.create();
    const page = doc.addPage([612, 792]);

    const width = page.getWidth();
    const height = page.getHeight();

    const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

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
        // if a single word is longer than the max width, hard-split it
        if (font.widthOfTextAtSize(word, size) > maxWidth) {
          let chunk = '';
          for (const ch of word) {
            const t = chunk + ch;
            if (font.widthOfTextAtSize(t, size) <= maxWidth) {
              chunk = t;
            } else {
              if (chunk) lines.push(chunk);
              chunk = ch;
            }
          }
          current = chunk;
        } else {
          current = word;
        }
      }
      if (current) lines.push(current);
      return lines;
    };

    const bg = rgb(0.04, 0.05, 0.07);
    const white = rgb(0.98, 0.98, 0.98);
    const muted = rgb(0.72, 0.74, 0.78);
    const accentPink = rgb(1, 0.37, 0.57);
    const accentPurple = rgb(0.48, 0.36, 1);
    const accentCyan = rgb(0.0, 0.71, 1);

    page.drawRectangle({ x: 0, y: 0, width, height, color: bg });

    const marginX = 54;
    const topY = height - 64;

    // Accent header bars
    page.drawRectangle({ x: 0, y: height - 14, width: width * 0.52, height: 14, color: accentPurple });
    page.drawRectangle({ x: width * 0.52, y: height - 14, width: width * 0.30, height: 14, color: accentPink });
    page.drawRectangle({ x: width * 0.82, y: height - 14, width: width * 0.18, height: 14, color: accentCyan });

    // Eyebrow
    page.drawText(pdfSafe('PINAQYN TECH'), {
      x: marginX,
      y: topY,
      size: 10,
      font: fontBold,
      color: muted,
    });
    page.drawText(pdfSafe('CAPABILITIES'), {
      x: marginX + 122,
      y: topY,
      size: 10,
      font: fontBold,
      color: muted,
    });

    // Title
    const titleY = topY - 46;
    page.drawText(pdfSafe('Results'), { x: marginX, y: titleY, size: 44, font: fontBold, color: white });
    page.drawText('>', { x: marginX + 153, y: titleY + 2, size: 36, font: fontBold, color: muted });
    page.drawText(pdfSafe('Everything'), {
      x: marginX + 190,
      y: titleY,
      size: 44,
      font: fontBold,
      color: white,
    });

    // Sub copy (keep cover clean)
    const copy =
      'Data-driven strategy. Relentless execution. Measurable outcomes. No fluff - just results you can track and scale.';
    const copyFontSize = 13;
    const copyLeading = 18;
    const copyMaxWidth = width - marginX * 2;
    const copyLines = wrapText(copy, fontRegular, copyFontSize, copyMaxWidth);
    const copyY = titleY - 60;
    copyLines.forEach((line, idx) => {
      page.drawText(line, {
        x: marginX,
        y: copyY - idx * copyLeading,
        size: copyFontSize,
        font: fontRegular,
        color: rgb(0.86, 0.88, 0.90),
      });
    });

    // Bottom blocks (anchor first)
    const contactY = 70;
    const contactH = 62;
    const deliverY = contactY + contactH + 18;
    const deliverH = 86;
    const deliverTopY = deliverY + deliverH;

    // Section blocks (ensure they never overlap deliverables/contact)
    const computedCardY = copyY - copyLines.length * copyLeading - 34;
    const cardW = (width - marginX * 2 - 18) / 2;
    const cardH = 140;
    const minCardY = deliverTopY + 28;
    const desiredCardY = 270;
    const cardY = Math.max(minCardY, Math.min(desiredCardY, computedCardY));

    const drawCard = (
      x: number,
      y: number,
      label: string,
      body: string,
      stripe: { r: number; g: number; b: number }
    ) => {
      page.drawRectangle({ x, y, width: cardW, height: cardH, color: rgb(0.07, 0.08, 0.10) });
      page.drawRectangle({ x, y: y + cardH - 6, width: cardW, height: 6, color: rgb(stripe.r, stripe.g, stripe.b) });
      page.drawText(pdfSafe(label.toUpperCase()), { x: x + 18, y: y + cardH - 28, size: 10, font: fontBold, color: muted });

      const bodyFontSize = 12;
      const bodyLeading = 16;
      const bodyMaxWidth = cardW - 36;
      const bodyLines: string[] = [];
      body.split('\n').forEach((ln) => {
        bodyLines.push(...wrapText(ln, fontRegular, bodyFontSize, bodyMaxWidth));
      });

      bodyLines.slice(0, 6).forEach((ln, i) => {
        page.drawText(ln, {
          x: x + 18,
          y: y + cardH - 52 - i * bodyLeading,
          size: bodyFontSize,
          font: fontRegular,
          color: white,
        });
      });
    };

    drawCard(marginX, cardY, 'Core Services', 'Branding & Strategy\nWeb & Development\nMarketing & SEO\nAI & Automation', {
      r: 1,
      g: 0.37,
      b: 0.57,
    });
    drawCard(marginX + cardW + 18, cardY, 'Process', 'Audit -> Strategy -> Build\nLaunch -> Optimize\nWeekly updates + clear KPIs', {
      r: 0.48,
      g: 0.36,
      b: 1,
    });

    // Highlights row (above cards, below the copy)
    const chipsIdealY = cardY + cardH + 18;
    const chipsMaxY = copyY - copyLines.length * copyLeading - 26;
    const chipsY = Math.min(chipsIdealY, chipsMaxY);
    const chipH = 34;
    const chipGap = 12;
    const chipW = (width - marginX * 2 - chipGap * 2) / 3;
    const chipTextSize = 10;
    const chipLabelSize = 8;
    const chips = [
      { label: 'FOCUS', value: 'Results you can track', color: accentCyan },
      { label: 'SPEED', value: 'Fast execution cycles', color: accentPink },
      { label: 'CLARITY', value: 'KPIs + weekly updates', color: accentPurple },
    ];
    chips.forEach((chip, idx) => {
      const x = marginX + idx * (chipW + chipGap);
      page.drawRectangle({ x, y: chipsY, width: chipW, height: chipH, color: rgb(0.06, 0.07, 0.09) });
      page.drawRectangle({ x, y: chipsY + chipH - 4, width: chipW, height: 4, color: chip.color });
      page.drawText(pdfSafe(chip.label), { x: x + 14, y: chipsY + 18, size: chipLabelSize, font: fontBold, color: muted });
      page.drawText(pdfSafe(chip.value), { x: x + 14, y: chipsY + 6, size: chipTextSize, font: fontBold, color: white });
    });

    // Deliverables strip (fills space above contact and improves cover composition)
    page.drawRectangle({ x: marginX, y: deliverY, width: width - marginX * 2, height: deliverH, color: rgb(0.07, 0.08, 0.10) });
    page.drawRectangle({ x: marginX, y: deliverY + deliverH - 5, width: width - marginX * 2, height: 5, color: accentPurple });
    page.drawText(pdfSafe('DELIVERABLES'), { x: marginX + 18, y: deliverY + deliverH - 26, size: 10, font: fontBold, color: muted });
    const deliverText = 'Landing pages • Creative & copy • Tracking & dashboards • Campaign execution • Automation workflows';
    const deliverLines = wrapText(deliverText, fontRegular, 12, width - marginX * 2 - 36);
    deliverLines.slice(0, 2).forEach((ln, i) => {
      page.drawText(ln, { x: marginX + 18, y: deliverY + deliverH - 48 - i * 16, size: 12, font: fontRegular, color: white });
    });

    // Contact bar
    page.drawRectangle({ x: marginX, y: contactY, width: width - marginX * 2, height: 62, color: rgb(0.06, 0.07, 0.09) });
    page.drawRectangle({ x: marginX, y: contactY + 62 - 4, width: width - marginX * 2, height: 4, color: accentCyan });
    page.drawText(pdfSafe('CONTACT'), { x: marginX + 18, y: contactY + 38, size: 10, font: fontBold, color: muted });
    page.drawText(pdfSafe('pinaqyn@gmail.com'), { x: marginX + 18, y: contactY + 18, size: 14, font: fontBold, color: white });
    page.drawText(pdfSafe('+91 8882816805 (WhatsApp)'), { x: marginX + 300, y: contactY + 18, size: 14, font: fontBold, color: white });

    // Footer note
    page.drawText(pdfSafe('Generated from pinaqyn.tech/capabilities'), {
      x: marginX,
      y: 34,
      size: 9,
      font: fontRegular,
      color: muted,
    });

    // Page 2+: long-form positioning statement (400+ words) with pagination
    const createBodyPage = (showTitle: boolean) => {
      const p = doc.addPage([612, 792]);
      const w2 = p.getWidth();
      const h2 = p.getHeight();

      p.drawRectangle({ x: 0, y: 0, width: w2, height: h2, color: bg });
      p.drawRectangle({ x: 0, y: h2 - 12, width: w2 * 0.52, height: 12, color: accentPurple });
      p.drawRectangle({ x: w2 * 0.52, y: h2 - 12, width: w2 * 0.30, height: 12, color: accentPink });
      p.drawRectangle({ x: w2 * 0.82, y: h2 - 12, width: w2 * 0.18, height: 12, color: accentCyan });

      const p2MarginX = 54;
      const p2TopY = h2 - 72;

      p.drawText(pdfSafe('PINAQYN TECH'), { x: p2MarginX, y: p2TopY, size: 10, font: fontBold, color: muted });
      p.drawText(pdfSafe('OUR APPROACH'), { x: p2MarginX + 122, y: p2TopY, size: 10, font: fontBold, color: muted });

      let startY = p2TopY - 28;
      if (showTitle) {
        p.drawText(pdfSafe('We focus on what moves the needle.'), {
          x: p2MarginX,
          y: p2TopY - 50,
          size: 26,
          font: fontBold,
          color: white,
        });
        startY = p2TopY - 92;
      }

      return { p, w2, h2, p2MarginX, startY };
    };

    const longCopy =
      "We focus on what actually moves the needle: data-driven strategy, relentless execution, and measurable outcomes. " +
      "That means every recommendation we make is tied to a business goal you care about - leads, revenue, margin, retention, and long-term brand demand. " +
      "We do not sell random activities. We build a growth system: clear positioning, a conversion-focused website, high-intent acquisition, and tracking that tells the truth. " +
      "When you work with us, you will always know what we are doing, why we are doing it, and what result it is expected to produce. " +
      "\n\n" +
      "Our process starts with fundamentals. We audit your current funnel end-to-end: traffic sources, landing pages, messaging, offer clarity, tracking quality, and the speed of your sales follow-up. " +
      "We map the highest-leverage bottlenecks and prioritize them. Sometimes the needle moves fastest by fixing one landing page and one campaign. " +
      "Other times it is a positioning shift or a measurement rebuild so decisions stop being based on guesswork. " +
      "We then translate the plan into an execution roadmap with clear owners, timelines, and KPIs. " +
      "\n\n" +
      "Execution is where most agencies fall short, so we operate with a simple rule: ship, measure, iterate. " +
      "We design creative that is built for performance, write copy that is built for clarity, and build pages that are built to convert. " +
      "We set up tracking so you can see what is working - not just clicks, but qualified leads and real revenue. " +
      "We run weekly check-ins, review results, and make specific decisions: scale what works, pause what does not, and test the next best hypothesis. " +
      "\n\n" +
      "You will not hear fluff. You will not get vanity metrics. You will get clear reporting and straight answers. " +
      "If a channel is not the right fit, we will tell you. If your offer needs refinement, we will show you why. " +
      "If your website is leaking conversions, we will fix the leak before spending more on ads. " +
      "If your sales pipeline needs automation and follow-up, we will design the workflow so leads do not go cold. " +
      "\n\n" +
      "The goal is simple: results you can track and scale. " +
      "Growth is not a single campaign - it is an engine. We help you build that engine with focus, speed, and discipline, " +
      "so your marketing becomes predictable, your acquisition becomes efficient, and your business becomes stronger month after month.";

    const p2FontSize = 12;
    const p2Leading = 16;

    // Build wrapped lines once (paragraph breaks preserved)
    const measurePage = createBodyPage(true);
    const p2MaxWidth = measurePage.w2 - measurePage.p2MarginX * 2;
    const longLines = longCopy
      .split('\n')
      .flatMap((para) => (para.trim() ? wrapText(para, fontRegular, p2FontSize, p2MaxWidth) : ['']));

    // Draw with pagination
    let { p: currentPage, p2MarginX, startY } = measurePage;
    const bottomPadding = 56;
    let cursorY = startY;
    let firstPage = true;

    for (const rawLine of longLines) {
      const line = rawLine;
      if (cursorY <= bottomPadding) {
        const next = createBodyPage(false);
        currentPage = next.p;
        p2MarginX = next.p2MarginX;
        cursorY = next.startY;
        firstPage = false;
      }

      if (line === '') {
        cursorY -= p2Leading; // paragraph spacing
        continue;
      }

      currentPage.drawText(line, {
        x: p2MarginX,
        y: cursorY,
        size: p2FontSize,
        font: fontRegular,
        color: rgb(0.86, 0.88, 0.90),
      });
      cursorY -= p2Leading;
    }

    const pdfBytes = await doc.save();
    const pdfBytesCopy = Uint8Array.from(pdfBytes);
    const blob = new Blob([pdfBytesCopy.buffer as ArrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'Pinaqyn-Capabilities.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const sections = [
    {
      eyebrow: 'Pinaqyn Tech',
      title: 'Capabilities Deck',
      body: 'A clear snapshot of what we do, how we work, and what outcomes you can expect — formatted like a shareable slide deck.',
    },
    {
      eyebrow: 'Positioning',
      title: 'Results > Everything',
      body: 'We focus on what moves the needle—data-driven strategy, relentless execution, and measurable outcomes. No fluff, no shortcuts, just results you can track and scale.',
    },
    {
      eyebrow: 'What we do',
      title: 'Growth services that compound',
      body: 'Brand, web, acquisition, and automation—built as a system so every channel reinforces the next.',
    },
    {
      eyebrow: 'Core services',
      title: 'Branding, Web, Marketing, Automation',
      body: 'From positioning and creative to performance campaigns and workflow automation, we build an end-to-end growth engine.',
    },
    {
      eyebrow: 'How we work',
      title: 'Simple process, fast execution',
      body: 'Audit → Strategy → Build → Launch → Optimize. Weekly updates, clear KPIs, and rapid iteration.',
    },
    {
      eyebrow: 'What you get',
      title: 'Deliverables you can ship',
      body: 'Campaign plans, landing pages, tracking, creatives, dashboards, and automation workflows — documented and ready to scale.',
    },
    {
      eyebrow: 'Proof',
      title: 'Outcomes you can measure',
      body: 'We align goals to KPIs (leads, CAC, ROAS, retention) and report progress with transparent dashboards.',
    },
    {
      eyebrow: 'Next step',
      title: 'Let’s discuss your growth plan',
      body: 'Share your goals and timeline. We’ll propose the fastest path to measurable growth.',
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="relative z-10">
        {sections.map((s, idx) => (
          <section
            key={idx}
            className={`min-h-[calc(100vh-4rem)] flex items-center px-6 py-24 ${idx % 2 === 1 ? 'grid-pattern' : ''}`}
          >
            <div className="max-w-6xl mx-auto w-full">
              <div className="rounded-[40px] border border-white/10 bg-black/50 backdrop-blur shadow-[0_25px_70px_rgba(0,0,0,0.65)] p-10 md:p-14">
                <p className="text-xs uppercase tracking-[0.6em] text-white/50">{s.eyebrow}</p>
                <h1 className={`${idx === 0 ? 'text-5xl md:text-7xl' : 'text-4xl md:text-6xl'} font-extrabold text-white mt-6`}>
                  {s.title}
                </h1>
                <p className="mt-6 text-lg md:text-xl text-white/75 leading-relaxed max-w-4xl">
                  {s.body}
                </p>

                {idx === 0 ? (
                  <div className="mt-10 flex flex-wrap gap-4">
                    <a
                      href="#contact"
                      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff] px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_15px_30px_rgba(255,95,145,0.35)] transition hover:shadow-[0_25px_45px_rgba(123,91,255,0.35)]"
                    >
                      Share With Client
                    </a>
                    <button
                      onClick={downloadPdf}
                      className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-white hover:text-white"
                      type="button"
                    >
                      Download PDF
                    </button>
                  </div>
                ) : null}

                {idx === sections.length - 1 ? (
                  <div id="contact" className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <a
                      href="mailto:pinaqyn@gmail.com"
                      className="rounded-[28px] border border-white/10 bg-white/5 p-8 transition hover:border-white/30"
                    >
                      <div className="text-xs uppercase tracking-[0.6em] text-white/50">Email</div>
                      <div className="mt-3 text-2xl font-bold text-white">pinaqyn@gmail.com</div>
                      <div className="mt-3 text-sm text-white/70">Tap to email us</div>
                    </a>
                    <a
                      href="https://wa.me/918882816805"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-[28px] border border-white/10 bg-white/5 p-8 transition hover:border-white/30"
                    >
                      <div className="text-xs uppercase tracking-[0.6em] text-white/50">WhatsApp</div>
                      <div className="mt-3 text-2xl font-bold text-white">+91 8882816805</div>
                      <div className="mt-3 text-sm text-white/70">Tap to chat on WhatsApp</div>
                    </a>

                    <div id="download" className="md:col-span-2 rounded-[28px] border border-white/10 bg-white/5 p-8">
                      <div className="text-xs uppercase tracking-[0.6em] text-white/50">Download</div>
                      <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="text-white/75 leading-relaxed">
                          Download a one-page capabilities PDF you can share with clients.
                        </div>
                        <button
                          onClick={downloadPdf}
                          className="inline-flex items-center justify-center rounded-full bg-white text-black px-8 py-3 text-xs font-semibold uppercase tracking-[0.3em] transition hover:bg-white/90"
                          type="button"
                        >
                          Download PDF
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
