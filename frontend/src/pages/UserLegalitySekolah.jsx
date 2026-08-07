import { useMemo, useState } from 'react';
import { useSchools } from '../features/schools/hooks/useSchools';
import SchoolBrowseCard from '../features/schools/components/SchoolBrowseCard';
import AddSchoolModal from '../features/schools/components/AddSchoolModal';
import SchoolDetailModal from '../features/schools/components/SchoolDetailModal';
import SearchFilterBar from '../components/SearchFilterBar';
import Pagination from '../components/Pagination';
import { STATES, BRANCHES, SCHOOL_TYPES } from '../utils/constants';

export default function UserLegalitySekolah() {
  const { schools, loading, addSchool, updateSchool } = useSchools();

  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = schools.filter((s) => {
      if (q && !`${s.school_name} ${s.pic_name}`.toLowerCase().includes(q)) return false;
      if (branchFilter && s.branch !== branchFilter) return false;
      if (stateFilter && s.state !== stateFilter) return false;
      if (typeFilter && s.type !== typeFilter) return false;
      return true;
    });
    list = [...list].sort((a, b) =>
      sort === 'newest'
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    );
    return list;
  }, [schools, search, branchFilter, stateFilter, typeFilter, sort]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleAdd = async (payload) => {
    const created = await addSchool(payload);
    setSelected(created);
  };

  const handleSaved = (updated) => {
    updateSchool(updated);
    setSelected(updated);
  };

  const resetToFirstPage = (setter) => (value) => { setter(value); setPage(1); };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-900">Legality — Sekolah</h1>
          <p className="text-slate-500 mt-1 text-sm">Browse and manage school legality records.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-navy-900 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-navy-800 transition-colors flex items-center gap-1.5"
        >
          <span className="text-lg leading-none">+</span> Add School
        </button>
      </div>

      <div className="mb-2">
        <SearchFilterBar
          search={search}
          onSearchChange={resetToFirstPage(setSearch)}
          searchPlaceholder="Search school or PIC…"
          filters={[
            { label: 'All Branches', value: branchFilter, onChange: resetToFirstPage(setBranchFilter), options: BRANCHES },
            { label: 'All States', value: stateFilter, onChange: resetToFirstPage(setStateFilter), options: STATES },
            { label: 'All Types', value: typeFilter, onChange: resetToFirstPage(setTypeFilter), options: SCHOOL_TYPES },
          ]}
        />
      </div>
      <div className="flex justify-end mb-6">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="text-sm text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5"
        >
          <option value="newest">Sort by: Newest</option>
          <option value="oldest">Sort by: Oldest</option>
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading schools…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-slate-400 py-12 text-center">No schools match your filters.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            {paged.map((s) => (
              <SchoolBrowseCard key={s.id} school={s} onOpen={setSelected} />
            ))}
          </div>
          <div className="mt-6">
            <Pagination page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} onPageSizeChange={(n) => { setPageSize(n); setPage(1); }} />
          </div>
        </>
      )}

      {showAdd && <AddSchoolModal onClose={() => setShowAdd(false)} onSubmit={handleAdd} />}
      {selected && (
        <SchoolDetailModal school={selected} onClose={() => setSelected(null)} onSaved={handleSaved} />
      )}
    </div>
  );
}
