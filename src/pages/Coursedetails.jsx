import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchCourse, enrollCourse } from '../Services/API'
import { User, Clock, BarChart2, Tag, CheckCircle, ArrowLeft, BookOpen, ListChecks, Zap } from 'lucide-react'

const LEVEL_COLORS = {
  Beginner: { color: 'var(--neon-green)', bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.25)' },
  Intermediate: { color: 'var(--neon-cyan)', bg: 'rgba(0,245,255,0.08)', border: 'rgba(0,245,255,0.25)' },
  Advanced: { color: 'var(--neon-pink)', bg: 'rgba(255,0,110,0.08)', border: 'rgba(255,0,110,0.25)' },
}

function Coursedetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [enrolled, setEnrolled] = useState(false)
  const [loading, setLoading] = useState(false)
  const userRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole') || ''

  useEffect(() => {
    fetchCourse(id).then(data => setCourse(data))
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token) {
      fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/courses/enrolled/my`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json()).then(data => { if (Array.isArray(data)) setEnrolled(data.some(c => c._id === id)) })
    }
  }, [id])

  const handleEnroll = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (!token) { alert('Please login first to enroll in a course.'); navigate('/Login'); return }
    setLoading(true)
    const data = await enrollCourse(id)
    if (data.message === 'Enrolled successfully') { setEnrolled(true); navigate('/Mycourses') }
    else alert(data.message)
    setLoading(false)
  }

  if (!course) return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--neon-cyan)', fontSize: '14px', letterSpacing: '2px' }}>Loading...</div>
    </div>
  )

  const level = LEVEL_COLORS[course.level] || LEVEL_COLORS.Beginner

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container">
        <div style={{
          background: 'var(--bg-card)', borderRadius: '16px', padding: '40px',
          border: '1px solid var(--border-neon)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(0,245,255,0.04)',
          position: 'relative', overflow: 'hidden'
        }}>
          {/* Top glow */}
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'var(--gradient-neon)', opacity: 0.4 }} />
          {/* Corner decoration */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'radial-gradient(circle at top right, rgba(0,245,255,0.06), transparent 70%)', pointerEvents: 'none' }} />

          <div className="row">
            <div className="col-md-4 text-center mb-4 mb-md-0">
              <div style={{
                background: 'linear-gradient(135deg, rgba(0,245,255,0.05), rgba(191,0,255,0.05))',
                borderRadius: '12px', padding: '30px', border: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px'
              }}>
                <img src={course.image} alt={course.title} style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(0,245,255,0.3))' }} />
              </div>
            </div>

            <div className="col-md-8">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', padding: '3px 10px', borderRadius: '4px', background: level.bg, color: level.color, border: `1px solid ${level.border}` }}>
                  {course.level}
                </span>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--neon-green)', background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', padding: '3px 10px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {course.price}
                </span>
              </div>

              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px', fontSize: 'clamp(20px, 3vw, 28px)' }}>{course.title}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.7, fontSize: '14px' }}>{course.description}</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                {[
                  { icon: <User size={13} color="var(--neon-cyan)"/>, label: 'Instructor', val: course.instructor },
                  { icon: <Clock size={13} color="var(--neon-purple)"/>, label: 'Duration', val: course.duration },
                  { icon: <BarChart2 size={13} color={level.color}/>, label: 'Level', val: course.level },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '10px 14px', border: '1px solid var(--border-subtle)' }}>
                    {item.icon}
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginRight: '4px' }}>{item.label}:</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontWeight: '600' }}>{item.val}</span>
                  </div>
                ))}
              </div>

              {course.topics && course.topics.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--neon-cyan)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                    <ListChecks size={13}/> Topics Covered
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {course.topics.map((t, i) => (
                      <span key={i} style={{ fontSize: '11px', fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', background: 'rgba(0,245,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Zap size={9} color="var(--neon-cyan)"/> {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {userRole !== 'admin' && (
                  <button onClick={handleEnroll} disabled={enrolled || loading} style={{
                    padding: '11px 28px',
                    background: enrolled ? 'rgba(0,255,136,0.1)' : loading ? 'rgba(0,245,255,0.2)' : 'var(--gradient-neon)',
                    border: enrolled ? '1px solid rgba(0,255,136,0.3)' : 'none',
                    borderRadius: '8px', fontFamily: 'var(--font-display)',
                    fontWeight: '700', fontSize: '13px', letterSpacing: '1px',
                    textTransform: 'uppercase', color: enrolled ? 'var(--neon-green)' : '#000',
                    cursor: enrolled ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    boxShadow: enrolled ? 'none' : '0 0 20px rgba(0,245,255,0.25)',
                    transition: 'var(--transition)'
                  }}>
                    {enrolled ? <><CheckCircle size={14}/> Enrolled</> : loading ? 'Enrolling...' : <><BookOpen size={14}/> Enroll Now</>}
                  </button>
                )}
                <button onClick={() => navigate('/home')} style={{
                  padding: '11px 24px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-neon)', borderRadius: '8px',
                  fontFamily: 'var(--font-display)', fontWeight: '600',
                  fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase',
                  color: 'var(--text-secondary)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  transition: 'var(--transition)'
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--neon-cyan)'; e.currentTarget.style.borderColor = 'var(--neon-cyan)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-neon)' }}>
                  <ArrowLeft size={14}/> Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Coursedetails
