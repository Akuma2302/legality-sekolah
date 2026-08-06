import { ALUMNI_STATUS_STYLES, NOT_STARTED_STYLE } from '../../../utils/constants';

const AVATAR_COLORS = ['bg-navy-800', 'bg-blue-600', 'bg-purple-600', 'bg-emerald-600', 'bg-amber-600'];

export default function AdminAlumniCard({ alumnus, onOpen }) {
  const avatarColor = AVATAR_COLORS[hashToIndex(alumnus.id, AVATAR_COLORS.length)];
  const statusStyle = alumnus.status ? ALUMNI_STATUS_STYLES[alumnus.status] : NOT_STARTED_STYLE;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col hover:shadow-md hover:border-accent-300 transition-all">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`w-9 h-9 rounded-lg ${avatarColor} text-white flex items-center justify-center font-display font-semibold text-sm shrink-0`}>
            {alumnus.pic_name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <p className="font-display font-semibold text-navy-900 leading-tight truncate">{alumnus.pic_name}</p>
            <p className="text-sm text-slate-500 truncate">{alumnus.school_name}</p>
          </div>
        </div>
        <span className={`shrink-0 text-xs font-medium rounded-full px-2.5 py-1 border ${statusStyle}`}>
          {alumnus.status || 'Not started'}
        </span>
      </div>

      <div className="space-y-1.5 text-sm text-slate-500 mb-4 flex-1">
        <div className="flex items-center gap-1.5">
          <LocationIcon /> {alumnus.state || '—'}
          <span className="text-slate-300">·</span>
          <BranchIcon /> {alumnus.branch || '—'}
        </div>
        {alumnus.school_type && (
          <div className="flex items-center gap-1.5">
            <SchoolIcon /> {alumnus.school_type}
          </div>
        )}
        {alumnus.program_propose && (
          <p className="text-slate-500 line-clamp-1">{alumnus.program_propose}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onOpen(alumnus)}
          className="flex-1 text-sm font-medium border border-slate-200 rounded-lg py-1.5 hover:bg-slate-50 transition-colors"
        >
          View
        </button>
        <button
          onClick={() => onOpen(alumnus)}
          className="flex-1 text-sm font-medium border border-slate-200 rounded-lg py-1.5 hover:bg-slate-50 transition-colors"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

function hashToIndex(str, mod) {
  let h = 0;
  for (const c of str || '') h = (h * 31 + c.charCodeAt(0)) % mod;
  return Math.abs(h) % mod;
}

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
function BranchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 9l9-6 9 6-9 6-9-6z" />
      <path d="M3 9v6l9 6 9-6V9" />
    </svg>
  );
}
function SchoolIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 21V9l8-5 8 5v12" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}
