const SIZE = 180;
const THICKNESS = 26;
const RADIUS = (SIZE - THICKNESS) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 6; // px gap between segments, purely visual

export default function DonutChart({ segments, centerLabel, centerValue }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

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
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-display font-semibold text-navy-900">{centerValue}</span>
          <span className="text-xs text-slate-400">{centerLabel}</span>
        </div>
      </div>

      <ul className="space-y-2 min-w-[200px]">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-sm">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-slate-600 flex-1 truncate">{s.label}</span>
            <span className="text-slate-400 text-xs">{total > 0 ? Math.round((s.value / total) * 100) : 0}%</span>
            <span className="font-medium text-navy-900 w-6 text-right">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
