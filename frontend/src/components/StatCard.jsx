const COLOR_STYLES = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  purple: 'bg-purple-50 text-purple-600',
};

export default function StatCard({ icon, label, value, sublabel, color = 'blue' }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${COLOR_STYLES[color] || COLOR_STYLES.blue}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-display font-semibold text-navy-900 mt-0.5">{value}</p>
        {sublabel && <p className="text-xs text-slate-400 mt-0.5">{sublabel}</p>}
      </div>
    </div>
  );
}
