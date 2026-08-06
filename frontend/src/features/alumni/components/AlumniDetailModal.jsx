import { useState } from 'react';
import Modal from '../../../components/Modal';
import TeacherCRM from '../../teachers/components/TeacherCRM';
import MomNoteSection from '../../mom-notes/components/MomNoteSection';
import { api } from '../../../services/api';
import { SCHOOL_TYPES, BRANCHES, STATES, ALUMNI_STATUSES, SCHOOL_TYPE_OPTIONS } from '../../../utils/constants';
import { formatTimestamp } from '../../../utils/formatDate';

export default function AlumniDetailModal({ alumnus, onClose, onSaved }) {
  const [form, setForm] = useState({
    school_name: alumnus.school_name || '',
    pic_name: alumnus.pic_name || '',
    type: alumnus.type || SCHOOL_TYPES[0],
    school_type: alumnus.school_type || '',
    branch: alumnus.branch || '',
    state: alumnus.state || '',
    status: alumnus.status || '',
    email: alumnus.email || '',
    contact_number: alumnus.contact_number || '',
    website: alumnus.website || '',
    tiktok: alumnus.tiktok || '',
    instagram: alumnus.instagram || '',
    program_propose: alumnus.program_propose || '',
    note: alumnus.note || '',
  });
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(alumnus.updated_at);
  const [error, setError] = useState('');

  const field = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const updated = await api.updateAlumnus(alumnus.id, form);
      setSavedAt(updated.updated_at);
      onSaved?.(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={alumnus.school_name} onClose={onClose} wide>
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <Field label="Status" hint="Tracks progress on this alumni outreach.">
              <select className="input font-medium" value={form.status} onChange={(e) => field('status', e.target.value)}>
                <option value="">Not started</option>
                {ALUMNI_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 bg-navy-900 text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-navy-800 disabled:opacity-50 whitespace-nowrap"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
          <Field label="School Type">
            <select className="input" value={form.school_type} onChange={(e) => field('school_type', e.target.value)}>
              <option value="">Select school type</option>
              {SCHOOL_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
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

        <Field label="Program Propose" hint="Describe the program details being proposed.">
          <textarea
            className="input min-h-[70px]"
            value={form.program_propose}
            onChange={(e) => field('program_propose', e.target.value)}
          />
        </Field>

        <Field label="Note (for PIC reference)" hint="A short internal note only visible to your team.">
          <textarea
            className="input min-h-[70px]"
            value={form.note}
            onChange={(e) => field('note', e.target.value)}
          />
        </Field>

        <TeacherCRM parentType="alumni" parentId={alumnus.id} />
        <MomNoteSection parentType="alumni" parentId={alumnus.id} />

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