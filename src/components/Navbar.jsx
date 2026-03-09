import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../lms logo.JPG'

function Navbar() {
  const [query, setQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || sessionStorage.getItem('isLoggedIn') === 'true'
  const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail') || ''
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const currentUser = users.find(u => u.email === userEmail)
  const userName = currentUser ? currentUser.name : userEmail
  const dropdownRef = useRef(null)

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
    if (newMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/home?search=${query}`)
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    sessionStorage.removeItem('isLoggedIn')
    sessionStorage.removeItem('userEmail')
    setDropdownOpen(false)
    navigate('/Login')
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="TechPath Logo" height="50" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" to="/home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Mycourses">Mycourses</Link>
            </li>
            {!isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link" to="/Login">Login</Link>
              </li>
            )}
          </ul>

          <form className="d-flex me-3" role="search" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>

          <div
            onClick={toggleDarkMode}
            style={{
              width: '56px', height: '28px', borderRadius: '50px', cursor: 'pointer',
              backgroundColor: darkMode ? '#F3E3D0' : '#1a1a2e',
              position: 'relative', transition: 'background-color 0.3s ease',
              flexShrink: 0, marginRight: '16px'
            }}
          >
            <div style={{
              position: 'absolute', top: '3px',
              left: darkMode ? '31px' : '3px',
              width: '22px', height: '22px', borderRadius: '50%',
              backgroundColor: darkMode ? '#1a1a2e' : '#F3E3D0',
              transition: 'left 0.3s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px'
            }}>
              {darkMode ? '☀️' : '🌙'}
            </div>
          </div>

          {isLoggedIn && (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  cursor: 'pointer', padding: '6px 14px',
                  backgroundColor: '#1a1a2e', borderRadius: '50px',
                  color: '#F3E3D0', fontWeight: '600', fontSize: '14px',
                  userSelect: 'none'
                }}
              >
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  backgroundColor: '#81A6C6', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontWeight: '800', fontSize: '13px', color: '#1a1a2e'
                }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                {userName}
                <span style={{ fontSize: '10px', marginLeft: '2px' }}>
                  {dropdownOpen ? '▲' : '▼'}
                </span>
              </div>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '44px',
                  backgroundColor: '#F3E3D0', borderRadius: '12px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  minWidth: '220px', zIndex: 1000, overflow: 'hidden'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #D2C4B4',
                    backgroundColor: '#1a1a2e'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '50%',
                        backgroundColor: '#81A6C6', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontWeight: '800', fontSize: '18px', color: '#1a1a2e',
                        flexShrink: 0
                      }}>
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', color: '#F3E3D0', fontSize: '15px' }}>
                          {userName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#81A6C6', marginTop: '2px' }}>
                          {userEmail}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '8px' }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%', padding: '10px 14px',
                        backgroundColor: 'transparent', border: 'none',
                        borderRadius: '8px', textAlign: 'left',
                        color: '#c0392b', fontWeight: '700',
                        fontSize: '14px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8d7da'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </nav>
  )
}

export default Navbar