import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { serverEnv } from '@/lib/env';

declare global {
  // eslint-disable-next-line no-var
  var __db_pool__: Pool | undefined;
  // eslint-disable-next-line no-var
  var __db_drizzle__: ReturnType<typeof drizzle> | undefined;
}

const pool = globalThis.__db_pool__ ?? new Pool({ connectionString: serverEnv.DATABASE_URL, max: 5 });
const dbInstance = globalThis.__db_drizzle__ ?? drizzle(pool);

if (process.env.NODE_ENV !== 'production') {
  globalThis.__db_pool__ = pool;
  globalThis.__db_drizzle__ = dbInstance;
}

export const db = dbInstance;



