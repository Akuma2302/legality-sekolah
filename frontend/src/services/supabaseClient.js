import { createClient } from '@supabase/supabase-js';

// Public anon key only — safe for frontend. Used only for login/session,
// never for direct data access (that goes through the backend API).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
