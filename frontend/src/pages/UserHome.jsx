import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAlumni } from '../features/alumni/hooks/useAlumni';
import { useSchools } from '../features/schools/hooks/useSchools';
import AlumniDetailModal from '../features/alumni/components/AlumniDetailModal';

const COMPLETED_STATUS = 'Done creating program report';

export default function UserHome() {
  const { alumni, updateAlumnus } = useAlumni();
  const { schools } = useSchools();
  const [selected, setSelected] = useState(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const stats = useMemo(() => {
    const completed = alumni.filter((a) => a.status === COMPLETED_STATUS).length;
    const schoolsReached = new Set(alumni.map((a) => a.school_name)).size;
    return { totalPrograms: alumni.length, completed, schoolsReached, totalSchools: schools.length };
  }, [alumni, schools]);

  const recentActivity = useMemo(
    () => [...alumni].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5),
    [alumni]
  );

  const handleSaved = (updated) => {
    updateAlumnus(updated);
    setSelected(updated);
  };

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy-900 to-navy-700 rounded-3xl px-8 py-12 mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h1 className="font-display text-3xl font-bold text-white leading-tight">
            Connecting Alumni, <span className="text-accent-300">Inspiring Schools</span>
          </h1>
          <p className="text-navy-200 mt-3">
            Legality Sekolah Tengah tracks legality records and alumni outreach programs across schools.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <Link
              to="/legality/alumni"
              className="bg-accent-500 text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-accent-400 transition-colors"
            >
              Explore Programs →
            </Link>
            <button
              onClick={() => setShowHowItWorks((s) => !s)}
              className="bg-white/10 text-white border border-white/20 rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-white/20 transition-colors"
            >
              How It Works
            </button>
          </div>
        </div>
        <SchoolIllustration className="absolute right-4 top-1/2 -translate-y-1/2 w-56 h-56 opacity-90 hidden md:block" />
      </div>

      {showHowItWorks && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <HowItWorksStep n="1" title="Add a school or alumni entry" text="Anyone can register a school's legality record or an alumni outreach program — no account needed." />
          <HowItWorksStep n="2" title="Track progress" text="Update contact details, assign teachers, log MOM notes, and move outreach status forward stage by stage." />
          <HowItWorksStep n="3" title="Admin reviews legality" text="An admin reviews school legality status separately, using the same shared records." />
        </div>
      )}

      <div className="grid grid-cols-[1fr_320px] gap-6 items-start">
        {/* Main column */}
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <ImpactCard value={stats.totalPrograms} label="Total Programs" />
            <ImpactCard value={stats.schoolsReached} label="Schools Reached" />
            <ImpactCard value={stats.completed} label="Completed" />
            <ImpactCard value={stats.totalSchools} label="Total Schools" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/legality/sekolah"
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-accent-400 hover:shadow-md transition-all"
            >
              <h3 className="font-display font-semibold text-navy-900 text-lg">Legality — Sekolah</h3>
              <p className="text-sm text-slate-500 mt-1">Browse and manage school legality records.</p>
              <span className="inline-block mt-3 text-sm font-medium text-accent-500">Browse schools →</span>
            </Link>
            <Link
              to="/legality/alumni"
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-accent-400 hover:shadow-md transition-all"
            >
              <h3 className="font-display font-semibold text-navy-900 text-lg">Legality — Alumni</h3>
              <p className="text-sm text-slate-500 mt-1">Browse and manage alumni outreach programs.</p>
              <span className="inline-block mt-3 text-sm font-medium text-accent-500">Browse programs →</span>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <a href="/kit-legality" className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-accent-400 hover:shadow-md transition-all">
              <h3 className="font-display font-semibold text-navy-900">Kit Legality</h3>
              <p className="text-sm text-slate-500 mt-1">Resources and documents for legality processes.</p>
            </a>
            <a href="/template-form" className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-accent-400 hover:shadow-md transition-all">
              <h3 className="font-display font-semibold text-navy-900">Template Form Program Sekolah</h3>
              <p className="text-sm text-slate-500 mt-1">Program templates and forms.</p>
            </a>
            <a href="/tds-chart" className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-accent-400 hover:shadow-md transition-all">
              <h3 className="font-display font-semibold text-navy-900">TDS Organisation Chart</h3>
              <p className="text-sm text-slate-500 mt-1">See the full organisation structure.</p>
            </a>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {recentActivity.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-display font-semibold text-navy-900 text-sm mb-4">Recent Activity</h3>
              <ul className="space-y-3">
                {recentActivity.map((a) => (
                  <li key={a.id}>
                    <button onClick={() => setSelected(a)} className="text-left w-full group">
                      <p className="text-sm font-medium text-navy-900 group-hover:text-accent-500 transition-colors truncate">
                        {a.school_name}
                      </p>
                      <p className="text-xs text-slate-400">{formatShortDate(a.created_at)}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-navy-900 rounded-2xl p-5 text-white">
            <h3 className="font-display font-semibold text-sm mb-1">Be Part of the Change</h3>
            <p className="text-xs text-navy-300 mb-4">
              Propose a new outreach program or register your school's legality record.
            </p>
            <Link
              to="/legality/alumni"
              className="inline-block bg-accent-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent-400 transition-colors"
            >
              Get Involved →
            </Link>
          </div>
        </div>
      </div>

      {/* Value props */}
      <div className="grid grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-200">
        <ValueProp icon={<CapIcon />} title="Empowering Students" text="Inspiring the next generation through real experiences." />
        <ValueProp icon={<PeopleIcon />} title="Building Connections" text="Bridging alumni and schools for a better future." />
        <ValueProp icon={<HeartIcon />} title="Meaningful Impact" text="Creating programs that leave lasting change." />
        <ValueProp icon={<PinIcon />} title="Nationwide Outreach" text="Reaching schools across Malaysia." />
      </div>

      {selected && (
        <AlumniDetailModal alumnus={selected} onClose={() => setSelected(null)} onSaved={handleSaved} />
      )}
    </div>
  );
}

function formatShortDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
}

function ImpactCard({ value, label }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <p className="text-2xl font-display font-semibold text-navy-900">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

function HowItWorksStep({ n, title, text }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="w-8 h-8 rounded-full bg-navy-900 text-white flex items-center justify-center font-display font-semibold text-sm mb-3">
        {n}
      </div>
      <h4 className="font-display font-semibold text-navy-900 text-sm mb-1">{title}</h4>
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  );
}

function ValueProp({ icon, title, text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-accent-500/10 text-accent-500 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-display font-semibold text-navy-900 text-sm">{title}</h4>
        <p className="text-xs text-slate-500 mt-0.5">{text}</p>
      </div>
    </div>
  );
}

function SchoolIllustration({ className }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none">
      <circle cx="100" cy="100" r="90" fill="white" fillOpacity="0.06" />
      <rect x="50" y="90" width="100" height="70" rx="4" fill="#254a99" fillOpacity="0.6" />
      <rect x="90" y="60" width="20" height="30" fill="#254a99" fillOpacity="0.6" />
      <path d="M85 60 L100 45 L115 60 Z" fill="#3b82f6" />
      <rect x="97" y="48" width="3" height="14" fill="#93c5fd" />
      <circle cx="102" cy="46" r="3" fill="#93c5fd" />
      <rect x="60" y="110" width="14" height="14" fill="#93c5fd" fillOpacity="0.7" />
      <rect x="82" y="110" width="14" height="14" fill="#93c5fd" fillOpacity="0.7" />
      <rect x="104" y="110" width="14" height="14" fill="#93c5fd" fillOpacity="0.7" />
      <rect x="126" y="110" width="14" height="14" fill="#93c5fd" fillOpacity="0.7" />
      <rect x="92" y="135" width="16" height="25" fill="#152c5c" />
    </svg>
  );
}

function CapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l10 5-10 5-10-5 10-5z" strokeLinejoin="round" />
      <path d="M6 10.5v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" />
    </svg>
  );
}
function PeopleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <circle cx="17.5" cy="9" r="2.5" /><path d="M15 20a5 5 0 0 1 8 0" strokeOpacity="0.6" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s-7.5-5-10-10a5.5 5.5 0 0 1 10-3 5.5 5.5 0 0 1 10 3c-2.5 5-10 10-10 10z" strokeLinejoin="round" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
