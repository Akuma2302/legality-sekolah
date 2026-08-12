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
  const { notes, loading, addNote, updateNote, deleteNote } = useMomNotes(parentType, parentId);
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditText(note.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    setEditSaving(true);
    try {
      await updateNote(id, editText);
      setEditingId(null);
      setEditText('');
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteNote(id);
    } finally {
      setDeletingId(null);
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
          {visibleNotes.map((n) => {
            const isEditing = editingId === n.id;
            const wasEdited = n.updated_at && n.updated_at !== n.created_at;

            return (
              <li key={n.id} className="bg-slate-50 rounded-lg p-3 text-sm">
                {isEditing ? (
                  <div>
                    <textarea
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm min-h-[100px] bg-white"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      autoFocus
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => saveEdit(n.id)}
                        disabled={editSaving}
                        className="bg-navy-900 text-white rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-navy-800 disabled:opacity-50"
                      >
                        {editSaving ? 'Saving…' : 'Save'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-xs font-medium text-slate-500 hover:text-slate-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-navy-900 whitespace-pre-wrap flex-1">{n.content}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => startEdit(n)}
                          className="text-xs font-medium text-accent-500 hover:text-accent-400"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(n.id)}
                          disabled={deletingId === n.id}
                          className="text-xs font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
                        >
                          {deletingId === n.id ? 'Deleting…' : 'Delete'}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      {formatTimestamp(n.created_at)}
                      {wasEdited && <span className="italic"> · edited {formatTimestamp(n.updated_at)}</span>}
                    </p>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
