import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSecurityQuestion, verifySecurityAnswer, resetPasswordWithAnswer } from '../Services/API'
import { Mail, ShieldCheck, Lock, AlertCircle, CheckCircle, ArrowLeft, KeyRound } from 'lucide-react'

const inputStyle = {
  width:'100%', background:'var(--bg-3)', border:'1px solid var(--b-1)',
  borderRadius:'var(--r-md)', padding:'9px 12px 9px 36px', color:'var(--t-hi)',
  fontSize:13, fontFamily:'var(--font-body)', outline:'none', boxSizing:'border-box'
}

const STEPS = ['Email', 'Security Question', 'New Password']

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [userId, setUserId] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleEmailSubmit = async () => {
    if (!email) { setError('Please enter your email address.'); return }
    setLoading(true); setError('')
    try {
      const data = await getSecurityQuestion(email)
      if (data.question) { setQuestion(data.question); setStep(2) }
      else setError(data.message || 'No account found.')
    } catch { setError('Server error. Please try again.') }
    setLoading(false)
  }

  const handleAnswerSubmit = async () => {
    if (!answer) { setError('Please enter your answer.'); return }
    setLoading(true); setError('')
    try {
      const data = await verifySecurityAnswer(email, answer)
      if (data.verified) { setUserId(data.userId); setStep(3) }
      else setError(data.message || 'Incorrect answer.')
    } catch { setError('Server error. Please try again.') }
    setLoading(false)
  }

  const handleReset = async () => {
    if (!newPass || !confirmPass) { setError('Please fill in both fields.'); return }
    if (newPass !== confirmPass) { setError('Passwords do not match.'); return }
    if (newPass.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true); setError('')
    try {
      const data = await resetPasswordWithAnswer(userId, newPass)
      if (data.message === 'Password reset successfully.') setDone(true)
      else setError(data.message || 'Reset failed.')
    } catch { setError('Server error. Please try again.') }
    setLoading(false)
  }

  if (done) return (
    <div style={{ background:'var(--bg-0)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 16px' }}>
      <div style={{ width:'100%', maxWidth:380, textAlign:'center' }}>
        <div style={{ width:56, height:56, borderRadius:14, background:'rgba(52,211,153,0.1)', border:'1px solid rgba(52,211,153,0.25)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:'0 0 28px rgba(52,211,153,0.15)' }}>
          <CheckCircle size={26} color="var(--green)"/>
        </div>
        <h2 style={{ fontSize:22, fontWeight:800, letterSpacing:'-0.03em', marginBottom:8 }}>Password reset!</h2>
        <p style={{ fontSize:13, color:'var(--t-mid)', marginBottom:28 }}>Your password has been updated successfully. You can now sign in with your new password.</p>
        <button onClick={() => navigate('/Login')} className="btn-accent" style={{ padding:'11px 28px' }}>
          Go to Sign in
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ background:'var(--bg-0)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 16px' }}>
      <div style={{ width:'100%', maxWidth:400 }}>

        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:44, height:44, borderRadius:11, background:'var(--accent-soft)', border:'1px solid var(--accent-border)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'0 0 24px rgba(6,255,210,0.12)' }}>
            <KeyRound size={20} color="var(--accent)"/>
          </div>
          <h2 style={{ fontSize:22, fontWeight:800, letterSpacing:'-0.03em', marginBottom:6 }}>Forgot password</h2>
          <p style={{ fontSize:13, color:'var(--t-mid)' }}>Answer your security question to reset your password</p>
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0, marginBottom:24 }}>
          {STEPS.map((s, i) => {
            const n = i + 1
            const active = step === n
            const done = step > n
            return (
              <React.Fragment key={s}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, fontFamily:'var(--font-mono)', background: done ? 'var(--accent)' : active ? 'var(--accent-soft)' : 'var(--bg-3)', border: done ? '1px solid var(--accent)' : active ? '1px solid var(--accent-border)' : '1px solid var(--b-1)', color: done ? '#050510' : active ? 'var(--accent)' : 'var(--t-lo)', transition:'all 0.3s' }}>
                    {done ? <CheckCircle size={13}/> : n}
                  </div>
                  <span style={{ fontSize:10, color: active ? 'var(--accent)' : 'var(--t-lo)', fontFamily:'var(--font-mono)', whiteSpace:'nowrap' }}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width:48, height:1, background: step > n ? 'var(--accent)' : 'var(--b-1)', marginBottom:16, transition:'background 0.3s' }}/>
                )}
              </React.Fragment>
            )
          })}
        </div>

        <div style={{ background:'var(--bg-2)', border:'1px solid var(--b-1)', borderRadius:'var(--r-xl)', padding:'28px 28px 24px', boxShadow:'0 20px 60px rgba(0,0,0,0.4)' }}>
          {error && (
            <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(248,113,113,0.07)', border:'1px solid rgba(248,113,113,0.16)', borderRadius:'var(--r-md)', padding:'10px 13px', marginBottom:18, fontSize:13, color:'#fca5a5' }}>
              <AlertCircle size={14} style={{ flexShrink:0 }}/> {error}
            </div>
          )}

          {step === 1 && (
            <>
              <div style={{ marginBottom:20 }}>
                <label>Email address</label>
                <div style={{ position:'relative' }}>
                  <Mail size={14} color="var(--t-lo)" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                  <input type="email" placeholder="Enter your account email" value={email}
                    onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleEmailSubmit()}
                    autoComplete="email" style={inputStyle}/>
                </div>
              </div>
              <button onClick={handleEmailSubmit} disabled={loading} className="btn-accent" style={{ width:'100%', justifyContent:'center', padding:'11px' }}>
                {loading ? 'Looking up…' : 'Continue'}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ background:'var(--bg-3)', border:'1px solid var(--b-1)', borderRadius:'var(--r-md)', padding:'12px 14px', marginBottom:18 }}>
                <p style={{ fontSize:11, color:'var(--t-lo)', fontFamily:'var(--font-mono)', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.06em' }}>Security question</p>
                <p style={{ fontSize:13, color:'var(--t-hi)', margin:0, fontWeight:500 }}>{question}</p>
              </div>
              <div style={{ marginBottom:20 }}>
                <label>Your answer</label>
                <div style={{ position:'relative' }}>
                  <ShieldCheck size={14} color="var(--t-lo)" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                  <input type="text" placeholder="Type your answer" value={answer}
                    onChange={e=>setAnswer(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAnswerSubmit()}
                    autoComplete="off" style={inputStyle}/>
                </div>
                <p style={{ fontSize:11, color:'var(--t-lo)', marginTop:6 }}>Answer is not case-sensitive</p>
              </div>
              <button onClick={handleAnswerSubmit} disabled={loading} className="btn-accent" style={{ width:'100%', justifyContent:'center', padding:'11px' }}>
                {loading ? 'Verifying…' : 'Verify answer'}
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div style={{ marginBottom:14 }}>
                <label>New password</label>
                <div style={{ position:'relative' }}>
                  <Lock size={14} color="var(--t-lo)" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                  <input type="password" placeholder="Create a new password" value={newPass}
                    onChange={e=>setNewPass(e.target.value)} autoComplete="new-password" style={inputStyle}/>
                </div>
              </div>
              <div style={{ marginBottom:20 }}>
                <label>Confirm new password</label>
                <div style={{ position:'relative' }}>
                  <Lock size={14} color="var(--t-lo)" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                  <input type="password" placeholder="Repeat your new password" value={confirmPass}
                    onChange={e=>setConfirmPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleReset()}
                    autoComplete="new-password" style={inputStyle}/>
                </div>
              </div>
              <button onClick={handleReset} disabled={loading} className="btn-accent" style={{ width:'100%', justifyContent:'center', padding:'11px' }}>
                <KeyRound size={15}/> {loading ? 'Resetting…' : 'Reset password'}
              </button>
            </>
          )}

          <div style={{ textAlign:'center', marginTop:18 }}>
            <span onClick={() => navigate('/Login')} style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:12, color:'var(--t-lo)', cursor:'pointer', fontFamily:'var(--font-mono)', transition:'color 0.15s' }}
              onMouseEnter={e=>e.currentTarget.style.color='var(--t-mid)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--t-lo)'}>
              <ArrowLeft size={12}/> Back to sign in
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
