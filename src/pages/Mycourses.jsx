import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchMyCourses, unenrollCourse } from '../Services/API'

function Mycourses() {
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const navigate = useNavigate()

  const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail') || ''
  const progressKey = `courseProgress_${userEmail}`

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (!token) {
      navigate('/Login')
      return
    }
    fetchMyCourses().then(data => {
      if (Array.isArray(data)) setEnrolledCourses(data)
    })
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

  const handleStartLearning = (id) => {
    navigate(`/Player/${id}`)
  }

  const getProgressColor = (value) => {
    if (value === 100) return '#27ae60'
    if (value >= 50) return '#f5a623'
    return '#81A6C6'
  }

  const getProgressLabel = (value) => {
    if (value === 100) return '✅ Completed'
    if (value >= 50) return '🔥 In Progress'
    return '📚 Not Started'
  }

  return (
    <div style={{ backgroundColor: '#81A6C6', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container">
        <h2 style={{ color: '#F3E3D0', fontWeight: '800', marginBottom: '10px', textAlign: 'center' }}>My Courses</h2>
        <p style={{ textAlign: 'center', color: '#F3E3D0', marginBottom: '30px', opacity: 0.85 }}>Track your learning progress below</p>

        {enrolledCourses.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#F3E3D0', marginTop: '60px' }}>
            <p style={{ fontSize: '18px' }}>You have not enrolled in any courses yet.</p>
            <Link to="/home" style={{ backgroundColor: '#1a1a2e', color: '#F3E3D0', padding: '10px 28px', borderRadius: '8px', fontWeight: '700', textDecoration: 'none' }}>
              Browse Courses
            </Link>
          </div>
        ) : (
          <>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '16px 24px', marginBottom: '30px', display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#F3E3D0' }}>{enrolledCourses.length}</div>
                <div style={{ fontSize: '13px', color: '#F3E3D0', opacity: 0.85 }}>Enrolled</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#27ae60' }}>
                  {enrolledCourses.filter(c => getProgress(c._id) === 100).length}
                </div>
                <div style={{ fontSize: '13px', color: '#F3E3D0', opacity: 0.85 }}>Completed</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#f5a623' }}>
                  {enrolledCourses.filter(c => getProgress(c._id) === 50).length}
                </div>
                <div style={{ fontSize: '13px', color: '#F3E3D0', opacity: 0.85 }}>In Progress</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#F3E3D0' }}>
                  {enrolledCourses.filter(c => getProgress(c._id) === 0).length}
                </div>
                <div style={{ fontSize: '13px', color: '#F3E3D0', opacity: 0.85 }}>Not Started</div>
              </div>
            </div>

            <div className="row g-4">
              {enrolledCourses.map(course => {
                const progress = getProgress(course._id)
                return (
                  <div className="col-md-4" key={course._id}>
                    <div style={{ backgroundColor: '#F3E3D0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <img src={course.image} alt={course.title} style={{ height: '160px', objectFit: 'contain', padding: '16px', backgroundColor: '#fff' }} />
                      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h5 style={{ color: '#1a1a2e', fontWeight: '700', marginBottom: '4px' }}>{course.title}</h5>
                          <p style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                            👨‍🏫 {course.instructor} &nbsp;|&nbsp; ⏱ {course.duration}
                          </p>
                          <p style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>
                            📹 {course.lessons?.length || 0} lessons
                          </p>
                          <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: getProgressColor(progress) }}>
                              {getProgressLabel(progress)}
                            </span>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e' }}>
                              {progress}%
                            </span>
                          </div>
                          <div style={{ height: '10px', backgroundColor: '#D2C4B4', borderRadius: '50px', overflow: 'hidden', marginBottom: '16px' }}>
                            <div style={{
                              height: '100%', width: `${progress}%`,
                              backgroundColor: getProgressColor(progress),
                              borderRadius: '50px', transition: 'width 0.4s ease'
                            }} />
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button
                            onClick={() => handleStartLearning(course._id)}
                            style={{ backgroundColor: '#1a1a2e', color: '#F3E3D0', border: 'none', borderRadius: '8px', padding: '9px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
                          >
                            {progress === 100 ? '🔁 Rewatch' : '▶ Start Learning'}
                          </button>
                          <button
                            onClick={() => handleUnenroll(course._id)}
                            style={{ backgroundColor: '#c0392b', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
                          >
                            Unenroll
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