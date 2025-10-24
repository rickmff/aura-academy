import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { serverEnv } from '@/lib/env';

const pool = new Pool({ connectionString: serverEnv.DATABASE_URL, max: 5 });

export const db = drizzle(pool);



