import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchMyCourses, unenrollCourse } from '../Services/API'
import { BookOpen, Clock, PlayCircle, RotateCcw, Trophy, Flame, UserMinus } from 'lucide-react'

export default function Mycourses() {
  const [courses, setCourses] = useState([])
  const navigate = useNavigate()
  const email = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail') || ''
  const progKey = `courseProgress_${email}`

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (!token) { navigate('/Login'); return }
    fetchMyCourses().then(d => { if (Array.isArray(d)) setCourses(d) })
  }, [navigate])

  const getProgress = id => {
    const all = JSON.parse(localStorage.getItem(progKey) || '{}')
    const p = all[id]
    if (!p) return 0
    if (p.overallComplete) return 100
    if (p.completedLessons?.length > 0) return 50
    return 0
  }

  const unenroll = async id => {
    await unenrollCourse(id)
    setCourses(prev => prev.filter(c => c._id !== id))
    const all = JSON.parse(localStorage.getItem(progKey) || '{}')
    delete all[id]; localStorage.setItem(progKey, JSON.stringify(all))
  }

  const progColor = v => v === 100 ? 'var(--green)' : v >= 50 ? 'var(--orange)' : 'var(--accent)'
  const progLabel = v => v === 100 ? {text:'Completed',icon:<Trophy size={12}/>} : v >= 50 ? {text:'In Progress',icon:<Flame size={12}/>} : {text:'Not Started',icon:<BookOpen size={12}/>}

  const stats = [
    { val: courses.length,                                     label: 'Enrolled' },
    { val: courses.filter(c=>getProgress(c._id)===100).length, label: 'Completed' },
    { val: courses.filter(c=>getProgress(c._id)===50).length,  label: 'In Progress' },
    { val: courses.filter(c=>getProgress(c._id)===0).length,   label: 'Not Started' },
  ]

  return (
    <div style={{ background:'var(--bg-0)', minHeight:'100vh', padding:'44px 20px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>

        <div style={{ marginBottom:28 }}>
          <div className="eyebrow" style={{ marginBottom:8 }}>Learning</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(22px,4vw,32px)', fontWeight:800, letterSpacing:'-0.03em' }}>My Courses</h1>
        </div>

        {courses.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px', color:'var(--t-lo)' }}>
            <BookOpen size={40} style={{ margin:'0 auto 14px', opacity:0.25 }}/>
            <p style={{ fontSize:14, marginBottom:20 }}>You haven't enrolled in any courses yet.</p>
            <Link to="/home" className="btn-accent" style={{ textDecoration:'none', padding:'10px 22px' }}>Browse courses</Link>
          </div>
        ) : (
          <>
            
            <div style={{ display:'flex', gap:1, background:'var(--b-1)', borderRadius:'var(--r-lg)', overflow:'hidden', marginBottom:28, border:'1px solid var(--b-1)' }}>
              {stats.map((s,i) => (
                <div key={s.label} style={{ flex:1, padding:'16px 14px', background:'var(--bg-2)', textAlign:'center', borderRight: i<stats.length-1 ? '1px solid var(--b-1)' : 'none' }}>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:24, fontWeight:800, color:'var(--t-hi)', letterSpacing:'-0.03em', lineHeight:1 }}>{s.val}</div>
                  <div style={{ fontSize:11, color:'var(--t-lo)', fontFamily:'var(--font-mono)', marginTop:4, textTransform:'uppercase', letterSpacing:'0.06em' }}>{s.label}</div>
                </div>
              ))}
            </div>

            
            <div className="row g-3">
              {courses.map(c => {
                const prog = getProgress(c._id)
                const lbl  = progLabel(prog)
                const col  = progColor(prog)
                return (
                  <div className="col-md-4" key={c._id}>
                    <div style={{ background:'var(--bg-2)', border:'1px solid var(--b-1)', borderRadius:'var(--r-lg)', overflow:'hidden', height:'100%', display:'flex', flexDirection:'column', transition:'all 0.22s var(--ease)' }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(6,255,210,0.22)';e.currentTarget.style.boxShadow='0 0 0 1px rgba(6,255,210,0.08), 0 0 24px rgba(6,255,210,0.07), 0 0 60px rgba(6,255,210,0.04)'}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--b-1)';e.currentTarget.style.boxShadow='none'}}>

                      
                      <div style={{ background:'var(--bg-3)', borderBottom:'1px solid var(--b-1)', height:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'12px', position:'relative' }}>
                        <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 80% 20%, rgba(6,255,210,0.04), transparent 60%)' }}/>
                        <img src={c.image} alt={c.title} style={{ maxHeight:64, maxWidth:'75%', objectFit:'contain', filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}/>
                      </div>

                      <div style={{ padding:'16px', flex:1, display:'flex', flexDirection:'column', gap:10 }}>
                        <h6 style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:700, color:'var(--t-hi)', lineHeight:1.35 }}>{c.title}</h6>
                        <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'var(--t-lo)' }}>
                          <Clock size={11}/><span style={{ fontFamily:'var(--font-mono)' }}>{c.duration}</span>
                          <span style={{ color:'var(--b-2)' }}>·</span>
                          <PlayCircle size={11}/>{c.lessons?.length||0} lessons
                        </div>

                        
                        <div style={{ marginTop:2 }}>
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                            <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, fontFamily:'var(--font-mono)', color: col }}>{lbl.icon}{lbl.text}</span>
                            <span style={{ fontSize:11, fontFamily:'var(--font-mono)', color:'var(--t-lo)' }}>{prog}%</span>
                          </div>
                          <div className="prog-track">
                            <div className="prog-fill" style={{ width:`${prog}%`, background: col, boxShadow: prog > 0 ? `0 0 8px ${col}55` : 'none' }}/>
                          </div>
                        </div>

                        
                        <div style={{ display:'flex', gap:7, marginTop:'auto' }}>
                          <button onClick={() => navigate(`/Player/${c._id}`)} className="btn-accent" style={{ flex:1, justifyContent:'center', padding:'8px 10px', fontSize:12 }}>
                            {prog===100 ? <><RotateCcw size={12}/>Rewatch</> : <><PlayCircle size={12}/>Start</>}
                          </button>
                          <button onClick={() => unenroll(c._id)} className="btn-danger" style={{ padding:'8px 10px', fontSize:12 }}>
                            <UserMinus size={12}/>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}