import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, Users, Search, Plus, X, Pencil,
  Trash2, ChevronUp, ChevronDown, Video, KeyRound, Ban, CheckCircle,
  Eye, UserX, ArrowLeft, GraduationCap, Clock, Zap
} from 'lucide-react'

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

function Admin() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('courses')
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [courseSearch, setCourseSearch] = useState('')
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [userSearch, setUserSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [courseStudents, setCourseStudents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [message, setMessage] = useState({ text: '', type: 'success' })
  const [editingUser, setEditingUser] = useState(null)
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'user' })
  const [resetPassword, setResetPassword] = useState({ userId: null, value: '' })
  const [form, setForm] = useState({ title: '', instructor: '', duration: '', image: '', description: '', level: 'Beginner', price: 'Free', topics: '', video: '', lessons: [] })

  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const userRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole')

  useEffect(() => {
    if (!token || userRole !== 'admin') { navigate('/Login'); return }
    loadCourses(); loadUsers()
  }, [])

  useEffect(() => {
    setFilteredCourses(courses.filter(c =>
      c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.instructor.toLowerCase().includes(courseSearch.toLowerCase())
    ))
  }, [courseSearch, courses])

  useEffect(() => {
    setFilteredUsers(users.filter(u =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
    ))
  }, [userSearch, users])

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: 'success' }), 3000)
  }

  const loadCourses = () => {
    fetch(`${BASE_URL}/api/courses`).then(r => r.json()).then(d => { setCourses(d); setFilteredCourses(d) })
  }
  const loadUsers = () => {
    fetch(`${BASE_URL}/api/auth/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (Array.isArray(d)) { setUsers(d); setFilteredUsers(d) } })
  }
  const loadCourseStudents = (id) => {
    fetch(`${BASE_URL}/api/courses/${id}/students`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setCourseStudents(d))
  }

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleAddLesson = () => setForm({ ...form, lessons: [...form.lessons, { title: '', video: '', duration: '' }] })
  const handleLessonChange = (i, field, val) => { const u = [...form.lessons]; u[i][field] = val; setForm({ ...form, lessons: u }) }
  const handleRemoveLesson = (i) => setForm({ ...form, lessons: form.lessons.filter((_, j) => j !== i) })
  const handleMoveLessonUp = (i) => { if (!i) return; const u = [...form.lessons]; [u[i-1],u[i]]=[u[i],u[i-1]]; setForm({ ...form, lessons: u }) }
  const handleMoveLessonDown = (i) => { if (i===form.lessons.length-1) return; const u=[...form.lessons]; [u[i],u[i+1]]=[u[i+1],u[i]]; setForm({ ...form, lessons: u }) }

  const handleSubmit = async () => {
    const courseData = { ...form, topics: form.topics.split('\n').filter(t => t.trim()), lessons: form.lessons.filter(l => l.title && l.video) }
    const url = editingCourse ? `${BASE_URL}/api/courses/${editingCourse._id}` : `${BASE_URL}/api/courses`
    const res = await fetch(url, { method: editingCourse ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(courseData) })
    const data = await res.json()
    if (data._id || data.title) { showMsg(editingCourse ? 'Course updated!' : 'Course added!'); resetForm(); loadCourses() }
    else showMsg('Something went wrong.', 'error')
  }
  const handleEdit = (c) => {
    setEditingCourse(c); setShowForm(true); window.scrollTo(0, 0)
    setForm({ title: c.title, instructor: c.instructor, duration: c.duration, image: c.image, description: c.description, level: c.level, price: c.price, topics: c.topics.join('\n'), video: c.video, lessons: c.lessons || [] })
  }
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? Enrolled users will be unenrolled.')) return
    await fetch(`${BASE_URL}/api/courses/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    showMsg('Course deleted.'); loadCourses()
  }
  const resetForm = () => { setShowForm(false); setEditingCourse(null); setForm({ title: '', instructor: '', duration: '', image: '', description: '', level: 'Beginner', price: 'Free', topics: '', video: '', lessons: [] }) }

  const handleEditUser = (u) => { setEditingUser(u._id); setUserForm({ name: u.name, email: u.email, role: u.role }) }
  const handleSaveUser = async (uid) => {
    const res = await fetch(`${BASE_URL}/api/auth/users/${uid}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(userForm) })
    const data = await res.json()
    if (data._id) { showMsg('User updated!'); setEditingUser(null); loadUsers(); if (selectedUser?._id === uid) setSelectedUser({ ...selectedUser, ...userForm }) }
  }
  const handleDeleteUser = async (uid) => {
    if (!window.confirm('Delete this user permanently?')) return
    await fetch(`${BASE_URL}/api/auth/users/${uid}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    showMsg('User deleted.'); setSelectedUser(null); loadUsers()
  }
  const handleBanUser = async (uid) => {
    const res = await fetch(`${BASE_URL}/api/auth/users/${uid}/ban`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json(); showMsg(data.message); loadUsers()
    if (selectedUser?._id === uid) setSelectedUser({ ...selectedUser, banned: data.banned })
  }
  const handleResetPassword = async (uid) => {
    if (!resetPassword.value) return showMsg('Enter a new password', 'error')
    const res = await fetch(`${BASE_URL}/api/auth/users/${uid}/reset-password`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ newPassword: resetPassword.value }) })
    const data = await res.json(); showMsg(data.message); setResetPassword({ userId: null, value: '' })
  }
  const handleUnenrollUser = async (uid, cid) => {
    if (!window.confirm('Unenroll this user?')) return
    await fetch(`${BASE_URL}/api/auth/users/${uid}/unenroll/${cid}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
    showMsg('User unenrolled.'); loadUsers()
    const updated = await fetch(`${BASE_URL}/api/auth/users/${uid}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
    setSelectedUser(updated)
  }

  /* ---- Styles ---- */
  const card = { background: 'var(--bg-card)', border: '1px solid var(--border-neon)', borderRadius: '12px', padding: '16px' }
  const btn = (color, textColor = '#fff') => ({
    display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px',
    background: color, color: textColor, border: 'none', borderRadius: '7px',
    fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '12px',
    letterSpacing: '0.5px', textTransform: 'uppercase', cursor: 'pointer', transition: 'var(--transition)'
  })
  const outlineBtn = (color) => ({
    display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px',
    background: `${color}10`, color, border: `1px solid ${color}40`,
    borderRadius: '7px', fontFamily: 'var(--font-display)', fontWeight: '700',
    fontSize: '12px', letterSpacing: '0.5px', textTransform: 'uppercase', cursor: 'pointer', transition: 'var(--transition)'
  })
  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-neon)', color: 'var(--text-primary)', borderRadius: '7px', padding: '8px 12px', fontSize: '13px', fontFamily: 'var(--font-body)', width: '100%', outline: 'none' }

  const LEVEL_COLORS = {
    Beginner: { color: 'var(--neon-green)', bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.25)' },
    Intermediate: { color: 'var(--neon-cyan)', bg: 'rgba(0,245,255,0.08)', border: 'rgba(0,245,255,0.25)' },
    Advanced: { color: 'var(--neon-pink)', bg: 'rgba(255,0,110,0.08)', border: 'rgba(255,0,110,0.25)' },
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container">

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--neon-orange)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>// Admin Panel</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: '900', fontSize: '32px', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LayoutDashboard size={26} color="var(--neon-cyan)"/>
            Admin <span style={{ background: 'var(--gradient-fire)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Dashboard</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontFamily: 'var(--font-body)', fontSize: '14px' }}>Manage courses and users</p>
        </div>

        {/* Toast */}
        {message.text && (
          <div style={{
            background: message.type === 'error' ? 'rgba(255,0,110,0.1)' : 'rgba(0,255,136,0.08)',
            border: `1px solid ${message.type === 'error' ? 'rgba(255,0,110,0.3)' : 'rgba(0,255,136,0.3)'}`,
            borderRadius: '8px', padding: '12px 18px', marginBottom: '20px',
            color: message.type === 'error' ? 'var(--neon-pink)' : 'var(--neon-green)',
            fontFamily: 'var(--font-display)', fontWeight: '600', fontSize: '13px',
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: message.type === 'error' ? '0 0 15px rgba(255,0,110,0.1)' : '0 0 15px rgba(0,255,136,0.1)'
          }}>
            {message.type === 'error' ? <X size={14}/> : <CheckCircle size={14}/>}
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'inline-flex', gap: '4px', background: 'var(--bg-card)', border: '1px solid var(--border-neon)', borderRadius: '10px', padding: '5px', marginBottom: '24px' }}>
          {[['courses', <BookOpen size={14}/>, `Courses (${courses.length})`], ['users', <Users size={14}/>, `Users (${users.length})`]].map(([tab, icon, label]) => {
            const active = activeTab === tab
            return (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '8px 20px',
                background: active ? 'var(--gradient-neon)' : 'transparent',
                border: 'none', borderRadius: '7px',
                color: active ? '#000' : 'var(--text-muted)',
                fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '12px',
                letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '7px',
                boxShadow: active ? '0 0 15px rgba(0,245,255,0.25)' : 'none', transition: 'var(--transition)'
              }}>
                {icon} {label}
              </button>
            )
          })}
        </div>

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div>
            {selectedCourse ? (
              <div>
                <button onClick={() => setSelectedCourse(null)} style={{ ...outlineBtn('var(--neon-cyan)'), marginBottom: '20px' }}>
                  <ArrowLeft size={13}/> Back to Courses
                </button>
                <div style={{ ...card, padding: '28px' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ width: '54px', height: '54px', background: 'rgba(0,245,255,0.06)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', flexShrink: 0 }}>
                      <img src={selectedCourse.image} alt={selectedCourse.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>{selectedCourse.title}</h4>
                      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '12px', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <GraduationCap size={11}/> {selectedCourse.instructor} · <Clock size={11}/> {selectedCourse.duration}
                      </p>
                    </div>
                  </div>
                  <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--neon-cyan)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <Users size={15}/> Enrolled Students ({courseStudents.length})
                  </h5>
                  {courseStudents.length === 0 ? <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>No students enrolled yet.</p> : (
                    <div className="row g-3">
                      {courseStudents.map(s => (
                        <div className="col-md-4" key={s._id}>
                          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '9px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--gradient-neon)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px', color: '#000', flexShrink: 0 }}>{s.name.charAt(0).toUpperCase()}</div>
                            <div>
                              <p style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--text-primary)', margin: 0, fontSize: '13px' }}>{s.name}</p>
                              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '11px', fontFamily: 'var(--font-mono)' }}>{s.email}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-neon)', borderRadius: '7px', padding: '8px 14px', maxWidth: '300px', flex: 1 }}>
                    <Search size={13} color="var(--text-muted)"/>
                    <input placeholder="Search courses..." value={courseSearch} onChange={e => setCourseSearch(e.target.value)} style={{ ...inputStyle, border: 'none', padding: 0, background: 'none', width: '100%' }} />
                  </div>
                  <button onClick={() => showForm ? resetForm() : setShowForm(true)} style={showForm ? outlineBtn('var(--text-muted)') : { ...btn('var(--gradient-neon)', '#000') }}>
                    {showForm ? <><X size={13}/> Cancel</> : <><Plus size={13}/> Add Course</>}
                  </button>
                </div>

                {showForm && (
                  <div style={{ ...card, padding: '28px', marginBottom: '24px', boxShadow: '0 0 30px rgba(0,245,255,0.06)' }}>
                    <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                      {editingCourse ? <><Pencil size={15} color="var(--neon-cyan)"/> Edit Course</> : <><Plus size={15} color="var(--neon-cyan)"/> New Course</>}
                    </h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Title</label>
                        <input name="title" className="form-control" value={form.title} onChange={handleFormChange} placeholder="Course title" />
                      </div>
                      <div className="col-md-6">
                        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Instructor</label>
                        <input name="instructor" className="form-control" value={form.instructor} onChange={handleFormChange} placeholder="Instructor name" />
                      </div>
                      <div className="col-md-4">
                        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Duration</label>
                        <input name="duration" className="form-control" value={form.duration} onChange={handleFormChange} placeholder="e.g. 5 hours" />
                      </div>
                      <div className="col-md-4">
                        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Level</label>
                        <select name="level" className="form-control" value={form.level} onChange={handleFormChange}>
                          <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Price</label>
                        <input name="price" className="form-control" value={form.price} onChange={handleFormChange} placeholder="Free or Rs.499" />
                      </div>
                      <div className="col-md-6">
                        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Image URL</label>
                        <input name="image" className="form-control" value={form.image} onChange={handleFormChange} placeholder="https://..." />
                      </div>
                      <div className="col-md-6">
                        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Main Video URL</label>
                        <input name="video" className="form-control" value={form.video} onChange={handleFormChange} placeholder="https://www.youtube.com/embed/..." />
                      </div>
                      <div className="col-12">
                        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Description</label>
                        <textarea name="description" className="form-control" rows="2" value={form.description} onChange={handleFormChange} />
                      </div>
                      <div className="col-12">
                        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Topics (one per line)</label>
                        <textarea name="topics" className="form-control" rows="3" value={form.topics} onChange={handleFormChange} placeholder="Topic 1&#10;Topic 2" />
                      </div>
                      <div className="col-12">
                        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--neon-cyan)', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                          <Video size={13}/> Lessons
                        </label>
                        <div style={{ border: '1px solid var(--border-neon)', borderRadius: '9px', padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
                          {form.lessons.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>No lessons added yet.</p>}
                          {form.lessons.map((lesson, idx) => (
                            <div key={idx} style={{ background: 'rgba(0,245,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--neon-cyan)', letterSpacing: '1px', textTransform: 'uppercase' }}>Lesson {idx + 1}</span>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                  {[
                                    [<ChevronUp size={11}/>, () => handleMoveLessonUp(idx), idx === 0],
                                    [<ChevronDown size={11}/>, () => handleMoveLessonDown(idx), idx === form.lessons.length-1],
                                    [<X size={11}/>, () => handleRemoveLesson(idx), false, true],
                                  ].map(([icon, fn, disabled, isDanger], i) => (
                                    <button key={i} onClick={fn} disabled={disabled} style={{ background: isDanger ? 'rgba(255,0,110,0.15)' : 'rgba(0,245,255,0.1)', color: isDanger ? 'var(--neon-pink)' : 'var(--neon-cyan)', border: 'none', borderRadius: '5px', padding: '4px 7px', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.3 : 1 }}>{icon}</button>
                                  ))}
                                </div>
                              </div>
                              <div className="row g-2">
                                <div className="col-md-5"><input className="form-control" placeholder="Lesson title" value={lesson.title} onChange={e => handleLessonChange(idx, 'title', e.target.value)} /></div>
                                <div className="col-md-5"><input className="form-control" placeholder="YouTube embed URL" value={lesson.video} onChange={e => handleLessonChange(idx, 'video', e.target.value)} /></div>
                                <div className="col-md-2"><input className="form-control" placeholder="Duration" value={lesson.duration} onChange={e => handleLessonChange(idx, 'duration', e.target.value)} /></div>
                              </div>
                            </div>
                          ))}
                          <button onClick={handleAddLesson} style={outlineBtn('var(--neon-cyan)')}>
                            <Plus size={12}/> Add Lesson
                          </button>
                        </div>
                      </div>
                    </div>
                    <button onClick={handleSubmit} style={{ ...btn('var(--gradient-neon)', '#000'), marginTop: '20px', padding: '11px 28px' }}>
                      {editingCourse ? <><Pencil size={14}/> Update Course</> : <><Plus size={14}/> Add Course</>}
                    </button>
                  </div>
                )}

                <div className="row g-3">
                  {filteredCourses.map(course => {
                    const lvl = LEVEL_COLORS[course.level] || LEVEL_COLORS.Beginner
                    return (
                      <div className="col-md-4" key={course._id}>
                        <div style={{ ...card, height: '100%' }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div style={{ width: '46px', height: '46px', background: 'rgba(0,245,255,0.05)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', flexShrink: 0 }}>
                              <img src={course.image} alt={course.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <h6 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px', fontSize: '13px' }}>{course.title}</h6>
                              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <GraduationCap size={10}/> {course.instructor}
                              </p>
                              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 4px', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Video size={10}/> {course.lessons?.length || 0} lessons · <Clock size={10}/> {course.duration}
                              </p>
                              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '4px', background: lvl.bg, color: lvl.color, border: `1px solid ${lvl.border}` }}>{course.level}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => handleEdit(course)} style={{ flex: 1, padding: '6px', background: 'rgba(0,245,255,0.1)', color: 'var(--neon-cyan)', border: '1px solid rgba(0,245,255,0.2)', borderRadius: '6px', fontFamily: 'var(--font-display)', fontWeight: '700', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              <Pencil size={11}/> Edit
                            </button>
                            <button onClick={() => { setSelectedCourse(course); loadCourseStudents(course._id) }} style={{ flex: 1, padding: '6px', background: 'rgba(191,0,255,0.1)', color: 'var(--neon-purple)', border: '1px solid rgba(191,0,255,0.2)', borderRadius: '6px', fontFamily: 'var(--font-display)', fontWeight: '700', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              <Users size={11}/> Students
                            </button>
                            <button onClick={() => handleDelete(course._id)} style={{ flex: 1, padding: '6px', background: 'rgba(255,0,110,0.1)', color: 'var(--neon-pink)', border: '1px solid rgba(255,0,110,0.2)', borderRadius: '6px', fontFamily: 'var(--font-display)', fontWeight: '700', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              <Trash2 size={11}/> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div>
            {selectedUser ? (
              <div>
                <button onClick={() => { setSelectedUser(null); setEditingUser(null); setResetPassword({ userId: null, value: '' }) }} style={{ ...outlineBtn('var(--neon-cyan)'), marginBottom: '20px' }}>
                  <ArrowLeft size={13}/> Back to Users
                </button>
                <div style={{ ...card, padding: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '22px', flexWrap: 'wrap' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: selectedUser.banned ? 'rgba(255,0,110,0.2)' : 'var(--gradient-neon)', border: selectedUser.banned ? '1px solid rgba(255,0,110,0.3)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: selectedUser.banned ? 'var(--neon-pink)' : '#000', fontWeight: '900', flexShrink: 0 }}>
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      {editingUser === selectedUser._id ? (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <input value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} style={{ ...inputStyle, maxWidth: '160px' }} placeholder="Name" />
                          <input value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} style={{ ...inputStyle, maxWidth: '220px' }} placeholder="Email" />
                          <select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })} style={{ ...inputStyle, maxWidth: '110px' }}>
                            <option value="user">User</option><option value="admin">Admin</option>
                          </select>
                          <button onClick={() => handleSaveUser(selectedUser._id)} style={btn('var(--gradient-matrix)', '#000')}>Save</button>
                          <button onClick={() => setEditingUser(null)} style={outlineBtn('var(--text-muted)')}>Cancel</button>
                        </div>
                      ) : (
                        <>
                          <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
                            {selectedUser.name}
                            {selectedUser.banned && <span style={{ fontSize: '10px', color: 'var(--neon-pink)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,0,110,0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(255,0,110,0.3)' }}><Ban size={10}/> Banned</span>}
                          </h4>
                          <p style={{ color: 'var(--text-muted)', margin: '4px 0 2px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{selectedUser.email}</p>
                          <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: 0, fontFamily: 'var(--font-mono)' }}>Role: {selectedUser.role} · Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '22px' }}>
                    <button onClick={() => handleEditUser(selectedUser)} style={outlineBtn('var(--neon-cyan)')}><Pencil size={12}/> Edit</button>
                    <button onClick={() => handleBanUser(selectedUser._id)} style={outlineBtn(selectedUser.banned ? 'var(--neon-green)' : 'var(--neon-orange)')}>
                      {selectedUser.banned ? <><CheckCircle size={12}/> Unban</> : <><Ban size={12}/> Ban</>}
                    </button>
                    <button onClick={() => setResetPassword({ userId: selectedUser._id, value: '' })} style={outlineBtn('var(--neon-purple)')}><KeyRound size={12}/> Reset Password</button>
                    <button onClick={() => handleDeleteUser(selectedUser._id)} style={outlineBtn('var(--neon-pink)')}><Trash2 size={12}/> Delete</button>
                  </div>

                  {resetPassword.userId === selectedUser._id && (
                    <div style={{ background: 'rgba(191,0,255,0.06)', border: '1px solid rgba(191,0,255,0.2)', borderRadius: '9px', padding: '14px 16px', marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <KeyRound size={13} color="var(--neon-purple)"/>
                      <input type="password" placeholder="New password" value={resetPassword.value} onChange={e => setResetPassword({ ...resetPassword, value: e.target.value })} style={{ ...inputStyle, maxWidth: '200px' }} />
                      <button onClick={() => handleResetPassword(selectedUser._id)} style={btn('var(--gradient-matrix)', '#000')}>Set</button>
                      <button onClick={() => setResetPassword({ userId: null, value: '' })} style={outlineBtn('var(--text-muted)')}>Cancel</button>
                    </div>
                  )}

                  <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--neon-cyan)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    <BookOpen size={14}/> Enrolled Courses ({selectedUser.enrolledCourses?.length || 0})
                  </h5>
                  {!selectedUser.enrolledCourses?.length ? <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>No courses enrolled yet.</p> : (
                    <div className="row g-3">
                      {selectedUser.enrolledCourses?.map(course => (
                        <div className="col-md-4" key={course._id}>
                          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '9px', padding: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div style={{ width: '36px', height: '36px', background: 'rgba(0,245,255,0.05)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <img src={course.image} alt="" style={{ maxWidth: '28px', maxHeight: '28px', objectFit: 'contain' }} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--text-primary)', margin: 0, fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{course.title}</p>
                              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '10px', fontFamily: 'var(--font-mono)' }}>{course.duration}</p>
                            </div>
                            <button onClick={() => handleUnenrollUser(selectedUser._id, course._id)} style={{ background: 'rgba(255,0,110,0.1)', color: 'var(--neon-pink)', border: '1px solid rgba(255,0,110,0.2)', borderRadius: '5px', padding: '4px 7px', cursor: 'pointer', fontSize: '10px', fontFamily: 'var(--font-display)', fontWeight: '700', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '3px', letterSpacing: '0.5px' }}>
                              <UserX size={10}/> Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-neon)', borderRadius: '7px', padding: '8px 14px', maxWidth: '300px', marginBottom: '16px' }}>
                  <Search size={13} color="var(--text-muted)"/>
                  <input placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)} style={{ ...inputStyle, border: 'none', padding: 0, background: 'none' }} />
                </div>
                <div className="row g-3">
                  {filteredUsers.map(user => (
                    <div className="col-md-4" key={user._id}>
                      <div style={{ ...card, opacity: user.banned ? 0.75 : 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                          <div style={{ width: '42px', height: '42px', borderRadius: '9px', background: user.banned ? 'rgba(255,0,110,0.2)' : 'var(--gradient-neon)', border: user.banned ? '1px solid rgba(255,0,110,0.3)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', color: user.banned ? 'var(--neon-pink)' : '#000', fontWeight: '800', flexShrink: 0 }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h6 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', fontSize: '13px' }}>
                              {user.name}
                              {user.banned && <span style={{ fontSize: '9px', background: 'rgba(255,0,110,0.1)', color: 'var(--neon-pink)', borderRadius: '3px', padding: '1px 5px', fontFamily: 'var(--font-mono)', letterSpacing: '1px', textTransform: 'uppercase', border: '1px solid rgba(255,0,110,0.2)' }}>Banned</span>}
                              {user.role === 'admin' && <span style={{ fontSize: '9px', background: 'rgba(255,123,0,0.1)', color: 'var(--neon-orange)', borderRadius: '3px', padding: '1px 5px', fontFamily: 'var(--font-mono)', letterSpacing: '1px', textTransform: 'uppercase', border: '1px solid rgba(255,123,0,0.2)' }}>Admin</span>}
                            </h6>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                            <p style={{ fontSize: '10px', color: 'var(--neon-cyan)', margin: '2px 0 0', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <BookOpen size={9}/> {user.enrolledCourses?.length || 0} courses
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button onClick={() => setSelectedUser(user)} style={{ flex: 2, padding: '6px', background: 'rgba(0,245,255,0.08)', color: 'var(--neon-cyan)', border: '1px solid rgba(0,245,255,0.2)', borderRadius: '6px', fontFamily: 'var(--font-display)', fontWeight: '700', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <Eye size={11}/> View
                          </button>
                          <button onClick={() => handleBanUser(user._id)} style={{ flex: 1, padding: '6px', background: user.banned ? 'rgba(0,255,136,0.1)' : 'rgba(255,123,0,0.1)', color: user.banned ? 'var(--neon-green)' : 'var(--neon-orange)', border: `1px solid ${user.banned ? 'rgba(0,255,136,0.2)' : 'rgba(255,123,0,0.2)'}`, borderRadius: '6px', fontFamily: 'var(--font-display)', fontWeight: '700', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {user.banned ? <CheckCircle size={12}/> : <Ban size={12}/>}
                          </button>
                          <button onClick={() => handleDeleteUser(user._id)} style={{ flex: 1, padding: '6px', background: 'rgba(255,0,110,0.1)', color: 'var(--neon-pink)', border: '1px solid rgba(255,0,110,0.2)', borderRadius: '6px', fontFamily: 'var(--font-display)', fontWeight: '700', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={12}/>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
