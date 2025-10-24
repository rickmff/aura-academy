import type { Config } from 'drizzle-kit';
import { serverEnv } from './src/lib/env';

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: serverEnv.DATABASE_URL,
  },
} satisfies Config;





