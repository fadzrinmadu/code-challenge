export function formatAmount(value: number): string {
  if (!Number.isFinite(value)) return ''
  if (value === 0) return '0'
  const abs = Math.abs(value)
  const digits = abs >= 1 ? 6 : abs >= 0.0001 ? 8 : 10
  return value
    .toFixed(digits)
    .replace(/0+$/, '')
    .replace(/\.$/, '')
}

export function formatUsd(value: number): string {
  if (!Number.isFinite(value)) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: value < 1 ? 4 : 2,
  }).format(value)
}

export function formatBalance(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
  }).format(value)
}
