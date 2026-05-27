import { useReducer, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import useFetch from '../hooks/useFetch'

const initialState = { index: 0, score: 0, answers: [], statut: 'playing', selected: null }

function quizReducer(state, action) {
  switch (action.type) {
    case 'START_QUIZ':
      return initialState
    case 'ANSWER_QUESTION': {
      const correct = action.payload.reponse === action.payload.bonne_reponse
      return {
        ...state,
        score: correct ? state.score + 1 : state.score,
        answers: [...state.answers, { ...action.payload, correct }],
        selected: action.payload.reponse,
      }
    }
    case 'NEXT_QUESTION':
      return { ...state, index: state.index + 1, selected: null }
    case 'FINISH_QUIZ':
      return { ...state, statut: 'finished' }
    default:
      return state
  }
}

const catColors = {
  'Science':    { bg:'rgba(0,200,255,0.15)', color:'#00c8ff', border:'rgba(0,200,255,0.3)' },
  'Histoire':   { bg:'rgba(255,200,0,0.15)', color:'#ffc800', border:'rgba(255,200,0,0.3)' },
  'Géographie': { bg:'rgba(0,255,120,0.15)', color:'#00ff78', border:'rgba(0,255,120,0.3)' },
  'Cinéma':     { bg:'rgba(255,80,180,0.15)', color:'#ff50b4', border:'rgba(255,80,180,0.3)' },
  'Musique':    { bg:'rgba(255,140,0,0.15)',  color:'#ff8c00', border:'rgba(255,140,0,0.3)' },
}

function Loader({ msg }) {
  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#1a0800,#2d1200,#1a0500)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem' }}>
      <div style={{ fontSize:'2rem' }}>⚡</div>
      <p style={{ color:'#ff8c00' }}>{msg}</p>
    </div>
  )
}

function QuizEngine() {
  const [state, dispatch]       = useReducer(quizReducer, initialState)
  const [timeLeft, setTimeLeft] = useState(60)
  const { data: questions, loading, error } = useFetch('/questions.json')
  const { pseudo, setBestScore, setLastAnswers } = useUser()
  const navigate  = useNavigate()
  const timerRef  = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          dispatch({ type: 'FINISH_QUIZ' })
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    if (state.statut === 'finished') {
      clearInterval(timerRef.current)
      setBestScore(s => Math.max(s, state.score))
      setLastAnswers(state.answers)
      navigate('/resultats')
    }
  }, [state.statut])

  if (loading) return <Loader msg="Chargement des questions..." />
  if (error)   return <Loader msg={`Erreur : ${error}`} />
  if (!questions) return null

  const question = questions[state.index]
  const progress = (state.index / questions.length) * 100
  const cat = catColors[question.categorie] || catColors['Musique']

  const timerColor = timeLeft > 20 ? '#ff8c00' : timeLeft > 10 ? '#ffcc00' : '#ff4444'
  const timerPct   = (timeLeft / 60) * 100

  function handleAnswer(option) {
    if (state.selected) return
    dispatch({ type: 'ANSWER_QUESTION', payload: { reponse: option, bonne_reponse: question.bonne_reponse, libelle: question.libelle } })
    setTimeout(() => {
      if (state.index + 1 >= questions.length) dispatch({ type: 'FINISH_QUIZ' })
      else dispatch({ type: 'NEXT_QUESTION' })
    }, 900)
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#1a0800,#2d1200,#1a0500)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ width:'100%', maxWidth:'580px' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.2rem' }}>
          <span style={{ color:'#ff8c00', fontSize:'14px', fontWeight:600 }}>👤 {pseudo}</span>
          <div style={{ textAlign:'center' }}>
            <span style={{ color:timerColor, fontWeight:800, fontSize:'22px' }}>{timeLeft}s</span>
            <div style={{ height:'3px', width:'80px', background:'rgba(255,255,255,0.1)', borderRadius:'2px', marginTop:'3px' }}>
              <div style={{ height:'100%', width:`${timerPct}%`, background:timerColor, borderRadius:'2px', transition:'width 1s linear' }} />
            </div>
          </div>
          <span style={{ color:'#ffcc00', fontWeight:700, fontSize:'15px' }}>⭐ {state.score} pts</span>
        </div>

        {/* Progress bar */}
        <div style={{ height:'5px', background:'rgba(255,255,255,0.08)', borderRadius:'3px', marginBottom:'1.5rem' }}>
          <div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(90deg,#ff8c00,#ffcc00)', borderRadius:'3px', transition:'width 0.4s' }} />
        </div>

        {/* Question card */}
        <div style={{ background:'rgba(255,140,0,0.05)', border:'1px solid rgba(255,140,0,0.2)', borderTop:`3px solid ${cat.color}`, borderRadius:'16px', padding:'2rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.2rem' }}>
            <span style={{ fontSize:'12px', padding:'4px 12px', borderRadius:'20px', background:cat.bg, color:cat.color, border:`1px solid ${cat.border}`, fontWeight:600 }}>
              {question.categorie}
            </span>
            <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'13px' }}>{state.index + 1} / {questions.length}</span>
          </div>

          <h2 style={{ color:'#fff5e0', fontSize:'17px', fontWeight:600, marginBottom:'1.8rem', lineHeight:1.6 }}>
            {question.libelle}
          </h2>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
            {question.options.map((option, i) => {
              const letters = ['A', 'B', 'C', 'D']
              let bg     = 'rgba(255,255,255,0.04)'
              let border = 'rgba(255,140,0,0.15)'
              let color  = '#e0c090'
              let letBg  = 'rgba(255,140,0,0.15)'
              let letC   = '#ff8c00'

              if (state.selected) {
                if (option === question.bonne_reponse) {
                  bg = 'rgba(0,220,100,0.12)'; border = '#00dc64'; color = '#00dc64'; letBg = 'rgba(0,220,100,0.2)'; letC = '#00dc64'
                } else if (option === state.selected) {
                  bg = 'rgba(255,60,60,0.12)'; border = '#ff3c3c'; color = '#ff6666'; letBg = 'rgba(255,60,60,0.2)'; letC = '#ff3c3c'
                }
              }

              return (
                <button key={option} onClick={() => handleAnswer(option)} style={{ background:bg, border:`1px solid ${border}`, borderRadius:'10px', padding:'12px 14px', color, fontSize:'13px', textAlign:'left', cursor: state.selected ? 'default' : 'pointer', transition:'all 0.2s', display:'flex', alignItems:'center', gap:'10px' }}>
                  <span style={{ minWidth:'22px', height:'22px', borderRadius:'6px', background:letBg, color:letC, fontSize:'11px', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{letters[i]}</span>
                  {option}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizEngine
