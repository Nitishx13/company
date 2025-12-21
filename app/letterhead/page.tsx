'use client';

import { useMemo, useState } from 'react';

export default function LetterheadGeneratorPage() {
  const today = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const [fromName, setFromName] = useState('Pinaqyn Tech');
  const [fromEmail, setFromEmail] = useState('pinaqyn@gmail.com');
  const [fromPhone, setFromPhone] = useState('+91 8882816805');
  const [date, setDate] = useState(today);

  const [toName, setToName] = useState('Client Name');
  const [toCompany, setToCompany] = useState('Client Company');
  const [subject, setSubject] = useState('Subject: Letter / Confirmation');

  const [body, setBody] = useState(
    'Dear Client,\n\nThank you for your time. This letter confirms our discussion and outlines the next steps.\n\nSincerely,\nPinaqyn Tech'
  );

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

    page.drawRectangle({ x: 0, y: 0, width, height, color: bg });

    // Accent header bars
    page.drawRectangle({ x: 0, y: height - 14, width: width * 0.52, height: 14, color: accentPurple });
    page.drawRectangle({ x: width * 0.52, y: height - 14, width: width * 0.30, height: 14, color: accentPink });
    page.drawRectangle({ x: width * 0.82, y: height - 14, width: width * 0.18, height: 14, color: accentCyan });

    const marginX = 54;

    // Header (letterhead)
    page.drawText(pdfSafe(fromName.toUpperCase()), { x: marginX, y: height - 70, size: 14, font: fontBold, color: white });
    page.drawText(pdfSafe('LETTERHEAD'), { x: width - marginX - 110, y: height - 68, size: 10, font: fontBold, color: muted });

    const metaLeftY = height - 98;
    page.drawText(pdfSafe(fromEmail), { x: marginX, y: metaLeftY, size: 10, font: fontRegular, color: muted });
    page.drawText(pdfSafe(fromPhone), { x: marginX, y: metaLeftY - 14, size: 10, font: fontRegular, color: muted });

    page.drawText(pdfSafe(`Date: ${date}`), { x: width - marginX - 140, y: metaLeftY, size: 10, font: fontRegular, color: muted });

    // Divider line
    page.drawRectangle({ x: marginX, y: height - 132, width: width - marginX * 2, height: 1, color: rgb(0.2, 0.22, 0.26) });

    // Recipient block
    const toY = height - 164;
    const toText = `${toName}${toCompany ? `\n${toCompany}` : ''}`;
    const toLines = toText.split('\n').map((l) => pdfSafe(l));
    toLines.forEach((ln, idx) => {
      page.drawText(ln, { x: marginX, y: toY - idx * 16, size: 12, font: fontBold, color: white });
    });

    // Subject
    const subjectLines = wrapText(subject, fontBold, 12, width - marginX * 2);
    const subjectY = toY - toLines.length * 16 - 24;
    page.drawText(pdfSafe('SUBJECT'), { x: marginX, y: subjectY + 16, size: 9, font: fontBold, color: muted });
    subjectLines.slice(0, 2).forEach((ln, idx) => {
      page.drawText(ln, { x: marginX, y: subjectY - idx * 16, size: 12, font: fontBold, color: white });
    });

    // Body
    const bodyStartY = subjectY - 46;
    const bodyFontSize = 12;
    const leading = 16;
    const maxWidth = width - marginX * 2;

    const paragraphs = pdfSafe(body).split('\n');
    let cursorY = bodyStartY;
    for (const para of paragraphs) {
      if (para.trim() === '') {
        cursorY -= leading;
        continue;
      }
      const lines = wrapText(para, fontRegular, bodyFontSize, maxWidth);
      for (const ln of lines) {
        page.drawText(ln, { x: marginX, y: cursorY, size: bodyFontSize, font: fontRegular, color: soft });
        cursorY -= leading;
        if (cursorY < 120) break;
      }
      cursorY -= 6;
      if (cursorY < 120) break;
    }

    // Footer contact strip
    const footerH = 62;
    const footerY = 70;
    page.drawRectangle({ x: marginX, y: footerY, width: width - marginX * 2, height: footerH, color: rgb(0.06, 0.07, 0.09) });
    page.drawRectangle({ x: marginX, y: footerY + footerH - 4, width: width - marginX * 2, height: 4, color: accentCyan });
    page.drawText(pdfSafe('CONTACT'), { x: marginX + 18, y: footerY + 38, size: 10, font: fontBold, color: muted });
    page.drawText(pdfSafe(fromEmail), { x: marginX + 18, y: footerY + 18, size: 14, font: fontBold, color: white });
    page.drawText(pdfSafe(fromPhone), { x: marginX + 360, y: footerY + 18, size: 14, font: fontBold, color: white });

    // Footer note
    page.drawText(pdfSafe('Generated from pinaqyn.tech/letterhead'), {
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
    a.download = `Letterhead-${pdfSafe(toName).replace(/\s+/g, '-')}.pdf`;
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
            <h1 className="text-5xl md:text-7xl font-bold">Letterhead Generator</h1>
            <div className="w-24 h-px bg-chalk-white mx-auto mt-6 mb-6" />
            <p className="text-lg text-chalk-gray">Create a black-themed letter on your brand letterhead and download as PDF.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-[28px] border border-white/10 bg-black/50 backdrop-blur p-8 space-y-5">
              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">FROM (NAME)</label>
                <input
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">FROM EMAIL</label>
                <input
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">FROM PHONE</label>
                <input
                  value={fromPhone}
                  onChange={(e) => setFromPhone(e.target.value)}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">DATE</label>
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/50 backdrop-blur p-8 space-y-5">
              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">TO (NAME)</label>
                <input
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">TO (COMPANY)</label>
                <input
                  value={toCompany}
                  onChange={(e) => setToCompany(e.target.value)}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">SUBJECT</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">LETTER BODY</label>
                <textarea
                  rows={10}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <button
                type="button"
                onClick={downloadPdf}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff] px-10 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_15px_30px_rgba(255,95,145,0.35)] transition hover:shadow-[0_25px_45px_rgba(123,91,255,0.35)]"
              >
                Download Letterhead PDF
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
