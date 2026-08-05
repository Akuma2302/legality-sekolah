import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../services/api';

/** Loads and manages the current user's own schools (Legality → Sekolah, user portal). */
export function useMySchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    return api.getMySchools().then(setSchools).finally(() => setLoading(false));
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const addSchool = async (payload) => {
    const created = await api.createSchool(payload);
    setSchools((prev) => [created, ...prev]);
    return created;
  };

  const updateSchool = (updated) => {
    setSchools((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  return { schools, loading, addSchool, updateSchool, reload };
}
