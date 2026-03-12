import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../lms logo.JPG'
import {
  Home, BookOpen, LayoutDashboard, LogIn, Search,
  Sun, Moon, ChevronUp, ChevronDown, LogOut, Settings, Menu, X
} from 'lucide-react'
import { FaUserShield } from 'react-icons/fa'

function Navbar() {
  const [query, setQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || sessionStorage.getItem('isLoggedIn') === 'true'
  const userRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole') || ''
  const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail') || ''
  const userName = localStorage.getItem('userName') || sessionStorage.getItem('userName') || userEmail

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedMode)
    if (savedMode) document.body.classList.add('dark-mode')
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', newMode)
    if (newMode) document.body.classList.add('dark-mode')
    else document.body.classList.remove('dark-mode')
  }

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

  return (
    <nav style={{ backgroundColor: '#F3E3D0', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 999 }}>
      <div className="container-fluid" style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <img src={logo} alt="TechPath Logo" height="46" />
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, justifyContent: 'center' }} className="d-none d-lg-flex">
            <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', color: '#1a1a2e', fontWeight: '600', fontSize: '14px' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#D2C4B4'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              <Home size={16} /> Home
            </Link>
            {isLoggedIn && userRole !== 'admin' && (
              <Link to="/Mycourses" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', color: '#1a1a2e', fontWeight: '600', fontSize: '14px' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#D2C4B4'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <BookOpen size={16} /> My Courses
              </Link>
            )}
            {isLoggedIn && userRole === 'admin' && (
              <Link to="/Admin" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', color: '#1a1a2e', fontWeight: '600', fontSize: '14px' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#D2C4B4'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <LayoutDashboard size={16} /> Admin Dashboard
              </Link>
            )}
            {!isLoggedIn && (
              <Link to="/Login" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', color: '#1a1a2e', fontWeight: '600', fontSize: '14px' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#D2C4B4'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <LogIn size={16} /> Login
              </Link>
            )}
          </div>

          {/* Desktop Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }} className="d-none d-lg-flex">

            {/* Search */}
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', borderRadius: '8px', padding: '6px 12px', border: '1px solid #D2C4B4' }}>
              <Search size={14} color="#888" />
              <input
                type="text"
                placeholder="Search courses..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '13px', width: '160px', backgroundColor: 'transparent' }}
              />
            </form>

            {/* Dark Mode Toggle */}
            <div onClick={toggleDarkMode} style={{ width: '56px', height: '28px', borderRadius: '50px', cursor: 'pointer', backgroundColor: darkMode ? '#1a1a2e' : '#D2C4B4', position: 'relative', transition: 'background-color 0.3s ease', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: '3px', left: darkMode ? '31px' : '3px', width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#F3E3D0', transition: 'left 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {darkMode ? <Sun size={12} color="#1a1a2e" /> : <Moon size={12} color="#1a1a2e" />}
              </div>
            </div>

            {/* User Dropdown */}
            {isLoggedIn && (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <div onClick={() => setDropdownOpen(!dropdownOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '6px 14px', backgroundColor: '#1a1a2e', borderRadius: '50px', color: '#F3E3D0', fontWeight: '600', fontSize: '14px', userSelect: 'none' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#81A6C6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px', color: '#1a1a2e' }}>
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  {userName}
                  {dropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>

                {dropdownOpen && (
                  <div style={{ position: 'absolute', right: 0, top: '44px', backgroundColor: '#F3E3D0', borderRadius: '12px', boxShadow: '0 8px 25px rgba(0,0,0,0.15)', minWidth: '220px', zIndex: 1000, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #D2C4B4', backgroundColor: '#1a1a2e' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#81A6C6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px', color: '#1a1a2e', flexShrink: 0 }}>
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: '#F3E3D0', fontSize: '15px' }}>{userName}</div>
                          <div style={{ fontSize: '12px', color: '#81A6C6', marginTop: '2px' }}>{userEmail}</div>
                          {userRole === 'admin' && (
                            <div style={{ fontSize: '11px', color: '#f5a623', marginTop: '2px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <FaUserShield size={11} /> Admin
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '8px' }}>
                      {userRole === 'admin' && (
                        <button onClick={() => { navigate('/Admin'); setDropdownOpen(false) }}
                          style={{ width: '100%', padding: '10px 14px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', textAlign: 'left', color: '#1a1a2e', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#D2C4B4'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <Settings size={15} /> Admin Dashboard
                        </button>
                      )}
                      <button onClick={handleLogout}
                        style={{ width: '100%', padding: '10px 14px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', textAlign: 'left', color: '#c0392b', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8d7da'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="d-lg-none" style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', color: '#1a1a2e' }}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="d-lg-none" style={{ borderTop: '1px solid #D2C4B4', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', borderRadius: '8px', padding: '8px 12px', border: '1px solid #D2C4B4', marginBottom: '8px' }}>
              <Search size={14} color="#888" />
              <input
                type="text"
                placeholder="Search courses..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '13px', flex: 1, backgroundColor: 'transparent' }}
              />
              <button type="submit" style={{ backgroundColor: '#1a1a2e', color: '#F3E3D0', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Go</button>
            </form>

            <Link to="/home" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', textDecoration: 'none', color: '#1a1a2e', fontWeight: '600', fontSize: '14px' }}>
              <Home size={16} /> Home
            </Link>
            {isLoggedIn && userRole !== 'admin' && (
              <Link to="/Mycourses" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', textDecoration: 'none', color: '#1a1a2e', fontWeight: '600', fontSize: '14px' }}>
                <BookOpen size={16} /> My Courses
              </Link>
            )}
            {isLoggedIn && userRole === 'admin' && (
              <Link to="/Admin" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', textDecoration: 'none', color: '#1a1a2e', fontWeight: '600', fontSize: '14px' }}>
                <LayoutDashboard size={16} /> Admin Dashboard
              </Link>
            )}
            {!isLoggedIn && (
              <Link to="/Login" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', textDecoration: 'none', color: '#1a1a2e', fontWeight: '600', fontSize: '14px' }}>
                <LogIn size={16} /> Login
              </Link>
            )}

            {/* Dark Mode in Mobile */}
            <div onClick={toggleDarkMode} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', color: '#1a1a2e', fontWeight: '600', fontSize: '14px' }}>
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </div>

            {/* Mobile User Info */}
            {isLoggedIn && (
              <div style={{ borderTop: '1px solid #D2C4B4', marginTop: '8px', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', marginBottom: '4px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F3E3D0', fontWeight: '800', fontSize: '14px', flexShrink: 0 }}>
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '14px' }}>{userName}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{userEmail}</div>
                  </div>
                </div>
                <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', color: '#c0392b', fontWeight: '700', fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                  <LogOut size={16} /> Logout
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