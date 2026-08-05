export default function ComingSoon({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-2xl bg-navy-800 flex items-center justify-center mb-4">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="font-display text-xl font-semibold text-navy-900">{label} is on its way</h2>
      <p className="text-slate-500 mt-1 max-w-sm">
        This section is still being put together. Check back soon.
      </p>
    </div>
  );
}
