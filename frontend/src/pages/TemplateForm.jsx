import { useState } from 'react';
import { api } from '../services/api';
import { PROGRAM_TYPES, BRANCHES } from '../utils/constants';

const emptyForm = {
  virality_ack_before_1: false,
  virality_ack_before_2: false,
  virality_ack_after_1: false,
  school_name: '',
  school_branch: BRANCHES[0],
  program_date: '',
  program_type: PROGRAM_TYPES[0],
  start_time: '',
  end_time: '',
  teacher_on_duty: '',
  teacher_position: '',
  students_involved: ['', '', '', '', ''],
  total_manpower: '',
  needs_additional_manpower: false,
  additional_manpower_count: '',
  sheet_program_url: '',
  main_pic_telegram: '',
  main_pic_branch: BRANCHES[0],
  legality_pic_telegram: '',
  legality_pic_branch: BRANCHES[0],
  virality_pic_telegram: '',
  virality_pic_branch: BRANCHES[0],
};

export default function TemplateForm() {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null); // { telegram_sent, telegram_error } after a successful save

  const field = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setStudent = (i, value) =>
    setForm((f) => {
      const next = [...f.students_involved];
      next[i] = value;
      return { ...f, students_involved: next };
    });

  const allAcknowledged =
    form.virality_ack_before_1 && form.virality_ack_before_2 && form.virality_ack_after_1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!allAcknowledged) {
      setError('Please confirm all Ketetapan Virality commitments before submitting.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        total_manpower: Number(form.total_manpower) || 0,
        additional_manpower_count: Number(form.additional_manpower_count) || 0,
        students_involved: form.students_involved.filter((s) => s.trim()),
      };
      const saved = await api.submitProgramForm(payload);
      setResult(saved);
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckIcon />
          </div>
          <h1 className="font-display text-xl font-semibold text-navy-900">Program submitted</h1>
          <p className="text-slate-500 mt-2 text-sm">
            {result.telegram_sent
              ? 'Your program details have been sent to the Telegram group.'
              : "Your program details were saved, but Telegram delivery didn't go through yet."}
          </p>
          {!result.telegram_sent && result.telegram_error && (
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mt-4 inline-block">
              {result.telegram_error}
            </p>
          )}
          <button
            onClick={() => setResult(null)}
            className="block mx-auto mt-6 bg-navy-900 text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-navy-800"
          >
            Submit another program
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-semibold text-navy-900">Template Form Program Sekolah</h1>
      <p className="text-slate-500 mt-1 text-sm mb-8">
        Confirm the Ketetapan Virality commitments, fill in the program details, then submit.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Ketetapan Virality */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-display font-semibold text-navy-900 mb-1">Ketetapan Virality</h2>
          <p className="text-xs text-slate-400 mb-4">
            Please tick all commitments below before submitting.
          </p>
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Sebelum Program</p>
            <CheckboxRow
              checked={form.virality_ack_before_1}
              onChange={(v) => field('virality_ack_before_1', v)}
              label="Isi Details Program Dalam Form"
            />
            <CheckboxRow
              checked={form.virality_ack_before_2}
              onChange={(v) => field('virality_ack_before_2', v)}
              label="Pantauan Content Plan & Update Posting"
            />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide pt-2">Selepas Program</p>
            <CheckboxRow
              checked={form.virality_ack_after_1}
              onChange={(v) => field('virality_ack_after_1', v)}
              label="Upload Semua Footage Dan Content Dalam Google Drive"
            />
          </div>
        </section>

        {/* Borang Program */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-display font-semibold text-navy-900 mb-1">Borang Program</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nama Sekolah">
              <input className="input" value={form.school_name} onChange={(e) => field('school_name', e.target.value)} />
            </Field>
            <Field label="Cawangan Sekolah">
              <select className="input" value={form.school_branch} onChange={(e) => field('school_branch', e.target.value)}>
                {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="Tarikh Program">
              <input type="date" className="input" value={form.program_date} onChange={(e) => field('program_date', e.target.value)} />
            </Field>
            <Field label="Jenis Program">
              <select className="input" value={form.program_type} onChange={(e) => field('program_type', e.target.value)}>
                {PROGRAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Guru Bertugas">
              <input className="input" value={form.teacher_on_duty} onChange={(e) => field('teacher_on_duty', e.target.value)} />
            </Field>
            <Field label="Jawatan Guru">
              <input className="input" value={form.teacher_position} onChange={(e) => field('teacher_position', e.target.value)} />
            </Field>
            <Field label="Masa Mula">
              <input type="time" className="input" value={form.start_time} onChange={(e) => field('start_time', e.target.value)} />
            </Field>
            <Field label="Masa Tamat">
              <input type="time" className="input" value={form.end_time} onChange={(e) => field('end_time', e.target.value)} />
            </Field>
          </div>

          <Field label="Pelajar Terlibat" hint="Isi sehingga 5 nama pelajar.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {form.students_involved.map((s, i) => (
                <input
                  key={i}
                  className="input"
                  placeholder={`Pelajar ${i + 1}`}
                  value={s}
                  onChange={(e) => setStudent(i, e.target.value)}
                />
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Jumlah Manpower">
              <input type="number" min="0" className="input" value={form.total_manpower} onChange={(e) => field('total_manpower', e.target.value)} />
            </Field>
            <Field label="Perlukan Manpower Tambahan?">
              <select
                className="input"
                value={form.needs_additional_manpower ? 'ya' : 'tidak'}
                onChange={(e) => field('needs_additional_manpower', e.target.value === 'ya')}
              >
                <option value="tidak">Tidak</option>
                <option value="ya">Ya</option>
              </select>
            </Field>
            {form.needs_additional_manpower && (
              <Field label="Jumlah Manpower Tambahan">
                <input
                  type="number"
                  min="0"
                  className="input"
                  value={form.additional_manpower_count}
                  onChange={(e) => field('additional_manpower_count', e.target.value)}
                />
              </Field>
            )}
          </div>

          <Field label="Sheet Program" hint="Pautan Google Sheet program (jika ada).">
            <input className="input" value={form.sheet_program_url} onChange={(e) => field('sheet_program_url', e.target.value)} />
          </Field>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-sm font-medium text-navy-900 mb-3">PIC Program</p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Main PIC Program">
                  <input className="input" placeholder="@telegram" value={form.main_pic_telegram} onChange={(e) => field('main_pic_telegram', e.target.value)} />
                </Field>
                <Field label="Kader Cawangan">
                  <select className="input" value={form.main_pic_branch} onChange={(e) => field('main_pic_branch', e.target.value)}>
                    {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="PIC Legality">
                  <input className="input" placeholder="@telegram" value={form.legality_pic_telegram} onChange={(e) => field('legality_pic_telegram', e.target.value)} />
                </Field>
                <Field label="Kader Cawangan">
                  <select className="input" value={form.legality_pic_branch} onChange={(e) => field('legality_pic_branch', e.target.value)}>
                    {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="PIC Virality">
                  <input className="input" placeholder="@telegram" value={form.virality_pic_telegram} onChange={(e) => field('virality_pic_telegram', e.target.value)} />
                </Field>
                <Field label="Kader Cawangan">
                  <select className="input" value={form.virality_pic_branch} onChange={(e) => field('virality_pic_branch', e.target.value)}>
                    {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          </div>
        </section>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-navy-900 text-white rounded-lg py-3 text-sm font-medium hover:bg-navy-800 disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : 'Submit'}
        </button>
      </form>
    </div>
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

function CheckboxRow({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-slate-300 text-accent-500 focus:ring-accent-500"
      />
      {label}
    </label>
  );
}

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.5 2.5L16 9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
