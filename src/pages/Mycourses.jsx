import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchMyCourses, unenrollCourse } from '../Services/API'
import { BookOpen, Clock, PlayCircle, RotateCcw, Trophy, Flame, UserMinus } from 'lucide-react'

function Mycourses() {
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const navigate = useNavigate()
  const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail') || ''
  const progressKey = `courseProgress_${userEmail}`

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (!token) { navigate('/Login'); return }
    fetchMyCourses().then(data => { if (Array.isArray(data)) setEnrolledCourses(data) })
  }, [navigate])

  const getProgress = (courseId) => {
    const allProgress = JSON.parse(localStorage.getItem(progressKey) || '{}')
    const p = allProgress[courseId]
    if (!p) return 0
    if (p.overallComplete) return 100
    if (p.completedLessons?.length > 0) return 50
    return 0
  }

  const handleUnenroll = async (courseId) => {
    await unenrollCourse(courseId)
    setEnrolledCourses(prev => prev.filter(c => c._id !== courseId))
    const allProgress = JSON.parse(localStorage.getItem(progressKey) || '{}')
    delete allProgress[courseId]
    localStorage.setItem(progressKey, JSON.stringify(allProgress))
  }

  const getProgressColor = (v) => v === 100 ? 'var(--neon-green)' : v >= 50 ? 'var(--neon-orange)' : 'var(--neon-cyan)'
  const getStatusLabel = (v) => v === 100 ? { text: 'Completed', icon: <Trophy size={12}/> } : v >= 50 ? { text: 'In Progress', icon: <Flame size={12}/> } : { text: 'Not Started', icon: <BookOpen size={12}/> }

  const completed = enrolledCourses.filter(c => getProgress(c._id) === 100).length
  const inProgress = enrolledCourses.filter(c => getProgress(c._id) === 50).length
  const notStarted = enrolledCourses.filter(c => getProgress(c._id) === 0).length

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--neon-cyan)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>// My Learning</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: '900', fontSize: 'clamp(26px, 4vw, 38px)', color: 'var(--text-primary)', marginBottom: '8px' }}>
            My <span style={{ background: 'var(--gradient-neon)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Courses</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Track your learning progress</p>
        </div>

        {enrolledCourses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(0,245,255,0.06)', border: '1px solid var(--border-neon)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <BookOpen size={28} color="var(--neon-cyan)" />
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '20px' }}>You haven't enrolled in any courses yet.</p>
            <Link to="/home" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'var(--gradient-neon)', border: 'none', borderRadius: '8px',
              padding: '11px 28px', color: '#000',
              fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '13px',
              letterSpacing: '1px', textTransform: 'uppercase', textDecoration: 'none',
              boxShadow: '0 0 20px rgba(0,245,255,0.25)'
            }}>Browse Courses</Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div style={{
              background: 'var(--bg-card)', borderRadius: '14px', padding: '20px 28px',
              marginBottom: '30px', border: '1px solid var(--border-neon)',
              display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap'
            }}>
              {[
                { count: enrolledCourses.length, label: 'Enrolled', color: 'var(--neon-cyan)', icon: <BookOpen size={16}/> },
                { count: completed, label: 'Completed', color: 'var(--neon-green)', icon: <Trophy size={16}/> },
                { count: inProgress, label: 'In Progress', color: 'var(--neon-orange)', icon: <Flame size={16}/> },
                { count: notStarted, label: 'Not Started', color: 'var(--text-muted)', icon: <BookOpen size={16}/> },
              ].map(({ count, label, color, icon }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color, marginBottom: '2px' }}>
                    {icon}
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: '900', textShadow: `0 0 15px ${color}` }}>{count}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</div>
                </div>
              ))}
            </div>

            <div className="row g-4">
              {enrolledCourses.map(course => {
                const progress = getProgress(course._id)
                const label = getStatusLabel(progress)
                const pColor = getProgressColor(progress)
                return (
                  <div className="col-md-4" key={course._id}>
                    <div style={{
                      background: 'var(--bg-card)', borderRadius: '14px', overflow: 'hidden',
                      border: '1px solid var(--border-neon)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                      height: '100%', display: 'flex', flexDirection: 'column',
                      transition: 'var(--transition-slow)'
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,245,255,0.3)'; e.currentTarget.style.transform = 'translateY(-5px)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-neon)'; e.currentTarget.style.transform = 'translateY(0)' }}>

                      {/* Image */}
                      <div style={{ background: 'linear-gradient(135deg, rgba(0,245,255,0.04), rgba(191,0,255,0.04))', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '130px', borderBottom: '1px solid var(--border-subtle)' }}>
                        <img src={course.image} alt={course.title} style={{ maxHeight: '90px', maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(0,245,255,0.2))' }} />
                      </div>

                      <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px', fontSize: '15px' }}>{course.title}</h5>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-body)' }}>
                          <BookOpen size={11}/> {course.instructor} &nbsp;·&nbsp; <Clock size={11}/> {course.duration}
                        </p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
                          <PlayCircle size={10}/> {course.lessons?.length || 0} lessons
                        </p>

                        {/* Progress */}
                        <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', color: pColor, display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)', textShadow: `0 0 8px ${pColor}` }}>
                            {label.icon} {label.text}
                          </span>
                          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: pColor }}>{progress}%</span>
                        </div>
                        <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' }}>
                          <div style={{ height: '100%', width: `${progress}%`, background: progress === 100 ? 'var(--gradient-matrix)' : pColor === 'var(--neon-orange)' ? 'var(--gradient-fire)' : 'var(--gradient-neon)', borderRadius: '3px', transition: 'width 0.6s ease', boxShadow: `0 0 8px ${pColor}` }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                          <button onClick={() => navigate(`/Player/${course._id}`)} style={{
                            background: 'var(--gradient-neon)', border: 'none', borderRadius: '7px',
                            padding: '9px', fontFamily: 'var(--font-display)', fontWeight: '700',
                            fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase',
                            color: '#000', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                            boxShadow: '0 0 15px rgba(0,245,255,0.2)', transition: 'var(--transition)'
                          }}>
                            {progress === 100 ? <><RotateCcw size={13}/> Rewatch</> : <><PlayCircle size={13}/> Start Learning</>}
                          </button>
                          <button onClick={() => handleUnenroll(course._id)} style={{
                            background: 'rgba(255,0,110,0.06)', border: '1px solid rgba(255,0,110,0.25)', borderRadius: '7px',
                            padding: '8px', fontFamily: 'var(--font-display)', fontWeight: '600',
                            fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase',
                            color: 'var(--neon-pink)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                            transition: 'var(--transition)'
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,0,110,0.12)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,0,110,0.06)'}>
                            <UserMinus size={12}/> Unenroll
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

export default Mycourses
