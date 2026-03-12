import logo from '../lms logo.JPG'
import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, BookOpen, LayoutDashboard, LogIn, Search, ChevronDown, LogOut, Settings, Menu, X } from 'lucide-react'
import { FaUserShield } from 'react-icons/fa'

export default function Navbar() {
  const [q, setQ]           = useState('')
  const [drop, setDrop]     = useState(false)
  const [mob, setMob]       = useState(false)
  const navigate = useNavigate()
  const dropRef  = useRef(null)

  const loggedIn = localStorage.getItem('isLoggedIn') === 'true' || sessionStorage.getItem('isLoggedIn') === 'true'
  const role  = localStorage.getItem('userRole')  || sessionStorage.getItem('userRole')  || ''
  const email = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail') || ''
  const name  = localStorage.getItem('userName')  || sessionStorage.getItem('userName')  || email
  const init  = name.charAt(0).toUpperCase()

  useEffect(() => {
    const h = e => { if (dropRef.current && !dropRef.current.contains(e.target)) setDrop(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const logout = () => {
    ;['isLoggedIn','userEmail','userName','userRole','userId','token'].forEach(k => {
      localStorage.removeItem(k); sessionStorage.removeItem(k)
    })
    setDrop(false); setMob(false); navigate('/Login')
  }

  const links = [
    { to: '/home',      label: 'Home',      icon: <Home size={14}/>,           show: true },
    { to: '/Mycourses', label: 'My Courses', icon: <BookOpen size={14}/>,       show: loggedIn && role !== 'admin' },
    { to: '/Admin',     label: 'Dashboard',  icon: <LayoutDashboard size={14}/>,show: loggedIn && role === 'admin' },
  ].filter(l => l.show)

  const linkBase = {
    display:'flex', alignItems:'center', gap:7,
    padding:'6px 11px', borderRadius:'var(--r-sm)',
    fontFamily:'var(--font-body)', fontWeight:500, fontSize:13,
    color:'var(--t-mid)', textDecoration:'none',
    transition:'all 0.15s var(--ease)',
  }

  return (
    <header style={{ background:'rgba(8,8,16,0.88)', backdropFilter:'blur(20px)', borderBottom:'1px solid var(--b-1)', position:'sticky', top:0, zIndex:200 }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 20px', height:58, display:'flex', alignItems:'center', gap:20 }}>

        
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:9, textDecoration:'none', flexShrink:0 }}>
          <img src={logo} alt="TechPath" style={{ height:36, width:'auto', objectFit:'contain' }}/>
          <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, color:'var(--t-hi)', letterSpacing:'-0.01em' }}>TechPath</span>
        </Link>

        
        <nav className="d-none d-lg-flex" style={{ display:'flex', alignItems:'center', gap:2, flex:1 }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={linkBase}
              onMouseEnter={e=>{e.currentTarget.style.color='var(--t-hi)';e.currentTarget.style.background='rgba(255,255,255,0.05)'}}
              onMouseLeave={e=>{e.currentTarget.style.color='var(--t-mid)';e.currentTarget.style.background='transparent'}}>
              {l.icon}{l.label}
            </Link>
          ))}
        </nav>

        
        <div className="d-none d-lg-flex" style={{ display:'flex', alignItems:'center', gap:10, marginLeft:'auto' }}>
          
          <form onSubmit={e=>{e.preventDefault();navigate(`/home?search=${q}`);setMob(false)}}
            style={{ display:'flex', alignItems:'center', gap:7, background:'var(--bg-3)', border:'1px solid var(--b-1)', borderRadius:'var(--r-md)', padding:'7px 12px', transition:'border-color 0.18s' }}
            onFocus={e=>e.currentTarget.style.borderColor='var(--b-focus)'}
            onBlur={e=>e.currentTarget.style.borderColor='var(--b-1)'}>
            <Search size={13} color="var(--t-lo)"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search courses…"
              style={{ background:'none', border:'none', outline:'none', color:'var(--t-hi)', fontFamily:'var(--font-body)', fontSize:13, width:148 }}/>
          </form>

          {loggedIn ? (
            <div ref={dropRef} style={{ position:'relative' }}>
              <button onClick={()=>setDrop(!drop)} style={{ display:'flex', alignItems:'center', gap:8, background:'var(--bg-3)', border:'1px solid var(--b-1)', borderRadius:'var(--r-md)', padding:'6px 12px', color:'var(--t-hi)', fontFamily:'var(--font-body)', fontWeight:500, fontSize:13, cursor:'pointer', transition:'border-color 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.borderColor='var(--b-2)'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='var(--b-1)'}>
                <div style={{ width:24, height:24, borderRadius:6, background:'var(--accent-soft)', border:'1px solid var(--accent-border)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-mono)', fontWeight:600, fontSize:11, color:'var(--accent)' }}>{init}</div>
                <span>{name}</span>
                <ChevronDown size={12} color="var(--t-lo)" style={{ transition:'transform 0.2s', transform: drop ? 'rotate(180deg)':'rotate(0)' }}/>
              </button>

              {drop && (
                <div style={{ position:'absolute', right:0, top:44, background:'var(--bg-2)', border:'1px solid var(--b-2)', borderRadius:'var(--r-lg)', boxShadow:'0 24px 64px rgba(0,0,0,0.6)', minWidth:215, zIndex:300, overflow:'hidden', animation:'fadeUp 0.15s var(--ease)' }}>
                  <div style={{ padding:'13px 15px', borderBottom:'1px solid var(--b-1)', background:'var(--bg-3)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                      <div style={{ width:34, height:34, borderRadius:8, background:'var(--accent-soft)', border:'1px solid var(--accent-border)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-mono)', fontWeight:700, fontSize:14, color:'var(--accent)', flexShrink:0 }}>{init}</div>
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontWeight:600, fontSize:13, color:'var(--t-hi)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{name}</div>
                        <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--t-lo)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:1 }}>{email}</div>
                        {role==='admin' && <span style={{ display:'inline-flex', alignItems:'center', gap:3, fontSize:10, color:'var(--orange)', fontWeight:600, marginTop:3 }}><FaUserShield size={9}/> Admin</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ padding:5 }}>
                    {role==='admin' && (
                      <button onClick={()=>{navigate('/Admin');setDrop(false)}} style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'8px 10px', background:'transparent', border:'none', borderRadius:'var(--r-sm)', color:'var(--t-mid)', fontFamily:'var(--font-body)', fontSize:13, fontWeight:500, cursor:'pointer', transition:'all 0.12s', textAlign:'left' }}
                        onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.04)';e.currentTarget.style.color='var(--t-hi)'}}
                        onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='var(--t-mid)'}}>
                        <Settings size={13}/> Admin Dashboard
                      </button>
                    )}
                    <button onClick={logout} style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'8px 10px', background:'transparent', border:'none', borderRadius:'var(--r-sm)', color:'var(--red)', fontFamily:'var(--font-body)', fontSize:13, fontWeight:500, cursor:'pointer', transition:'background 0.12s', textAlign:'left' }}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(248,113,113,0.07)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <LogOut size={13}/> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display:'flex', gap:8 }}>
              <Link to="/Login" style={{ ...linkBase, padding:'7px 15px', border:'1px solid var(--b-1)', borderRadius:'var(--r-md)', color:'var(--t-mid)', display:'flex', alignItems:'center', gap:6, transition:'all 0.15s' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--b-2)';e.currentTarget.style.color='var(--t-hi)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--b-1)';e.currentTarget.style.color='var(--t-mid)'}}>
                <LogIn size={13}/> Sign in
              </Link>
              <Link to="/Signup" style={{ display:'flex', alignItems:'center', padding:'7px 16px', background:'var(--accent)', borderRadius:'var(--r-md)', color:'#050510', fontFamily:'var(--font-body)', fontWeight:600, fontSize:13, boxShadow:'0 0 16px rgba(6,255,210,0.22)', transition:'all 0.18s' }}
                onMouseEnter={e=>{e.currentTarget.style.background='#1affda';e.currentTarget.style.boxShadow='var(--accent-glow-lg)'}}
                onMouseLeave={e=>{e.currentTarget.style.background='var(--accent)';e.currentTarget.style.boxShadow='0 0 16px rgba(6,255,210,0.22)'}}>
                Get started
              </Link>
            </div>
          )}
        </div>

        
        <button className="d-lg-none" onClick={()=>setMob(!mob)}
          style={{ marginLeft:'auto', background:'var(--bg-3)', border:'1px solid var(--b-1)', borderRadius:'var(--r-sm)', padding:'7px', cursor:'pointer', color:'var(--t-mid)' }}>
          {mob ? <X size={17}/> : <Menu size={17}/>}
        </button>
      </div>

      
      {mob && (
        <div className="d-lg-none" style={{ borderTop:'1px solid var(--b-1)', background:'var(--bg-1)', padding:'12px 16px', display:'flex', flexDirection:'column', gap:3 }}>
          <form onSubmit={e=>{e.preventDefault();navigate(`/home?search=${q}`);setMob(false)}}
            style={{ display:'flex', alignItems:'center', gap:7, background:'var(--bg-3)', border:'1px solid var(--b-1)', borderRadius:'var(--r-md)', padding:'8px 12px', marginBottom:8 }}>
            <Search size={13} color="var(--t-lo)"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…"
              style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--t-hi)', fontFamily:'var(--font-body)', fontSize:13 }}/>
          </form>
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={()=>setMob(false)} style={{ ...linkBase, padding:'10px 11px' }}
              onMouseEnter={e=>{e.currentTarget.style.color='var(--t-hi)';e.currentTarget.style.background='rgba(255,255,255,0.05)'}}
              onMouseLeave={e=>{e.currentTarget.style.color='var(--t-mid)';e.currentTarget.style.background='transparent'}}>
              {l.icon}{l.label}
            </Link>
          ))}
          {!loggedIn && (
            <Link to="/Login" onClick={()=>setMob(false)} style={{ ...linkBase, padding:'10px 11px' }}
              onMouseEnter={e=>{e.currentTarget.style.color='var(--t-hi)';e.currentTarget.style.background='rgba(255,255,255,0.05)'}}
              onMouseLeave={e=>{e.currentTarget.style.color='var(--t-mid)';e.currentTarget.style.background='transparent'}}>
              <LogIn size={14}/> Sign in
            </Link>
          )}
          {loggedIn && (
            <div style={{ borderTop:'1px solid var(--b-1)', marginTop:8, paddingTop:10, display:'flex', flexDirection:'column', gap:3 }}>
              <div style={{ display:'flex', alignItems:'center', gap:9, padding:'6px 10px', marginBottom:3 }}>
                <div style={{ width:30, height:30, borderRadius:7, background:'var(--accent-soft)', border:'1px solid var(--accent-border)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-mono)', fontWeight:700, fontSize:13, color:'var(--accent)', flexShrink:0 }}>{init}</div>
                <div>
                  <div style={{ fontWeight:600, fontSize:13, color:'var(--t-hi)' }}>{name}</div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--t-lo)' }}>{email}</div>
                </div>
              </div>
              <button onClick={logout} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 11px', background:'transparent', border:'none', borderRadius:'var(--r-sm)', color:'var(--red)', fontFamily:'var(--font-body)', fontSize:13, fontWeight:500, cursor:'pointer', textAlign:'left' }}>
                <LogOut size={13}/> Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}