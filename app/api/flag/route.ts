import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { output, source } = await req.json()

  // Hardcoded mock for now — Safi replaces with real engine
  return NextResponse.json({
    flagged: true,
    auditId: "mock-audit-id-001",
    violations: [
      {
        type: "PROTECTED_CHARACTERISTIC_REFERENCE",
        severity: "HIGH",
        rationale: "References candidate age and family/parental status — protected characteristics.",
        matchedControl: {
          ref: "NIST-MANAGE-2.2",
          description: "Monitor AI outputs for bias against protected groups."
        }
      }
    ]
  })
}