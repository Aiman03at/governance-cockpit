'use client'
import { useState } from 'react'
import Link from 'next/link'

interface AuditEntry {
  input: string
  result: any
  timestamp: string
}

export default function Cockpit() {
  const [output, setOutput] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showTraceback, setShowTraceback] = useState(false)
  const [history, setHistory] = useState<AuditEntry[]>([])

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
    setHistory(prev => [{
      input: output,
      result: data,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev])
    setLoading(false)
  }

  function loadFromHistory(entry: AuditEntry) {
    setOutput(entry.input)
    setResult(entry.result)
    setShowTraceback(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Nav bar */}
      <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-medium tracking-widest uppercase">
                AI Governance Cockpit
              </span>
            </Link>
            <div className="h-4 w-px bg-gray-800" />
            <span className="text-xs text-gray-500">Audit Console</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded">
              LIVE
            </span>
            <span className="text-[10px] font-mono text-gray-600">
              Aurora PostgreSQL + pgvector
            </span>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">

        {/* Sidebar — Audit History */}
        <aside className="w-72 border-r border-gray-800 p-4 hidden lg:block">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-medium tracking-widest uppercase text-gray-500">
              Audit History
            </h2>
            <span className="text-[10px] font-mono text-gray-600 bg-gray-900 px-2 py-0.5 rounded">
              {history.length} runs
            </span>
          </div>

          {history.length === 0 ? (
            <p className="text-xs text-gray-600 mt-8 text-center">
              No audits yet. Submit an AI output to begin.
            </p>
          ) : (
            <div className="space-y-2">
              {history.map((entry, i) => (
                <button
                  key={i}
                  onClick={() => loadFromHistory(entry)}
                  className="w-full text-left bg-gray-900 hover:bg-gray-800 rounded-lg p-3
                  border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    {entry.result.flagged ? (
                      <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                        FLAGGED
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">
                        CLEAN
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-gray-600">
                      {entry.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {entry.input}
                  </p>
                </button>
              ))}
            </div>
          )}
        </aside>

        {/* Main panel */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-3xl">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-xs text-gray-600">
              <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-gray-400">Audit Console</span>
            </div>

            {/* Page header */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-white mb-1.5">
                New Audit
              </h1>
              <p className="text-sm text-gray-500">
                Paste an AI output to check it against governance controls.
              </p>
            </div>

            {/* Input box */}
            <div className="bg-gray-900 rounded-xl p-6 mb-6 border border-gray-800">
              <label className="block text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">
                AI Output
              </label>
              <textarea
                className="w-full bg-gray-800 text-white rounded-lg p-4 h-36
                resize-none border border-gray-700 focus:border-amber-500/50
                focus:outline-none text-sm"
                placeholder="Paste AI output here e.g. Strong technical fit, though candidate's age and recent maternity leave may affect availability..."
                value={output}
                onChange={(e) => {
                  setOutput(e.target.value)
                  if (!e.target.value) { setResult(null); setShowTraceback(false) }
                }}
              />
              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleFlag}
                  disabled={loading || !output}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700
                  disabled:text-gray-500 text-gray-950 font-semibold py-3 px-6 rounded-lg
                  transition-colors text-sm"
                >
                  {loading ? 'Checking...' : 'Check for Violations →'}
                </button>
                {output && (
                  <button
                    onClick={() => { setOutput(''); setResult(null); setShowTraceback(false) }}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-400 font-medium
                    py-3 px-6 rounded-lg transition-colors text-sm border border-gray-700"
                  >
                    Clear
                  </button>
                )}
              </div>
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
                        className="text-amber-500 hover:text-amber-400 text-sm underline"
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
                          <p className="text-amber-500 text-sm font-medium">
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
                      <span className="text-amber-500">⬡</span>
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
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          <span className="text-[11px] font-mono text-gray-700">
            governance-cockpit.vercel.app
          </span>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-gray-700">
              NIST AI RMF · ISO 42001 · Fairness Controls
            </span>
            <span className="text-[11px] text-gray-700">·</span>
            <span className="text-[11px] text-gray-700">
              HO Hackathon 2026
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
