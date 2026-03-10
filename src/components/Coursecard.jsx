import React from 'react'
import { useNavigate } from 'react-router-dom'

function Coursecard({ course }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/Coursedetails/${course._id}`)}
      style={{
        backgroundColor: '#F3E3D0', borderRadius: '16px', overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)', cursor: 'pointer',
        transition: 'transform 0.2s ease', height: '100%'
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ backgroundColor: '#fff', padding: '20px', textAlign: 'center', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={course.image} alt={course.title} style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain' }} />
      </div>
      <div style={{ padding: '16px' }}>
        <h6 style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '6px' }}>{course.title}</h6>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>👨‍🏫 {course.instructor}</p>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>⏱ {course.duration}</p>
        <span style={{ fontSize: '11px', backgroundColor: '#81A6C6', color: '#fff', borderRadius: '4px', padding: '3px 8px' }}>{course.level}</span>
      </div>
    </div>
  )
}

export default Coursecard