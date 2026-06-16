import { Pool } from 'pg'
import { CONTROLS } from '../lib/controls'
import { getEmbedding } from '../lib/embeddings'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function seed() {
  console.log('Seeding controls...')

  for (const control of CONTROLS) {
    console.log(`Embedding ${control.controlRef}...`)

    const embedding = await getEmbedding(control.description)
    const vectorLiteral = `[${embedding.join(',')}]`

    await pool.query(`
      INSERT INTO controls (id, framework, control_ref, description, embedding)
      VALUES ($1, $2, $3, $4, $5::vector)
      ON CONFLICT (id) DO UPDATE
      SET description = $4, embedding = $5::vector
    `, [control.id, control.framework, control.controlRef, control.description, vectorLiteral])

    console.log(`✅ ${control.controlRef} seeded`)

    // Wait 25 seconds between requests to stay under 3 RPM limit
    console.log('Waiting 25s for rate limit...')
    await sleep(25000)
  }

  console.log('🎉 All controls seeded!')
  await pool.end()
}

seed().catch(console.error)