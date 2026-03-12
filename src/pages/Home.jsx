import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Coursecard from '../components/Coursecard'
import { fetchCourses } from '../Services/API'
import { BookOpen, Search } from 'lucide-react'

export default function Home() {
  const [courses, setCourses] = useState([])
  const [filtered, setFiltered] = useState([])
  const [levelFilter, setLevelFilter] = useState('All')
  const location = useLocation()

  useEffect(() => {
    fetchCourses().then(data => { setCourses(data); setFiltered(data) })
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const query = params.get('search') || ''
    let result = courses
    if (query.trim()) result = result.filter(c => c.title.toLowerCase().includes(query.toLowerCase()))
    if (levelFilter !== 'All') result = result.filter(c => c.level === levelFilter)
    setFiltered(result)
  }, [location.search, courses, levelFilter])

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']
  const levelColors = {
    All: 'var(--neon-cyan)',
    Beginner: 'var(--neon-green)',
    Intermediate: 'var(--neon-cyan)',
    Advanced: 'var(--neon-pink)'
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--neon-cyan)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>// All Courses</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: '900', fontSize: 'clamp(26px, 4vw, 38px)', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Explore Our <span style={{ background: 'var(--gradient-neon)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Courses</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {filtered.length} course{filtered.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '36px', flexWrap: 'wrap' }}>
          {levels.map(level => {
            const active = levelFilter === level
            const c = levelColors[level]
            return (
              <button key={level} onClick={() => setLevelFilter(level)} style={{
                padding: '7px 20px',
                background: active ? `${c}18` : 'transparent',
                border: `1px solid ${active ? c : 'var(--border-subtle)'}`,
                borderRadius: '6px', color: active ? c : 'var(--text-muted)',
                fontFamily: 'var(--font-mono)', fontWeight: '600', fontSize: '11px',
                letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer',
                transition: 'var(--transition)',
                boxShadow: active ? `0 0 12px ${c}30` : 'none'
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = c; e.currentTarget.style.color = c } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)' } }}>
                {level}
              </button>
            )
          })}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <Search size={40} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '16px', fontFamily: 'var(--font-display)' }}>No courses found.</p>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map(course => (
              <div className="col-md-3 col-sm-6" key={course._id}>
                <Coursecard course={course} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
