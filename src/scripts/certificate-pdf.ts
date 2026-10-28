// Builds the certificate PDF in the browser. jsPDF is loaded only when someone clicks "Download PDF".
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

async function loadLogo(): Promise<string | null> {
  try {
    const res = await fetch('/logo.png');
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

export async function downloadCertificate(c: CertData) {
  const [{ jsPDF }, logo] = await Promise.all([import('jspdf'), loadLogo()]);
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = 297, H = 210;
  const violet: [number, number, number] = [139, 140, 255];
  const dark: [number, number, number] = [7, 7, 12];
  const date = new Date(c.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Dhaka' });
  const verifyUrl = `${location.origin}/verify/${c.id}`;

  doc.setFillColor(...dark);
  doc.rect(0, 0, W, H, 'F');
  doc.setDrawColor(...violet);
  doc.setLineWidth(0.8);
  doc.rect(10, 10, W - 20, H - 20);
  doc.setLineWidth(0.2);
  doc.rect(13, 13, W - 26, H - 26);

  let x = 26;
  if (logo) {
    try {
      doc.addImage(logo, 'PNG', 24, 22, 14, 14);
      x = 42;
    } catch {}
  }
  doc.setTextColor(236, 236, 244);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('NARQIX', x, 31);
  doc.setTextColor(...violet);
  doc.text('ACADEMY', x + doc.getTextWidth('NARQIX '), 31);

  doc.setTextColor(163, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Certificate ID  ${c.id}`, W - 26, 31, { align: 'right' });

  doc.setFontSize(12);
  doc.text('This certifies that', W / 2, 68, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.text(c.name, W / 2, 86, { align: 'center', maxWidth: W - 60 });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(163, 163, 184);
  doc.text('has passed the Narqix Academy Foundation Exam and Track Exam and is', W / 2, 100, { align: 'center' });
  doc.setTextColor(...violet);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(21);
  doc.text(c.title, W / 2, 116, { align: 'center', maxWidth: W - 50 });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(236, 236, 244);
  const cols = [
    ['Foundation Exam', c.foundationScore],
    [`${c.trackTitle} Track Exam`, c.trackScore],
    ['Issued', date],
  ];
  cols.forEach(([label, value], i) => {
    const cx = W / 2 + (i - 1) * 78;
    doc.setTextColor(163, 163, 184);
    doc.setFontSize(9);
    doc.text(label.toUpperCase(), cx, 140, { align: 'center' });
    doc.setTextColor(236, 236, 244);
    doc.setFontSize(13);
    doc.text(value, cx, 148, { align: 'center' });
  });

  doc.setDrawColor(38, 38, 54);
  doc.line(30, 162, W - 30, 162);
  doc.setFontSize(9);
  doc.setTextColor(163, 163, 184);
  doc.text(`Verify this certificate at ${verifyUrl}`, W / 2, 171, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(110, 110, 134);
  doc.text('Pre-certification covers the written Foundation and Track exams. Role-play and live certification are completed after hiring.', W / 2, 179, { align: 'center', maxWidth: W - 60 });
  doc.text('© Narqix Academy', W / 2, 186, { align: 'center' });
  if (c.status !== 'valid') {
    doc.setTextColor(255, 90, 74);
    doc.setFontSize(28);
    doc.text('REVOKED', W / 2, 56, { align: 'center' });
  }
  doc.save(`Narqix-Academy-${c.id}.pdf`);
}
