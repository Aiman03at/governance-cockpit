'use client'
import { useState } from 'react'

export default function Home() {
  const [output, setOutput] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function handleFlag() {
    setLoading(true)
    const res = await fetch('/api/flag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ output, source: 'TalentCo résumé screener' })
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">
          AI Governance Cockpit
        </h1>
        <p className="text-gray-400 mb-8">
          Paste an AI output below to check it against governance controls.
        </p>

        {/* Input box */}
        <div className="bg-gray-900 rounded-xl p-6 mb-6 border border-gray-800">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            AI Output
          </label>
          <textarea
            className="w-full bg-gray-800 text-white rounded-lg p-4 h-36 
            resize-none border border-gray-700 focus:border-blue-500 
            focus:outline-none text-sm"
            placeholder="Paste AI output here e.g. Strong technical fit, though candidate's age and recent maternity leave may affect availability..."
            value={output}
            onChange={(e) => setOutput(e.target.value)}
          />
          <button
            onClick={handleFlag}
            disabled={loading || !output}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700
            disabled:text-gray-500 text-white font-semibold py-3 px-6 rounded-lg 
            transition-colors"
          >
            {loading ? 'Checking...' : 'Check for Violations →'}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            {/* Flag status */}
            <div className="flex items-center gap-3 mb-6">
              {result.flagged ? (
                <span className="bg-red-500/20 text-red-400 border border-red-500/30 
                px-3 py-1 rounded-full text-sm font-medium">
                  ⚠ Violations Found
                </span>
              ) : (
                <span className="bg-green-500/20 text-green-400 border border-green-500/30 
                px-3 py-1 rounded-full text-sm font-medium">
                  ✓ No Violations
                </span>
              )}
              <span className="text-gray-500 text-sm">
                Audit ID: {result.auditId}
              </span>
            </div>

            {/* Violations list */}
            {result.violations?.map((v: any, i: number) => (
              <div key={i} className="bg-gray-800 rounded-lg p-5 mb-4 
              border border-red-500/20">
                {/* Severity badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium text-sm">
                    {v.type.replaceAll('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    v.severity === 'HIGH' 
                      ? 'bg-red-500/20 text-red-400' 
                      : v.severity === 'MEDIUM'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {v.severity}
                  </span>
                </div>

                {/* Rationale */}
                <p className="text-gray-300 text-sm mb-4">{v.rationale}</p>

                {/* Matched control */}
                {v.matchedControl && (
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <p className="text-xs text-gray-500 mb-1">Matched Control</p>
                    <p className="text-blue-400 text-sm font-medium">
                      {v.matchedControl.ref}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {v.matchedControl.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}