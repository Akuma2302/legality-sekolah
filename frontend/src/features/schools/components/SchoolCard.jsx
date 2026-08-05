export default function SchoolCard({ school, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-2xl border border-slate-200 p-5 hover:border-accent-400 hover:shadow-md transition-all"
    >
      <div className="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center mb-3">
        <span className="text-accent-300 font-display font-semibold text-sm">
          {school.school_name?.[0]?.toUpperCase() || '?'}
        </span>
      </div>
      <h3 className="font-display font-semibold text-navy-900 leading-tight">{school.school_name}</h3>
      <p className="text-sm text-slate-500 mt-1">{school.pic_name}</p>
    </button>
  );
}
