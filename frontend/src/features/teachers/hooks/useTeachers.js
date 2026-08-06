import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../services/api';

/** Manages the Teacher CRM list for a single parent (a school or an alumni entry). */
export function useTeachers(parentType, parentId) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    return api.getTeachers(parentType, parentId).then(setTeachers).finally(() => setLoading(false));
  }, [parentType, parentId]);

  useEffect(() => { reload(); }, [reload]);

  const addTeacher = async (payload) => {
    await api.addTeacher(parentType, parentId, payload);
    await reload();
  };

  const removeTeacher = async (id) => {
    await api.deleteTeacher(id);
    await reload();
  };

  return { teachers, loading, addTeacher, removeTeacher };
}
