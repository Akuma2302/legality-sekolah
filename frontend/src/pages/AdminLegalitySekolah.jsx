import { useState } from 'react';
import { useAllSchools } from '../features/schools/hooks/useAllSchools';
import { useAlumni } from '../features/alumni/hooks/useAlumni';
import AdminSchoolTable from '../features/schools/components/AdminSchoolTable';
import AdminAlumniTable from '../features/alumni/components/AdminAlumniTable';
import SchoolDetailModal from '../features/schools/components/SchoolDetailModal';
import AlumniDetailModal from '../features/alumni/components/AlumniDetailModal';

export default function AdminLegalitySekolah() {
  const [view, setView] = useState('sekolah'); // 'sekolah' | 'alumni'

  const { schools, loading: schoolsLoading, updateLegalityStatus, applyUpdate } = useAllSchools();
  const { alumni, loading: alumniLoading, updateAlumnus } = useAlumni();

  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedAlumnus, setSelectedAlumnus] = useState(null);

  const handleSchoolSaved = (updated) => {
    applyUpdate(updated);
    setSelectedSchool(updated);
  };

  const handleAlumnusSaved = (updated) => {
    updateAlumnus(updated);
    setSelectedAlumnus(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-900">Legality (Sekolah)</h1>
          <p className="text-slate-500 mt-1 text-sm">
            All records registered by PICs. Click a row for full details.
          </p>
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

      {view === 'sekolah' ? (
        schoolsLoading ? (
          <p className="text-sm text-slate-400">Loading schools…</p>
        ) : (
          <AdminSchoolTable schools={schools} onStatusChange={updateLegalityStatus} onRowClick={setSelectedSchool} />
        )
      ) : alumniLoading ? (
        <p className="text-sm text-slate-400">Loading alumni…</p>
      ) : (
        <AdminAlumniTable alumni={alumni} onRowClick={setSelectedAlumnus} />
      )}

      {selectedSchool && (
        <SchoolDetailModal school={selectedSchool} onClose={() => setSelectedSchool(null)} onSaved={handleSchoolSaved} />
      )}
      {selectedAlumnus && (
        <AlumniDetailModal alumnus={selectedAlumnus} onClose={() => setSelectedAlumnus(null)} onSaved={handleAlumnusSaved} />
      )}
    </div>
  );
}