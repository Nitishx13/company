'use client';

import { useState } from 'react';

export default function LetterheadGeneratorPage() {
  const [content, setContent] = useState('');

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
    const muted = rgb(0.72, 0.74, 0.78);
    const soft = rgb(0.86, 0.88, 0.9);

    const accentPurple = rgb(0.48, 0.36, 1);
    const accentPink = rgb(1, 0.37, 0.57);
    const accentCyan = rgb(0.0, 0.71, 1);

    page.drawRectangle({ x: 0, y: 0, width, height, color: bg });

    // Header bars (same style as proposal/capabilities)
    page.drawRectangle({ x: 0, y: height - 14, width: width * 0.52, height: 14, color: accentPurple });
    page.drawRectangle({ x: width * 0.52, y: height - 14, width: width * 0.30, height: 14, color: accentPink });
    page.drawRectangle({ x: width * 0.82, y: height - 14, width: width * 0.18, height: 14, color: accentCyan });

    const marginX = 54;
    const boxX = marginX;
    const boxW = width - marginX * 2;

    // Header labels
    const headerLabelY = height - 70;
    page.drawText(pdfSafe('PINAQYN TECH'), { x: boxX, y: headerLabelY, size: 10, font: fontBold, color: muted });

    // Divider line below header labels
    const dividerY = height - 96;
    page.drawRectangle({ x: boxX, y: dividerY, width: boxW, height: 1, color: rgb(0.2, 0.22, 0.26) });

    // Footer contact strip
    const footerH = 62;
    const footerY = 70;
    page.drawRectangle({ x: boxX, y: footerY, width: boxW, height: footerH, color: rgb(0.06, 0.07, 0.09) });
    page.drawRectangle({ x: boxX, y: footerY + footerH - 4, width: boxW, height: 4, color: accentCyan });
    page.drawText(pdfSafe('CONTACT'), { x: boxX + 18, y: footerY + 38, size: 10, font: fontBold, color: muted });
    page.drawText(pdfSafe('pinaqyn@gmail.com'), { x: boxX + 18, y: footerY + 18, size: 14, font: fontBold, color: soft });
    page.drawText(pdfSafe('+91 8882816805 (WhatsApp)'), {
      x: boxX + 300,
      y: footerY + 18,
      size: 14,
      font: fontBold,
      color: soft,
    });

    // Footer note
    page.drawText(pdfSafe('Generated from pinaqyn.tech/letterhead'), {
      x: boxX,
      y: 34,
      size: 9,
      font: fontRegular,
      color: muted,
    });

    // Content box placed between header divider and footer
    const boxTopY = dividerY - 22;
    const boxY = footerY + footerH + 18;
    const boxH = Math.max(220, boxTopY - boxY);

    // One single big box
    page.drawRectangle({ x: boxX, y: boxY, width: boxW, height: boxH, color: rgb(0.07, 0.08, 0.10) });
    page.drawRectangle({ x: boxX, y: boxY + boxH - 6, width: boxW, height: 6, color: accentPurple });

    // Draw typed content inside the box
    const textInset = 22;
    const fontSize = 12;
    const leading = 16;
    const maxWidth = boxW - textInset * 2;
    const topTextY = boxY + boxH - 34;
    const bottomPadding = boxY + 18;

    const paragraphs = pdfSafe(content).split('\n');
    let cursorY = topTextY;
    for (const para of paragraphs) {
      if (cursorY <= bottomPadding) break;
      if (para.trim() === '') {
        cursorY -= leading;
        continue;
      }
      const lines = wrapText(para, fontRegular, fontSize, maxWidth);
      for (const ln of lines) {
        if (cursorY <= bottomPadding) break;
        page.drawText(ln, { x: boxX + textInset, y: cursorY, size: fontSize, font: fontRegular, color: soft });
        cursorY -= leading;
      }
      cursorY -= 6;
    }

    const pdfBytes = await doc.save();
    const pdfBytesCopy = Uint8Array.from(pdfBytes);
    const blob = new Blob([pdfBytesCopy.buffer as ArrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'Letterhead.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <div className="text-white/90 text-xl font-bold">PINAQYN TECH</div>
          <div className="mt-3 h-px w-full bg-white/15" />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write here..."
          className="w-full min-h-[70vh] rounded-2xl border border-white/15 bg-black text-white/90 px-6 py-6 text-sm leading-relaxed focus:outline-none focus:border-white/40"
        />

        <button
          type="button"
          onClick={downloadPdf}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff] px-10 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_15px_30px_rgba(255,95,145,0.35)] transition hover:shadow-[0_25px_45px_rgba(123,91,255,0.35)]"
        >
          Download Letterhead PDF
        </button>
      </div>
    </main>
  );
}
