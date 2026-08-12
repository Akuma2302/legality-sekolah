function pad(n) {
  return String(n).padStart(2, '0');
}

/** Local YYYY-MM-DD key for a Date — deliberately NOT toISOString(), which converts to UTC and
 * shifts the calendar day for any timezone ahead of UTC (including Malaysia, UTC+8). */
function localDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Reverses localDateKey — constructs a local-midnight Date from a YYYY-MM-DD key.
 * Deliberately NOT `new Date(key)`, which the spec requires browsers to parse as UTC midnight. */
function parseLocalDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Returns { start, end } for the Sunday–Saturday week containing `date`, entirely in local time. */
function getWeekRange(date) {
  const d = new Date(date);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay());
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6, 23, 59, 59, 999);
  return { start, end };
}

/** e.g. "3 – 9 Aug 2026", or "28 Jul – 3 Aug 2026" when the week spans two months. */
function formatWeekLabel(start, end) {
  const sameMonth = start.getMonth() === end.getMonth();
  const startStr = start.toLocaleDateString('en-MY', { day: 'numeric', month: sameMonth ? undefined : 'short' });
  const endStr = end.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${startStr} – ${endStr}`;
}

/**
 * Builds the list of week options for a dropdown: a rolling window from
 * `pastWeeks` weeks ago through `futureWeeks` weeks ahead of today (always
 * shown, even if empty), unioned with any week that actually has an entry
 * (so older data further back than the window is never hidden). Newest first.
 *
 * The window is computed from `new Date()` at call time, so it automatically
 * slides forward every week without any code change — "next week" today
 * becomes "this week" next week, on its own.
 */
export function buildWeekOptions(entries, dateField = 'created_at', { pastWeeks = 8, futureWeeks = 1 } = {}) {
  const weeks = new Map();

  const addWeekFor = (date) => {
    const { start, end } = getWeekRange(date);
    const key = localDateKey(start);
    if (!weeks.has(key)) weeks.set(key, { key, start, end, label: formatWeekLabel(start, end) });
    return key;
  };

  const today = new Date();
  const currentWeekKey = addWeekFor(today);
  const { start: currentStart } = getWeekRange(today);

  let nextWeekKey = currentWeekKey;
  for (let i = -pastWeeks; i <= futureWeeks; i++) {
    const weekStart = new Date(currentStart.getFullYear(), currentStart.getMonth(), currentStart.getDate() + i * 7);
    const key = addWeekFor(weekStart);
    if (i === 1) nextWeekKey = key;
  }

  // Union in any week with a real entry, even if it's older than the rolling window covers
  for (const entry of entries) {
    if (entry[dateField]) addWeekFor(new Date(entry[dateField]));
  }

  const options = [...weeks.values()].sort((a, b) => b.start - a.start);
  return { options, currentWeekKey, nextWeekKey };
}

/** True if `date` falls within the week identified by `key` (that week's local Sunday, YYYY-MM-DD). */
export function isInWeek(date, key) {
  if (!date) return false;
  const { start, end } = getWeekRange(parseLocalDateKey(key));
  const d = new Date(date);
  return d >= start && d <= end;
}

/** True if `date` falls within the current (this week's) Sunday–Saturday range. */
export function isThisWeek(date) {
  if (!date) return false;
  const { start, end } = getWeekRange(new Date());
  const d = new Date(date);
  return d >= start && d <= end;
}
