// Builds the certificate PDF in the browser. jsPDF is loaded only when someone clicks "Download PDF".
// renderCertificate is also used by scripts/preview-certificate.mjs to make a sample without a browser.
import type { jsPDF as JsPDF } from 'jspdf';

export interface CertData {
  id: string;
  name: string;
  trackTitle: string;
  title: string;
  issuedAt: number;
  foundationScore: string;
  trackScore: string;
  status: string;
}

type RGB = [number, number, number];
const INK: RGB = [10, 10, 10];
const VIOLET: RGB = [139, 140, 255];
const ORANGE: RGB = [255, 122, 61];
const WHITE: RGB = [245, 245, 250];
const MUTED: RGB = [160, 160, 180];
const FAINT: RGB = [96, 96, 116];
const MARK_RATIO = 545 / 640; // width / height of public/logo-mark.png

async function loadMark(): Promise<string | null> {
  try {
    const res = await fetch('/logo-mark.png');
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/** Draws the certificate (A4 landscape). `mark` is the logo as a PNG data URL. */
export function renderCertificate(JsPDFClass: typeof JsPDF, c: CertData, opts: { mark: string | null; origin: string }): JsPDF {
  const doc = new JsPDFClass({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = 297, H = 210, cx = W / 2;
  const date = new Date(c.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Dhaka' });
  const verifyUrl = `${opts.origin.replace(/\/$/, '')}/verify/${c.id}`;
  // getTextWidth ignores letter spacing, so spaced-out text is centred by hand.
  const spacedWidth = (text: string, space: number) => doc.getTextWidth(text) + space * (text.length - 1);
  const spaced = (text: string, x: number, y: number, space: number) => {
    doc.setCharSpace(space);
    doc.text(text, x - spacedWidth(text, space) / 2, y);
    doc.setCharSpace(0);
  };

  // Background and frame.
  doc.setFillColor(...INK);
  doc.rect(0, 0, W, H, 'F');
  doc.setDrawColor(...VIOLET);
  doc.setLineWidth(0.9);
  doc.rect(8, 8, W - 16, H - 16);
  doc.setLineWidth(0.25);
  doc.rect(11.5, 11.5, W - 23, H - 23);
  // Orange corner accents.
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(0.9);
  for (const [x, y, dx, dy] of [[8, 8, 1, 1], [W - 8, 8, -1, 1], [8, H - 8, 1, -1], [W - 8, H - 8, -1, -1]] as const) {
    doc.line(x, y, x + 16 * dx, y);
    doc.line(x, y, x, y + 16 * dy);
  }

  // Big logo.
  const markH = 45;
  if (opts.mark) {
    try {
      doc.addImage(opts.mark, 'PNG', cx - (markH * MARK_RATIO) / 2, 15, markH * MARK_RATIO, markH, undefined, 'SLOW');
    } catch {}
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  const brandA = 'NARQIX ', brandB = 'ACADEMY';
  const wA = spacedWidth(brandA, 2.2) + 2.2, wB = spacedWidth(brandB, 2.2);
  const bx = cx - (wA + wB) / 2;
  doc.setCharSpace(2.2);
  doc.setTextColor(...WHITE);
  doc.text(brandA, bx, 68);
  doc.setTextColor(...VIOLET);
  doc.text(brandB, bx + wA, 68);
  doc.setCharSpace(0);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...ORANGE);
  spaced('CERTIFICATE OF PRE-CERTIFICATION', cx, 76.5, 1.4);

  doc.setFontSize(11.5);
  doc.setTextColor(...MUTED);
  doc.text('This certifies that', cx, 88, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  let size = 34;
  doc.setFontSize(size);
  while (doc.getTextWidth(c.name) > W - 70 && size > 20) doc.setFontSize((size -= 1));
  doc.text(c.name, cx, 103, { align: 'center' });
  doc.setDrawColor(...VIOLET);
  doc.setLineWidth(0.35);
  doc.line(cx - 55, 108, cx + 55, 108);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11.5);
  doc.setTextColor(...MUTED);
  doc.text(`has passed the Narqix Academy Foundation Exam and the ${c.trackTitle} Track Exam and is`, cx, 117, { align: 'center', maxWidth: W - 60 });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(...VIOLET);
  doc.text(c.title, cx, 129, { align: 'center', maxWidth: W - 50 });

  // Scores.
  const cols: [string, string][] = [
    ['FOUNDATION EXAM', c.foundationScore],
    [`${c.trackTitle.toUpperCase()} TRACK EXAM`, c.trackScore],
    ['ISSUED', date],
  ];
  cols.forEach(([label, value], i) => {
    const x = cx + (i - 1) * 70;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...FAINT);
    doc.text(label, x, 143, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(...WHITE);
    doc.text(value, x, 150, { align: 'center' });
  });

  // Signatures.
  const sig = (x: number, name: string) => {
    doc.setDrawColor(...FAINT);
    doc.setLineWidth(0.3);
    doc.line(x - 32, 172, x + 32, 172);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...WHITE);
    doc.text(name, x, 178, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);
    doc.text('Co-Founder & CEO, Narqix', x, 183, { align: 'center' });
  };
  sig(62, 'Afreed K.');
  sig(W - 62, 'Ayman Sharif');

  // Certificate ID and verification, between the signatures.
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...FAINT);
  doc.text('CERTIFICATE ID', cx, 170, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...WHITE);
  doc.text(c.id, cx, 177, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...VIOLET);
  doc.text(verifyUrl.replace(/^https?:\/\//, ''), cx, 183, { align: 'center' });

  doc.setFontSize(7);
  doc.setTextColor(...FAINT);
  doc.text('Pre-certification covers the written Foundation and Track exams. Role-play and live certification are completed after hiring.  © Narqix Academy', cx, 194, { align: 'center', maxWidth: W - 40 });

  if (c.status !== 'valid') {
    doc.setTextColor(255, 90, 74);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.text('REVOKED', cx, 92, { align: 'center', angle: 0 });
  }
  return doc;
}

export async function downloadCertificate(c: CertData) {
  const [{ jsPDF }, mark] = await Promise.all([import('jspdf'), loadMark()]);
  renderCertificate(jsPDF, c, { mark, origin: location.origin }).save(`Narqix-Academy-${c.id}.pdf`);
}
