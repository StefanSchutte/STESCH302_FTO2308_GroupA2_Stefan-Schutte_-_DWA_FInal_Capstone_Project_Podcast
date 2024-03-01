import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL or Supabase key is not provided in environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const auth = supabase.auth;

export default supabase;