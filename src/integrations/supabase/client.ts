import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const supabase = createClient<Database>(process.env.REACT_APP_SUPABASE_URL!, process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY!, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});