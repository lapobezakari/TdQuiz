import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function Results() {
  const { pseudo, bestScore, lastAnswers, setPseudo } = useUser()
  const navigate = useNavigate()

  const ratio = useMemo(() => {
    if (!lastAnswers.length) return 0
    return Math.round((lastAnswers.filter(a => a.correct).length / lastAnswers.length) * 100)
  }, [lastAnswers])

  const score   = lastAnswers.filter(a => a.correct).length
  const mention = ratio >= 80 ? { emoji:'🥇', label:'Excellent !', color:'#ffcc00' }
                : ratio >= 60 ? { emoji:'🥈', label:'Bien joué !', color:'#c0c0c0' }
                : ratio >= 40 ? { emoji:'🥉', label:'Pas mal !',   color:'#cd7f32' }
                :               { emoji:'💡', label:'Continue !',  color:'#ff8c00' }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#1a0800,#2d1200,#1a0500)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ width:'100%', maxWidth:'540px' }}>

        {/* Score card */}
        <div style={{ background:'rgba(255,140,0,0.06)', border:'1px solid rgba(255,140,0,0.25)', borderRadius:'20px', padding:'2rem', textAlign:'center', marginBottom:'1.2rem' }}>
          <div style={{ fontSize:'3.5rem', marginBottom:'6px' }}>{mention.emoji}</div>
          <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:mention.color, marginBottom:'4px' }}>{mention.label}</h1>
          <p style={{ color:'rgba(255,200,100,0.6)', fontSize:'13px', marginBottom:'2rem' }}>👤 {pseudo}</p>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'2rem' }}>
            {[
              { label:'Score',   value:`${score}/10`,  color:'#ff8c00' },
              { label:'Ratio',   value:`${ratio}%`,    color:'#ffcc00' },
              { label:'Record',  value:`${bestScore}/10`, color:'#ff6600' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background:'rgba(0,0,0,0.3)', borderRadius:'12px', padding:'14px 8px' }}>
                <div style={{ fontSize:'22px', fontWeight:800, color }}>{value}</div>
                <div style={{ fontSize:'11px', color:'rgba(255,200,100,0.5)', marginTop:'3px', letterSpacing:'0.5px' }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', gap:'10px' }}>
            <button onClick={() => navigate('/quiz')} style={{ flex:1, background:'linear-gradient(135deg,#ff8c00,#e65c00)', border:'none', borderRadius:'12px', padding:'13px', color:'#fff', fontWeight:700, fontSize:'14px', cursor:'pointer' }}>
              🔄 Rejouer
            </button>
            <button onClick={() => { setPseudo(null); navigate('/') }} style={{ flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,140,0,0.25)', borderRadius:'12px', padding:'13px', color:'#ff8c00', fontWeight:700, fontSize:'14px', cursor:'pointer' }}>
              🏠 Accueil
            </button>
          </div>
        </div>

        {/* Detail */}
        <div style={{ background:'rgba(255,140,0,0.04)', border:'1px solid rgba(255,140,0,0.15)', borderRadius:'16px', padding:'1.5rem' }}>
          <h3 style={{ color:'#ff8c00', fontSize:'12px', letterSpacing:'2px', marginBottom:'1rem', textTransform:'uppercase' }}>Récapitulatif</h3>
          {lastAnswers.map((a, i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'12px', padding:'10px 0', borderBottom:'1px solid rgba(255,140,0,0.08)' }}>
              <span style={{ fontSize:'18px', flexShrink:0 }}>{a.correct ? '✅' : '❌'}</span>
              <div>
                <p style={{ fontSize:'13px', color: a.correct ? '#4ade80' : '#ff6666', lineHeight:1.4 }}>{a.libelle}</p>
                {!a.correct && <p style={{ fontSize:'11px', color:'rgba(255,200,100,0.5)', marginTop:'2px' }}>Réponse : {a.bonne_reponse}</p>}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Results
