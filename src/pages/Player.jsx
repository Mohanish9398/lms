import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchCourse } from '../Services/API'
import { ArrowLeft, CheckCircle, PlayCircle, ChevronRight, Trophy, BookOpen, Clock, Check } from 'lucide-react'

function Player() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)

  const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail') || ''
  const progressKey = `courseProgress_${userEmail}`

  useEffect(() => {
    fetchCourse(id).then(data => {
      setCourse(data)
      if (data.lessons?.length > 0) { setCurrentLesson(data.lessons[0]); setCurrentLessonIndex(0) }
    })
  }, [id])

  const getProgress = () => {
    const all = JSON.parse(localStorage.getItem(progressKey) || '{}')
    return all[id] || { completedLessons: [], overallComplete: false }
  }
  const isLessonCompleted = (lid) => getProgress().completedLessons?.includes(lid)
  const isCourseCompleted = () => getProgress().overallComplete === true

  const handleMarkLessonComplete = () => {
    const all = JSON.parse(localStorage.getItem(progressKey) || '{}')
    const p = all[id] || { completedLessons: [], overallComplete: false }
    if (!p.completedLessons.includes(currentLesson._id)) p.completedLessons.push(currentLesson._id)
    if (p.completedLessons.length >= course.lessons.length) p.overallComplete = true
    all[id] = p
    localStorage.setItem(progressKey, JSON.stringify(all))
    setCourse({ ...course })
  }

  const handleMarkCourseComplete = () => {
    const all = JSON.parse(localStorage.getItem(progressKey) || '{}')
    const p = all[id] || { completedLessons: [], overallComplete: false }
    p.overallComplete = true
    if (course.lessons) p.completedLessons = course.lessons.map(l => l._id)
    all[id] = p
    localStorage.setItem(progressKey, JSON.stringify(all))
    setCourse({ ...course })
  }

  const getOverallProgress = () => {
    if (!course?.lessons?.length) return 0
    return Math.round((getProgress().completedLessons?.length / course.lessons.length) * 100)
  }

  if (!course) return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--neon-cyan)', fontSize: '14px', letterSpacing: '2px' }}>Loading...</div>
    </div>
  )

  const hasLessons = course.lessons?.length > 0
  const overallProgress = getOverallProgress()
  const pColor = overallProgress === 100 ? 'var(--neon-green)' : 'var(--neon-cyan)'

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '20px' }}>
      <div className="container-fluid">

        {/* Top bar */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', color: 'var(--text-primary)', margin: 0, fontSize: '18px' }}>{course.title}</h4>
            <p style={{ color: 'var(--text-muted)', margin: '4px 0 0', fontSize: '12px', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={11}/> {course.instructor} &nbsp;·&nbsp; {course.level}
            </p>
          </div>
          <button onClick={() => navigate('/Mycourses')} style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-neon)',
            borderRadius: '7px', padding: '8px 18px', color: 'var(--text-secondary)',
            fontFamily: 'var(--font-display)', fontWeight: '600', fontSize: '12px',
            letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '7px', transition: 'var(--transition)'
          }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--neon-cyan)'; e.currentTarget.style.borderColor = 'var(--neon-cyan)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-neon)' }}>
            <ArrowLeft size={13}/> My Courses
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', border: '1px solid var(--border-neon)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Overall Progress</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: '700', color: pColor }}>{overallProgress}%</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${overallProgress}%`, background: overallProgress === 100 ? 'var(--gradient-matrix)' : 'var(--gradient-neon)', borderRadius: '3px', transition: 'width 0.5s ease', boxShadow: `0 0 10px ${pColor}` }} />
          </div>
          {isCourseCompleted() && (
            <div style={{ marginTop: '10px', color: 'var(--neon-green)', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', textShadow: '0 0 10px rgba(0,255,136,0.5)' }}>
              <Trophy size={14}/> Course Completed!
            </div>
          )}
        </div>

        <div className="row g-3">
          <div className={hasLessons ? 'col-lg-8' : 'col-12'}>
            <div style={{ background: 'var(--bg-card)', borderRadius: '14px', padding: '20px', border: '1px solid var(--border-neon)' }}>
              {currentLesson && (
                <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                  <PlayCircle size={16} color="var(--neon-cyan)"/> {currentLesson.title}
                </h5>
              )}
              <div style={{ borderRadius: '10px', overflow: 'hidden', marginBottom: '16px', border: '1px solid var(--border-subtle)' }}>
                <iframe width="100%" height="420"
                  src={currentLesson ? currentLesson.video : course.video}
                  title={currentLesson ? currentLesson.title : course.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen />
              </div>

              {currentLesson && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {isLessonCompleted(currentLesson._id) ? (
                    <div style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: '7px', padding: '9px 18px', display: 'flex', alignItems: 'center', gap: '7px', color: 'var(--neon-green)', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '12px', letterSpacing: '0.5px' }}>
                      <CheckCircle size={13}/> Lesson Completed
                    </div>
                  ) : (
                    <button onClick={handleMarkLessonComplete} style={{
                      background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.35)',
                      borderRadius: '7px', padding: '9px 18px', color: 'var(--neon-green)',
                      fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '12px',
                      letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '7px', transition: 'var(--transition)'
                    }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 15px rgba(0,255,136,0.25)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                      <Check size={13}/> Mark Complete
                    </button>
                  )}
                  {currentLessonIndex < course.lessons.length - 1 && (
                    <button onClick={() => {
                      const next = course.lessons[currentLessonIndex + 1]
                      setCurrentLesson(next); setCurrentLessonIndex(currentLessonIndex + 1)
                    }} style={{
                      background: 'var(--gradient-neon)', border: 'none', borderRadius: '7px',
                      padding: '9px 18px', color: '#000', fontFamily: 'var(--font-display)',
                      fontWeight: '700', fontSize: '12px', letterSpacing: '1px',
                      textTransform: 'uppercase', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '7px',
                      boxShadow: '0 0 15px rgba(0,245,255,0.25)', transition: 'var(--transition)'
                    }}>
                      Next <ChevronRight size={13}/>
                    </button>
                  )}
                  {!isCourseCompleted() && overallProgress > 0 && (
                    <button onClick={handleMarkCourseComplete} style={{
                      background: 'rgba(255,123,0,0.1)', border: '1px solid rgba(255,123,0,0.3)',
                      borderRadius: '7px', padding: '9px 18px', color: 'var(--neon-orange)',
                      fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '12px',
                      letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '7px', transition: 'var(--transition)'
                    }}>
                      <Trophy size={13}/> Complete Course
                    </button>
                  )}
                </div>
              )}

              {!hasLessons && (
                <div>
                  {isCourseCompleted() ? (
                    <div style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: '10px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Trophy size={18} color="var(--neon-green)"/>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--neon-green)', textShadow: '0 0 10px rgba(0,255,136,0.5)' }}>Course Completed!</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>Great job! This course is marked as complete.</div>
                      </div>
                    </div>
                  ) : (
                    <button onClick={handleMarkCourseComplete} style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.35)', borderRadius: '8px', padding: '10px 22px', color: 'var(--neon-green)', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Check size={14}/> Mark as Complete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {hasLessons && (
            <div className="col-lg-4">
              <div style={{ background: 'var(--bg-card)', borderRadius: '14px', padding: '18px', border: '1px solid var(--border-neon)', maxHeight: '600px', overflowY: 'auto' }}>
                <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <BookOpen size={15} color="var(--neon-cyan)"/> Lessons
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginLeft: '2px' }}>
                    {getProgress().completedLessons?.length || 0}/{course.lessons.length}
                  </span>
                </h5>
                {course.lessons.map((lesson, index) => {
                  const completed = isLessonCompleted(lesson._id)
                  const isActive = currentLesson?._id === lesson._id
                  return (
                    <div key={lesson._id}
                      onClick={() => { setCurrentLesson(lesson); setCurrentLessonIndex(index) }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 12px', borderRadius: '9px', cursor: 'pointer',
                        marginBottom: '6px', transition: 'var(--transition)',
                        background: isActive ? 'rgba(0,245,255,0.1)' : completed ? 'rgba(0,255,136,0.05)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isActive ? 'rgba(0,245,255,0.3)' : completed ? 'rgba(0,255,136,0.15)' : 'var(--border-subtle)'}`
                      }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '7px', flexShrink: 0,
                        background: completed ? 'rgba(0,255,136,0.2)' : isActive ? 'var(--gradient-neon)' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${completed ? 'rgba(0,255,136,0.3)' : isActive ? 'transparent' : 'var(--border-subtle)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: completed ? 'var(--neon-green)' : isActive ? '#000' : 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '11px'
                      }}>
                        {completed ? <Check size={12}/> : index + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: '600', fontSize: '12px', color: isActive ? 'var(--neon-cyan)' : 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lesson.title}</p>
                        {lesson.duration && (
                          <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                            <Clock size={8}/> {lesson.duration}
                          </p>
                        )}
                      </div>
                      {isActive && <PlayCircle size={13} color="var(--neon-cyan)"/>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Player
