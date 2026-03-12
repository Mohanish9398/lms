import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../Services/API'

function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }
    setLoading(true)
    try {
      const data = await loginUser(email, password)
      if (data.token && data.user.role === 'admin') {
        localStorage.setItem('token', data.token)
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userEmail', data.user.email)
        localStorage.setItem('userName', data.user.name)
        localStorage.setItem('userRole', data.user.role)
        localStorage.setItem('userId', data.user.id)
        navigate('/Admin')
      } else if (data.token && data.user.role !== 'admin') {
        setError('Access denied. This login is for admins only.')
      } else {
        setError(data.message || 'Invalid credentials.')
      }
    } catch (err) {
      setError('Server error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      backgroundColor: '#1a1a2e', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px'
    }}>
      <div style={{
        backgroundColor: '#16213e', borderRadius: '16px', padding: '40px',
        width: '100%', maxWidth: '450px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        border: '1px solid #f5a623'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            backgroundColor: '#f5a623', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', fontWeight: '800', color: '#1a1a2e',
            margin: '0 auto 12px'
          }}>
            A
          </div>
          <h2 style={{ color: '#F3E3D0', fontWeight: '800', marginBottom: '4px' }}>Admin Login</h2>
          <p style={{ color: '#81A6C6', fontSize: '14px' }}>TechPath Administration Panel</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#2d1b1b', border: '1px solid #c0392b',
            borderRadius: '8px', padding: '12px 16px',
            color: '#e74c3c', marginBottom: '20px', fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <div className="mb-3">
          <label style={{ fontWeight: '600', color: '#F3E3D0', fontSize: '14px' }}>Admin Email</label>
          <input
            type="email"
            className="form-control mt-1"
            placeholder="Enter admin email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ backgroundColor: '#0f3460', border: '1px solid #f5a623', color: '#F3E3D0' }}
          />
        </div>
        <div className="mb-4">
          <label style={{ fontWeight: '600', color: '#F3E3D0', fontSize: '14px' }}>Password</label>
          <input
            type="password"
            className="form-control mt-1"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{ backgroundColor: '#0f3460', border: '1px solid #f5a623', color: '#F3E3D0' }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '12px',
            backgroundColor: '#f5a623', color: '#1a1a2e',
            border: 'none', borderRadius: '8px',
            fontWeight: '800', fontSize: '16px', cursor: 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.2s'
          }}
        >
          {loading ? 'Verifying...' : 'Login as Admin'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#81A6C6', fontSize: '13px' }}>
          Not an admin?{' '}
          <span
            onClick={() => navigate('/Login')}
            style={{ color: '#f5a623', fontWeight: '600', cursor: 'pointer' }}
          >
            Go to User Login
          </span>
        </p>
      </div>
    </div>
  )
}

export default AdminLogin