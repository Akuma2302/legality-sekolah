import { useState } from 'react';
import { useAllSchools } from '../features/schools/hooks/useAllSchools';
import AdminSchoolTable from '../features/schools/components/AdminSchoolTable';
import ComingSoon from '../components/ComingSoon';

export default function AdminLegalitySekolah() {
  const [view, setView] = useState('sekolah'); // 'sekolah' | 'alumni'
  const { schools, loading, updateLegalityStatus } = useAllSchools();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-900">Legality (Sekolah)</h1>
          <p className="text-slate-500 mt-1 text-sm">All schools registered by PICs, with legality status.</p>
        </div>
        <div className="flex bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setView('sekolah')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              view === 'sekolah' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            Sekolah
          </button>
          <button
            onClick={() => setView('alumni')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              view === 'alumni' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            Alumni
          </button>
        </div>
      </div>

      {view === 'alumni' ? (
        <ComingSoon label="Alumni" />
      ) : loading ? (
        <p className="text-sm text-slate-400">Loading schools…</p>
      ) : (
        <AdminSchoolTable schools={schools} onStatusChange={updateLegalityStatus} />
      )}
    </div>
  );
}
