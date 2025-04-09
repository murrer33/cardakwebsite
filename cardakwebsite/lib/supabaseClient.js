import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wubahsklurblyqlurwlf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1YmFoc2tsdXJibHlxbHVyd2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTI2MDMsImV4cCI6MjA1OTc4ODYwM30.O8lEkNjYjfpoyVFADMx2ZbZMda6CGUYBv-T9BGhr0Eo';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase; 