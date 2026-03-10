import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signupUser } from '../Services/API'

function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password || !formData.confirm) {
      setError('All fields are required.')
      return
    }
    if (formData.password !== formData.confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const data = await signupUser(formData.name, formData.email, formData.password)
      if (data.message === 'Account created successfully') {
        navigate('/Login')
      } else {
        setError(data.message || 'Signup failed.')
      }
    } catch (err) {
      setError('Server error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ backgroundColor: '#81A6C6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ backgroundColor: '#F3E3D0', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '450px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
        <h2 style={{ textAlign: 'center', color: '#1a1a2e', fontWeight: '800', marginBottom: '8px' }}>Create Account</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Join TechPath and start learning today</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label style={{ fontWeight: '600', color: '#1a1a2e' }}>Full Name</label>
          <input type="text" name="name" className="form-control mt-1" placeholder="Enter your full name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label style={{ fontWeight: '600', color: '#1a1a2e' }}>Email</label>
          <input type="email" name="email" className="form-control mt-1" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label style={{ fontWeight: '600', color: '#1a1a2e' }}>Password</label>
          <input type="password" name="password" className="form-control mt-1" placeholder="Create a password" value={formData.password} onChange={handleChange} />
        </div>
        <div className="mb-4">
          <label style={{ fontWeight: '600', color: '#1a1a2e' }}>Confirm Password</label>
          <input type="password" name="confirm" className="form-control mt-1" placeholder="Confirm your password" value={formData.confirm} onChange={handleChange} />
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#1a1a2e', color: '#F3E3D0', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          Already have an account? <Link to="/Login" style={{ color: '#81A6C6', fontWeight: '600' }}>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup