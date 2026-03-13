import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../Services/API'
import { Mail, Lock, LogIn, AlertCircle, ShieldAlert } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail]     = useState('')
  const [pass, setPass]       = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!email || !pass) { setError('Please enter both email and password.'); return }
    setLoading(true); setError('')
    try {
      const data = await loginUser(email, pass)
      if (data.token && data.user.role === 'user') {
        const s = remember ? localStorage : sessionStorage
        s.setItem('token', data.token); s.setItem('isLoggedIn','true')
        s.setItem('userEmail', data.user.email); s.setItem('userName', data.user.name)
        s.setItem('userRole', data.user.role); s.setItem('userId', data.user.id)
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
    <div style={{ background:'var(--bg-0)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 16px' }}>
      <div style={{ width:'100%', maxWidth:400 }}>

        
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:44, height:44, borderRadius:11, background:'var(--accent-soft)', border:'1px solid var(--accent-border)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'0 0 24px rgba(6,255,210,0.12)' }}>
            <LogIn size={20} color="var(--accent)"/>
          </div>
          <h2 style={{ fontSize:22, fontWeight:800, letterSpacing:'-0.03em', marginBottom:6 }}>Welcome back</h2>
          <p style={{ fontSize:13, color:'var(--t-mid)' }}>Sign in to continue your learning journey</p>
        </div>

        
        <div style={{ background:'var(--bg-2)', border:'1px solid var(--b-1)', borderRadius:'var(--r-xl)', padding:'28px 28px 24px', boxShadow:'0 20px 60px rgba(0,0,0,0.4)' }}>
          {error && (
            <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(248,113,113,0.07)', border:'1px solid rgba(248,113,113,0.16)', borderRadius:'var(--r-md)', padding:'10px 13px', marginBottom:18, fontSize:13, color:'#fca5a5' }}>
              <AlertCircle size={14} style={{ flexShrink:0 }}/> {error}
            </div>
          )}

          <div style={{ marginBottom:16 }}>
            <label>Email address</label>
            <div style={{ position:'relative' }}>
              <Mail size={14} color="var(--t-lo)" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
              <input type="email" style={{ width:'100%', background:'var(--bg-3)', border:'1px solid var(--b-1)', borderRadius:'var(--r-md)', padding:'9px 12px 9px 36px', color:'var(--t-hi)', fontSize:13, fontFamily:'var(--font-body)', outline:'none', boxSizing:'border-box' }} placeholder="you@example.com" value={email}
                onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()}/>
            </div>
          </div>

          <div style={{ marginBottom:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
              <label style={{ margin:0 }}>Password</label>
              <Link to="/ForgotPassword" style={{ fontSize:11, color:'var(--t-lo)', fontFamily:'var(--font-mono)', transition:'color 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.color='var(--accent)'}
                onMouseLeave={e=>e.currentTarget.style.color='var(--t-lo)'}>Forgot?</Link>
            </div>
            <div style={{ position:'relative' }}>
              <Lock size={14} color="var(--t-lo)" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
              <input type="password" style={{ width:'100%', background:'var(--bg-3)', border:'1px solid var(--b-1)', borderRadius:'var(--r-md)', padding:'9px 12px 9px 36px', color:'var(--t-hi)', fontSize:13, fontFamily:'var(--font-body)', outline:'none', boxSizing:'border-box' }} placeholder="Enter your password" value={pass}
                onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()}/>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:22 }}>
            <input type="checkbox" className="form-check-input" id="rem" checked={remember} onChange={e=>setRemember(e.target.checked)} style={{ margin:0 }}/>
            <label htmlFor="rem" style={{ margin:0, fontSize:12, color:'var(--t-mid)', textTransform:'none', letterSpacing:'normal', cursor:'pointer' }}>Remember me</label>
          </div>

          <button onClick={submit} disabled={loading} className="btn-accent" style={{ width:'100%', justifyContent:'center', padding:'11px' }}>
            <LogIn size={15}/> {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <div style={{ textAlign:'center', marginTop:18 }}>
            <span style={{ fontSize:13, color:'var(--t-lo)' }}>
              No account?{' '}
              <Link to="/Signup" style={{ color:'var(--accent)', fontWeight:600, transition:'opacity 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.opacity='0.8'}
                onMouseLeave={e=>e.currentTarget.style.opacity='1'}>Sign up free</Link>
            </span>
          </div>
        </div>

        
        <div style={{ textAlign:'center', marginTop:18 }}>
          <span onClick={() => navigate('/AdminLogin')} style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:12, color:'var(--t-lo)', fontFamily:'var(--font-mono)', cursor:'pointer', transition:'color 0.15s' }}
            onMouseEnter={e=>e.currentTarget.style.color='var(--orange)'}
            onMouseLeave={e=>e.currentTarget.style.color='var(--t-lo)'}>
            <ShieldAlert size={12}/> Admin login
          </span>
        </div>
      </div>
    </div>
  )
}