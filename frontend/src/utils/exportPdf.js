import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates and downloads a simple PDF: a title, an optional subtitle, and a table.
 * @param {string} filename - e.g. "alumni-done-messaging-teacher.pdf"
 * @param {string} title - main heading, e.g. the status name
 * @param {string} subtitle - smaller line under the title, e.g. "12 alumni · Generated 10 Aug 2026"
 * @param {string[]} headers - column headers
 * @param {Array<Array<string|number>>} rows - one array per row, matching headers order
 */
export function downloadPdf(filename, title, subtitle, headers, rows) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(title, 40, 48);

  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(subtitle, 40, 66);
    doc.setTextColor(0);
  }

  autoTable(doc, {
    startY: subtitle ? 82 : 64,
    head: [headers],
    body: rows,
    margin: { left: 40, right: 40 },
    styles: { fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: [21, 44, 92] }, // navy-800, matches the app's theme
    alternateRowStyles: { fillColor: [248, 250, 252] }, // slate-50
  });

  doc.save(filename);
}
