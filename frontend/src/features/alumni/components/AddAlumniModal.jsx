import { useState } from 'react';
import Modal from '../../../components/Modal';
import { SCHOOL_TYPES } from '../../../utils/constants';

export default function AddAlumniModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ school_name: '', pic_name: '', type: SCHOOL_TYPES[0] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.school_name.trim() || !form.pic_name.trim()) {
      setError('School name and PIC name are required.');
      return;
    }
    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Add school" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-navy-900 mb-1">School Name</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
            value={form.school_name}
            onChange={(e) => setForm({ ...form, school_name: e.target.value })}
            placeholder="e.g. SMK Taman Ilmu"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-900 mb-1">PIC Name</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
            value={form.pic_name}
            onChange={(e) => setForm({ ...form, pic_name: e.target.value })}
            placeholder="Person in charge"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-900 mb-1">Type</label>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            {SCHOOL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm font-medium bg-navy-900 text-white rounded-lg hover:bg-navy-800 disabled:opacity-50"
          >
            {saving ? 'Adding…' : 'Add school'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
