import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../services/api';

/** Loads and manages every school across all PICs (Legality (Sekolah), admin portal). */
export function useAllSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    return api.getAllSchools().then(setSchools).finally(() => setLoading(false));
  }, []);

  useEffect(() => { reload(); }, [reload]);

  /** Replaces one school in local state — used after any save (status dropdown or full detail modal). */
  const applyUpdate = (updated) => {
    setSchools((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const updateLegalityStatus = async (schoolId, status) => {
    const updated = await api.updateLegalityStatus(schoolId, status);
    applyUpdate(updated);
    return updated;
  };

  return { schools, loading, updateLegalityStatus, applyUpdate, reload };
}
