import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lxzlqvfijioujvnnulqh.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };