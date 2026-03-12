import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../Services/API'
import { ShieldCheck, Mail, Lock, AlertCircle } from 'lucide-react'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [pass, setPass]   = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!email||!pass) { setError('Please enter both email and password.'); return }
    setLoading(true); setError('')
    try {
      const data = await loginUser(email, pass)
      if (data.token && data.user.role === 'admin') {
        localStorage.setItem('token', data.token); localStorage.setItem('isLoggedIn','true')
        localStorage.setItem('userEmail', data.user.email); localStorage.setItem('userName', data.user.name)
        localStorage.setItem('userRole', data.user.role); localStorage.setItem('userId', data.user.id)
        navigate('/Admin')
      } else if (data.token) {
        setError('Access denied. This portal is for administrators only.')
      } else {
        setError(data.message || 'Invalid credentials.')
      }
    } catch { setError('Server error. Please try again.') }
    setLoading(false)
  }

  return (
    <div style={{ background:'var(--bg-0)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 16px' }}>
      <div style={{ width:'100%', maxWidth:380 }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:46, height:46, borderRadius:12, background:'rgba(251,146,60,0.10)', border:'1px solid rgba(251,146,60,0.22)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'0 0 24px rgba(251,146,60,0.12)' }}>
            <ShieldCheck size={22} color="var(--orange)"/>
          </div>
          <h2 style={{ fontSize:22, fontWeight:800, letterSpacing:'-0.03em', marginBottom:6 }}>Admin Portal</h2>
          <p style={{ fontSize:12, color:'var(--t-lo)', fontFamily:'var(--font-mono)' }}>Restricted access — authorised personnel only</p>
        </div>

        <div style={{ background:'var(--bg-2)', border:'1px solid rgba(251,146,60,0.12)', borderRadius:'var(--r-xl)', padding:'28px 28px 24px', boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>
          {error && (
            <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(248,113,113,0.07)', border:'1px solid rgba(248,113,113,0.16)', borderRadius:'var(--r-md)', padding:'10px 13px', marginBottom:18, fontSize:13, color:'#fca5a5' }}>
              <AlertCircle size={14} style={{ flexShrink:0 }}/> {error}
            </div>
          )}

          <div style={{ marginBottom:14 }}>
            <label>Admin email</label>
            <div style={{ position:'relative' }}>
              <Mail size={14} color="var(--t-lo)" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
              <input type="email" placeholder="admin@techpath.com" value={email}
                onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()}
                style={{ width:'100%', background:'var(--bg-3)', border:'1px solid var(--b-1)', borderRadius:'var(--r-md)', padding:'9px 12px 9px 36px', color:'var(--t-hi)', fontSize:13, fontFamily:'var(--font-body)', outline:'none', boxSizing:'border-box' }}/>
            </div>
          </div>

          <div style={{ marginBottom:22 }}>
            <label>Password</label>
            <div style={{ position:'relative' }}>
              <Lock size={14} color="var(--t-lo)" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
              <input type="password" placeholder="Enter admin password" value={pass}
                onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()}
                style={{ width:'100%', background:'var(--bg-3)', border:'1px solid var(--b-1)', borderRadius:'var(--r-md)', padding:'9px 12px 9px 36px', color:'var(--t-hi)', fontSize:13, fontFamily:'var(--font-body)', outline:'none', boxSizing:'border-box' }}/>
            </div>
          </div>

          <button onClick={submit} disabled={loading} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'11px', background:'rgba(251,146,60,0.9)', color:'#0a0608', border:'none', borderRadius:'var(--r-md)', fontFamily:'var(--font-body)', fontWeight:600, fontSize:14, cursor:'pointer', transition:'all 0.18s', boxShadow:'0 0 20px rgba(251,146,60,0.2)' }}
            onMouseEnter={e=>{if(!loading){e.currentTarget.style.background='rgba(251,146,60,1)';e.currentTarget.style.boxShadow='0 0 32px rgba(251,146,60,0.3)';e.currentTarget.style.transform='translateY(-1px)'}}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(251,146,60,0.9)';e.currentTarget.style.boxShadow='0 0 20px rgba(251,146,60,0.2)';e.currentTarget.style.transform='translateY(0)'}}>
            <ShieldCheck size={15}/> {loading ? 'Verifying…' : 'Access admin panel'}
          </button>

          <div style={{ textAlign:'center', marginTop:16 }}>
            <span onClick={() => navigate('/Login')} style={{ fontSize:12, color:'var(--t-lo)', cursor:'pointer', fontFamily:'var(--font-mono)', transition:'color 0.15s' }}
              onMouseEnter={e=>e.currentTarget.style.color='var(--t-mid)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--t-lo)'}>
              ← Return to user login
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}