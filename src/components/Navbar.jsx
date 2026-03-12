import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Home, BookOpen, LayoutDashboard, LogIn, Search,
  ChevronUp, ChevronDown, LogOut, Settings, Menu, X, Zap
} from 'lucide-react'
import { FaUserShield } from 'react-icons/fa'

function Navbar() {
  const [query, setQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || sessionStorage.getItem('isLoggedIn') === 'true'
  const userRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole') || ''
  const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail') || ''
  const userName = localStorage.getItem('userName') || sessionStorage.getItem('userName') || userEmail

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/home?search=${query}`)
    setMobileOpen(false)
  }

  const handleLogout = () => {
    ['isLoggedIn','userEmail','userName','userRole','userId','token'].forEach(key => {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    })
    setDropdownOpen(false)
    setMobileOpen(false)
    navigate('/Login')
  }

  const avatarInitial = userName.charAt(0).toUpperCase()

  const navLink = (to, icon, label) => (
    <Link key={to} to={to}
      style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '7px 14px', borderRadius: '6px', textDecoration: 'none',
        color: 'var(--text-secondary)', fontFamily: 'var(--font-display)',
        fontWeight: '600', fontSize: '12px', letterSpacing: '1px',
        textTransform: 'uppercase', transition: 'var(--transition)',
        border: '1px solid transparent'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = 'var(--neon-cyan)'
        e.currentTarget.style.borderColor = 'rgba(0,245,255,0.2)'
        e.currentTarget.style.background = 'rgba(0,245,255,0.05)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = 'var(--text-secondary)'
        e.currentTarget.style.borderColor = 'transparent'
        e.currentTarget.style.background = 'transparent'
      }}>
      {icon} {label}
    </Link>
  )

  return (
    <nav style={{
      background: 'rgba(5,5,16,0.92)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-neon)',
      position: 'sticky', top: 0, zIndex: 999,
      boxShadow: '0 4px 30px rgba(0,0,0,0.5), 0 1px 0 rgba(0,245,255,0.08)'
    }}>
      <div className="container-fluid" style={{ padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'var(--gradient-neon)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 12px rgba(0,245,255,0.4)', flexShrink: 0
            }}>
              <Zap size={16} color="#000" fill="#000" />
            </div>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: '900',
              fontSize: '17px', letterSpacing: '3px', textTransform: 'uppercase',
              background: 'var(--gradient-neon)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>TechPath</span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }} className="d-none d-lg-flex">
            {navLink('/home', <Home size={13}/>, 'Home')}
            {isLoggedIn && userRole !== 'admin' && navLink('/Mycourses', <BookOpen size={13}/>, 'My Courses')}
            {isLoggedIn && userRole === 'admin' && navLink('/Admin', <LayoutDashboard size={13}/>, 'Dashboard')}
            {!isLoggedIn && navLink('/Login', <LogIn size={13}/>, 'Login')}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }} className="d-none d-lg-flex">
            {/* Search */}
            <form onSubmit={handleSearch} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.03)', borderRadius: '6px',
              padding: '7px 12px', border: '1px solid var(--border-neon)',
              transition: 'var(--transition)'
            }}>
              <Search size={12} color="var(--text-muted)" />
              <input type="text" placeholder="Search courses..."
                value={query} onChange={e => setQuery(e.target.value)}
                style={{
                  background: 'none', border: 'none', outline: 'none',
                  color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
                  fontSize: '13px', width: '140px'
                }} />
            </form>

            {/* User or Login */}
            {isLoggedIn ? (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(0,245,255,0.05)', border: '1px solid var(--border-neon)',
                  borderRadius: '6px', padding: '6px 12px',
                  color: 'var(--text-primary)', fontFamily: 'var(--font-display)',
                  fontWeight: '600', fontSize: '12px', cursor: 'pointer',
                  transition: 'var(--transition)', letterSpacing: '0.5px'
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--neon-cyan)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(0,245,255,0.2)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-neon)'; e.currentTarget.style.boxShadow = 'none' }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '5px',
                    background: 'var(--gradient-neon)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '800', fontSize: '11px', color: '#000'
                  }}>{avatarInitial}</div>
                  {userName}
                  {dropdownOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                </button>

                {dropdownOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: '46px',
                    background: 'var(--bg-card)', border: '1px solid var(--border-neon)',
                    borderRadius: 'var(--radius-md)', boxShadow: '0 20px 60px rgba(0,0,0,0.9), 0 0 20px rgba(0,245,255,0.1)',
                    minWidth: '220px', zIndex: 1000, overflow: 'hidden',
                    animation: 'slideUp 0.2s ease'
                  }}>
                    <div style={{
                      padding: '16px 18px', borderBottom: '1px solid var(--border-neon)',
                      background: 'linear-gradient(135deg, rgba(0,245,255,0.04), rgba(191,0,255,0.04))'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '9px',
                          background: 'var(--gradient-neon)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: '900', fontSize: '16px', color: '#000', flexShrink: 0
                        }}>{avatarInitial}</div>
                        <div>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--text-primary)', fontSize: '13px' }}>{userName}</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>{userEmail}</div>
                          {userRole === 'admin' && (
                            <span style={{ fontSize: '9px', color: 'var(--neon-orange)', fontFamily: 'var(--font-display)', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
                              <FaUserShield size={8} /> Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '6px' }}>
                      {userRole === 'admin' && (
                        <button onClick={() => { navigate('/Admin'); setDropdownOpen(false) }}
                          style={{ width: '100%', padding: '8px 12px', background: 'transparent', border: 'none', borderRadius: '6px', textAlign: 'left', color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', fontWeight: '600', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.5px', transition: 'var(--transition)' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,245,255,0.06)'; e.currentTarget.style.color = 'var(--neon-cyan)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
                          <Settings size={13} /> Admin Dashboard
                        </button>
                      )}
                      <button onClick={handleLogout}
                        style={{ width: '100%', padding: '8px 12px', background: 'transparent', border: 'none', borderRadius: '6px', textAlign: 'left', color: 'var(--neon-pink)', fontFamily: 'var(--font-display)', fontWeight: '600', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.5px', transition: 'var(--transition)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,0,110,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <LogOut size={13} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/Login" style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'rgba(0,245,255,0.08)',
                border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)',
                padding: '7px 16px', borderRadius: '6px', textDecoration: 'none',
                fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '11px',
                letterSpacing: '1.5px', textTransform: 'uppercase', transition: 'var(--transition)'
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 15px rgba(0,245,255,0.3)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <LogIn size={12} /> Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="d-lg-none"
            style={{ background: 'rgba(0,245,255,0.06)', border: '1px solid var(--border-neon)', borderRadius: '6px', padding: '8px', cursor: 'pointer', color: 'var(--neon-cyan)' }}>
            {mobileOpen ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="d-lg-none" style={{ borderTop: '1px solid var(--border-neon)', padding: '14px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-neon)', borderRadius: '6px', padding: '7px 12px', marginBottom: '8px' }}>
              <Search size={12} color="var(--text-muted)" />
              <input type="text" placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '13px' }} />
              <button type="submit" style={{ background: 'var(--gradient-neon)', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '10px', fontWeight: '700', color: '#000', cursor: 'pointer', fontFamily: 'var(--font-display)' }}>GO</button>
            </form>
            {[
              { to: '/home', icon: <Home size={14}/>, label: 'Home', show: true },
              { to: '/Mycourses', icon: <BookOpen size={14}/>, label: 'My Courses', show: isLoggedIn && userRole !== 'admin' },
              { to: '/Admin', icon: <LayoutDashboard size={14}/>, label: 'Dashboard', show: isLoggedIn && userRole === 'admin' },
              { to: '/Login', icon: <LogIn size={14}/>, label: 'Login', show: !isLoggedIn },
            ].filter(l => l.show).map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '6px', textDecoration: 'none', color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', fontWeight: '600', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {l.icon} {l.label}
              </Link>
            ))}
            {isLoggedIn && (
              <div style={{ borderTop: '1px solid var(--border-neon)', marginTop: '8px', paddingTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px', marginBottom: '4px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '7px', background: 'var(--gradient-neon)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: '800', fontSize: '13px' }}>{avatarInitial}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--text-primary)', fontSize: '13px' }}>{userName}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{userEmail}</div>
                  </div>
                </div>
                <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', background: 'transparent', border: 'none', borderRadius: '6px', color: 'var(--neon-pink)', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '12px', cursor: 'pointer', letterSpacing: '0.5px' }}>
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
