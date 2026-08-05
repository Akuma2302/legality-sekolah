import { supabase } from '../config/supabase.js';

export const schoolsRepository = {
  async findByOwner(ownerId) {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async findAll() {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase.from('schools').select('*').eq('id', id).single();
    if (error) return null;
    return data;
  },

  async create({ school_name, pic_name, type, owner_id }) {
    const { data, error } = await supabase
      .from('schools')
      .insert({ school_name, pic_name, type, owner_id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('schools')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from('schools').delete().eq('id', id);
    if (error) throw error;
  },
};
