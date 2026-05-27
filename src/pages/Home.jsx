import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const S = {
  page: { minHeight:'100vh', background:'linear-gradient(135deg,#1a0800,#2d1200,#1a0500)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' },
  card: { background:'rgba(255,140,0,0.07)', border:'1px solid rgba(255,140,0,0.25)', borderRadius:'24px', padding:'3rem 2.5rem', width:'100%', maxWidth:'440px', textAlign:'center' },
  title: { fontSize:'2.8rem', fontWeight:800, background:'linear-gradient(90deg,#ff8c00,#ffcc00)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'3px', marginBottom:'6px' },
  sub: { color:'#cc8800', fontSize:'13px', letterSpacing:'2px', marginBottom:'2.5rem' },
  input: { width:'100%', background:'rgba(0,0,0,0.4)', border:'2px solid rgba(255,140,0,0.3)', borderRadius:'12px', padding:'14px 18px', color:'#fff', fontSize:'15px', outline:'none', marginBottom:'1rem', textAlign:'center' },
  btn: { width:'100%', background:'linear-gradient(135deg,#ff8c00,#e65c00)', border:'none', borderRadius:'12px', padding:'14px', color:'#fff', fontWeight:700, fontSize:'16px', cursor:'pointer', letterSpacing:'1px' },
  score: { color:'#ffcc00', fontSize:'13px', marginBottom:'1.2rem' },
  divider: { borderTop:'1px solid rgba(255,140,0,0.15)', margin:'1.5rem 0' },
  cat: { display:'flex', justifyContent:'center', gap:'8px', flexWrap:'wrap', marginBottom:'2rem' },
  badge: { fontSize:'11px', padding:'4px 12px', borderRadius:'20px', background:'rgba(255,140,0,0.1)', color:'#ffaa33', border:'1px solid rgba(255,140,0,0.2)' }
}

function Home() {
  const [input, setInput] = useState('')
  const { setPseudo, bestScore } = useUser()
  const navigate = useNavigate()

  function handleStart() {
    if (!input.trim()) return
    setPseudo(input.trim())
    navigate('/quiz')
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={{ fontSize:'3.5rem', marginBottom:'0.5rem' }}>🧩</div>
        <h1 style={S.title}>BRAINWAVE</h1>
        <p style={S.sub}>F1 · MOTOGP · NBA · MANGA · ANIME</p>
        <div style={S.cat}>
           {['🏎 F1','🏍 MotoGP','🏀 NBA','📚 Manga','🎌 Anime'].map(c => (
            <span key={c} style={S.badge}>{c}</span>
          ))}
        </div>
        {bestScore > 0 && <p style={S.score}>🏅 Ton record : {bestScore} / 10</p>}
        <input
          style={S.input}
          type="text"
          placeholder="Ton pseudo..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleStart()}
        />
        <button style={S.btn} onClick={handleStart}>LANCER LE DÉFI →</button>
        <div style={S.divider} />
        <p style={{ color:'rgba(255,140,0,0.4)', fontSize:'12px' }}>10 questions · 60 secondes · Bonne chance !</p>
      </div>
    </div>
  )
}

export default Home
