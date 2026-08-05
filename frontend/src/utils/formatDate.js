/** Formats an ISO timestamp as "Wednesday, 5 Aug 2026, 14:30" (used for save/creation timestamps). */
export function formatTimestamp(isoString) {
  if (!isoString) return null;
  return new Date(isoString).toLocaleString('en-MY', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
