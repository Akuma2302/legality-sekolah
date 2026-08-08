import { useMemo, useState } from 'react';
import { useAlumni } from '../features/alumni/hooks/useAlumni';
import AdminAlumniCard from '../features/alumni/components/AdminAlumniCard';
import AddAlumniModal from '../features/alumni/components/AddAlumniModal';
import AlumniDetailModal from '../features/alumni/components/AlumniDetailModal';
import StatCard from '../components/StatCard';
import SearchFilterBar from '../components/SearchFilterBar';
import Pagination from '../components/Pagination';
import { STATES, BRANCHES, SCHOOL_TYPE_OPTIONS, ALUMNI_STATUSES } from '../utils/constants';

const COMPLETED_STATUS = 'Done creating program report';

export default function AdminAlumni() {
  const { alumni, loading, addAlumnus, updateAlumnus } = useAlumni();

  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [schoolTypeFilter, setSchoolTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);

  const stats = useMemo(() => {
    const completed = alumni.filter((a) => a.status === COMPLETED_STATUS).length;
    const pending = alumni.filter((a) => a.status && a.status !== COMPLETED_STATUS).length;
    const schoolCount = new Set(alumni.map((a) => a.school_name)).size;
    return { total: alumni.length, completed, pending, schoolCount };
  }, [alumni]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return alumni.filter((a) => {
      if (q && !`${a.pic_name} ${a.school_name}`.toLowerCase().includes(q)) return false;
      if (stateFilter && a.state !== stateFilter) return false;
      if (branchFilter && a.branch !== branchFilter) return false;
      if (schoolTypeFilter && a.school_type !== schoolTypeFilter) return false;
      if (statusFilter && a.status !== statusFilter) return false;
      return true;
    });
  }, [alumni, search, stateFilter, branchFilter, schoolTypeFilter, statusFilter]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleAdd = async (payload) => {
    const created = await addAlumnus(payload);
    setSelected(created);
  };

  const handleSaved = (updated) => {
    updateAlumnus(updated);
    setSelected(updated);
  };

  const resetToFirstPage = (setter) => (value) => { setter(value); setPage(1); };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-900">Legality Alumni</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage alumni outreach records and their outreach progress.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-accent-500 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-accent-400 transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto"
        >
          <span className="text-lg leading-none">+</span> Add Alumni
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<PeopleIcon />} label="Total Alumni" value={stats.total} sublabel="All records" color="blue" />
        <StatCard icon={<CheckIcon />} label="Completed" value={stats.completed} sublabel={`${pct(stats.completed, stats.total)}% of total`} color="green" />
        <StatCard icon={<ClockIcon />} label="Pending" value={stats.pending} sublabel={`${pct(stats.pending, stats.total)}% of total`} color="amber" />
        <StatCard icon={<SchoolIcon />} label="Schools" value={stats.schoolCount} sublabel="Distinct schools" color="purple" />
      </div>

      <div className="mb-6">
        <SearchFilterBar
          search={search}
          onSearchChange={resetToFirstPage(setSearch)}
          searchPlaceholder="Search alumni, school…"
          filters={[
            { label: 'All States', value: stateFilter, onChange: resetToFirstPage(setStateFilter), options: STATES },
            { label: 'All Branches', value: branchFilter, onChange: resetToFirstPage(setBranchFilter), options: BRANCHES },
            { label: 'All School Types', value: schoolTypeFilter, onChange: resetToFirstPage(setSchoolTypeFilter), options: SCHOOL_TYPE_OPTIONS },
            { label: 'All Statuses', value: statusFilter, onChange: resetToFirstPage(setStatusFilter), options: ALUMNI_STATUSES },
          ]}
        />
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading alumni…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-slate-400 py-12 text-center">No alumni entries match your filters.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paged.map((a) => (
              <AdminAlumniCard key={a.id} alumnus={a} onOpen={setSelected} />
            ))}
          </div>
          <div className="mt-6">
            <Pagination page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} onPageSizeChange={(n) => { setPageSize(n); setPage(1); }} />
          </div>
        </>
      )}

      {showAdd && <AddAlumniModal onClose={() => setShowAdd(false)} onSubmit={handleAdd} />}
      {selected && (
        <AlumniDetailModal alumnus={selected} onClose={() => setSelected(null)} onSaved={handleSaved} />
      )}
    </div>
  );
}

function pct(n, total) {
  if (!total) return '0.0';
  return ((n / total) * 100).toFixed(1);
}

function PeopleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <circle cx="17.5" cy="9" r="2.5" /><path d="M15 20a5 5 0 0 1 8 0" strokeOpacity="0.6" />
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
function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 3.5" strokeLinecap="round" />
    </svg>
  );
}
function SchoolIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 21V9l8-5 8 5v12" /><path d="M9 21v-6h6v6" />
    </svg>
  );
}
