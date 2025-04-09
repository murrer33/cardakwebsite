import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wubahsklurblyqlurwlf.supabase.co';
const supabaseAnonKey = 'qIcLToAc09ri2J1ob4mi7spVYM8Qtqos2ejXd7rlC1morKisNtH5IcdzWmx2nVloOf1HgfjrL2nKE6C0Fv6TVA==.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1YmFoc2tsdXJibHlxbHVyd2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTI2MDMsImV4cCI6MjA1OTc4ODYwM30.O8lEkNjYjfpoyVFADMx2ZbZMda6CGUYBv-T9BGhr0Eo';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase; 