import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, GraduationCap, BookOpen, Video, Monitor, Lock, BadgeDollarSign, CheckCircle } from 'lucide-react'
import logo from '../lms logo.JPG'

const FEATURES = [
  { icon: <GraduationCap size={18}/>, title:'Expert Instructors',    desc:'Learn from practitioners with real-world engineering experience.' },
  { icon: <BookOpen size={18}/>,      title:'24+ Structured Courses', desc:'Clear learning paths from Beginner to Advanced across 10+ technologies.' },
  { icon: <Video size={18}/>,         title:'Video-First Learning',   desc:'Embedded, high-quality video lessons — no redirects or sign-ups needed.' },
  { icon: <Monitor size={18}/>,       title:'Fully Responsive',       desc:'A seamless, consistent experience on desktop, tablet, and mobile.' },
  { icon: <Lock size={18}/>,          title:'Progress Tracking',      desc:'Per-lesson completion tracking — resume exactly where you left off.' },
  { icon: <BadgeDollarSign size={18}/>,title:'Always Free',           desc:'Every course, every lesson, zero paywalls. No subscription, ever.' },
]

const TECHS = ['React','Node.js','MongoDB','JavaScript','Python','Django','Java','Spring','Kotlin','TypeScript','Next.js','Express.js','Redux','Tailwind CSS','SQL','Docker']

