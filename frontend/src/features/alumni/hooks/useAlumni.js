import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../services/api';

/** Loads and manages the shared, public list of alumni entries (Legality → Alumni, user portal). */
export function useAlumni() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    return api.getAlumni().then(setAlumni).finally(() => setLoading(false));
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const addAlumnus = async (payload) => {
    const created = await api.createAlumnus(payload);
    setAlumni((prev) => [created, ...prev]);
    return created;
  };

  const updateAlumnus = (updated) => {
    setAlumni((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  return { alumni, loading, addAlumnus, updateAlumnus, reload };
}
