import React from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Clock, BarChart2 } from 'lucide-react'

const LEVEL_COLORS = {
  Beginner: { color: 'var(--neon-green)', bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.25)' },
  Intermediate: { color: 'var(--neon-cyan)', bg: 'rgba(0,245,255,0.08)', border: 'rgba(0,245,255,0.25)' },
  Advanced: { color: 'var(--neon-pink)', bg: 'rgba(255,0,110,0.08)', border: 'rgba(255,0,110,0.25)' },
}

function Coursecard({ course }) {
  const navigate = useNavigate()
  const level = LEVEL_COLORS[course.level] || LEVEL_COLORS.Beginner

  return (
    <div
      onClick={() => navigate(`/Coursedetails/${course._id}`)}
      className="course-card"
      style={{
        background: 'var(--bg-card)',
        borderRadius: '14px', overflow: 'hidden',
        border: '1px solid var(--border-neon)',
        cursor: 'pointer', height: '100%',
        position: 'relative'
      }}
    >
      {/* Top image area */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,245,255,0.04), rgba(191,0,255,0.04))',
        padding: '24px 20px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '140px', position: 'relative',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        {/* Corner decoration */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '60px', height: '60px',
          background: 'radial-gradient(circle at top right, rgba(0,245,255,0.12), transparent 70%)'
        }} />
        <img
          src={course.image} alt={course.title}
          style={{ maxHeight: '90px', maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(0,245,255,0.2))' }}
        />
      </div>

      <div style={{ padding: '16px' }}>
        <h6 style={{
          fontFamily: 'var(--font-display)', fontWeight: '700',
          color: 'var(--text-primary)', marginBottom: '10px', fontSize: '14px',
          lineHeight: 1.3
        }}>{course.title}</h6>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-body)' }}>
            <User size={11} color="var(--neon-cyan)" /> {course.instructor}
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)' }}>
            <Clock size={10} color="var(--text-muted)" /> {course.duration}
          </p>
        </div>

        <span style={{
          fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: '700',
          letterSpacing: '1px', textTransform: 'uppercase',
          padding: '3px 9px', borderRadius: '4px',
          background: level.bg, color: level.color, border: `1px solid ${level.border}`,
          display: 'inline-flex', alignItems: 'center', gap: '4px'
        }}>
          <BarChart2 size={9} /> {course.level}
        </span>
      </div>

      {/* Bottom glow line on hover */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
        background: 'var(--gradient-neon)', opacity: 0,
        transition: 'opacity 0.3s'
      }} className="card-glow-line" />
    </div>
  )
}

export default Coursecard
