import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function Coursedetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [enrolled, setEnrolled] = useState(false)

  const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail') || ''
  const enrollmentKey = `enrolledCourses_${userEmail}`

  useEffect(() => {
    fetch(`http://localhost:3001/courses/${id}`)
      .then(res => res.json())
      .then(data => {
        setCourse(data)
        const enrolledList = JSON.parse(localStorage.getItem(enrollmentKey) || '[]')
        setEnrolled(enrolledList.some(c => c.id === data.id))
      })
  }, [id, enrollmentKey])

  const handleEnroll = () => {
    if (!userEmail) {
      alert('Please login first to enroll in a course.')
      navigate('/Login')
      return
    }
    const enrolledCourses = JSON.parse(localStorage.getItem(enrollmentKey) || '[]')
    enrolledCourses.push(course)
    localStorage.setItem(enrollmentKey, JSON.stringify(enrolledCourses))
    setEnrolled(true)
    navigate('/Mycourses')
  }

  if (!course) return <div className="text-center mt-5">Loading...</div>

  return (
    <div style={{ backgroundColor: '#81A6C6', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container">
        <div style={{ backgroundColor: '#F3E3D0', borderRadius: '16px', padding: '40px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
          <div className="row">
            <div className="col-md-4 text-center mb-4 mb-md-0">
              <img src={course.image} alt={course.title} style={{ height: '200px', objectFit: 'contain', width: '100%' }} />
            </div>
            <div className="col-md-8">
              <h2 style={{ color: '#1a1a2e', fontWeight: '800' }}>{course.title}</h2>
              <p style={{ color: '#555' }}>{course.description}</p>
              <p><strong>Instructor:</strong> {course.instructor}</p>
              <p><strong>Duration:</strong> {course.duration}</p>
              <p><strong>Level:</strong> {course.level}</p>
              <p><strong>Price:</strong> {course.price}</p>
              {course.topics && (
                <>
                  <strong>Topics Covered:</strong>
                  <ul className="mt-2">
                    {course.topics.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </>
              )}
              <div className="mt-3 d-flex gap-3">
                <button
                  onClick={handleEnroll}
                  disabled={enrolled}
                  style={{
                    padding: '10px 28px', backgroundColor: enrolled ? '#aaa' : '#1a1a2e',
                    color: '#F3E3D0', border: 'none', borderRadius: '8px',
                    fontWeight: '700', cursor: enrolled ? 'not-allowed' : 'pointer'
                  }}
                >
                  {enrolled ? 'Already Enrolled' : 'Enroll Now'}
                </button>
                <button
                  onClick={() => navigate('/home')}
                  style={{
                    padding: '10px 28px', backgroundColor: '#81A6C6',
                    color: '#fff', border: 'none', borderRadius: '8px',
                    fontWeight: '700', cursor: 'pointer'
                  }}
                >
                  Back to Courses
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