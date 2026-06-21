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
]

const BIAS_PROXY_PHRASES = [
  'family obligation', 'family commitment', 'family responsibilit',
  'outside commitment', 'outside obligation', 'personal commitment',
  'recent grad', 'young and energetic', 'energetic young',
  'digital native', 'culture fit', 'cultural fit',
  'child care', 'childcare burden',
  'no dependents', 'without dependents',
  'no kids', 'without kids', 'without children',
  'physical demands', 'physically demanding',
]

const SEMANTIC_SIMILARITY_THRESHOLD = 0.65

function detectKeywordViolations(output: string) {
  const lower = output.toLowerCase()
  return PROTECTED_CHARACTERISTICS.filter(c => lower.includes(c))
}

function detectProxyBias(output: string): string[] {
  const lower = output.toLowerCase()
  return BIAS_PROXY_PHRASES.filter(p => lower.includes(p))
}

export async function POST(req: NextRequest) {
  const { output, source } = await req.json()

  const keywordHits = detectKeywordViolations(output)
  const proxyHits = detectProxyBias(output)

  const matchedControl = await findMatchingControl(output)
  const semanticHit = matchedControl !== null && matchedControl.similarity >= SEMANTIC_SIMILARITY_THRESHOLD

  if (keywordHits.length === 0 && proxyHits.length === 0 && !semanticHit) {
    return NextResponse.json({ flagged: false, auditId: null, violations: [] })
  }

  const auditId = randomUUID()

  await pool.query(
    `INSERT INTO audit_events (id, raw_output, source) VALUES ($1, $2, $3)`,
    [auditId, output, source || 'unknown']
  )

  let rationale: string
  if (keywordHits.length > 0) {
    rationale = `References protected characteristics: ${keywordHits.join(', ')}. Employment AI must not factor these into assessments.`
  } else if (proxyHits.length > 0) {
    rationale = `Contains indirect proxy language for protected characteristics: "${proxyHits.join('", "')}". These phrases are commonly used as coded substitutes for age, family status, or other protected attributes in employment contexts.`
  } else {
    rationale = `Output semantically matches governance control language on protected-characteristic proxies (similarity ${Math.round(matchedControl!.similarity * 100)}%), despite containing no explicit protected-characteristic keywords. Likely indirect or coded discriminatory language.`
  }

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