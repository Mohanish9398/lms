import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchCourse, enrollCourse } from '../Services/API'
import { User, Clock, BarChart2, Tag, CheckCircle, ArrowLeft, BookOpen, Zap } from 'lucide-react'

export default function Coursedetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse]   = useState(null)
  const [enrolled, setEnrolled] = useState(false)
  const [loading, setLoading] = useState(false)
  const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole') || ''

  useEffect(() => {
    fetchCourse(id).then(d => setCourse(d))
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token) {
      fetch(`${process.env.REACT_APP_API_URL||'http://localhost:5000'}/api/courses/enrolled/my`, { headers:{Authorization:`Bearer ${token}`} })
        .then(r=>r.json()).then(d=>{ if(Array.isArray(d)) setEnrolled(d.some(c=>c._id===id)) })
    }
  }, [id])

  const handleEnroll = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (!token) { alert('Please login first.'); navigate('/Login'); return }
    setLoading(true)
    const data = await enrollCourse(id)
    if (data.message==='Enrolled successfully') { setEnrolled(true); navigate('/Mycourses') }
    else alert(data.message)
    setLoading(false)
  }

  if (!course) return (
    <div style={{ background:'var(--bg-0)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--t-lo)', fontSize:13, fontFamily:'var(--font-mono)' }}>
      Loading…
    </div>
  )

  const lvlBadge = { Beginner:'badge-green', Intermediate:'badge-teal', Advanced:'badge-red' }

  const Meta = ({ icon, label, value }) => (
    <div style={{ display:'flex', alignItems:'center', gap:9, padding:'11px 14px', background:'var(--bg-3)', border:'1px solid var(--b-1)', borderRadius:'var(--r-md)' }}>
      <span style={{ color:'var(--accent)' }}>{icon}</span>
      <div>
        <div style={{ fontSize:10, fontFamily:'var(--font-mono)', color:'var(--t-lo)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:1 }}>{label}</div>
        <div style={{ fontSize:13, fontWeight:600, color:'var(--t-hi)' }}>{value}</div>
      </div>
    </div>
  )

  return (
    <div style={{ background:'var(--bg-0)', minHeight:'100vh', padding:'44px 20px' }}>
      <div style={{ maxWidth:960, margin:'0 auto' }}>
        <button onClick={() => navigate('/home')} className="btn-ghost" style={{ marginBottom:24, color:'var(--t-lo)', fontSize:12 }}>
          <ArrowLeft size={13}/> Back to courses
        </button>

        <div style={{ background:'var(--bg-2)', border:'1px solid var(--b-1)', borderRadius:'var(--r-xl)', overflow:'hidden' }}>
          
          <div style={{ background:'var(--bg-3)', borderBottom:'1px solid var(--b-1)', padding:'32px', display:'flex', gap:28, alignItems:'flex-start', flexWrap:'wrap' }}>
            <div style={{ width:100, height:100, borderRadius:14, background:'var(--bg-1)', border:'1px solid var(--b-1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <img src={course.image} alt={course.title} style={{ maxWidth:70, maxHeight:70, objectFit:'contain', filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}/>
            </div>
            <div style={{ flex:1, minWidth:200 }}>
              <span className={`badge ${lvlBadge[course.level]||'badge-muted'}`} style={{ marginBottom:10 }}>{course.level}</span>
              <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(20px,3vw,28px)', fontWeight:800, letterSpacing:'-0.03em', marginBottom:8 }}>{course.title}</h1>
              <p style={{ fontSize:14, color:'var(--t-mid)', lineHeight:1.65 }}>{course.description}</p>
            </div>
          </div>

          <div style={{ padding:'28px 32px' }}>
            
            <div className="row g-2" style={{ marginBottom:24 }}>
              <div className="col-6 col-md-3"><Meta icon={<User size={14}/>}     label="Instructor" value={course.instructor}/></div>
              <div className="col-6 col-md-3"><Meta icon={<Clock size={14}/>}    label="Duration"   value={course.duration}/></div>
              <div className="col-6 col-md-3"><Meta icon={<BarChart2 size={14}/>}label="Level"      value={course.level}/></div>
              <div className="col-6 col-md-3"><Meta icon={<Tag size={14}/>}      label="Price"      value={course.price}/></div>
            </div>

            
            {course.topics?.length > 0 && (
              <div style={{ marginBottom:28 }}>
                <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:14 }}>
                  <BookOpen size={14} color="var(--accent)"/>
                  <span style={{ fontSize:12, fontFamily:'var(--font-mono)', color:'var(--t-mid)', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600 }}>Topics covered</span>
                </div>
                <div className="row g-2">
                  {course.topics.map((t,i) => (
                    <div key={i} className="col-md-6">
                      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px', background:'var(--bg-3)', border:'1px solid var(--b-1)', borderRadius:'var(--r-md)', fontSize:13, color:'var(--t-mid)' }}>
                        <Zap size={11} color="var(--accent)"/>{t}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            
            {role !== 'admin' && (
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                {enrolled ? (
                  <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 18px', background:'rgba(52,211,153,0.07)', border:'1px solid rgba(52,211,153,0.16)', borderRadius:'var(--r-md)', fontSize:13, color:'#6ee7b7', fontWeight:500 }}>
                    <CheckCircle size={14}/> Already enrolled
                  </div>
                ) : (
                  <button onClick={handleEnroll} disabled={loading} className="btn-accent" style={{ padding:'10px 22px' }}>
                    <BookOpen size={14}/> {loading ? 'Enrolling…' : 'Enroll now — free'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}