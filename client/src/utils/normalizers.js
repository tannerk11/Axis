// Normalize year values to consistent format
export const normalizeYear = (year) => {
  if (!year) return '-';
  const y = year.toLowerCase().trim().replace('.', '');
  if (y === 'fr' || y === 'freshman') return 'Fr';
  if (y === 'so' || y === 'sophomore') return 'So';
  if (y === 'jr' || y === 'junior') return 'Jr';
  if (y === 'sr' || y === 'senior') return 'Sr';
  if (y === 'gr' || y === 'grad' || y === 'grad senior' || y === 'graduate') return 'Gr';
  if (y.includes('r-') || y.includes('rs ') || y.includes('redshirt')) return 'RS';
  return year;
};

// Normalize position values to consistent format
export const normalizePosition = (pos) => {
  if (!pos) return '-';
  const p = pos.toLowerCase().trim();
  if (p === 'guard' || p === 'g') return 'G';
  if (p === 'forward' || p === 'f') return 'F';
  if (p === 'center' || p === 'c') return 'C';
  if (p === 'point guard' || p === 'pg') return 'PG';
  if (p === 'shooting guard' || p === 'sg') return 'SG';
  if (p === 'small forward' || p === 'sf') return 'SF';
  if (p === 'power forward' || p === 'pf') return 'PF';
  if (p === 'g/f' || p === 'guard/forward') return 'G/F';
  if (p === 'f/c' || p === 'forward/center') return 'F/C';
  if (p === 'w' || p === 'wing') return 'W';
  return pos.toUpperCase();
};
