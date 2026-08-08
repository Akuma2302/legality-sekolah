import { useState } from 'react';
import Modal from '../../../components/Modal';
import TeacherCRM from '../../teachers/components/TeacherCRM';
import MomNoteSection from '../../mom-notes/components/MomNoteSection';
import { api } from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';
import { SCHOOL_TYPES, BRANCHES, STATES, LEGALITY_STATUSES, LEGALITY_STATUS_STYLES } from '../../../utils/constants';
import { formatTimestamp } from '../../../utils/formatDate';

export default function SchoolDetailModal({ school, onClose, onSaved }) {
  const { role } = useAuth();
  const isAdmin = role === 'admin';

  const [form, setForm] = useState({
    school_name: school.school_name || '',
    pic_name: school.pic_name || '',
    type: school.type || SCHOOL_TYPES[0],
    branch: school.branch || '',
    state: school.state || '',
    email: school.email || '',
    contact_number: school.contact_number || '',
    website: school.website || '',
    tiktok: school.tiktok || '',
    instagram: school.instagram || '',
    note: school.note || '',
    legality_status: school.legality_status || LEGALITY_STATUSES[LEGALITY_STATUSES.length - 1],
  });
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(school.updated_at);
  const [error, setError] = useState('');

  const field = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const { legality_status, ...editableFields } = form;
      let updated = await api.updateSchool(school.id, editableFields);
      if (isAdmin) {
        updated = await api.updateLegalityStatus(school.id, legality_status);
      }
      setSavedAt(updated.updated_at);
      onSaved?.(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={school.school_name} onClose={onClose} wide>
      <div className="space-y-6">
        {isAdmin && (
          <Field label="Legality Status" hint="Only admins can see and change this.">
            <select
              className={`input font-medium ${LEGALITY_STATUS_STYLES[form.legality_status] || ''}`}
              value={form.legality_status}
              onChange={(e) => field('legality_status', e.target.value)}
            >
              {LEGALITY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="School Name">
            <input className="input" value={form.school_name} onChange={(e) => field('school_name', e.target.value)} />
          </Field>
          <Field label="PIC Name">
            <input className="input" value={form.pic_name} onChange={(e) => field('pic_name', e.target.value)} />
          </Field>
          <Field label="Type">
            <select className="input" value={form.type} onChange={(e) => field('type', e.target.value)}>
              {SCHOOL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Branch">
            <select className="input" value={form.branch} onChange={(e) => field('branch', e.target.value)}>
              <option value="">Select branch</option>
              {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </Field>
          <Field label="State">
            <select className="input" value={form.state} onChange={(e) => field('state', e.target.value)}>
              <option value="">Select state</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="School Email">
            <input className="input" type="email" value={form.email} onChange={(e) => field('email', e.target.value)} />
          </Field>
          <Field label="Contact Number">
            <input className="input" value={form.contact_number} onChange={(e) => field('contact_number', e.target.value)} />
          </Field>
          <Field label="Website">
            <input className="input" value={form.website} onChange={(e) => field('website', e.target.value)} />
          </Field>
          <Field label="TikTok">
            <input className="input" value={form.tiktok} onChange={(e) => field('tiktok', e.target.value)} />
          </Field>
          <Field label="Instagram">
            <input className="input" value={form.instagram} onChange={(e) => field('instagram', e.target.value)} />
          </Field>
        </div>

        <Field label="Note (for PIC reference)" hint="A short internal note only visible to your team.">
          <textarea
            className="input min-h-[70px]"
            value={form.note}
            onChange={(e) => field('note', e.target.value)}
          />
        </Field>

        <TeacherCRM parentType="school" parentId={school.id} />
        <MomNoteSection parentType="school" parentId={school.id} />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            {savedAt ? `Last saved ${formatTimestamp(savedAt)}` : 'Not saved yet'}
          </p>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-navy-900 text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-navy-800 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-900 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}
