/**
 * Escape a value for CSV format.
 * Wraps in double quotes if value contains commas, quotes, or newlines.
 */
function escapeCSV(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Export data as a CSV file download.
 *
 * @param {Array<Object>} rows - Array of data objects
 * @param {Array<{key: string, label: string}>} columns - Column definitions with key and header label
 * @param {string} filename - Name for the downloaded file (without extension)
 * @param {Function} [formatter] - Optional function(row, colKey) to format values
 */
export function exportToCSV(rows, columns, filename, formatter) {
  if (!rows || rows.length === 0) return;

  // Build header row
  const headerRow = columns.map(col => escapeCSV(col.label)).join(',');

  // Build data rows
  const dataRows = rows.map(row =>
    columns.map(col => {
      const value = formatter ? formatter(row, col.key) : row[col.key];
      return escapeCSV(value);
    }).join(',')
  );

  const csvContent = [headerRow, ...dataRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
