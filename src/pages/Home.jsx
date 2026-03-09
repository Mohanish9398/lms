import React, { useState, useEffect } from 'react'
import Coursecard from '../components/Coursecard'
import { courses as fetchCourses } from '../Services/API'
import { useLocation } from 'react-router-dom'

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
            const results = courses.filter(course =>
                course.title.toLowerCase().includes(query.toLowerCase())
            )
            setFiltered(results)
        }
    }, [location.search, courses])

    return (
        <div style={{ backgroundColor: '#81A6C6', minHeight: '100vh', padding: '30px 0' }}>
            <h1 style={{ color: '#F3E3D0', textAlign: 'center', fontSize: '32px', marginBottom: '30px', fontWeight: 'bold' }}>
                AVAILABLE COURSES
            </h1>
            <div className="container">
                {filtered.length === 0 ? (
                    <p style={{ color: '#F3E3D0', textAlign: 'center', fontSize: '18px' }}>No courses found.</p>
                ) : (
                    <div className="row g-4">
                        {filtered.map(course => (
                            <div className="col-md-3" key={course.id}>
                                <Coursecard course={course} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}