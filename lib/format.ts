/**
 * Format time from minutes to human-readable string
 * @param minutes - Total minutes
 * @returns Formatted string (e.g., "2h 30m", "45m", "3h")
 */
export function formatTime(minutes: number): string {
  if (minutes === 0) return '0m'
  
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}
