import 'server-only';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { serverEnv } from '../env';
import * as schema from './schema';

let pool: Pool | undefined;

function createPool(): Pool {
  // Each limit keeps a stalled database from holding a request until the function times out.
  const created = new Pool({
    connectionString: serverEnv().DATABASE_URL,
    connectionTimeoutMillis: 3000,
    query_timeout: 3000,
    statement_timeout: 3000,
    idleTimeoutMillis: 10000,
  });
  // An idle connection dropped by the server emits 'error'; without a listener it becomes an
  // uncaught exception whose log includes the connection parameters.
  created.on('error', () => {
    console.error('database: an idle connection was closed');
  });
  return created;
}

export function db() {
  pool ??= createPool();
  return drizzle({ client: pool, schema });
}
