import { useMemo, useState } from 'react';
import { useMomNotes } from '../hooks/useMomNotes';
import { formatTimestamp } from '../../../utils/formatDate';
import { buildWeekOptions, isInWeek } from '../../../utils/weekOptions';

export default function MomNoteSection({
  parentType,
  parentId,
  title = 'Minutes of Meeting (MOM)',
  addLabel = '+ Add MOM',
  placeholder = 'Write meeting notes, follow-ups, or anything the PIC needs to record…',
}) {
  const { notes, loading, addNote } = useMomNotes(parentType, parentId);
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const { options: weekOptions, currentWeekKey, nextWeekKey } = useMemo(() => buildWeekOptions(notes), [notes]);
  const [selectedWeek, setSelectedWeek] = useState(currentWeekKey);

  // Keep the selection valid if the notes list changes (e.g. right after adding the first entry)
  const activeWeek = weekOptions.some((w) => w.key === selectedWeek) ? selectedWeek : currentWeekKey;

  const visibleNotes = notes.filter((n) => isInWeek(n.created_at, activeWeek));

  const handleSave = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      await addNote(text);
      setText('');
      setShowForm(false);
      setSelectedWeek(currentWeekKey); // jump back to this week so the new entry is visible
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl p-4 mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <h4 className="font-display font-semibold text-navy-900">{title}</h4>
        <div className="flex items-center gap-2">
          <select
            value={activeWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600"
          >
            {weekOptions.map((w) => (
              <option key={w.key} value={w.key}>
                {w.key === currentWeekKey
                  ? `This week (${w.label})`
                  : w.key === nextWeekKey
                    ? `Next week (${w.label})`
                    : w.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="text-sm font-medium text-accent-500 hover:text-accent-400 whitespace-nowrap"
          >
            {showForm ? 'Cancel' : addLabel}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-4">
          <textarea
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm min-h-[120px]"
            placeholder={placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-2 bg-navy-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-navy-800 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : visibleNotes.length === 0 ? (
        <p className="text-sm text-slate-400">
          {notes.length === 0 ? 'No entries yet.' : 'No entries for this week.'}
        </p>
      ) : (
        <ul className="space-y-3">
          {visibleNotes.map((n) => (
            <li key={n.id} className="bg-slate-50 rounded-lg p-3 text-sm">
              <p className="text-navy-900 whitespace-pre-wrap">{n.content}</p>
              <p className="text-xs text-slate-400 mt-2">{formatTimestamp(n.created_at)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
