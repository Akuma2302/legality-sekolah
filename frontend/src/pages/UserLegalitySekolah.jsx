import { useState } from 'react';
import { useMySchools } from '../features/schools/hooks/useMySchools';
import SchoolCard from '../features/schools/components/SchoolCard';
import AddSchoolModal from '../features/schools/components/AddSchoolModal';
import SchoolDetailModal from '../features/schools/components/SchoolDetailModal';

export default function UserLegalitySekolah() {
  const { schools, loading, addSchool, updateSchool } = useMySchools();
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSaved = (updated) => {
    updateSchool(updated);
    setSelected(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-900">Legality — Sekolah</h1>
          <p className="text-slate-500 mt-1 text-sm">Add and manage the schools under your care.</p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading schools…</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {schools.map((s) => (
            <SchoolCard key={s.id} school={s} onClick={() => setSelected(s)} />
          ))}

          {/* Add school tile */}
          <button
            onClick={() => setShowAdd(true)}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-accent-400 hover:text-accent-500 transition-colors min-h-[104px]"
          >
            <span className="text-2xl leading-none">+</span>
            <span className="text-sm font-medium">Add school</span>
          </button>
        </div>
      )}

      {showAdd && <AddSchoolModal onClose={() => setShowAdd(false)} onSubmit={addSchool} />}
      {selected && (
        <SchoolDetailModal school={selected} onClose={() => setSelected(null)} onSaved={handleSaved} />
      )}
    </div>
  );
}
