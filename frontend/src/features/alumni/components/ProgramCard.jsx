import { ALUMNI_STATUS_STYLES, NOT_STARTED_STYLE } from '../../../utils/constants';

const AVATAR_COLORS = ['bg-navy-800', 'bg-blue-600', 'bg-purple-600', 'bg-emerald-600', 'bg-amber-600'];

export default function ProgramCard({ alumnus, onOpen }) {
  const avatarColor = AVATAR_COLORS[hashToIndex(alumnus.id, AVATAR_COLORS.length)];
  const statusStyle = alumnus.status ? ALUMNI_STATUS_STYLES[alumnus.status] : NOT_STARTED_STYLE;

  return (
    <button
      onClick={() => onOpen(alumnus)}
      className="text-left bg-white rounded-2xl border border-slate-200 p-5 hover:border-accent-400 hover:shadow-md transition-all flex flex-col"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-9 h-9 rounded-lg ${avatarColor} text-white flex items-center justify-center font-display font-semibold text-sm shrink-0`}>
            {alumnus.school_name?.[0]?.toUpperCase() || '?'}
          </div>
          <p className="font-display font-semibold text-navy-900 leading-tight truncate">{alumnus.school_name}</p>
        </div>
        <span className={`shrink-0 text-xs font-medium rounded-full px-2.5 py-1 border ${statusStyle}`}>
          {alumnus.status || 'Not started'}
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-2">
        {[alumnus.state, alumnus.branch].filter(Boolean).join(' · ') || 'Location not set'}
      </p>

      <p className="text-sm text-slate-600 line-clamp-2 flex-1 mb-3">
        {alumnus.program_propose || alumnus.note || 'No program details added yet.'}
      </p>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
        <span className="flex items-center gap-1.5">
          <PersonIcon /> {alumnus.pic_name}
        </span>
        <span>{formatShortDate(alumnus.created_at)}</span>
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
