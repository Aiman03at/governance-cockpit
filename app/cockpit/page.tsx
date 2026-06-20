'use client'
import { useState } from 'react'

export default function Home() {
  const [output, setOutput] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showTraceback, setShowTraceback] = useState(false)

  async function handleFlag() {
    setLoading(true)
    setResult(null)
    setShowTraceback(false)
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
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            AI Governance Cockpit
          </h1>
          <p className="text-gray-400">
            Paste an AI output below to check it against governance controls.
          </p>
        </div>

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
            onChange={(e) => {
              setOutput(e.target.value)
              if (!e.target.value) { setResult(null); setShowTraceback(false) }
            }}
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
          <div className="space-y-4">

            {/* Flag status bar */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
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
                  {result.auditId && (
                    <span className="text-gray-500 text-sm">
                      Audit ID: {result.auditId}
                    </span>
                  )}
                </div>
                {result.flagged && (
                  <button
                    onClick={() => setShowTraceback(!showTraceback)}
                    className="text-blue-400 hover:text-blue-300 text-sm underline"
                  >
                    {showTraceback ? 'Hide traceback' : 'View full traceback →'}
                  </button>
                )}
              </div>

              {/* Violation cards */}
              {result.violations?.map((v: any, i: number) => (
                <div key={i} className="bg-gray-800 rounded-lg p-5 mb-4
                border border-red-500/20">
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
                  <p className="text-gray-300 text-sm mb-4">{v.rationale}</p>

                  {v.matchedControl && (
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <p className="text-xs text-gray-500 mb-1">Matched Control</p>
                      <p className="text-blue-400 text-sm font-medium">
                        {v.matchedControl.ref}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {v.matchedControl.description}
                      </p>
                      {v.matchedControl.similarity && (
                        <p className="text-green-400 text-xs mt-2">
                          Semantic similarity: {v.matchedControl.similarity}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Traceback panel */}
            {showTraceback && (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-white font-semibold mb-6 flex items-center gap-2">
                  <span className="text-blue-400">⬡</span>
                  Full Audit Traceback
                </h2>

                {/* Step 1 */}
                <div className="flex gap-4 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-700 text-gray-300
                    text-xs flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div className="w-px flex-1 bg-gray-700 mt-2"/>
                  </div>
                  <div className="pb-6">
                    <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">
                      AI Output Submitted
                    </p>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <p className="text-white text-sm">{output}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        Source: TalentCo résumé screener
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                {result.violations?.map((v: any, i: number) => (
                  <div key={i} className="flex gap-4 mb-6">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-red-900 text-red-300
                      text-xs flex items-center justify-center font-bold flex-shrink-0">
                        2
                      </div>
                      <div className="w-px flex-1 bg-gray-700 mt-2"/>
                    </div>
                    <div className="pb-6">
                      <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">
                        Violation Detected
                      </p>
                      <div className="bg-red-950/40 rounded-lg p-4 border border-red-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-red-400 text-sm font-medium">
                            {v.type.replaceAll('_', ' ')}
                          </p>
                          <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded font-bold">
                            {v.severity}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{v.rationale}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Step 3 */}
                {result.violations?.map((v: any, i: number) => v.matchedControl && (
                  <div key={i} className="flex gap-4 mb-6">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-900 text-blue-300
                      text-xs flex items-center justify-center font-bold flex-shrink-0">
                        3
                      </div>
                      <div className="w-px flex-1 bg-gray-700 mt-2"/>
                    </div>
                    <div className="pb-6">
                      <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">
                        Governance Control Matched via pgvector
                      </p>
                      <div className="bg-blue-950/40 rounded-lg p-4 border border-blue-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-blue-400 text-sm font-medium">
                            {v.matchedControl.ref}
                          </p>
                          <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                            {v.matchedControl.similarity} match
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">
                          {v.matchedControl.description}
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                          Framework: {v.matchedControl.framework}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-green-900 text-green-300
                    text-xs flex items-center justify-center font-bold flex-shrink-0">
                      4
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">
                      Audit Record Written to Aurora PostgreSQL
                    </p>
                    <div className="bg-green-950/40 rounded-lg p-4 border border-green-500/20">
                      <p className="text-green-400 text-sm font-mono">
                        {result.auditId}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        Timestamp: {new Date().toISOString()}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Immutable audit trail written · exportable as evidence
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}