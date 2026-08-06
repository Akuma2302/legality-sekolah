export default function AdminAlumniTable({ alumni, onRowClick }) {
  if (alumni.length === 0) {
    return <p className="text-sm text-slate-400 py-12 text-center">No alumni entries have been added yet.</p>;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-500 bg-slate-50 border-b border-slate-200">
            <th className="px-5 py-3 font-medium">School</th>
            <th className="px-5 py-3 font-medium">PIC</th>
            <th className="px-5 py-3 font-medium">Type</th>
            <th className="px-5 py-3 font-medium">Branch</th>
            <th className="px-5 py-3 font-medium">State</th>
            <th className="px-5 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {alumni.map((a) => (
            <tr
              key={a.id}
              onClick={() => onRowClick?.(a)}
              className="hover:bg-slate-50/60 cursor-pointer"
            >
              <td className="px-5 py-3 font-medium text-navy-900">{a.school_name}</td>
              <td className="px-5 py-3 text-slate-600">{a.pic_name}</td>
              <td className="px-5 py-3 text-slate-600">{a.type}</td>
              <td className="px-5 py-3 text-slate-600">{a.branch || '—'}</td>
              <td className="px-5 py-3 text-slate-600">{a.state || '—'}</td>
              <td className="px-5 py-3">
                {a.status ? (
                  <span className="text-xs font-medium rounded-full px-3 py-1.5 border bg-sky-50 text-sky-700 border-sky-200">
                    {a.status}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Not started</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}