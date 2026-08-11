const DAY_MS = 24 * 60 * 60 * 1000;

/** Returns { start, end } for the Sunday–Saturday week containing `date` (start = Sun 00:00, end = Sat 23:59:59.999). */
function getWeekRange(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const start = new Date(d.getTime() - d.getDay() * DAY_MS);
  const end = new Date(start.getTime() + 6 * DAY_MS);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

/** Stable key for a week, based on its Sunday date (YYYY-MM-DD). */
function weekKey(start) {
  return start.toISOString().slice(0, 10);
}

/** e.g. "3 – 9 Aug 2026", or "28 Jul – 3 Aug 2026" when the week spans two months. */
function formatWeekLabel(start, end) {
  const sameMonth = start.getMonth() === end.getMonth();
  const startStr = start.toLocaleDateString('en-MY', { day: 'numeric', month: sameMonth ? undefined : 'short' });
  const endStr = end.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${startStr} – ${endStr}`;
}

/**
 * Builds the list of week options for a dropdown: every week that actually has
 * an entry, plus the current week (even if empty), newest first.
 */
export function buildWeekOptions(entries, dateField = 'created_at') {
  const weeks = new Map();

  const addWeekFor = (date) => {
    const { start, end } = getWeekRange(date);
    const key = weekKey(start);
    if (!weeks.has(key)) weeks.set(key, { key, start, end, label: formatWeekLabel(start, end) });
    return key;
  };

  const currentWeekKey = addWeekFor(new Date());
  for (const entry of entries) {
    if (entry[dateField]) addWeekFor(entry[dateField]);
  }

  const options = [...weeks.values()].sort((a, b) => b.start - a.start);
  return { options, currentWeekKey };
}

/** True if `date` falls within the week identified by `key` (that week's Sunday, YYYY-MM-DD). */
export function isInWeek(date, key) {
  if (!date) return false;
  const { start, end } = getWeekRange(new Date(key));
  const d = new Date(date);
  return d >= start && d <= end;
}
