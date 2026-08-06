import { LEGALITY_STATUS_STYLES } from '../../../utils/constants';

const AVATAR_COLORS = ['bg-navy-800', 'bg-blue-600', 'bg-purple-600', 'bg-emerald-600', 'bg-amber-600'];

export default function AdminSchoolCard({ school, onOpen }) {
  const avatarColor = AVATAR_COLORS[hashToIndex(school.id, AVATAR_COLORS.length)];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col hover:shadow-md hover:border-accent-300 transition-all">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`w-9 h-9 rounded-lg ${avatarColor} text-white flex items-center justify-center font-display font-semibold text-sm shrink-0`}>
            {school.school_name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <p className="font-display font-semibold text-navy-900 leading-tight truncate">{school.school_name}</p>
            <p className="text-sm text-slate-500 truncate">{school.pic_name}</p>
          </div>
        </div>
        <span className={`shrink-0 text-xs font-medium rounded-full px-2.5 py-1 border ${LEGALITY_STATUS_STYLES[school.legality_status] || ''}`}>
          {school.legality_status}
        </span>
      </div>

      <div className="space-y-1.5 text-sm text-slate-500 mb-4 flex-1">
        <div className="flex items-center gap-1.5">
          <LocationIcon /> {school.state || '—'}
          <span className="text-slate-300">·</span>
          <BranchIcon /> {school.branch || '—'}
        </div>
        {(school.email || school.contact_number) && (
          <div className="flex items-center gap-1.5 truncate">
            <ContactIcon /> {school.email || school.contact_number}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onOpen(school)}
          className="flex-1 text-sm font-medium border border-slate-200 rounded-lg py-1.5 hover:bg-slate-50 transition-colors"
        >
          View
        </button>
        <button
          onClick={() => onOpen(school)}
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
function ContactIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 4h16v16H4z" opacity="0" />
      <path d="M3 6l9 6 9-6" />
      <rect x="3" y="5" width="18" height="14" rx="2" />
    </svg>
  );
}
