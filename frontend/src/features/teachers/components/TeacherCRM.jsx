import { useState } from 'react';
import { useTeachers } from '../hooks/useTeachers';
import { STATES } from '../../../utils/constants';

const emptyForm = { name: '', position: '', subject: '', phone: '', state: STATES[0] };

export default function TeacherCRM({ parentType, parentId }) {
  const { teachers, loading, addTeacher, removeTeacher } = useTeachers(parentType, parentId);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await addTeacher(form);
      setForm(emptyForm);
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-display font-semibold text-navy-900">Teacher CRM</h4>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="text-sm font-medium text-accent-500 hover:text-accent-400"
        >
          {showForm ? 'Cancel' : '+ Add Teacher'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 rounded-lg p-4">
          <input
            className="col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Teacher Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Position"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Subject Teach"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Fon Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          >
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            type="submit"
            disabled={saving}
            className="col-span-2 bg-navy-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-navy-800 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save teacher'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-slate-400">Loading teachers…</p>
      ) : teachers.length === 0 ? (
        <p className="text-sm text-slate-400">No teachers added yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {teachers.map((t) => (
            <li key={t.id} className="py-2 flex items-center justify-between text-sm">
              <div>
                <span className="font-medium text-navy-900">{t.name}</span>
                <span className="text-slate-500"> — {t.position || '—'} · {t.subject || '—'}</span>
                <div className="text-slate-400 text-xs">{t.phone || '—'} · {t.state || '—'}</div>
              </div>
              <button onClick={() => removeTeacher(t.id)} className="text-slate-400 hover:text-red-500 text-xs">
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
