import React from 'react'
import { Link } from 'react-router-dom'

function Coursecard({ course }) {
  return (
    <div className="card h-100 course-card" style={{ backgroundColor: '#F3E3D0', border: 'none', borderRadius: '12px' }}>
      <img
        src={course.image}
        className="card-img-top p-3"
        alt={course.title}
        style={{ height: '180px', objectFit: 'contain' }}
      />
      <div className="card-body d-flex flex-column justify-content-between">
        <h5 className="card-title text-center" style={{ color: '#81A6C6', fontSize: '16px', fontWeight: 'bold' }}>
          {course.title}
        </h5>
        <Link
          to={`/Coursedetails/${course.id}`}
          className="btn explore-btn"
        >
          Explore
        </Link>
      </div>
    </div>
  )
}

export default Coursecard