import { useEffect, useMemo, useState } from 'react';
import { useAllSchools } from '../features/schools/hooks/useAllSchools';
import AdminSchoolCard from '../features/schools/components/AdminSchoolCard';
import SchoolDetailModal from '../features/schools/components/SchoolDetailModal';
import StatCard from '../components/StatCard';
import SearchFilterBar from '../components/SearchFilterBar';
import Pagination from '../components/Pagination';
import { api } from '../services/api';
import { isThisWeek } from '../utils/weekOptions';
import { STATES, BRANCHES, SCHOOL_TYPES, LEGALITY_STATUSES } from '../utils/constants';

export default function AdminSchools() {
  const { schools, loading, applyUpdate } = useAllSchools();

  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const [selected, setSelected] = useState(null);

  const [latestUpdates, setLatestUpdates] = useState(null); // { [schoolId]: latestCreatedAt } | null while loading

  useEffect(() => {
    api.getLatestMomNotesByParentType('school').then(setLatestUpdates);
  }, []);

  const notUpdatedThisWeek = useMemo(() => {
    if (!latestUpdates) return [];
    return schools.filter((s) => !isThisWeek(latestUpdates[s.id]));
  }, [schools, latestUpdates]);

  const stats = useMemo(() => {
    const legal = schools.filter((s) => s.legality_status?.startsWith('Legal')).length;
    const potential = schools.filter((s) => s.legality_status === 'Potentially Legal').length;
    const notLegal = schools.filter((s) => s.legality_status === 'Not Legal').length;
    return { total: schools.length, legal, potential, notLegal };
  }, [schools]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return schools.filter((s) => {
      if (q && !`${s.school_name} ${s.pic_name}`.toLowerCase().includes(q)) return false;
      if (stateFilter && s.state !== stateFilter) return false;
      if (branchFilter && s.branch !== branchFilter) return false;
      if (typeFilter && s.type !== typeFilter) return false;
      if (statusFilter && s.legality_status !== statusFilter) return false;
      return true;
    });
  }, [schools, search, stateFilter, branchFilter, typeFilter, statusFilter]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSaved = (updated) => {
    applyUpdate(updated);
    setSelected(updated);
  };

  const resetToFirstPage = (setter) => (value) => { setter(value); setPage(1); };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-900">Legality Schools</h1>
          <p className="text-slate-500 mt-1 text-sm">All schools registered by PICs, with legality status.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<SchoolIcon />} label="Total Schools" value={stats.total} sublabel="All records" color="blue" />
        <StatCard icon={<CheckIcon />} label="Legal" value={stats.legal} sublabel={`${pct(stats.legal, stats.total)}% of total`} color="green" />
        <StatCard icon={<ClockIcon />} label="Potentially Legal" value={stats.potential} sublabel={`${pct(stats.potential, stats.total)}% of total`} color="amber" />
        <StatCard icon={<AlertIcon />} label="Not Legal" value={stats.notLegal} sublabel={`${pct(stats.notLegal, stats.total)}% of total`} color="purple" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="font-display font-semibold text-navy-900 text-sm">PICs Not Updated This Week</h2>
          {latestUpdates && (
            <span className="text-xs font-medium bg-red-50 text-red-600 rounded-full px-2 py-0.5">
              {notUpdatedThisWeek.length}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 mb-4">Schools whose PIC hasn't logged a Weekly Update entry this week.</p>

        {!latestUpdates ? (
          <p className="text-sm text-slate-400">Checking weekly updates…</p>
        ) : notUpdatedThisWeek.length === 0 ? (
          <p className="text-sm text-emerald-600">Every PIC has logged an update this week.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
            {notUpdatedThisWeek.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className="text-left bg-slate-50 hover:bg-slate-100 rounded-lg px-3 py-2.5 transition-colors"
              >
                <p className="text-sm font-medium text-navy-900 truncate">{s.pic_name}</p>
                <p className="text-xs text-slate-500 truncate">{s.school_name}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {latestUpdates[s.id] ? `Last update ${formatShortDate(latestUpdates[s.id])}` : 'No updates yet'}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <SearchFilterBar
          search={search}
          onSearchChange={resetToFirstPage(setSearch)}
          searchPlaceholder="Search schools, PIC…"
          filters={[
            { label: 'All States', value: stateFilter, onChange: resetToFirstPage(setStateFilter), options: STATES },
            { label: 'All Branches', value: branchFilter, onChange: resetToFirstPage(setBranchFilter), options: BRANCHES },
            { label: 'All Types', value: typeFilter, onChange: resetToFirstPage(setTypeFilter), options: SCHOOL_TYPES },
            { label: 'All Statuses', value: statusFilter, onChange: resetToFirstPage(setStatusFilter), options: LEGALITY_STATUSES },
          ]}
        />
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading schools…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-slate-400 py-12 text-center">No schools match your filters.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paged.map((s) => (
              <AdminSchoolCard key={s.id} school={s} onOpen={setSelected} />
            ))}
          </div>
          <div className="mt-6">
            <Pagination page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} onPageSizeChange={(n) => { setPageSize(n); setPage(1); }} />
          </div>
        </>
      )}

      {selected && (
        <SchoolDetailModal school={selected} onClose={() => setSelected(null)} onSaved={handleSaved} />
      )}
    </div>
  );
}

function pct(n, total) {
  if (!total) return '0.0';
  return ((n / total) * 100).toFixed(1);
}

function formatShortDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
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
function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 3.5" strokeLinecap="round" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
      <path d="M10.3 3.9L2.5 18a1.8 1.8 0 0 0 1.6 2.7h15.8a1.8 1.8 0 0 0 1.6-2.7L13.7 3.9a1.8 1.8 0 0 0-3.4 0z" />
    </svg>
  );
}
