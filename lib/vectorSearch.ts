import { Pool } from 'pg'
import { getEmbedding } from './embeddings'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

export async function findMatchingControl(text: string) {
  const embedding = await getEmbedding(text)
  const vectorLiteral = `[${embedding.join(',')}]`

  console.log('Searching for matching control...')

  const result = await pool.query(`
    SELECT
      id,
      framework,
      control_ref,
      description,
      1 - (embedding <=> $1::vector) AS similarity
    FROM controls
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> $1::vector
    LIMIT 1
  `, [vectorLiteral])

  console.log('Match result:', result.rows[0])
  return result.rows[0] ?? null
}