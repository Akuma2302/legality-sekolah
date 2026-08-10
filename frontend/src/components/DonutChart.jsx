const SIZE = 180;
const THICKNESS = 26;
const RADIUS = (SIZE - THICKNESS) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 6; // px gap between segments, purely visual

export default function DonutChart({ segments, centerLabel, centerValue, activeLabel, onSegmentClick }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const clickable = typeof onSegmentClick === 'function';

  let cumulative = 0;
  const arcs = segments
    .filter((s) => s.value > 0)
    .map((s) => {
      const fraction = total > 0 ? s.value / total : 0;
      const length = Math.max(fraction * CIRCUMFERENCE - GAP, 0);
      const offset = -(cumulative / total) * CIRCUMFERENCE;
      cumulative += s.value;
      return { ...s, length, offset, fraction };
    });

  const isDimmed = (label) => clickable && activeLabel && activeLabel !== label;

  return (
    <div className="flex items-center gap-6 flex-wrap">
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
          <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="#1e293b" strokeWidth={THICKNESS} opacity={total === 0 ? 1 : 0.15} />
          {arcs.map((a) => (
            <circle
              key={a.label}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={a.color}
              strokeWidth={THICKNESS}
              strokeDasharray={`${a.length} ${CIRCUMFERENCE - a.length}`}
              strokeDashoffset={a.offset}
              strokeLinecap="round"
              opacity={isDimmed(a.label) ? 0.3 : 1}
              onClick={clickable ? () => onSegmentClick(a.label) : undefined}
              className={clickable ? 'cursor-pointer transition-opacity' : 'transition-opacity'}
            >
              <title>{a.label}</title>
            </circle>
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-display font-semibold text-navy-900">{centerValue}</span>
          <span className="text-xs text-slate-400">{centerLabel}</span>
        </div>
      </div>

      <ul className="space-y-1 min-w-[220px]">
        {segments.map((s) => {
          const active = activeLabel === s.label;
          const Row = clickable ? 'button' : 'div';
          return (
            <li key={s.label}>
              <Row
                onClick={clickable ? () => onSegmentClick(s.label) : undefined}
                className={`w-full flex items-center gap-2 text-sm rounded-lg px-2 py-1.5 -mx-2 transition-colors ${
                  clickable ? 'hover:bg-slate-50 cursor-pointer' : ''
                } ${active ? 'bg-accent-50' : ''} ${isDimmed(s.label) ? 'opacity-50' : ''}`}
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <span className={`flex-1 truncate text-left ${active ? 'text-accent-600 font-medium' : 'text-slate-600'}`}>
                  {s.label}
                </span>
                <span className="text-slate-400 text-xs">{total > 0 ? Math.round((s.value / total) * 100) : 0}%</span>
                <span className="font-medium text-navy-900 w-6 text-right">{s.value}</span>
              </Row>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
