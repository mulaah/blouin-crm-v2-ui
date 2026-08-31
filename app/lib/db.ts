import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  user: process.env.DATABASE_USER || 'bngom',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'blouin_crm_localhost',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export async function query(text: string, params?: any[]): Promise<QueryResult> {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('✅ Query executed', { duration: `${duration}ms`, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('❌ Database error:', error);
    throw error;
  }
}

export async function getClient() {
  return pool.connect();
}

export async function close() {
  await pool.end();
}

export default pool;
