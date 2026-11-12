import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { serverEnv } from '../env';
import * as schema from './schema';

let pool: Pool | undefined;

export function db() {
  pool ??= new Pool({ connectionString: serverEnv().DATABASE_URL, connectionTimeoutMillis: 3000 });
  return drizzle({ client: pool, schema });
}
