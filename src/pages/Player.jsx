import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function Player() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [completed, setCompleted] = useState(false)

  const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail') || ''
  const progressKey = `courseProgress_${userEmail}`

  useEffect(() => {
    fetch(`http://localhost:3001/courses/${id}`)
      .then(res => res.json())
      .then(data => {
        setCourse(data)
        const allProgress = JSON.parse(localStorage.getItem(progressKey) || '{}')
        setCompleted(allProgress[data.id] === 100)
      })
  }, [id, progressKey])

  const handleMarkComplete = () => {
    const allProgress = JSON.parse(localStorage.getItem(progressKey) || '{}')
    allProgress[id] = 100
    localStorage.setItem(progressKey, JSON.stringify(allProgress))
    setCompleted(true)
  }

  if (!course) return <div className="text-center mt-5">Loading...</div>

  return (
    <div style={{ backgroundColor: '#81A6C6', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container">

        <div style={{
          backgroundColor: '#F3E3D0', borderRadius: '16px',
          padding: '30px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
        }}>
          <h3 style={{ color: '#1a1a2e', fontWeight: '800', marginBottom: '6px' }}>{course.title}</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
            👨‍🏫 {course.instructor} &nbsp;|&nbsp; ⏱ {course.duration} &nbsp;|&nbsp; 📊 {course.level}
          </p>

          <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '24px' }}>
            <iframe
              width="100%"
              height="500"
              src={course.video}
              title={course.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {completed ? (
            <div style={{
              backgroundColor: '#d4edda', border: '1px solid #27ae60',
              borderRadius: '10px', padding: '14px 20px',
              display: 'flex', alignItems: 'center', gap: '10px',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '22px' }}>✅</span>
              <div>
                <div style={{ fontWeight: '700', color: '#27ae60', fontSize: '15px' }}>
                  Course Completed!
                </div>
                <div style={{ fontSize: '13px', color: '#555' }}>
                  Great job! This course is marked as complete in your progress tracker.
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#fff8e1', border: '1px solid #f5a623',
              borderRadius: '10px', padding: '14px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: '12px', marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px' }}>🎯</span>
                <div>
                  <div style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '15px' }}>
                    Finished watching?
                  </div>
                  <div style={{ fontSize: '13px', color: '#555' }}>
                    Click the button to mark this course as complete.
                  </div>
                </div>
              </div>
              <button
                onClick={handleMarkComplete}
                style={{
                  backgroundColor: '#27ae60', color: '#fff', border: 'none',
                  borderRadius: '8px', padding: '10px 24px',
                  fontWeight: '700', fontSize: '14px', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(39,174,96,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => e.target.style.backgroundColor = '#219a52'}
                onMouseLeave={e => e.target.style.backgroundColor = '#27ae60'}
              >
                ✅ Mark as Complete
              </button>
            </div>
          )}

          <button
            onClick={() => navigate('/Mycourses')}
            style={{
              backgroundColor: '#1a1a2e', color: '#F3E3D0', border: 'none',
              borderRadius: '8px', padding: '10px 24px',
              fontWeight: '700', cursor: 'pointer', fontSize: '14px'
            }}
          >
            ← Back to My Courses
          </button>
        </div>

      </div>
    </div>
  )
}

export default Player