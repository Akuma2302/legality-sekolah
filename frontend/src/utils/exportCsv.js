/** Escapes a single CSV field per RFC 4180 (wraps in quotes if it contains a comma, quote, or newline). */
function escapeCsvField(value) {
  const str = String(value ?? '');
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Triggers a browser download of a CSV file.
 * @param {string} filename - e.g. "alumni-done-messaging-teacher.csv"
 * @param {string[]} headers - column headers
 * @param {Array<Array<string|number>>} rows - one array per row, matching headers order
 */
export function downloadCsv(filename, headers, rows) {
  const lines = [headers, ...rows].map((row) => row.map(escapeCsvField).join(','));
  const csvContent = lines.join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Turns a label like "Done messaging teacher" into a safe filename segment like "done-messaging-teacher". */
export function slugify(label) {
  return String(label)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
