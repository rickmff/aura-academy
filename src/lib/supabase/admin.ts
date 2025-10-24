import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { clientEnv } from '@/lib/env-client';
import { serverEnv } from '@/lib/env-server';

export function createSupabaseAdminClient() {
  if (!serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }
  return createClient(clientEnv.NEXT_PUBLIC_SUPABASE_URL, serverEnv.SUPABASE_SERVICE_ROLE_KEY);
}


