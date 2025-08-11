// backend/services/cert.ts
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

export async function generateCertificatePdf(userIdentifier: string, level: string) {
  // Out dir (absolute)
  const outDir = path.join(process.cwd(), process.env.PDF_STORAGE_PATH || 'storage/certs');
  fs.mkdirSync(outDir, { recursive: true });

  const filename = `cert_${userIdentifier}_${Date.now()}.pdf`;
  const filepath = path.join(outDir, filename);

  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, left: 50, right: 50, bottom: 50 }
  });

  const stream = fs.createWriteStream(filepath);
  doc.pipe(stream);

  // ------- Certificate layout -------
  // Background rectangle
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff');
  doc.fillColor('#111827');

  // Title
  doc.fontSize(28).fill('#111827').text('Test_School Professional Certificate', {
    align: 'center',
  });

  doc.moveDown(1.5);

  // Level badge
  doc.fontSize(18).fill('#4f46e5').text(level, {
    align: 'center',
  });

  doc.moveDown(1.2);

  // Recipient
  doc.fontSize(20).fill('#111827').text(`Awarded to: ${userIdentifier}`, {
    align: 'center',
  });

  doc.moveDown(0.8);

  // Issued date
  doc.fontSize(12).fill('#374151').text(`Issued: ${new Date().toLocaleString()}`, {
    align: 'center',
  });

  doc.moveDown(2);

  // Footer / signature line
  const sigX = doc.page.width / 2 - 150;
  const sigY = doc.y + 40;
  doc.moveTo(sigX, sigY).lineTo(sigX + 300, sigY).stroke('#9CA3AF');
  doc.fontSize(12).fill('#6B7280').text('Authorized by TONNI School', sigX, sigY + 8, {
    width: 300,
    align: 'center',
  });

  doc.end();

  // Wait for write stream to finish
  await new Promise<void>((resolve, reject) => {
    stream.on('finish', () => resolve());
    stream.on('error', (err) => reject(err));
  });

  // Return public path
  const publicPath = `/certs/${filename}`;
  return publicPath;
}
