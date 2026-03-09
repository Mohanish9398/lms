import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
    const matchedUser = existingUsers.find(u => u.email === email && u.password === password)

    if (!matchedUser) {
      setError('Invalid credentials. Please signup first or check your email and password.')
      return
    }

    if (rememberMe) {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userEmail', email)
    } else {
      sessionStorage.setItem('isLoggedIn', 'true')
      sessionStorage.setItem('userEmail', email)
    }

    setError('')
    navigate('/Mycourses')
  }

  return (
    <div style={{ backgroundColor: '#81A6C6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ backgroundColor: '#F3E3D0', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '450px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
        <h2 style={{ textAlign: 'center', color: '#1a1a2e', fontWeight: '800', marginBottom: '8px' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Login to continue your learning journey</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label style={{ fontWeight: '600', color: '#1a1a2e' }}>Email</label>
          <input type="email" className="form-control mt-1" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label style={{ fontWeight: '600', color: '#1a1a2e' }}>Password</label>
          <input type="password" className="form-control mt-1" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="rememberMe" style={{ color: '#1a1a2e' }}>
              Remember Me
            </label>
          </div>
          <Link to="#" style={{ color: '#81A6C6', fontSize: '14px' }}>Forgot Password?</Link>
        </div>

        <button onClick={handleSubmit} style={{ width: '100%', padding: '12px', backgroundColor: '#1a1a2e', color: '#F3E3D0', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}>
          Login
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          Don't have an account? <Link to="/Signup" style={{ color: '#81A6C6', fontWeight: '600' }}>Sign Up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login