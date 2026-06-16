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
  'parental', 'paternity'
]

function detectViolations(output: string) {
  const lower = output.toLowerCase()
  return PROTECTED_CHARACTERISTICS.filter(c => lower.includes(c))
}

export async function POST(req: NextRequest) {
  const { output, source } = await req.json()
  const found = detectViolations(output)

  if (found.length === 0) {
    return NextResponse.json({ flagged: false, auditId: null, violations: [] })
  }

  const matchedControl = await findMatchingControl(output)
  const auditId = randomUUID()

  await pool.query(
    `INSERT INTO audit_events (id, raw_output, source) VALUES ($1, $2, $3)`,
    [auditId, output, source || 'unknown']
  )

  const violation = {
    type: 'PROTECTED_CHARACTERISTIC_REFERENCE',
    severity: 'HIGH',
    rationale: `References protected characteristics: ${found.join(', ')}. Employment AI must not factor these into assessments.`,
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