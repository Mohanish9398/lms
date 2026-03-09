import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../lms logo.JPG'

function Landing() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  const features = [
    { icon: '🎓', title: 'Expert Instructors', desc: 'Learn from industry professionals with real-world experience' },
    { icon: '📚', title: '16+ Courses', desc: 'Wide range of tech courses from Beginner to Advanced level' },
    { icon: '🎥', title: 'Video Learning', desc: 'Watch high quality YouTube tutorials embedded directly in the platform' },
    { icon: '📱', title: 'Learn Anywhere', desc: 'Fully responsive design — learn on desktop, tablet, or mobile' },
    { icon: '🔒', title: 'Secure Access', desc: 'Login to unlock your enrolled courses and track your progress' },
    { icon: '💸', title: '100% Free', desc: 'All courses are completely free — no hidden fees or subscriptions' },
  ]

  return (
    <div className="landing-page" style={{ fontFamily: "'Segoe UI', sans-serif", overflowX: 'hidden' }}>

      <div style={{
        background: 'linear-gradient(135deg, #81A6C6 0%, #AACDC 50%, #F3E3D0 100%)',
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '40px 20px', position: 'relative', overflow: 'hidden'
      }}>

        <div style={{
          position: 'absolute', width: '400px', height: '400px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
          top: '-100px', left: '-100px'
        }} />
        <div style={{
          position: 'absolute', width: '300px', height: '300px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
          bottom: '-80px', right: '-80px'
        }} />

        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-30px)',
          transition: 'all 0.8s ease', marginBottom: '20px'
        }}>
          <img src={logo} alt="TechPath Logo" style={{ height: '100px', borderRadius: '16px' }} />
        </div>

        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s ease 0.2s',
        }}>
          <h1 style={{ fontSize: '52px', fontWeight: '800', color: '#1a1a2e', marginBottom: '10px', lineHeight: 1.2 }}>
            Welcome to <span style={{ color: '#f5a623', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>TechPath</span>
          </h1>
          <h2 style={{ fontSize: '22px', color: '#2d2d2d', fontWeight: '400', marginBottom: '20px' }}>
            Your Gateway to World-Class Tech Education
          </h2>
          <p style={{ fontSize: '16px', color: '#3a3a3a', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.8 }}>
            Explore 16+ expertly curated courses across React, Python, Java, Node.js, MongoDB and more.
            Learn at your own pace with embedded video lessons — completely free.
          </p>

          <button
            onClick={() => navigate('/home')}
            style={{
              backgroundColor: '#1a1a2e', color: '#F3E3D0', border: 'none',
              padding: '16px 48px', fontSize: '18px', fontWeight: '700',
              borderRadius: '50px', cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
              transition: 'all 0.3s ease', letterSpacing: '0.5px'
            }}
            onMouseEnter={e => {
              e.target.style.backgroundColor = '#81A6C6'
              e.target.style.color = '#ffffff'
              e.target.style.transform = 'translateY(-3px)'
              e.target.style.boxShadow = '0 12px 30px rgba(0,0,0,0.3)'
            }}
            onMouseLeave={e => {
              e.target.style.backgroundColor = '#1a1a2e'
              e.target.style.color = '#F3E3D0'
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.25)'
            }}
          >
            Explore Our Courses →
          </button>
        </div>

        <div style={{
          display: 'flex', gap: '40px', marginTop: '60px', flexWrap: 'wrap',
          justifyContent: 'center', opacity: visible ? 1 : 0,
          transition: 'all 0.8s ease 0.4s',
        }}>
          {[['16+', 'Courses'], ['100%', 'Free'], ['10+', 'Technologies'], ['⭐ 4.8', 'Rating']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a2e' }}>{num}</div>
              <div style={{ fontSize: '13px', color: '#3a3a3a', fontWeight: '500' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: '#F3E3D0', padding: '80px 20px' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: '800', color: '#1a1a2e', marginBottom: '10px' }}>
            Why Choose TechPath?
          </h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '50px', fontSize: '16px' }}>
            Everything you need to start your tech journey
          </p>
          <div className="row g-4">
            {features.map((f, i) => (
              <div className="col-md-4" key={i}>
                <div style={{
                  backgroundColor: '#ffffff', borderRadius: '16px', padding: '30px', height: '100%',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'default'
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-8px)'
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'
                  }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '15px' }}>{f.icon}</div>
                  <h5 style={{ color: '#1a1a2e', fontWeight: '700', marginBottom: '10px' }}>{f.title}</h5>
                  <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.7, marginBottom: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#81A6C6', padding: '60px 20px' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: '800', color: '#ffffff', marginBottom: '10px' }}>
            Technologies You'll Learn
          </h2>
          <p style={{ textAlign: 'center', color: '#F3E3D0', marginBottom: '40px' }}>
            Master the most in-demand tech skills
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            {['React', 'Node.js', 'MongoDB', 'JavaScript', 'Python', 'Django', 'Java', 'Spring', 'Kotlin', 'TypeScript', 'Next.js', 'Express.js', 'Redux', 'Tailwind CSS', 'CSS', 'SQL'].map(tech => (
              <span key={tech} style={{
                backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff',
                padding: '8px 20px', borderRadius: '50px', fontSize: '14px',
                fontWeight: '600', border: '1px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease', cursor: 'default'
              }}
                onMouseEnter={e => {
                  e.target.style.backgroundColor = '#1a1a2e'
                  e.target.style.borderColor = '#1a1a2e'
                }}
                onMouseLeave={e => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'
                  e.target.style.borderColor = 'rgba(255,255,255,0.3)'
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#1a1a2e', padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ color: '#F3E3D0', fontSize: '36px', fontWeight: '800', marginBottom: '15px' }}>
          Ready to Start Learning with TechPath?
        </h2>
        <p style={{ color: '#81A6C6', fontSize: '16px', marginBottom: '35px' }}>
          Join thousands of learners on TechPath and start your journey today — it's completely free.
        </p>
        <button
          onClick={() => navigate('/home')}
          style={{
            backgroundColor: '#81A6C6', color: '#ffffff', border: 'none',
            padding: '16px 48px', fontSize: '18px', fontWeight: '700',
            borderRadius: '50px', cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(0,0,0,0.3)', transition: 'all 0.3s ease'
          }}
          onMouseEnter={e => {
            e.target.style.backgroundColor = '#F3E3D0'
            e.target.style.color = '#1a1a2e'
            e.target.style.transform = 'translateY(-3px)'
          }}
          onMouseLeave={e => {
            e.target.style.backgroundColor = '#81A6C6'
            e.target.style.color = '#ffffff'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          Explore Our Courses →
        </button>
      </div>

    </div>
  )
}

export default Landing