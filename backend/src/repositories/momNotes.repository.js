import { supabase } from '../config/supabase.js';

export const momNotesRepository = {
  async findBySchool(schoolId) {
    const { data, error } = await supabase
      .from('mom_notes')
      .select('*')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(schoolId, content) {
    const { data, error } = await supabase
      .from('mom_notes')
      .insert({ school_id: schoolId, content })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
