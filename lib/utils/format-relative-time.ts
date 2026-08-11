const UNITS: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
  { unit: 'year', ms: 365 * 24 * 60 * 60 * 1000 },
  { unit: 'month', ms: 30 * 24 * 60 * 60 * 1000 },
  { unit: 'week', ms: 7 * 24 * 60 * 60 * 1000 },
  { unit: 'day', ms: 24 * 60 * 60 * 1000 },
  { unit: 'hour', ms: 60 * 60 * 1000 },
  { unit: 'minute', ms: 60 * 1000 },
]

const rtf = new Intl.RelativeTimeFormat('id', { numeric: 'auto' })

export function formatRelativeTime(dateString: string): string {
  const elapsed = new Date(dateString).getTime() - Date.now()

  for (const { unit, ms } of UNITS) {
    if (Math.abs(elapsed) >= ms) {
      return rtf.format(Math.round(elapsed / ms), unit)
    }
  }

  return 'baru saja'
}
