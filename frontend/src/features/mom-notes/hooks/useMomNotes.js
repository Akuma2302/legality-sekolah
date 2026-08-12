import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../services/api';

/** Manages the Minutes-of-Meeting (MOM) notes for a single parent (a school or an alumni entry). */
export function useMomNotes(parentType, parentId) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    return api.getMomNotes(parentType, parentId).then(setNotes).finally(() => setLoading(false));
  }, [parentType, parentId]);

  useEffect(() => { reload(); }, [reload]);

  const addNote = async (content) => {
    await api.addMomNote(parentType, parentId, content);
    await reload();
  };

  const updateNote = async (id, content) => {
    await api.updateMomNote(id, content);
    await reload();
  };

  const deleteNote = async (id) => {
    await api.deleteMomNote(id);
    await reload();
  };

  return { notes, loading, addNote, updateNote, deleteNote };
}
