import { Pool, PoolClient, QueryResult } from 'pg'

const pool = new Pool({
  user: process.env.DB_USER || 'bngom',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'blouin_crm_localhost',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

export async function query(text: string, params?: any[]): Promise<QueryResult> {
  const client = await pool.connect()
  try {
    return await client.query(text, params)
  } finally {
    client.release()
  }
}

export async function getClient(): Promise<PoolClient> {
  return pool.connect()
}

export default pool