export default function Landing() {
  const navigate = useNavigate()
  const [vis, setVis] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVis(true), 60); return () => clearTimeout(t) }, [])

  const s = (delay = 0) => ({
    opacity: vis ? 1 : 0,
    transform: vis ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity 0.6s var(--ease) ${delay}s, transform 0.6s var(--ease) ${delay}s`,
  })

  return (
    <div style={{ fontFamily:'var(--font-body)' }}>

      
      <section style={{ background:'var(--bg-0)', position:'relative', overflow:'hidden', minHeight:'calc(100vh - 58px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'80px 20px' }}>
        
        <div style={{ position:'absolute', top:-280, left:-200, width:640, height:640, borderRadius:'50%', background:'radial-gradient(circle, rgba(6,255,210,0.04) 0%, transparent 65%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:-200, right:-150, width:560, height:560, borderRadius:'50%', background:'radial-gradient(circle, rgba(96,165,250,0.025) 0%, transparent 65%)', pointerEvents:'none' }}/>
        
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none', maskImage:'radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)' }}/>

        <div style={{ maxWidth:680, textAlign:'center', position:'relative', zIndex:1 }}>
          <div style={{ ...s(0), display:'inline-flex', alignItems:'center', gap:8, background:'var(--bg-2)', border:'1px solid var(--b-1)', borderRadius:99, padding:'5px 14px 5px 8px', marginBottom:28, fontSize:12, fontFamily:'var(--font-mono)' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--accent)', display:'inline-block', animation:'accentPulse 2.4s ease infinite' }}/>
            <span style={{ color:'var(--t-mid)' }}>Free forever · No account required to browse</span>
          </div>

          <div style={{ ...s(0.04), display:'flex', justifyContent:'center', marginBottom:28 }}>
            <div style={{ position:'relative', display:'inline-flex' }}>
              <div style={{ position:'absolute', inset:-18, borderRadius:'50%', background:'radial-gradient(circle, rgba(6,255,210,0.12) 0%, transparent 70%)', pointerEvents:'none' }}/>
              <div style={{ background:'var(--bg-2)', border:'1px solid var(--b-1)', borderRadius:24, padding:'14px 18px', boxShadow:'0 0 0 1px rgba(6,255,210,0.08), 0 20px 60px rgba(0,0,0,0.4)' }}>
                <img src={logo} alt="TechPath" style={{ height:88, width:'auto', objectFit:'contain', display:'block', filter:'drop-shadow(0 4px 16px rgba(6,255,210,0.18))' }}/>
              </div>
            </div>
          </div>

          <h1 style={{ ...s(0.07), fontSize:'clamp(38px,7vw,66px)', fontWeight:800, letterSpacing:'-0.04em', lineHeight:1.05, marginBottom:20 }}>
            Learn to build <br/>
            <span style={{ color:'var(--accent)', textShadow:'0 0 48px rgba(6,255,210,0.22)' }}>great software.</span>
          </h1>

          <p style={{ ...s(0.14), fontSize:16, color:'var(--t-mid)', lineHeight:1.75, maxWidth:500, margin:'0 auto 36px', fontWeight:400 }}>
            TechPath offers 24+ structured courses across React, Python, Node.js and more — for free, with no fluff.
          </p>

          <div style={{ ...s(0.2), display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', marginBottom:52 }}>
            <button onClick={() => navigate('/home')} className="btn-accent" style={{ padding:'12px 22px', fontSize:14 }}>
              Browse courses <ArrowRight size={15}/>
            </button>
            <button onClick={() => navigate('/Signup')} className="btn-outline" style={{ padding:'12px 20px', fontSize:14 }}>
              Create free account
            </button>
          </div>

          <div style={{ ...s(0.26), display:'flex', gap:36, justifyContent:'center', flexWrap:'wrap', paddingTop:28, borderTop:'1px solid var(--b-1)' }}>
            {[['24+','Courses'],['100%','Free'],['10+','Technologies'],['4.8★','Rating']].map(([v,l]) => (
              <div key={l} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:800, color:'var(--t-hi)', letterSpacing:'-0.03em' }}>{v}</div>
                <div style={{ fontSize:11, color:'var(--t-lo)', marginTop:2, fontFamily:'var(--font-mono)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section style={{ background:'var(--bg-1)', borderTop:'1px solid var(--b-1)', borderBottom:'1px solid var(--b-1)', padding:'72px 20px' }}>
        <div style={{ maxWidth:1080, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:44 }}>
            <div className="eyebrow" style={{ marginBottom:10 }}>Why TechPath</div>
            <h2 style={{ fontSize:'clamp(22px,3.5vw,34px)', fontWeight:700, letterSpacing:'-0.03em' }}>
              Everything you need, nothing you don't.
            </h2>
          </div>
          <div className="row g-3">
            {FEATURES.map((f, i) => (
              <div className="col-md-4" key={i}>
                <div style={{ background:'var(--bg-2)', border:'1px solid var(--b-1)', borderRadius:'var(--r-lg)', padding:'20px 22px', height:'100%', transition:'all 0.22s var(--ease)' }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(6,255,210,0.22)';e.currentTarget.style.boxShadow='0 0 0 1px rgba(6,255,210,0.08), 0 0 24px rgba(6,255,210,0.07), 0 0 60px rgba(6,255,210,0.04)'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--b-1)';e.currentTarget.style.boxShadow='none'}}>
                  <div style={{ width:38, height:38, borderRadius:9, background:'var(--accent-soft)', border:'1px solid var(--accent-border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--accent)', marginBottom:14 }}>
                    {f.icon}
                  </div>
                  <h5 style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:700, color:'var(--t-hi)', marginBottom:6 }}>{f.title}</h5>
                  <p style={{ fontSize:13, color:'var(--t-mid)', lineHeight:1.65 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section style={{ background:'var(--bg-0)', padding:'64px 20px' }}>
        <div style={{ maxWidth:820, margin:'0 auto', textAlign:'center' }}>
          <div className="eyebrow" style={{ marginBottom:10 }}>Tech Stack</div>
          <h2 style={{ fontSize:'clamp(20px,3vw,30px)', fontWeight:700, letterSpacing:'-0.03em', marginBottom:8 }}>Technologies you'll master</h2>
          <p style={{ fontSize:13, color:'var(--t-lo)', marginBottom:32 }}>The most in-demand skills across frontend, backend, and cloud.</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:7, justifyContent:'center' }}>
            {TECHS.map(tech => (
              <span key={tech} style={{ background:'var(--bg-2)', border:'1px solid var(--b-1)', borderRadius:'var(--r-sm)', padding:'5px 13px', fontSize:12, color:'var(--t-mid)', fontFamily:'var(--font-mono)', transition:'all 0.15s var(--ease)', cursor:'default' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--accent-border)';e.currentTarget.style.color='var(--accent)';e.currentTarget.style.background='var(--accent-soft)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--b-1)';e.currentTarget.style.color='var(--t-mid)';e.currentTarget.style.background='var(--bg-2)'}}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      
      <section style={{ background:'var(--bg-1)', borderTop:'1px solid var(--b-1)', padding:'68px 20px', textAlign:'center' }}>
        <div style={{ maxWidth:520, margin:'0 auto' }}>
          <h2 style={{ fontSize:'clamp(22px,4vw,36px)', fontWeight:800, letterSpacing:'-0.035em', marginBottom:12 }}>
            Ready to start learning?
          </h2>
          <p style={{ fontSize:14, color:'var(--t-mid)', marginBottom:28, lineHeight:1.7 }}>
            Join thousands of developers already on TechPath. Free forever, no credit card needed.
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', marginBottom:24 }}>
            {['No credit card','All courses free','Learn at your pace'].map(t => (
              <span key={t} style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'var(--t-lo)' }}>
                <CheckCircle size={12} color="var(--accent)"/> {t}
              </span>
            ))}
          </div>
          <button onClick={() => navigate('/Signup')} className="btn-accent" style={{ padding:'12px 26px', fontSize:14 }}>
            Get started for free <ArrowRight size={15}/>
          </button>
        </div>
      </section>
    </div>
  )
}