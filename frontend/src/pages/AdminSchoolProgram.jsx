import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import SearchFilterBar from '../components/SearchFilterBar';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import { BRANCHES, PROGRAM_TYPES } from '../utils/constants';

export default function AdminSchoolProgram() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.getProgramSubmissions()
      .then(setSubmissions)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const sent = submissions.filter((s) => s.telegram_sent).length;
    return { total: submissions.length, sent, pending: submissions.length - sent };
  }, [submissions]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return submissions.filter((s) => {
      if (q && !`${s.school_name} ${s.teacher_on_duty}`.toLowerCase().includes(q)) return false;
      if (branchFilter && s.school_branch !== branchFilter) return false;
      if (typeFilter && s.program_type !== typeFilter) return false;
      return true;
    });
  }, [submissions, search, branchFilter, typeFilter]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const resetToFirstPage = (setter) => (value) => { setter(value); setPage(1); };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-navy-900">School Program</h1>
        <p className="text-slate-500 mt-1 text-sm">All submitted Borang Program entries, and their Telegram delivery status.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={<DocIcon />} label="Total Submissions" value={stats.total} sublabel="All records" color="blue" />
        <StatCard icon={<CheckIcon />} label="Sent to Telegram" value={stats.sent} sublabel={`${pct(stats.sent, stats.total)}% of total`} color="green" />
        <StatCard icon={<ClockIcon />} label="Not Sent Yet" value={stats.pending} sublabel={`${pct(stats.pending, stats.total)}% of total`} color="amber" />
      </div>

      <div className="mb-6">
        <SearchFilterBar
          search={search}
          onSearchChange={resetToFirstPage(setSearch)}
          searchPlaceholder="Search school, guru bertugas…"
          filters={[
            { label: 'All Cawangan', value: branchFilter, onChange: resetToFirstPage(setBranchFilter), options: BRANCHES },
            { label: 'All Program Types', value: typeFilter, onChange: resetToFirstPage(setTypeFilter), options: PROGRAM_TYPES },
          ]}
        />
      </div>

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : loading ? (
        <p className="text-sm text-slate-400">Loading submissions…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-slate-400 py-12 text-center">No submissions match your filters.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paged.map((s) => (
              <SubmissionCard key={s.id} submission={s} onOpen={setSelected} />
            ))}
          </div>
          <div className="mt-6">
            <Pagination page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} onPageSizeChange={(n) => { setPageSize(n); setPage(1); }} />
          </div>
        </>
      )}

      {selected && <SubmissionDetailModal submission={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function SubmissionCard({ submission: s, onOpen }) {
  return (
    <button
      onClick={() => onOpen(s)}
      className="text-left bg-white rounded-2xl border border-slate-200 p-5 hover:border-accent-400 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="font-display font-semibold text-navy-900 truncate">{s.school_name}</p>
        {s.telegram_sent ? (
          <span className="shrink-0 text-xs font-medium rounded-full px-2.5 py-1 border bg-emerald-50 text-emerald-700 border-emerald-200">Sent</span>
        ) : (
          <span className="shrink-0 text-xs font-medium rounded-full px-2.5 py-1 border bg-amber-50 text-amber-700 border-amber-200">Not sent</span>
        )}
      </div>
      <p className="text-xs text-slate-500 mb-3">
        {s.school_branch} · {s.program_type} · {formatShortDate(s.program_date)}
      </p>
      <p className="text-xs text-slate-400">Submitted {formatShortDate(s.created_at)}</p>
    </button>
  );
}

function SubmissionDetailModal({ submission: s, onClose }) {
  return (
    <Modal title={s.school_name} onClose={onClose} wide>
      <div className="space-y-6">
        {!s.telegram_sent && s.telegram_error && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Telegram not sent: {s.telegram_error}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <Detail label="Cawangan Sekolah" value={s.school_branch} />
          <Detail label="Tarikh Program" value={formatShortDate(s.program_date)} />
          <Detail label="Jenis Program" value={s.program_type} />
          <Detail label="Masa" value={`${s.start_time} – ${s.end_time}`} />
          <Detail label="Guru Bertugas" value={s.teacher_on_duty} />
          <Detail label="Jawatan Guru" value={s.teacher_position} />
          <Detail label="Jumlah Manpower" value={s.total_manpower} />
          <Detail
            label="Manpower Tambahan"
            value={s.needs_additional_manpower ? `Ya (${s.additional_manpower_count})` : 'Tidak'}
          />
        </div>

        {s.students_involved?.length > 0 && (
          <Detail label="Pelajar Terlibat" value={s.students_involved.join(', ')} />
        )}

        {s.sheet_program_url && (
          <Detail
            label="Sheet Program"
            value={
              <a href={s.sheet_program_url} target="_blank" rel="noreferrer" className="text-accent-500 hover:underline break-all">
                {s.sheet_program_url}
              </a>
            }
          />
        )}

        <div className="border-t border-slate-100 pt-4">
          <p className="text-sm font-medium text-navy-900 mb-3">PIC Program</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Detail label="Main PIC" value={`${s.main_pic_telegram} · ${s.main_pic_branch}`} />
            <Detail label="PIC Legality" value={`${s.legality_pic_telegram} · ${s.legality_pic_branch}`} />
            <Detail label="PIC Virality" value={`${s.virality_pic_telegram} · ${s.virality_pic_branch}`} />
          </div>
        </div>

        <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">
          Submitted {formatShortDate(s.created_at)}
        </p>
      </div>
    </Modal>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p className="text-navy-900">{value ?? '—'}</p>
    </div>
  );
}

function pct(n, total) {
  if (!total) return '0.0';
  return ((n / total) * 100).toFixed(1);
}

function formatShortDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
}

function DocIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 2h9l5 5v15H6z" /><path d="M15 2v5h5" /><path d="M9 13h6M9 17h6" strokeLinecap="round" />
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
