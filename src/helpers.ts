export function fmtDate(s: string): string {
  if (!s) return '';
  const [y, m, d] = s.split('-');
  return `${d}/${m}/${y}`;
}

export function maskId(id: string): string {
  if (!id || id.length < 4) return id;
  return '●●●●' + id.slice(-4);
}

export function isExpired(dateStr: string): boolean {
  return !!dateStr && new Date(dateStr) < new Date();
}

export function receiptId(): string {
  return 'IR-' + Date.now().toString(36).toUpperCase() + '-' +
    Math.random().toString(36).substring(2, 6).toUpperCase();
}
