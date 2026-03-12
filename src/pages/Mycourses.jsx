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
    const courseProgress = allProgress[courseId]
    if (!courseProgress) return 0
    if (courseProgress.overallComplete) return 100
    if (courseProgress.completedLessons?.length > 0) return 50
    return 0
  }

  const handleUnenroll = async (courseId) => {
    await unenrollCourse(courseId)
    setEnrolledCourses(prev => prev.filter(c => c._id !== courseId))
    const allProgress = JSON.parse(localStorage.getItem(progressKey) || '{}')
    delete allProgress[courseId]
    localStorage.setItem(progressKey, JSON.stringify(allProgress))
  }

  const getProgressColor = (value) => {
    if (value === 100) return '#27ae60'
    if (value >= 50) return '#f5a623'
    return '#81A6C6'
  }

  const getProgressLabel = (value) => {
    if (value === 100) return { text: 'Completed', icon: <Trophy size={13} /> }
    if (value >= 50) return { text: 'In Progress', icon: <Flame size={13} /> }
    return { text: 'Not Started', icon: <BookOpen size={13} /> }
  }

  return (
    <div style={{ backgroundColor: '#81A6C6', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container">
        <h2 style={{ color: '#F3E3D0', fontWeight: '800', marginBottom: '10px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <BookOpen size={28} /> My Courses
        </h2>
        <p style={{ textAlign: 'center', color: '#F3E3D0', marginBottom: '30px', opacity: 0.85 }}>Track your learning progress below</p>

        {enrolledCourses.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#F3E3D0', marginTop: '60px' }}>
            <BookOpen size={48} style={{ marginBottom: '16px', opacity: 0.6 }} />
            <p style={{ fontSize: '18px' }}>You have not enrolled in any courses yet.</p>
            <Link to="/home" style={{ backgroundColor: '#1a1a2e', color: '#F3E3D0', padding: '10px 28px', borderRadius: '8px', fontWeight: '700', textDecoration: 'none' }}>Browse Courses</Link>
          </div>
        ) : (
          <>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '16px 24px', marginBottom: '30px', display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { count: enrolledCourses.length, label: 'Enrolled', color: '#F3E3D0', icon: <BookOpen size={18} /> },
                { count: enrolledCourses.filter(c => getProgress(c._id) === 100).length, label: 'Completed', color: '#27ae60', icon: <Trophy size={18} /> },
                { count: enrolledCourses.filter(c => getProgress(c._id) === 50).length, label: 'In Progress', color: '#f5a623', icon: <Flame size={18} /> },
                { count: enrolledCourses.filter(c => getProgress(c._id) === 0).length, label: 'Not Started', color: '#F3E3D0', icon: <BookOpen size={18} /> },
              ].map(({ count, label, color, icon }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color }}>{icon}<span style={{ fontSize: '28px', fontWeight: '800' }}>{count}</span></div>
                  <div style={{ fontSize: '13px', color: '#F3E3D0', opacity: 0.85 }}>{label}</div>
                </div>
              ))}
            </div>

            <div className="row g-4">
              {enrolledCourses.map(course => {
                const progress = getProgress(course._id)
                const label = getProgressLabel(progress)
                return (
                  <div className="col-md-4" key={course._id}>
                    <div style={{ backgroundColor: '#F3E3D0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <img src={course.image} alt={course.title} style={{ height: '160px', objectFit: 'contain', padding: '16px', backgroundColor: '#fff' }} />
                      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h5 style={{ color: '#1a1a2e', fontWeight: '700', marginBottom: '4px' }}>{course.title}</h5>
                          <p style={{ fontSize: '13px', color: '#666', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <BookOpen size={13} /> {course.instructor} &nbsp;|&nbsp; <Clock size={13} /> {course.duration}
                          </p>
                          <p style={{ fontSize: '12px', color: '#888', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <PlayCircle size={12} /> {course.lessons?.length || 0} lessons
                          </p>
                          <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: getProgressColor(progress), display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {label.icon} {label.text}
                            </span>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e' }}>{progress}%</span>
                          </div>
                          <div style={{ height: '10px', backgroundColor: '#D2C4B4', borderRadius: '50px', overflow: 'hidden', marginBottom: '16px' }}>
                            <div style={{ height: '100%', width: `${progress}%`, backgroundColor: getProgressColor(progress), borderRadius: '50px', transition: 'width 0.4s ease' }} />
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button onClick={() => navigate(`/Player/${course._id}`)} style={{ backgroundColor: '#1a1a2e', color: '#F3E3D0', border: 'none', borderRadius: '8px', padding: '9px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            {progress === 100 ? <><RotateCcw size={15} /> Rewatch</> : <><PlayCircle size={15} /> Start Learning</>}
                          </button>
                          <button onClick={() => handleUnenroll(course._id)} style={{ backgroundColor: '#c0392b', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <UserMinus size={15} /> Unenroll
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