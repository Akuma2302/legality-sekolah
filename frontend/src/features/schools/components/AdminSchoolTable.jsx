import { useState } from 'react';
import { LEGALITY_STATUS_STYLES, LEGALITY_STATUSES } from '../../../utils/constants';

export default function AdminSchoolTable({ schools, onStatusChange, onRowClick }) {
  const [updatingId, setUpdatingId] = useState(null);

  const handleChange = async (schoolId, status) => {
    setUpdatingId(schoolId);
    try {
      await onStatusChange(schoolId, status);
    } finally {
      setUpdatingId(null);
    }
  };

  if (schools.length === 0) {
    return <p className="text-sm text-slate-400 py-12 text-center">No schools have been added yet.</p>;
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
            <th className="px-5 py-3 font-medium">Contact</th>
            <th className="px-5 py-3 font-medium">Legality Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {schools.map((s) => (
            <tr
              key={s.id}
              onClick={() => onRowClick?.(s)}
              className="hover:bg-slate-50/60 cursor-pointer"
            >
              <td className="px-5 py-3 font-medium text-navy-900">{s.school_name}</td>
              <td className="px-5 py-3 text-slate-600">{s.pic_name}</td>
              <td className="px-5 py-3 text-slate-600">{s.type}</td>
              <td className="px-5 py-3 text-slate-600">{s.branch || '—'}</td>
              <td className="px-5 py-3 text-slate-600">{s.state || '—'}</td>
              <td className="px-5 py-3 text-slate-500">
                {s.email || s.contact_number ? (
                  <span className="text-xs">{s.email || s.contact_number}</span>
                ) : (
                  '—'
                )}
              </td>
              <td className="px-5 py-3">
                <select
                  className={`text-xs font-medium rounded-full px-3 py-1.5 border ${LEGALITY_STATUS_STYLES[s.legality_status] || ''} disabled:opacity-50`}
                  value={s.legality_status}
                  disabled={updatingId === s.id}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleChange(s.id, e.target.value)}
                >
                  {LEGALITY_STATUSES.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
