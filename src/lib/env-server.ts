import { z } from 'zod';

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z
    .string()
    .refine(
      (v) => v.startsWith('postgres') || v.startsWith('postgresql'),
      'DATABASE_URL deve ser uma URL Postgres válida'
    ),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
});

export const serverEnv = serverEnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
});


