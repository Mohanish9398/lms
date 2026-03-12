import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, User } from 'lucide-react'

const levelBadge = {
  Beginner:     'badge-green',
  Intermediate: 'badge-teal',
  Advanced:     'badge-red',
}

export default function Coursecard({ course }) {
  const navigate = useNavigate()
  const badgeCls = levelBadge[course.level] || 'badge-muted'

  return (
    <div className="card card-hover" onClick={() => navigate(`/Coursedetails/${course._id}`)}
      style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>

      
      <div style={{ background:'var(--bg-3)', borderBottom:'1px solid var(--b-1)', height:120, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 80% 20%, rgba(6,255,210,0.04) 0%, transparent 60%)', pointerEvents:'none' }}/>
        <img src={course.image} alt={course.title}
          style={{ maxHeight:76, maxWidth:'80%', objectFit:'contain', filter:'drop-shadow(0 2px 10px rgba(0,0,0,0.5))', position:'relative' }}/>
      </div>

      
      <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:7, flex:1 }}>
        <span className={`badge ${badgeCls}`}>{course.level}</span>
        <h6 style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:600, color:'var(--t-hi)', lineHeight:1.35 }}>
          {course.title}
        </h6>
        <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap:4 }}>
          <span style={{ fontFamily:'var(--font-body)', fontSize:12, color:'var(--t-lo)', display:'flex', alignItems:'center', gap:5 }}>
            <User size={11}/>{course.instructor}
          </span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--t-lo)', display:'flex', alignItems:'center', gap:5 }}>
            <Clock size={11}/>{course.duration}
          </span>
        </div>
      </div>
    </div>
  )
}