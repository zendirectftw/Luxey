import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client (uses service role key for admin operations)
// For now, we use the anon key since we haven't set up RLS policies yet
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createServerSupabase() {
    return createClient(supabaseUrl, supabaseKey);
}
