const PAGE_SIZE_OPTIONS = [12, 24, 48];

export default function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const pageNumbers = getPageNumbers(page, totalPages);

  if (total === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
      <p className="text-sm text-slate-500">
        Showing {start} to {end} of {total} results
      </p>

      <div className="flex items-center gap-1">
        <PageButton disabled={page === 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
          ‹
        </PageButton>
        {pageNumbers.map((n, i) =>
          n === '…' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-slate-400 text-sm">…</span>
          ) : (
            <PageButton key={n} active={n === page} onClick={() => onPageChange(n)}>
              {n}
            </PageButton>
          )
        )}
        <PageButton disabled={page === totalPages} onClick={() => onPageChange(page + 1)} aria-label="Next page">
          ›
        </PageButton>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-500">
        Show
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
        >
          {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        per page
      </div>
    </div>
  );
}

function PageButton({ children, active, disabled, onClick, ...rest }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        active ? 'bg-navy-900 text-white' : 'text-slate-600 hover:bg-slate-100'
      }`}
      {...rest}
    >
      {children}
    </button>
  );
}

function getPageNumbers(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const set = new Set([1, 2, totalPages - 1, totalPages, page - 1, page, page + 1]);
  const nums = [...set].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  const withEllipsis = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) withEllipsis.push('…');
    withEllipsis.push(n);
  });
  return withEllipsis;
}
