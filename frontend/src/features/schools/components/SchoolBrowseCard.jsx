const AVATAR_COLORS = ['bg-navy-800', 'bg-blue-600', 'bg-purple-600', 'bg-emerald-600', 'bg-amber-600'];

export default function SchoolBrowseCard({ school, onOpen }) {
  const avatarColor = AVATAR_COLORS[hashToIndex(school.id, AVATAR_COLORS.length)];

  return (
    <button
      onClick={() => onOpen(school)}
      className="text-left bg-white rounded-2xl border border-slate-200 p-5 hover:border-accent-400 hover:shadow-md transition-all flex flex-col"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-9 h-9 rounded-lg ${avatarColor} text-white flex items-center justify-center font-display font-semibold text-sm shrink-0`}>
            {school.school_name?.[0]?.toUpperCase() || '?'}
          </div>
          <p className="font-display font-semibold text-navy-900 leading-tight truncate">{school.school_name}</p>
        </div>
        <span className="shrink-0 text-xs font-medium rounded-full px-2.5 py-1 border bg-slate-50 text-slate-600 border-slate-200">
          Type {school.type}
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-2">
        {[school.state, school.branch].filter(Boolean).join(' · ') || 'Location not set'}
      </p>

      <p className="text-sm text-slate-600 line-clamp-2 flex-1 mb-3">
        {school.note || 'No additional notes added yet.'}
      </p>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
        <span className="flex items-center gap-1.5">
          <PersonIcon /> {school.pic_name}
        </span>
        <span>{formatShortDate(school.created_at)}</span>
      </div>
    </button>
  );
}

function hashToIndex(str, mod) {
  let h = 0;
  for (const c of str || '') h = (h * 31 + c.charCodeAt(0)) % mod;
  return Math.abs(h) % mod;
}

function formatShortDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
}

function PersonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}
