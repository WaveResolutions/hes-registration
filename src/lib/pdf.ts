import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { WAIVER_TEXT } from '@/constants/waiver';

interface WaiverPdfOptions {
  parentName: string;
  confirmationNumber: string;
  children: Array<{ firstName: string; lastName: string; age: number }>;
  signatureType: 'drawn' | 'typed';
  signatureData: string;
  signedAt: string;
}

export async function generateWaiverPdf(opts: WaiverPdfOptions): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

  const purple = rgb(0.29, 0.063, 0.47);
  const black = rgb(0, 0, 0);
  const gray = rgb(0.4, 0.4, 0.4);

  let currentPage = pdf.addPage([612, 792]);
  let y = 750;
  const margin = 50;
  const width = 612 - margin * 2;

  const wrapText = (text: string, maxWidth: number, size: number, f: typeof font): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let current = '';
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      const w = f.widthOfTextAtSize(test, size);
      if (w > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  };

  const drawText = (text: string, size = 10, isBold = false, color = black, indent = 0) => {
    const f = isBold ? boldFont : font;
    const lines = wrapText(text, width - indent, size, f);
    for (const line of lines) {
      if (y < 80) {
        currentPage = pdf.addPage([612, 792]);
        y = 750;
      }
      currentPage.drawText(line, { x: margin + indent, y, size, font: f, color });
      y -= size + 4;
    }
  };

  // Header
  currentPage.drawRectangle({ x: 0, y: 742, width: 612, height: 50, color: purple });
  currentPage.drawText('HAMRO EVENT SOLUTIONS LLC', { x: margin, y: 768, size: 16, font: boldFont, color: rgb(1, 1, 1) });
  currentPage.drawText('Babysitting Services — Liability Waiver', { x: margin, y: 752, size: 10, font, color: rgb(0.93, 0.88, 0.96) });

  y = 720;
  drawText('BABYSITTING SERVICES — LIABILITY WAIVER & RELEASE OF CLAIMS', 12, true, purple);
  drawText('Saturday, May 30, 2026 | 10:00 AM – 10:00 PM', 10, false, gray);
  y -= 10;

  // Waiver text sections
  const sections = WAIVER_TEXT.split('\n\n');
  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;
    if (trimmed.match(/^\d\./)) {
      y -= 8;
      drawText(trimmed.split('\n')[0], 10, true, purple);
      const rest = trimmed.split('\n').slice(1).join(' ');
      if (rest.trim()) drawText(rest.trim(), 9);
    } else {
      drawText(trimmed, 9);
    }
    y -= 4;
  }

  // Signature section
  y -= 16;
  if (y < 200) {
    currentPage = pdf.addPage([612, 792]);
    y = 750;
  }

  currentPage.drawLine({ start: { x: margin, y }, end: { x: 612 - margin, y }, thickness: 1, color: purple });
  y -= 20;
  drawText('ACKNOWLEDGMENT & SIGNATURE', 12, true, purple);
  y -= 8;

  const childrenText = opts.children.map((c) => `${c.firstName} ${c.lastName} (Age ${c.age})`).join(', ');
  drawText(`Parent/Guardian: ${opts.parentName}`, 10, true);
  drawText(`Children: ${childrenText}`, 10);
  drawText(`Signed: ${new Date(opts.signedAt).toLocaleString()}`, 10);
  drawText(`Confirmation #: ${opts.confirmationNumber}`, 10);
  y -= 16;

  if (opts.signatureType === 'typed') {
    currentPage.drawText(opts.signatureData, {
      x: margin,
      y,
      size: 20,
      font: await pdf.embedFont(StandardFonts.TimesRomanItalic),
      color: black,
    });
    y -= 28;
  } else if (opts.signatureData.startsWith('data:image')) {
    try {
      const base64Data = opts.signatureData.split(',')[1];
      const imgBytes = Buffer.from(base64Data, 'base64');
      const img = await pdf.embedPng(imgBytes);
      const dims = img.scale(0.4);
      if (y - dims.height < 80) {
        currentPage = pdf.addPage([612, 792]);
        y = 750;
      }
      currentPage.drawImage(img, { x: margin, y: y - dims.height, width: dims.width, height: dims.height });
      y -= dims.height + 8;
    } catch {
      drawText('[Signature on file]', 10, false, gray);
    }
  }

  currentPage.drawLine({ start: { x: margin, y }, end: { x: margin + 200, y }, thickness: 1, color: gray });
  y -= 14;
  drawText('Signature', 9, false, gray);

  return pdf.save();
}
