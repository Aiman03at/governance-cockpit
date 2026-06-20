import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { findMatchingControl } from '../../../lib/vectorSearch'
import { randomUUID } from 'crypto'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

const PROTECTED_CHARACTERISTICS = [
  'age', 'maternity', 'pregnancy', 'gender', 'race',
  'religion', 'disability', 'nationality', 'ethnicity',
  'sexual orientation', 'family status', 'marital status',
  'parental', 'paternity',
  // Indirect proxies — common coded language for protected characteristics
  'family obligations', 'family commitments', 'family responsibilities',
  'recent graduate', 'energetic young', 'digital native',
]

// Similarity threshold for semantic (meaning-based) detection.
// Lowered to 0.72 so indirect/coded language (e.g. "energetic recent graduates
// without family obligations") crosses the bar even with no explicit
// protected-characteristic keyword present.
const SEMANTIC_SIMILARITY_THRESHOLD = 0.72

function detectKeywordViolations(output: string) {
  const lower = output.toLowerCase()
  return PROTECTED_CHARACTERISTICS.filter(c => lower.includes(c))
}

export async function POST(req: NextRequest) {
  const { output, source } = await req.json()

  const keywordHits = detectKeywordViolations(output)

  // Always run semantic matching — this is what makes "meaning, not
  // keywords" true. Previously this only ran after a keyword hit, so
  // indirect/coded language never reached pgvector at all.
  const matchedControl = await findMatchingControl(output)
  const semanticHit = matchedControl !== null && matchedControl.similarity >= SEMANTIC_SIMILARITY_THRESHOLD

  if (keywordHits.length === 0 && !semanticHit) {
    return NextResponse.json({ flagged: false, auditId: null, violations: [] })
  }

  const auditId = randomUUID()

  await pool.query(
    `INSERT INTO audit_events (id, raw_output, source) VALUES ($1, $2, $3)`,
    [auditId, output, source || 'unknown']
  )

  const rationale = keywordHits.length > 0
    ? `References protected characteristics: ${keywordHits.join(', ')}. Employment AI must not factor these into assessments.`
    : `Output semantically matches governance control language on protected-characteristic proxies (similarity ${Math.round(matchedControl.similarity * 100)}%), despite containing no explicit protected-characteristic keywords. Likely indirect or coded discriminatory language.`

  const violation = {
    type: 'PROTECTED_CHARACTERISTIC_REFERENCE',
    severity: 'HIGH',
    rationale,
    matchedControl: matchedControl ? {
      ref: matchedControl.control_ref,
      framework: matchedControl.framework,
      description: matchedControl.description,
      similarity: Math.round(matchedControl.similarity * 100) + '%'
    } : null
  }

  await pool.query(
    `INSERT INTO violations (id, audit_event_id, violation_type, severity, rationale, matched_control_id)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [randomUUID(), auditId, violation.type, violation.severity, violation.rationale, matchedControl?.id ?? null]
  )

  return NextResponse.json({ flagged: true, auditId, violations: [violation] })
}