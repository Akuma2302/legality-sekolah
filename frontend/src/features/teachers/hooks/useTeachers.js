import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../services/api';

/** Manages the Teacher CRM list for a single school. */
export function useTeachers(schoolId) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    return api.getTeachers(schoolId).then(setTeachers).finally(() => setLoading(false));
  }, [schoolId]);

  useEffect(() => { reload(); }, [reload]);

  const addTeacher = async (payload) => {
    await api.addTeacher(schoolId, payload);
    await reload();
  };

  const removeTeacher = async (id) => {
    await api.deleteTeacher(id);
    await reload();
  };

  return { teachers, loading, addTeacher, removeTeacher };
}
