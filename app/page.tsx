'use client'

export default function Home() {
  return (
    <main style={{background:'#0a0a0b',color:'#e8e6e0',minHeight:'100vh',fontFamily:'Inter,sans-serif'}}>

      {/* Nav */}
      <nav style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 40px',borderBottom:'1px solid #1e1e20'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:'#f59e0b',animation:'pulse 2s ease-in-out infinite'}}/>
          <span style={{fontSize:13,fontWeight:500,letterSpacing:'.08em',textTransform:'uppercase'}}>AI Governance Cockpit</span>
        </div>
        <span style={{fontSize:11,fontFamily:'monospace',color:'#f59e0b',background:'#1a1500',border:'1px solid #3d2e00',padding:'4px 10px',borderRadius:3}}>HO Hackathon 2026</span>
      </nav>

      {/* Hero */}
      <div style={{padding:'80px 40px 60px',maxWidth:860}}>
        <div style={{fontSize:11,fontFamily:'monospace',color:'#f59e0b',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:24,display:'flex',alignItems:'center',gap:8}}>
          <span style={{display:'inline-block',width:20,height:1,background:'#f59e0b'}}/>
          Live governance assurance
        </div>
        <h1 style={{fontSize:52,fontWeight:300,lineHeight:1.1,letterSpacing:'-.02em',color:'#f0ede6',marginBottom:12}}>
          AI outputs.<br/><span style={{fontWeight:600,color:'#f59e0b'}}>Governed in real time.</span>
        </h1>
        <p style={{fontSize:18,fontWeight:300,color:'#9a9690',lineHeight:1.6,maxWidth:560,marginBottom:48}}>
          A compliance layer that sits between your AI systems and the people accountable for governing them. Every output checked. Every violation traced. Every flag auditable.
        </p>

        {/* Terminal */}
        <div style={{background:'#0f0f10',border:'1px solid #1e1e20',borderRadius:6,padding:24,marginBottom:48,maxWidth:680}}>
          <div style={{display:'flex',gap:6,marginBottom:16}}>
            <span style={{width:10,height:10,borderRadius:'50%',background:'#ff5f57',display:'inline-block'}}/>
            <span style={{width:10,height:10,borderRadius:'50%',background:'#febc2e',display:'inline-block'}}/>
            <span style={{width:10,height:10,borderRadius:'50%',background:'#28c840',display:'inline-block'}}/>
          </div>
          {[
            {c:'#3d3d3f',t:'$ '},{c:'#9a9690',t:'POST /api/flag'},
            {c:'#3d3d3f',t:'  output: "Strong technical fit, though candidate\'s age and maternity leave..."'},
            {c:'#1e1e20',t:'\u00a0'},
            {c:'#f59e0b',t:'⚠ VIOLATION DETECTED — HIGH severity'},
            {c:'#9a9690',t:'type: PROTECTED_CHARACTERISTIC_REFERENCE'},
            {c:'#9a9690',t:'matched_control: NIST-MANAGE-2.2 (similarity: 89%)'},
            {c:'#60a5fa',t:'audit_id: 0595e6d8-9663-40a1-8b1b-be5ee4599b08'},
            {c:'#34d399',t:'✓ Audit record written to Aurora PostgreSQL'},
          ].map((l,i)=>(
            <div key={i} style={{fontFamily:'monospace',fontSize:12,lineHeight:2,color:l.c}}>{l.t}</div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
          <a href="/cockpit" style={{background:'#f59e0b',color:'#0a0a0b',fontSize:13,fontWeight:600,padding:'12px 24px',borderRadius:4,textDecoration:'none',letterSpacing:'.04em'}}>
            Open the Cockpit →
          </a>
          <span style={{fontSize:11,fontFamily:'monospace',color:'#9a9690',background:'transparent',padding:'12px 24px',borderRadius:4,border:'1px solid #2a2a2c'}}>
            Aurora PostgreSQL + pgvector
          </span>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',borderTop:'1px solid #1e1e20',borderBottom:'1px solid #1e1e20'}}>
        {[
          {v:'12',l:'Governance controls',a:true},
          {v:'512',l:'Vector dimensions',a:false},
          {v:'<1s',l:'Flag latency',a:false},
          {v:'3',l:'Frameworks covered',a:true},
        ].map((s,i)=>(
          <div key={i} style={{padding:'32px 40px',borderRight:i<3?'1px solid #1e1e20':'none'}}>
            <div style={{fontSize:32,fontWeight:300,color:s.a?'#f59e0b':'#f0ede6',fontFamily:'monospace',marginBottom:6}}>{s.v}</div>
            <div style={{fontSize:11,color:'#6b6a65',textTransform:'uppercase',letterSpacing:'.08em'}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{padding:'64px 40px',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:32,maxWidth:1100}}>
        {[
          {n:'01',t:'Paste AI output',d:'Submit any AI-generated text from your hiring, lending, or healthcare systems.',tag:'Next.js · Vercel'},
          {n:'02',t:'Semantic violation match',d:'pgvector finds the most relevant governance control by meaning, not keywords.',tag:'Aurora · pgvector'},
          {n:'03',t:'Immutable audit trail',d:'Every flag written to Aurora with full lineage — exportable as evidence for regulators.',tag:'NIST AI RMF · ISO 42001'},
        ].map((s,i)=>(
          <div key={i} style={{borderTop:'1px solid #1e1e20',paddingTop:24}}>
            <div style={{fontFamily:'monospace',fontSize:11,color:'#3d3d3f',marginBottom:16}}>{s.n}</div>
            <div style={{fontSize:15,fontWeight:500,color:'#e8e6e0',marginBottom:8}}>{s.t}</div>
            <div style={{fontSize:13,color:'#6b6a65',lineHeight:1.6}}>{s.d}</div>
            <span style={{display:'inline-block',marginTop:12,fontSize:10,fontFamily:'monospace',color:'#f59e0b',background:'#1a1500',border:'1px solid #3d2e00',padding:'3px 8px',borderRadius:2}}>{s.tag}</span>
          </div>
        ))}
      </div>

      {/* Flag demo */}
      <div style={{margin:'0 40px 48px',border:'1px solid #2a1500',borderRadius:6,background:'#0f0a00',padding:'20px 24px',maxWidth:640,display:'flex',alignItems:'center',gap:16}}>
        <div style={{width:36,height:36,background:'#f59e0b',borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>⚠</div>
        <div style={{flex:1}}>
          <div style={{fontSize:12,fontWeight:500,color:'#f59e0b',marginBottom:4,fontFamily:'monospace'}}>PROTECTED_CHARACTERISTIC_REFERENCE</div>
          <div style={{fontSize:12,color:'#9a9690',lineHeight:1.5}}>References candidate age and family/parental status — protected characteristics. Matched to NIST-MANAGE-2.2 via semantic similarity search.</div>
        </div>
        <div style={{background:'#7c1d06',color:'#fca5a5',fontSize:10,fontFamily:'monospace',padding:'3px 8px',borderRadius:2,flexShrink:0,alignSelf:'flex-start'}}>HIGH</div>
      </div>

      {/* Stack */}
      <div style={{background:'#0f0f10',borderTop:'1px solid #1e1e20',padding:'48px 40px',display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:24,maxWidth:900}}>
        {[
          {icon:'PG',n:'Aurora PostgreSQL 17',d:'Serverless v2 on AWS. System of record for controls, audit events, violations, and risk register.'},
          {icon:'vec',n:'pgvector',d:'ivfflat index with cosine similarity. Semantic control matching — understands meaning, not just keywords.'},
          {icon:'AI',n:'Voyage AI embeddings',d:'512-dimensional embeddings for 12 verified NIST AI RMF, ISO 42001, and fairness controls.'},
          {icon:'▲',n:'Next.js on Vercel',d:'Hero interaction: paste → flag → traceback → audit export. Live at governance-cockpit.vercel.app'},
        ].map((s,i)=>(
          <div key={i} style={{display:'flex',gap:16,alignItems:'flex-start'}}>
            <div style={{width:36,height:36,border:'1px solid #1e1e20',borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontFamily:'monospace',fontSize:10,color:'#f59e0b',background:'#0a0a0b'}}>{s.icon}</div>
            <div>
              <div style={{fontSize:13,fontWeight:500,color:'#e8e6e0',marginBottom:3}}>{s.n}</div>
              <div style={{fontSize:12,color:'#6b6a65',lineHeight:1.5}}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer style={{borderTop:'1px solid #1e1e20',padding:'24px 40px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontSize:11,color:'#3d3d3f',fontFamily:'monospace'}}>governance-cockpit.vercel.app</span>
        <span style={{fontSize:11,color:'#3d3d3f'}}>Built for HO Hackathon · June 2026</span>
      </footer>

    </main>
  )
}