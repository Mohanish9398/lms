import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signupUser } from '../Services/API'
import { User, Mail, Lock, UserPlus, ShieldAlert, Zap } from 'lucide-react'

function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirm) { setError('All fields are required.'); return }
    if (formData.password !== formData.confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      const data = await signupUser(formData.name, formData.email, formData.password)
      if (data.token) navigate('/Login')
      else setError(data.message || 'Signup failed.')
    } catch { setError('Server error. Please try again.') }
    setLoading(false)
  }

  const fieldLabel = (icon, text) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
      {icon} {text}
    </label>
  )

  return (
    <div style={{
      background: 'var(--bg-primary)', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,0,255,0.06) 0%, transparent 70%)', top: '-100px', right: '-100px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)', bottom: '-100px', left: '-100px', pointerEvents: 'none' }} />

      <div style={{
        background: 'var(--bg-card)', borderRadius: '16px', padding: '40px',
        width: '100%', maxWidth: '440px', position: 'relative',
        border: '1px solid var(--border-purple)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(191,0,255,0.05)'
      }}>
        <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px', background: 'linear-gradient(90deg, var(--neon-purple), var(--neon-cyan))', opacity: 0.6 }} />

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--neon-purple), var(--neon-cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 25px rgba(191,0,255,0.4)'
          }}>
            <UserPlus size={24} color="#000" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: '900', fontSize: '26px', color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '1px' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Join TechPath and start learning today</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,0,110,0.08)', border: '1px solid rgba(255,0,110,0.25)', borderRadius: '8px', padding: '11px 14px', marginBottom: '20px', color: '#ff6699', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={14}/> {error}
          </div>
        )}

        <div style={{ marginBottom: '14px' }}>
          {fieldLabel(<User size={11} color="var(--neon-purple)"/>, 'Full Name')}
          <input type="text" name="name" className="form-control" placeholder="Your full name" value={formData.name} onChange={handleChange} />
        </div>
        <div style={{ marginBottom: '14px' }}>
          {fieldLabel(<Mail size={11} color="var(--neon-purple)"/>, 'Email')}
          <input type="email" name="email" className="form-control" placeholder="your@email.com" value={formData.email} onChange={handleChange} />
        </div>
        <div style={{ marginBottom: '14px' }}>
          {fieldLabel(<Lock size={11} color="var(--neon-purple)"/>, 'Password')}
          <input type="password" name="password" className="form-control" placeholder="Create a password" value={formData.password} onChange={handleChange} />
        </div>
        <div style={{ marginBottom: '24px' }}>
          {fieldLabel(<Lock size={11} color="var(--neon-purple)"/>, 'Confirm Password')}
          <input type="password" name="confirm" className="form-control" placeholder="Confirm your password" value={formData.confirm} onChange={handleChange} />
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', padding: '13px',
          background: loading ? 'rgba(191,0,255,0.3)' : 'linear-gradient(135deg, var(--neon-purple), var(--neon-cyan))',
          border: 'none', borderRadius: '8px',
          fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '14px',
          letterSpacing: '1.5px', textTransform: 'uppercase',
          color: '#000', cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          boxShadow: '0 0 20px rgba(191,0,255,0.25)', transition: 'var(--transition)'
        }}>
          <UserPlus size={16}/> {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>
          Already have an account?{' '}
          <Link to="/Login" style={{ color: 'var(--neon-cyan)', fontWeight: '600', textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
