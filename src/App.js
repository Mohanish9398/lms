import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'

import Home from './pages/Home'
import Coursedetails from './pages/Coursedetails'
import Mycourses from './pages/Mycourses'
import Signup from './pages/Signup'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import Player from './pages/Player'
import Landing from './pages/Landing'
import Admin from './pages/Admin'

function App() {

  useEffect(() => {

    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.course-card')

      cards.forEach(card => {
        const rect = card.getBoundingClientRect()

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        card.style.setProperty('--x', `${x}px`)
        card.style.setProperty('--y', `${y}px`)
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }

  }, [])

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Coursedetails/:id" element={<Coursedetails />} />
        <Route path="/Mycourses" element={<Mycourses />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/Player/:id" element={<Player />} />
        <Route path="/Admin" element={<Admin />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App