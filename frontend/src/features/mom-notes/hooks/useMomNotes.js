import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../services/api';

/** Manages the Minutes-of-Meeting (MOM) notes for a single school. */
export function useMomNotes(schoolId) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    return api.getMomNotes(schoolId).then(setNotes).finally(() => setLoading(false));
  }, [schoolId]);

  useEffect(() => { reload(); }, [reload]);

  const addNote = async (content) => {
    await api.addMomNote(schoolId, content);
    await reload();
  };

  return { notes, loading, addNote };
}
