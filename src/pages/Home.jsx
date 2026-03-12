import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Coursecard from '../components/Coursecard'
import { fetchCourses } from '../Services/API'
import { Search } from 'lucide-react'

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function Home() {
  const [courses, setCourses] = useState([])
  const [filtered, setFiltered] = useState([])
  const [level, setLevel] = useState('All')
  const location = useLocation()

  useEffect(() => { fetchCourses().then(data => { setCourses(data); setFiltered(data) }) }, [])

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('search') || ''
    let res = courses
    if (q.trim()) res = res.filter(c => c.title.toLowerCase().includes(q.toLowerCase()) || c.instructor.toLowerCase().includes(q.toLowerCase()))
    if (level !== 'All') res = res.filter(c => c.level === level)
    setFiltered(res)
  }, [location.search, courses, level])

  return (
    <div style={{ background:'var(--bg-0)', minHeight:'100vh', padding:'44px 20px' }}>
      <div style={{ maxWidth:1280, margin:'0 auto' }}>

        
        <div style={{ marginBottom:32 }}>
          <div className="eyebrow" style={{ marginBottom:8 }}>Course catalog</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(24px,4vw,36px)', fontWeight:800, letterSpacing:'-0.03em', marginBottom:4 }}>
            All Courses
          </h1>
          <p style={{ fontSize:13, color:'var(--t-mid)' }}>{filtered.length} course{filtered.length !== 1 ? 's' : ''} available</p>
        </div>

        
        <div style={{ display:'flex', gap:6, marginBottom:28, flexWrap:'wrap' }}>
          {LEVELS.map(l => (
            <button key={l} onClick={() => setLevel(l)} style={{ padding:'6px 14px', borderRadius:'var(--r-sm)', border:`1px solid ${level===l?'var(--accent-border)':'var(--b-1)'}`, background: level===l?'var(--accent-soft)':'transparent', color: level===l?'var(--accent)':'var(--t-mid)', fontFamily:'var(--font-mono)', fontSize:12, fontWeight:500, cursor:'pointer', transition:'all 0.15s var(--ease)' }}
              onMouseEnter={e=>{if(level!==l){e.currentTarget.style.borderColor='var(--b-2)';e.currentTarget.style.color='var(--t-hi)'}}}
              onMouseLeave={e=>{if(level!==l){e.currentTarget.style.borderColor='var(--b-1)';e.currentTarget.style.color='var(--t-mid)'}}}>
              {l}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px', color:'var(--t-lo)' }}>
            <Search size={36} style={{ margin:'0 auto 14px', opacity:0.3 }}/>
            <p style={{ fontSize:14 }}>No courses match your search.</p>
          </div>
        ) : (
          <div className="row g-3">
            {filtered.map(c => (
              <div className="col-6 col-md-4 col-lg-3" key={c._id}>
                <Coursecard course={c}/>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}