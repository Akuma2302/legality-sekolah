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

  const updateLegalityStatus = async (schoolId, status) => {
    const updated = await api.updateLegalityStatus(schoolId, status);
    setSchools((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    return updated;
  };

  return { schools, loading, updateLegalityStatus, reload };
}
