import { Pool } from 'pg'
import { getEmbedding } from './embeddings'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

export async function findMatchingControl(text: string) {
  const embedding = await getEmbedding(text)
  const vectorLiteral = `[${embedding.join(',')}]`

  const result = await pool.query(`
    SELECT
      id,
      framework,
      control_ref,
      description,
      1 - (embedding <=> $1::vector) AS similarity
    FROM controls
    ORDER BY embedding <=> $1::vector
    LIMIT 1
  `, [vectorLiteral])

  return result.rows[0] ?? null
}