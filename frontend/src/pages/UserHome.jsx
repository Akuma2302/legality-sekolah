export default function UserHome() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900">
        Assalamualaikum
      </h1>
      <p className="text-slate-500 mt-2 max-w-xl">
        Welcome to the Legality Sekolah Tengah portal. Use the tabs above to manage school
        legality records, access the legality kit, program templates, and the organisation chart.
      </p>
      <div className="grid grid-cols-3 gap-4 mt-8">
        <a href="/legality/sekolah" className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-accent-400 hover:shadow-md transition-all">
          <h3 className="font-display font-semibold text-navy-900">Legality — Sekolah</h3>
          <p className="text-sm text-slate-500 mt-1">Manage school legality records and PIC details.</p>
        </a>
        <a href="/kit-legality" className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-accent-400 hover:shadow-md transition-all">
          <h3 className="font-display font-semibold text-navy-900">Kit Legality</h3>
          <p className="text-sm text-slate-500 mt-1">Resources and documents for legality processes.</p>
        </a>
        <a href="/tds-chart" className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-accent-400 hover:shadow-md transition-all">
          <h3 className="font-display font-semibold text-navy-900">TDS Organisation Chart</h3>
          <p className="text-sm text-slate-500 mt-1">See the full organisation structure.</p>
        </a>
      </div>
    </div>
  );
}
