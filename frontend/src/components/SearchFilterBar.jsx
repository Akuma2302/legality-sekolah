export default function SearchFilterBar({ search, onSearchChange, searchPlaceholder, filters }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-wrap items-center gap-3">
      <div className="relative w-full sm:flex-1 sm:min-w-[200px]">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder || 'Search…'}
          className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
        />
      </div>

      {filters.map((f) => (
        <div key={f.label} className="flex-1 min-w-[calc(50%-0.375rem)] sm:min-w-[140px] sm:flex-initial">
          <select
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
          >
            <option value="">{f.label}</option>
            {f.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
