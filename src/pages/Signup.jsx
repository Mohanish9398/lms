import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signupUser } from '../Services/API'
import { UserPlus, Mail, Lock, User, AlertCircle, ShieldCheck } from 'lucide-react'

const QUESTIONS = [
  "What was the name of your first pet?",
  "What city were you born in?",
  "What is your mother's maiden name?",
  "What was the name of your first school?",
  "What is your favourite movie?",
  "What was your childhood nickname?",
]

const inputStyle = {
  width:'100%', background:'var(--bg-3)', border:'1px solid var(--b-1)',
  borderRadius:'var(--r-md)', padding:'9px 12px 9px 36px', color:'var(--t-hi)',
  fontSize:13, fontFamily:'var(--font-body)', outline:'none', boxSizing:'border-box'
}

const selectStyle = {
  width:'100%', background:'var(--bg-3)', border:'1px solid var(--b-1)',
  borderRadius:'var(--r-md)', padding:'9px 12px', color:'var(--t-hi)',
  fontSize:13, fontFamily:'var(--font-body)', outline:'none', boxSizing:'border-box', cursor:'pointer'
}

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'', securityQuestion: QUESTIONS[0], securityAnswer:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async () => {
    if (!form.name || !form.email || !form.password || !form.confirm || !form.securityAnswer) {
      setError('All fields are required.'); return
    }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true); setError('')
    try {
      const data = await signupUser(form.name, form.email, form.password, form.securityQuestion, form.securityAnswer)
      if (data.token) navigate('/Login')
      else setError(data.message || 'Signup failed.')
    } catch { setError('Server error. Please try again.') }
    setLoading(false)
  }

  const Field = ({ icon, label, name, type='text', placeholder }) => (
    <div style={{ marginBottom:14 }}>
      <label>{label}</label>
      <div style={{ position:'relative' }}>
        <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--t-lo)', pointerEvents:'none' }}>{icon}</span>
        <input type={type} name={name} placeholder={placeholder} value={form[name]} onChange={update}
          autoComplete="new-password" style={inputStyle}/>
      </div>
    </div>
  )

  return (
    <div style={{ background:'var(--bg-0)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 16px' }}>
      <div style={{ width:'100%', maxWidth:420 }}>

        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:44, height:44, borderRadius:11, background:'var(--accent-soft)', border:'1px solid var(--accent-border)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'0 0 24px rgba(6,255,210,0.12)' }}>
            <UserPlus size={20} color="var(--accent)"/>
          </div>
          <h2 style={{ fontSize:22, fontWeight:800, letterSpacing:'-0.03em', marginBottom:6 }}>Create an account</h2>
          <p style={{ fontSize:13, color:'var(--t-mid)' }}>Join TechPath and start learning for free</p>
        </div>

        <div style={{ background:'var(--bg-2)', border:'1px solid var(--b-1)', borderRadius:'var(--r-xl)', padding:'28px 28px 24px', boxShadow:'0 20px 60px rgba(0,0,0,0.4)' }}>
          {error && (
            <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(248,113,113,0.07)', border:'1px solid rgba(248,113,113,0.16)', borderRadius:'var(--r-md)', padding:'10px 13px', marginBottom:18, fontSize:13, color:'#fca5a5' }}>
              <AlertCircle size={14} style={{ flexShrink:0 }}/> {error}
            </div>
          )}

          <Field icon={<User size={14}/>}  label="Full name"      name="name"     type="text"     placeholder="John Doe"/>
          <Field icon={<Mail size={14}/>}  label="Email address"  name="email"    type="email"    placeholder="you@example.com"/>
          <Field icon={<Lock size={14}/>}  label="Password"       name="password" type="password" placeholder="Create a strong password"/>

          <div style={{ marginBottom:14 }}>
            <label>Confirm password</label>
            <div style={{ position:'relative' }}>
              <Lock size={14} color="var(--t-lo)" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
              <input type="password" name="confirm" placeholder="Repeat your password" value={form.confirm}
                onChange={update} onKeyDown={e=>e.key==='Enter'&&submit()} autoComplete="new-password" style={inputStyle}/>
            </div>
          </div>

          <div style={{ borderTop:'1px solid var(--b-1)', margin:'18px 0', paddingTop:18 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
              <ShieldCheck size={13} color="var(--accent)"/>
              <span style={{ fontSize:11, color:'var(--t-lo)', fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Account Recovery</span>
            </div>
            <p style={{ fontSize:12, color:'var(--t-lo)', marginBottom:14, lineHeight:1.6 }}>
              Set a security question to recover your account if you forget your password.
            </p>

            <div style={{ marginBottom:14 }}>
              <label>Security question</label>
              <select name="securityQuestion" value={form.securityQuestion} onChange={update} style={selectStyle}>
                {QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>

            <div style={{ marginBottom:4 }}>
              <label>Your answer</label>
              <div style={{ position:'relative' }}>
                <ShieldCheck size={14} color="var(--t-lo)" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                <input type="text" name="securityAnswer" placeholder="Your answer (case-insensitive)"
                  value={form.securityAnswer} onChange={update} autoComplete="off" style={inputStyle}/>
              </div>
            </div>
          </div>

          <button onClick={submit} disabled={loading} className="btn-accent" style={{ width:'100%', justifyContent:'center', padding:'11px', marginTop:6 }}>
            <UserPlus size={15}/> {loading ? 'Creating account…' : 'Sign up'}
          </button>

          <div style={{ textAlign:'center', marginTop:18 }}>
            <span style={{ fontSize:13, color:'var(--t-lo)' }}>
              Already have an account?{' '}
              <Link to="/Login" style={{ color:'var(--accent)', fontWeight:600 }}>Sign in</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
