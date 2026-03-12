import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../Services/API'
import { ShieldCheck, Mail, Lock, AlertCircle } from 'lucide-react'

function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please enter both email and password.'); return }
    setLoading(true)
    try {
      const data = await loginUser(email, password)
      if (data.token && data.user.role === 'admin') {
        localStorage.setItem('token', data.token); localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userEmail', data.user.email); localStorage.setItem('userName', data.user.name)
        localStorage.setItem('userRole', data.user.role); localStorage.setItem('userId', data.user.id)
        navigate('/Admin')
      } else if (data.token && data.user.role !== 'admin') {
        setError('Access denied. This login is for admins only.')
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
      <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,123,0,0.06) 0%, transparent 70%)', top: '-150px', right: '-150px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,0,110,0.05) 0%, transparent 70%)', bottom: '-100px', left: '-100px', pointerEvents: 'none' }} />

      <div style={{
        background: 'var(--bg-card)', borderRadius: '16px', padding: '40px',
        width: '100%', maxWidth: '440px', position: 'relative',
        border: '1px solid rgba(255,123,0,0.2)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(255,123,0,0.06)'
      }}>
        <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px', background: 'linear-gradient(90deg, var(--neon-orange), var(--neon-pink))', opacity: 0.7 }} />

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--neon-orange), var(--neon-pink))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 25px rgba(255,123,0,0.4)'
          }}>
            <ShieldCheck size={28} color="#000" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: '900', fontSize: '26px', color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '1px' }}>Admin Access</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>TechPath Administration Panel</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,0,110,0.08)', border: '1px solid rgba(255,0,110,0.3)', borderRadius: '8px', padding: '11px 14px', marginBottom: '20px', color: '#ff6699', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={14}/> {error}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            <Mail size={11} color="var(--neon-orange)"/> Admin Email
          </label>
          <input type="email" className="form-control" placeholder="admin@techpath.com"
            value={email} onChange={e => setEmail(e.target.value)}
            style={{ borderColor: 'rgba(255,123,0,0.2) !important' }} />
        </div>

        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            <Lock size={11} color="var(--neon-orange)"/> Password
          </label>
          <input type="password" className="form-control" placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', padding: '13px',
          background: loading ? 'rgba(255,123,0,0.3)' : 'linear-gradient(135deg, var(--neon-orange), var(--neon-pink))',
          border: 'none', borderRadius: '8px',
          fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '14px',
          letterSpacing: '1.5px', textTransform: 'uppercase',
          color: '#000', cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          boxShadow: '0 0 20px rgba(255,123,0,0.3)', transition: 'var(--transition)'
        }}
          onMouseEnter={e => !loading && (e.currentTarget.style.boxShadow = '0 0 35px rgba(255,123,0,0.5)')}
          onMouseLeave={e => !loading && (e.currentTarget.style.boxShadow = '0 0 20px rgba(255,123,0,0.3)')}>
          <ShieldCheck size={16}/> {loading ? 'Verifying...' : 'Login as Admin'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
          Not an admin?{' '}
          <span onClick={() => navigate('/Login')} style={{ color: 'var(--neon-orange)', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.5px' }}>
            User Login
          </span>
        </p>
      </div>
    </div>
  )
}

export default AdminLogin
