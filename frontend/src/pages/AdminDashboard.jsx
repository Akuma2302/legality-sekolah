import { useAllSchools } from '../features/schools/hooks/useAllSchools';
import { LEGALITY_STATUSES } from '../utils/constants';

export default function AdminDashboard() {
  const { schools, loading } = useAllSchools();

  const counts = LEGALITY_STATUSES.map((status) => ({
    status,
    count: schools.filter((s) => s.legality_status === status).length,
  }));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900">Dashboard</h1>
      <p className="text-slate-500 mt-1 text-sm">Overview of all registered schools.</p>

      {loading ? (
        <p className="text-sm text-slate-400 mt-6">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-navy-900 text-white rounded-2xl p-5">
              <p className="text-3xl font-display font-semibold">{schools.length}</p>
              <p className="text-navy-300 text-sm mt-1">Total schools</p>
            </div>
            {counts.map((c) => (
              <div key={c.status} className="bg-white rounded-2xl border border-slate-200 p-5">
                <p className="text-3xl font-display font-semibold text-navy-900">{c.count}</p>
                <p className="text-slate-500 text-sm mt-1">{c.status}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
