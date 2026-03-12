import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, BookOpen, Video, Monitor, Lock, BadgeDollarSign, ArrowRight, Star, Zap, ChevronRight } from 'lucide-react'

function Landing() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  const features = [
    { icon: <GraduationCap size={28}/>, color: 'var(--neon-cyan)', title: 'Expert Instructors', desc: 'Learn from industry professionals with real-world experience' },
    { icon: <BookOpen size={28}/>, color: 'var(--neon-purple)', title: '16+ Courses', desc: 'Wide range of tech courses from Beginner to Advanced level' },
    { icon: <Video size={28}/>, color: 'var(--neon-pink)', title: 'Video Learning', desc: 'High quality YouTube tutorials embedded directly in the platform' },
    { icon: <Monitor size={28}/>, color: 'var(--neon-green)', title: 'Learn Anywhere', desc: 'Fully responsive — desktop, tablet, or mobile' },
    { icon: <Lock size={28}/>, color: 'var(--neon-orange)', title: 'Secure Access', desc: 'Login to unlock courses and track your progress' },
    { icon: <BadgeDollarSign size={28}/>, color: 'var(--neon-cyan)', title: '100% Free', desc: 'All courses completely free — no hidden fees' },
  ]

  const techs = ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Python', 'Django', 'Java', 'Spring', 'Kotlin', 'TypeScript', 'Next.js', 'Express.js', 'Redux', 'Tailwind CSS', 'CSS', 'SQL']

  return (
    <div style={{ fontFamily: 'var(--font-body)', overflowX: 'hidden' }}>

      {/* HERO */}
      <section style={{
        minHeight: 'calc(100vh - 60px)',
        background: 'var(--bg-primary)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '60px 20px'
      }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)', top: '-200px', left: '-200px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,0,255,0.06) 0%, transparent 70%)', bottom: '-150px', right: '-150px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 70%)', top: '40%', left: '60%', pointerEvents: 'none' }} />

        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 80%)'
        }} />

        <div style={{
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.9s cubic-bezier(0.4,0,0.2,1)',
          position: 'relative', zIndex: 1, maxWidth: '760px'
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)',
            borderRadius: '100px', padding: '6px 16px', marginBottom: '32px',
            fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--neon-cyan)',
            letterSpacing: '2px', textTransform: 'uppercase'
          }}>
            <Zap size={11} fill="var(--neon-cyan)" /> World-Class Tech Education
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: '900',
            fontSize: 'clamp(40px, 7vw, 72px)', lineHeight: 1.05,
            color: 'var(--text-primary)', marginBottom: '20px', letterSpacing: '-1px'
          }}>
            Welcome to{' '}
            <span style={{
              background: 'var(--gradient-neon)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(0,245,255,0.4))'
            }}>TechPath</span>
          </h1>

          <p style={{
            fontFamily: 'var(--font-display)', fontWeight: '400',
            fontSize: 'clamp(16px, 2.5vw, 20px)', color: 'var(--text-secondary)',
            marginBottom: '16px', letterSpacing: '0.3px'
          }}>Your Gateway to World-Class Tech Education</p>

          <p style={{
            fontSize: '15px', color: 'var(--text-muted)', maxWidth: '560px',
            margin: '0 auto 40px', lineHeight: 1.8
          }}>
            Explore 16+ expertly curated courses across React, Python, Java, Node.js, MongoDB and more. Learn at your own pace — completely free.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/home')} style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: 'var(--gradient-neon)',
              border: 'none', padding: '14px 36px',
              fontSize: '14px', fontWeight: '700', borderRadius: '8px',
              cursor: 'pointer', color: '#000',
              fontFamily: 'var(--font-display)', letterSpacing: '1.5px',
              textTransform: 'uppercase',
              boxShadow: '0 0 30px rgba(0,245,255,0.3), 0 0 60px rgba(0,245,255,0.1)',
              transition: 'var(--transition)'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(0,245,255,0.5), 0 0 80px rgba(0,245,255,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(0,245,255,0.3), 0 0 60px rgba(0,245,255,0.1)' }}>
              Explore Courses <ArrowRight size={16} />
            </button>

            <button onClick={() => navigate('/Signup')} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'transparent',
              border: '1px solid rgba(191,0,255,0.4)', padding: '14px 36px',
              fontSize: '14px', fontWeight: '700', borderRadius: '8px',
              cursor: 'pointer', color: 'var(--neon-purple)',
              fontFamily: 'var(--font-display)', letterSpacing: '1.5px',
              textTransform: 'uppercase', transition: 'var(--transition)'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(191,0,255,0.08)'; e.currentTarget.style.boxShadow = 'var(--glow-purple)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}>
              Sign Up Free
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '40px', marginTop: '60px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['16+', 'Courses', 'var(--neon-cyan)'], ['100%', 'Free', 'var(--neon-green)'], ['10+', 'Technologies', 'var(--neon-purple)'], ['4.8', 'Rating', 'var(--neon-orange)']].map(([num, label, color]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '900', color, textShadow: `0 0 15px ${color}` }}>{num}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', opacity: 0.4, animation: 'float 3s ease-in-out infinite' }}>
          <ChevronRight size={20} color="var(--neon-cyan)" style={{ transform: 'rotate(90deg)' }} />
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: 'var(--bg-secondary)', padding: '80px 20px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, var(--neon-cyan), var(--neon-purple), transparent)', opacity: 0.3 }} />
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--neon-cyan)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>// Why Choose Us</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Why Choose <span style={{ background: 'var(--gradient-neon)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>TechPath?</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Everything you need to start your tech journey</p>
          </div>
          <div className="row g-4">
            {features.map((f, i) => (
              <div className="col-md-4" key={i}>
                <div style={{
                  background: 'var(--bg-card)', borderRadius: '14px', padding: '28px',
                  border: '1px solid var(--border-subtle)', height: '100%',
                  transition: 'var(--transition-slow)', cursor: 'default', position: 'relative', overflow: 'hidden'
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,245,255,0.2)'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.5), 0 0 20px rgba(0,245,255,0.06)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: `radial-gradient(circle at top right, ${f.color}10, transparent 70%)` }} />
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '12px',
                    background: `${f.color}15`, border: `1px solid ${f.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '18px', color: f.color
                  }}>{f.icon}</div>
                  <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', fontSize: '16px' }}>{f.title}</h5>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGIES */}
      <section style={{ background: 'var(--bg-primary)', padding: '70px 20px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, var(--neon-purple), var(--neon-pink), transparent)', opacity: 0.3 }} />
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--neon-purple)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>// Tech Stack</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Technologies You'll <span style={{ background: 'var(--gradient-aurora)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Master</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>The most in-demand tech skills in the industry</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {techs.map((tech, i) => {
              const colors = ['var(--neon-cyan)', 'var(--neon-purple)', 'var(--neon-pink)', 'var(--neon-green)', 'var(--neon-orange)']
              const c = colors[i % colors.length]
              return (
                <span key={tech} style={{
                  background: `${c}08`, color: c, padding: '7px 18px',
                  borderRadius: '6px', fontSize: '12px', fontFamily: 'var(--font-mono)',
                  fontWeight: '600', letterSpacing: '0.5px',
                  border: `1px solid ${c}25`, transition: 'var(--transition)', cursor: 'default'
                }}
                  onMouseEnter={e => { e.target.style.background = `${c}18`; e.target.style.boxShadow = `0 0 15px ${c}40`; e.target.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.target.style.background = `${c}08`; e.target.style.boxShadow = 'none'; e.target.style.transform = 'translateY(0)' }}>
                  {tech}
                </span>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--bg-secondary)', padding: '80px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, var(--neon-green), var(--neon-cyan), transparent)', opacity: 0.3 }} />
        <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--neon-green)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>// Start Today</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: '900', fontSize: 'clamp(28px, 5vw, 44px)', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.1 }}>
            Ready to Start<br/><span style={{ background: 'var(--gradient-matrix)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Your Journey?</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '36px' }}>Join thousands of learners on TechPath. Start your journey today — completely free.</p>
          <button onClick={() => navigate('/home')} style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'var(--gradient-neon)', border: 'none',
            padding: '14px 40px', fontSize: '14px', fontWeight: '700',
            borderRadius: '8px', cursor: 'pointer', color: '#000',
            fontFamily: 'var(--font-display)', letterSpacing: '1.5px',
            textTransform: 'uppercase',
            boxShadow: '0 0 30px rgba(0,245,255,0.3)', transition: 'var(--transition)'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 0 50px rgba(0,245,255,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(0,245,255,0.3)' }}>
            Explore Courses <ArrowRight size={16} />
          </button>
        </div>
      </section>

    </div>
  )
}

export default Landing
