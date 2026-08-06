import { useState } from 'react';
import { useAlumni } from '../features/alumni/hooks/useAlumni';
import AlumniCard from '../features/alumni/components/AlumniCard';
import AddAlumniModal from '../features/alumni/components/AddAlumniModal';
import AlumniDetailModal from '../features/alumni/components/AlumniDetailModal';

export default function UserLegalityAlumni() {
  const { alumni, loading, addAlumnus, updateAlumnus } = useAlumni();
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSaved = (updated) => {
    updateAlumnus(updated);
    setSelected(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-900">Legality — Alumni</h1>
          <p className="text-slate-500 mt-1 text-sm">Add and manage alumni outreach records.</p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {alumni.map((a) => (
            <AlumniCard key={a.id} alumnus={a} onClick={() => setSelected(a)} />
          ))}

          {/* Add tile */}
          <button
            onClick={() => setShowAdd(true)}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-accent-400 hover:text-accent-500 transition-colors min-h-[104px]"
          >
            <span className="text-2xl leading-none">+</span>
            <span className="text-sm font-medium">Add school</span>
          </button>
        </div>
      )}

      {showAdd && <AddAlumniModal onClose={() => setShowAdd(false)} onSubmit={addAlumnus} />}
      {selected && (
        <AlumniDetailModal alumnus={selected} onClose={() => setSelected(null)} onSaved={handleSaved} />
      )}
    </div>
  );
}
