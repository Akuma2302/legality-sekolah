import { useState } from 'react';
import { useMomNotes } from '../hooks/useMomNotes';
import { formatTimestamp } from '../../../utils/formatDate';

export default function MomNoteSection({ schoolId }) {
  const { notes, loading, addNote } = useMomNotes(schoolId);
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      await addNote(text);
      setText('');
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-display font-semibold text-navy-900">Minutes of Meeting (MOM)</h4>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="text-sm font-medium text-accent-500 hover:text-accent-400"
        >
          {showForm ? 'Cancel' : '+ Add MOM'}
        </button>
      </div>

      {showForm && (
        <div className="mb-4">
          <textarea
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm min-h-[120px]"
            placeholder="Write meeting notes, follow-ups, or anything the PIC needs to record…"
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
        <p className="text-sm text-slate-400">Loading notes…</p>
      ) : notes.length === 0 ? (
        <p className="text-sm text-slate-400">No MOM entries yet.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((n) => (
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
