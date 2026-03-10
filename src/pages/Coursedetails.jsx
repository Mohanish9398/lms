import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchCourse, enrollCourse } from '../Services/API'

function Coursedetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [enrolled, setEnrolled] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCourse(id).then(data => setCourse(data))
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token) {
      fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/courses/enrolled/my`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setEnrolled(data.some(c => c._id === id))
          }
        })
    }
  }, [id])

  const handleEnroll = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (!token) {
      alert('Please login first to enroll in a course.')
      navigate('/Login')
      return
    }
    setLoading(true)
    const data = await enrollCourse(id)
    if (data.message === 'Enrolled successfully') {
      setEnrolled(true)
      navigate('/Mycourses')
    } else {
      alert(data.message)
    }
    setLoading(false)
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
                  disabled={enrolled || loading}
                  style={{
                    padding: '10px 28px', backgroundColor: enrolled ? '#aaa' : '#1a1a2e',
                    color: '#F3E3D0', border: 'none', borderRadius: '8px',
                    fontWeight: '700', cursor: enrolled ? 'not-allowed' : 'pointer'
                  }}
                >
                  {enrolled ? 'Already Enrolled' : loading ? 'Enrolling...' : 'Enroll Now'}
                </button>
                <button onClick={() => navigate('/home')} style={{ padding: '10px 28px', backgroundColor: '#81A6C6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
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