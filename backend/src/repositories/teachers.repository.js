import { supabase } from '../config/supabase.js';

export const teachersRepository = {
  async findBySchool(schoolId) {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase.from('teachers').select('*').eq('id', id).single();
    if (error) return null;
    return data;
  },

  async create(schoolId, { name, position, subject, phone, state }) {
    const { data, error } = await supabase
      .from('teachers')
      .insert({ school_id: schoolId, name, position, subject, phone, state })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from('teachers').delete().eq('id', id);
    if (error) throw error;
  },
};
