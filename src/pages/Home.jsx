import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Coursecard from '../components/Coursecard'
import { fetchCourses } from '../Services/API'

export default function Home() {
  const [courses, setCourses] = useState([])
  const [filtered, setFiltered] = useState([])
  const location = useLocation()

  useEffect(() => {
    fetchCourses().then(data => {
      setCourses(data)
      setFiltered(data)
    })
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const query = params.get('search') || ''
    if (query.trim() === '') {
      setFiltered(courses)
    } else {
      setFiltered(courses.filter(c =>
        c.title.toLowerCase().includes(query.toLowerCase())
      ))
    }
  }, [location.search, courses])

  return (
    <div style={{ backgroundColor: '#81A6C6', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container">
        <h2 style={{ color: '#F3E3D0', fontWeight: '800', textAlign: 'center', marginBottom: '30px' }}>
          Our Courses
        </h2>
        {filtered.length === 0 ? (
          <p style={{ color: '#F3E3D0', textAlign: 'center', fontSize: '18px' }}>No courses found.</p>
        ) : (
          <div className="row g-4">
            {filtered.map(course => (
              <div className="col-md-3" key={course._id}>
                <Coursecard course={course} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}