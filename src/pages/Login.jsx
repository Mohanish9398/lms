import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../Services/API'
import { Mail, Lock, LogIn, ShieldAlert, Zap } from 'lucide-react'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please enter both email and password.'); return }
    setLoading(true)
    try {
      const data = await loginUser(email, password)
      if (data.token && data.user.role === 'user') {
        const storage = rememberMe ? localStorage : sessionStorage
        storage.setItem('token', data.token); storage.setItem('isLoggedIn', 'true')
        storage.setItem('userEmail', data.user.email); storage.setItem('userName', data.user.name)
        storage.setItem('userRole', data.user.role); storage.setItem('userId', data.user.id)
        navigate('/home')
      } else if (data.token && data.user.role === 'admin') {
        setError('Please use the Admin Login page.')
      } else {
        setError(data.message || 'Invalid credentials.')
      }
    } catch { setError('Server error. Please try again.') }
    setLoading(false)
  }

  return (
    <div style={{
      background: 'var(--bg-primary)', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px', position: 'relative', overflow: 'hidden'
    }}>
      {/* Background */}
      <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)', top: '-100px', left: '-100px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,0,255,0.06) 0%, transparent 70%)', bottom: '-100px', right: '-100px', pointerEvents: 'none' }} />

      <div style={{
        background: 'var(--bg-card)', borderRadius: '16px', padding: '40px',
        width: '100%', maxWidth: '440px', position: 'relative',
        border: '1px solid var(--border-neon)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(0,245,255,0.06)'
      }}>
        {/* Top glow */}
        <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px', background: 'var(--gradient-neon)', opacity: 0.6 }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: 'var(--gradient-neon)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 25px rgba(0,245,255,0.4)'
          }}>
            <Zap size={26} color="#000" fill="#000" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: '900', fontSize: '26px', color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '1px' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-body)' }}>Login to continue your learning journey</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,0,110,0.08)', border: '1px solid rgba(255,0,110,0.25)', borderRadius: '8px', padding: '11px 14px', marginBottom: '20px', color: '#ff6699', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-body)' }}>
            <ShieldAlert size={14}/> {error}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            <Mail size={11} color="var(--neon-cyan)" /> Email
          </label>
          <input type="email" className="form-control" placeholder="your@email.com"
            value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            <Lock size={11} color="var(--neon-cyan)" /> Password
          </label>
          <input type="password" className="form-control" placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div className="form-check" style={{ margin: 0 }}>
            <input className="form-check-input" type="checkbox" id="rememberMe" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
            <label className="form-check-label" htmlFor="rememberMe" style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', textTransform: 'none', letterSpacing: 0 }}>Remember Me</label>
          </div>
          <Link to="#" style={{ color: 'var(--neon-cyan)', fontSize: '12px', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>Forgot password?</Link>
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', padding: '13px',
          background: loading ? 'rgba(0,245,255,0.3)' : 'var(--gradient-neon)',
          border: 'none', borderRadius: '8px',
          fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '14px',
          letterSpacing: '1.5px', textTransform: 'uppercase',
          color: '#000', cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          boxShadow: '0 0 20px rgba(0,245,255,0.25)', transition: 'var(--transition)'
        }}
          onMouseEnter={e => !loading && (e.currentTarget.style.boxShadow = '0 0 35px rgba(0,245,255,0.5)')}
          onMouseLeave={e => !loading && (e.currentTarget.style.boxShadow = '0 0 20px rgba(0,245,255,0.25)')}>
          <LogIn size={16} /> {loading ? 'Logging In...' : 'Login'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-body)' }}>
          Don't have an account?{' '}
          <Link to="/Signup" style={{ color: 'var(--neon-cyan)', fontWeight: '600', textDecoration: 'none' }}>Sign Up</Link>
        </p>

        <div style={{ textAlign: 'center', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
          <span onClick={() => navigate('/AdminLogin')} style={{
            color: 'var(--neon-orange)', fontFamily: 'var(--font-mono)',
            fontWeight: '600', cursor: 'pointer', fontSize: '11px',
            letterSpacing: '1px', textTransform: 'uppercase',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            transition: 'var(--transition)'
          }}
            onMouseEnter={e => e.currentTarget.style.textShadow = '0 0 10px rgba(255,123,0,0.8)'}
            onMouseLeave={e => e.currentTarget.style.textShadow = 'none'}>
            <ShieldAlert size={12}/> Admin Login
          </span>
        </div>
      </div>
    </div>
  )
}

export default Login
