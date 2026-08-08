import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../services/api';

/** Loads and manages the shared, public list of Random entries. */
export function useRandomEntries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    return api.getRandomEntries().then(setEntries).finally(() => setLoading(false));
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const addEntry = async (payload) => {
    const created = await api.createRandomEntry(payload);
    setEntries((prev) => [created, ...prev]);
    return created;
  };

  const updateEntry = (updated) => {
    setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  return { entries, loading, addEntry, updateEntry, reload };
}
