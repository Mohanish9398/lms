import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchCourse } from '../Services/API'
import { ArrowLeft, CheckCircle, PlayCircle, ChevronRight, Trophy, BookOpen, Clock, Check } from 'lucide-react'

export default function Player() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [curLesson, setCurLesson] = useState(null)
  const [curIdx, setCurIdx] = useState(0)

  const email = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail') || ''
  const progKey = `courseProgress_${email}`

  useEffect(() => {
    fetchCourse(id).then(data => {
      setCourse(data)
      if (data.lessons?.length > 0) { setCurLesson(data.lessons[0]); setCurIdx(0) }
    })
  }, [id])

  const getProgress = () => {
    const all = JSON.parse(localStorage.getItem(progKey) || '{}')
    return all[id] || { completedLessons: [], overallComplete: false }
  }
  const isLessonDone = lid => getProgress().completedLessons?.includes(lid)
  const isCourseDone = () => getProgress().overallComplete === true

  const markLesson = () => {
    const all = JSON.parse(localStorage.getItem(progKey) || '{}')
    const p = all[id] || { completedLessons: [], overallComplete: false }
    if (!p.completedLessons.includes(curLesson._id)) p.completedLessons.push(curLesson._id)
    if (p.completedLessons.length >= course.lessons.length) p.overallComplete = true
    all[id] = p; localStorage.setItem(progKey, JSON.stringify(all)); setCourse({...course})
  }

  const markCourse = () => {
    const all = JSON.parse(localStorage.getItem(progKey) || '{}')
    const p = all[id] || { completedLessons: [], overallComplete: false }
    p.overallComplete = true
    if (course.lessons) p.completedLessons = course.lessons.map(l => l._id)
    all[id] = p; localStorage.setItem(progKey, JSON.stringify(all)); setCourse({...course})
  }

  const overallPct = () => {
    if (!course?.lessons?.length) return 0
    return Math.round((getProgress().completedLessons?.length / course.lessons.length) * 100)
  }

  if (!course) return (
    <div style={{ background:'var(--bg-0)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--t-lo)', fontSize:13, fontFamily:'var(--font-mono)' }}>Loading…</div>
  )

  const pct = overallPct()
  const hasLessons = course.lessons?.length > 0

  return (
    <div style={{ background:'var(--bg-0)', minHeight:'100vh', padding:'32px 20px' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>

        
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:24, flexWrap:'wrap' }}>
          <div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:700, letterSpacing:'-0.02em', marginBottom:4 }}>{course.title}</h2>
            <p style={{ fontSize:12, color:'var(--t-lo)', fontFamily:'var(--font-mono)', display:'flex', alignItems:'center', gap:6 }}>
              <BookOpen size={11}/>{course.instructor} · {course.level}
            </p>
          </div>
          <button onClick={() => navigate('/Mycourses')} className="btn-outline" style={{ padding:'7px 15px', fontSize:12 }}>
            <ArrowLeft size={13}/> My Courses
          </button>
        </div>

        
        <div style={{ background:'var(--bg-2)', border:'1px solid var(--b-1)', borderRadius:'var(--r-lg)', padding:'16px 18px', marginBottom:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <span style={{ fontSize:12, color:'var(--t-mid)', fontFamily:'var(--font-mono)' }}>Overall progress</span>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              {isCourseDone() && <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'var(--green)', fontFamily:'var(--font-mono)' }}><Trophy size={11}/>Completed</span>}
              <span style={{ fontSize:12, fontFamily:'var(--font-mono)', color: pct===100?'var(--green)':pct>0?'var(--orange)':'var(--t-lo)' }}>{pct}%</span>
            </div>
          </div>
          <div className="prog-track" style={{ height:4 }}>
            <div className="prog-fill" style={{ width:`${pct}%`, background: pct===100?'var(--green)':pct>0?'var(--orange)':'var(--accent)', boxShadow: pct>0?`0 0 10px ${pct===100?'rgba(52,211,153,0.4)':'rgba(251,146,60,0.4)'}`:'' }}/>
          </div>
        </div>

        
        <div className="row g-3">
          
          <div className={hasLessons ? 'col-lg-8' : 'col-12'}>
            <div style={{ background:'var(--bg-2)', border:'1px solid var(--b-1)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
              {curLesson && (
                <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--b-1)', display:'flex', alignItems:'center', gap:8 }}>
                  <PlayCircle size={15} color="var(--accent)"/>
                  <span style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:600, color:'var(--t-hi)' }}>{curLesson.title}</span>
                </div>
              )}
              <div style={{ background:'#000', lineHeight:0 }}>
                <iframe width="100%" height="400" src={curLesson ? curLesson.video : course.video}
                  title={curLesson ? curLesson.title : course.title}
                  frameBorder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowFullScreen
                  style={{ display:'block' }}/>
              </div>

              <div style={{ padding:'16px 18px', display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
                {curLesson && (
                  isLessonDone(curLesson._id) ? (
                    <div style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:'rgba(52,211,153,0.07)', border:'1px solid rgba(52,211,153,0.16)', borderRadius:'var(--r-md)', fontSize:12, color:'var(--green)', fontWeight:500 }}>
                      <CheckCircle size={13}/> Lesson complete
                    </div>
                  ) : (
                    <button onClick={markLesson} className="btn-success" style={{ fontSize:12 }}>
                      <Check size={13}/> Mark complete
                    </button>
                  )
                )}
                {curLesson && curIdx < course.lessons.length - 1 && (
                  <button onClick={() => { const n=course.lessons[curIdx+1]; setCurLesson(n); setCurIdx(curIdx+1) }} className="btn-outline" style={{ fontSize:12, padding:'8px 14px' }}>
                    Next <ChevronRight size={13}/>
                  </button>
                )}
                {!isCourseDone() && pct > 0 && (
                  <button onClick={markCourse} className="btn-warn" style={{ fontSize:12 }}>
                    <Trophy size={13}/> Mark course complete
                  </button>
                )}
                {!hasLessons && !isCourseDone() && (
                  <button onClick={markCourse} className="btn-success" style={{ fontSize:12 }}>
                    <Check size={13}/> Mark as complete
                  </button>
                )}
              </div>
            </div>
          </div>

          
          {hasLessons && (
            <div className="col-lg-4">
              <div style={{ background:'var(--bg-2)', border:'1px solid var(--b-1)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
                <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--b-1)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontFamily:'var(--font-display)', fontSize:13, fontWeight:700, color:'var(--t-hi)', display:'flex', alignItems:'center', gap:6 }}>
                    <BookOpen size={13} color="var(--accent)"/> Lessons
                  </span>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--t-lo)' }}>
                    {getProgress().completedLessons?.length||0}/{course.lessons.length}
                  </span>
                </div>
                <div style={{ maxHeight:460, overflowY:'auto', padding:8 }}>
                  {course.lessons.map((l, i) => {
                    const done   = isLessonDone(l._id)
                    const active = curLesson?._id === l._id
                    return (
                      <div key={l._id} onClick={() => { setCurLesson(l); setCurIdx(i) }}
                        style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:'var(--r-md)', cursor:'pointer', marginBottom:3, background: active?'var(--bg-4)':done?'rgba(52,211,153,0.04)':'transparent', border:`1px solid ${active?'var(--accent-border)':done?'rgba(52,211,153,0.12)':'transparent'}`, transition:'all 0.15s var(--ease)' }}
                        onMouseEnter={e=>{if(!active)e.currentTarget.style.background='var(--bg-3)'}}
                        onMouseLeave={e=>{if(!active)e.currentTarget.style.background=done?'rgba(52,211,153,0.04)':'transparent'}}>
                        <div style={{ width:26, height:26, borderRadius:6, flexShrink:0, background: done?'rgba(52,211,153,0.12)':active?'var(--accent-soft)':'var(--bg-4)', border:`1px solid ${done?'rgba(52,211,153,0.22)':active?'var(--accent-border)':'var(--b-1)'}`, display:'flex', alignItems:'center', justifyContent:'center', color: done?'var(--green)':active?'var(--accent)':'var(--t-lo)', fontSize:11, fontFamily:'var(--font-mono)', fontWeight:600 }}>
                          {done ? <Check size={12}/> : active ? <PlayCircle size={12}/> : i+1}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ fontSize:12, fontWeight:500, color: active?'var(--t-hi)':done?'var(--t-mid)':'var(--t-mid)', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{l.title}</p>
                          {l.duration && <p style={{ fontSize:10, color:'var(--t-lo)', margin:0, fontFamily:'var(--font-mono)', display:'flex', alignItems:'center', gap:3, marginTop:2 }}><Clock size={9}/>{l.duration}</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}