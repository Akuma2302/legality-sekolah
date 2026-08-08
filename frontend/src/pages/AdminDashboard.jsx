import { Link } from 'react-router-dom';
import { useAllSchools } from '../features/schools/hooks/useAllSchools';
import { useAlumni } from '../features/alumni/hooks/useAlumni';
import StatCard from '../components/StatCard';

const COMPLETED_ALUMNI_STATUS = 'Done creating program report';

export default function AdminDashboard() {
  const { schools, loading: schoolsLoading } = useAllSchools();
  const { alumni, loading: alumniLoading } = useAlumni();
  const loading = schoolsLoading || alumniLoading;

  const legalCount = schools.filter((s) => s.legality_status?.startsWith('Legal')).length;
  const alumniCompleted = alumni.filter((a) => a.status === COMPLETED_ALUMNI_STATUS).length;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900">Dashboard</h1>
      <p className="text-slate-500 mt-1 text-sm">Overview across schools and alumni outreach.</p>

      {loading ? (
        <p className="text-sm text-slate-400 mt-6">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatCard icon={<SchoolIcon />} label="Total Schools" value={schools.length} sublabel="All records" color="blue" />
          <StatCard icon={<CheckIcon />} label="Legal Schools" value={legalCount} sublabel={`${pct(legalCount, schools.length)}% of total`} color="green" />
          <StatCard icon={<PeopleIcon />} label="Total Alumni" value={alumni.length} sublabel="All records" color="purple" />
          <StatCard icon={<CheckIcon />} label="Alumni Completed" value={alumniCompleted} sublabel={`${pct(alumniCompleted, alumni.length)}% of total`} color="amber" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <Link
          to="/admin/legality/schools"
          className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-accent-400 hover:shadow-md transition-all"
        >
          <h3 className="font-display font-semibold text-navy-900">Legality — Schools</h3>
          <p className="text-sm text-slate-500 mt-1">Browse all schools and manage legality status.</p>
        </Link>
        <Link
          to="/admin/legality/alumni"
          className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-accent-400 hover:shadow-md transition-all"
        >
          <h3 className="font-display font-semibold text-navy-900">Legality — Alumni</h3>
          <p className="text-sm text-slate-500 mt-1">Browse alumni outreach records and progress.</p>
        </Link>
      </div>
    </div>
  );
}

function pct(n, total) {
  if (!total) return '0.0';
  return ((n / total) * 100).toFixed(1);
}

function SchoolIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 21V9l8-5 8 5v12" /><path d="M9 21v-6h6v6" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.5 2.5L16 9.5" strokeLinecap="round" strokeLinejoin="round" />
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
