import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file'
  );
}

export const getSupabaseClient = () => {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error('No authenticated user found');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        'x-clerk-user-id': userId
      }
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
}; 