import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, Users, Search, Plus, X, Pencil,
  Trash2, ChevronUp, ChevronDown, Video, KeyRound, Ban, CheckCircle,
  Eye, UserX, ArrowLeft, GraduationCap, Clock
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
  const [form, setForm] = useState({
    title: '', instructor: '', duration: '', image: '',
    description: '', level: 'Beginner', price: 'Free',
    topics: '', video: '', lessons: []
  })

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
    fetch(`${BASE_URL}/api/courses`).then(res => res.json()).then(data => { setCourses(data); setFilteredCourses(data) })
  }

  const loadUsers = () => {
    fetch(`${BASE_URL}/api/auth/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(data => { if (Array.isArray(data)) { setUsers(data); setFilteredUsers(data) } })
  }

  const loadCourseStudents = (courseId) => {
    fetch(`${BASE_URL}/api/courses/${courseId}/students`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(data => setCourseStudents(data))
  }

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleAddLesson = () => setForm({ ...form, lessons: [...form.lessons, { title: '', video: '', duration: '' }] })
  const handleLessonChange = (index, field, value) => {
    const updated = [...form.lessons]; updated[index][field] = value; setForm({ ...form, lessons: updated })
  }
  const handleRemoveLesson = (index) => setForm({ ...form, lessons: form.lessons.filter((_, i) => i !== index) })
  const handleMoveLessonUp = (index) => {
    if (index === 0) return
    const updated = [...form.lessons]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    setForm({ ...form, lessons: updated })
  }
  const handleMoveLessonDown = (index) => {
    if (index === form.lessons.length - 1) return
    const updated = [...form.lessons]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    setForm({ ...form, lessons: updated })
  }

  const handleSubmit = async () => {
    const courseData = { ...form, topics: form.topics.split('\n').filter(t => t.trim() !== ''), lessons: form.lessons.filter(l => l.title && l.video) }
    const url = editingCourse ? `${BASE_URL}/api/courses/${editingCourse._id}` : `${BASE_URL}/api/courses`
    const method = editingCourse ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(courseData) })
    const data = await res.json()
    if (data._id || data.title) { showMsg(editingCourse ? 'Course updated!' : 'Course added!'); resetForm(); loadCourses() }
    else showMsg('Something went wrong.', 'error')
  }

  const handleEdit = (course) => {
    setEditingCourse(course)
    setForm({ title: course.title, instructor: course.instructor, duration: course.duration, image: course.image, description: course.description, level: course.level, price: course.price, topics: course.topics.join('\n'), video: course.video, lessons: course.lessons || [] })
    setShowForm(true); window.scrollTo(0, 0)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? Enrolled users will be unenrolled.')) return
    await fetch(`${BASE_URL}/api/courses/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    showMsg('Course deleted.'); loadCourses()
  }

  const resetForm = () => {
    setShowForm(false); setEditingCourse(null)
    setForm({ title: '', instructor: '', duration: '', image: '', description: '', level: 'Beginner', price: 'Free', topics: '', video: '', lessons: [] })
  }

  const handleViewCourseStudents = (course) => { setSelectedCourse(course); loadCourseStudents(course._id) }
  const handleEditUser = (user) => { setEditingUser(user._id); setUserForm({ name: user.name, email: user.email, role: user.role }) }

  const handleSaveUser = async (userId) => {
    const res = await fetch(`${BASE_URL}/api/auth/users/${userId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(userForm) })
    const data = await res.json()
    if (data._id) { showMsg('User updated!'); setEditingUser(null); loadUsers(); if (selectedUser?._id === userId) setSelectedUser({ ...selectedUser, ...userForm }) }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user permanently?')) return
    await fetch(`${BASE_URL}/api/auth/users/${userId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    showMsg('User deleted.'); setSelectedUser(null); loadUsers()
  }

  const handleBanUser = async (userId) => {
    const res = await fetch(`${BASE_URL}/api/auth/users/${userId}/ban`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json(); showMsg(data.message); loadUsers()
    if (selectedUser?._id === userId) setSelectedUser({ ...selectedUser, banned: data.banned })
  }

  const handleResetPassword = async (userId) => {
    if (!resetPassword.value) return showMsg('Enter a new password', 'error')
    const res = await fetch(`${BASE_URL}/api/auth/users/${userId}/reset-password`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ newPassword: resetPassword.value }) })
    const data = await res.json(); showMsg(data.message); setResetPassword({ userId: null, value: '' })
  }

  const handleUnenrollUser = async (userId, courseId) => {
    if (!window.confirm('Unenroll this user from the course?')) return
    await fetch(`${BASE_URL}/api/auth/users/${userId}/unenroll/${courseId}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
    showMsg('User unenrolled.'); loadUsers()
    const updated = await fetch(`${BASE_URL}/api/auth/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
    setSelectedUser(updated)
  }

  const tabStyle = (tab) => ({
    padding: '10px 24px', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px',
    backgroundColor: activeTab === tab ? '#1a1a2e' : 'transparent',
    color: activeTab === tab ? '#F3E3D0' : '#1a1a2e', transition: 'all 0.2s',
    display: 'flex', alignItems: 'center', gap: '8px'
  })

  const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D2C4B4', fontSize: '13px', outline: 'none' }
  const btnStyle = (bg) => ({ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: bg, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' })

  return (
    <div style={{ backgroundColor: '#81A6C6', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container">
        <h2 style={{ color: '#F3E3D0', fontWeight: '800', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <LayoutDashboard size={28} /> Admin Dashboard
        </h2>
        <p style={{ color: '#F3E3D0', opacity: 0.85, marginBottom: '24px' }}>Manage courses and users</p>

        {message.text && (
          <div style={{ backgroundColor: message.type === 'error' ? '#fde8e8' : '#d4edda', border: `1px solid ${message.type === 'error' ? '#c0392b' : '#27ae60'}`, borderRadius: '8px', padding: '12px 20px', marginBottom: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {message.type === 'error' ? <X size={16} color="#c0392b" /> : <CheckCircle size={16} color="#27ae60" />}
            {message.text}
          </div>
        )}

        <div style={{ backgroundColor: '#F3E3D0', borderRadius: '12px', padding: '8px', display: 'inline-flex', gap: '4px', marginBottom: '24px' }}>
          <button style={tabStyle('courses')} onClick={() => setActiveTab('courses')}>
            <BookOpen size={16} /> Courses ({courses.length})
          </button>
          <button style={tabStyle('users')} onClick={() => setActiveTab('users')}>
            <Users size={16} /> Users ({users.length})
          </button>
        </div>

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div>
            {selectedCourse ? (
              <div>
                <button onClick={() => setSelectedCourse(null)} style={{ ...btnStyle('#1a1a2e'), marginBottom: '20px' }}>
                  <ArrowLeft size={16} /> Back to Courses
                </button>
                <div style={{ backgroundColor: '#F3E3D0', borderRadius: '16px', padding: '30px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                    <img src={selectedCourse.image} alt={selectedCourse.title} style={{ width: '60px', height: '60px', objectFit: 'contain', backgroundColor: '#fff', padding: '6px', borderRadius: '10px' }} />
                    <div>
                      <h4 style={{ fontWeight: '800', color: '#1a1a2e', margin: 0 }}>{selectedCourse.title}</h4>
                      <p style={{ color: '#666', margin: 0, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <GraduationCap size={13} /> {selectedCourse.instructor}
                        <Clock size={13} /> {selectedCourse.duration}
                      </p>
                    </div>
                  </div>
                  <h5 style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} /> Enrolled Students ({courseStudents.length})
                  </h5>
                  {courseStudents.length === 0 ? <p style={{ color: '#666' }}>No students enrolled yet.</p> : (
                    <div className="row g-3">
                      {courseStudents.map(student => (
                        <div className="col-md-4" key={student._id}>
                          <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F3E3D0', fontWeight: '800', flexShrink: 0 }}>
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p style={{ fontWeight: '700', color: '#1a1a2e', margin: 0, fontSize: '13px' }}>{student.name}</p>
                              <p style={{ color: '#666', margin: 0, fontSize: '12px' }}>{student.email}</p>
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
                  <div style={{ position: 'relative', maxWidth: '360px', flex: 1 }}>
                    <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                    <input placeholder="Search courses..." value={courseSearch} onChange={e => setCourseSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: '34px', backgroundColor: '#F3E3D0' }} />
                  </div>
                  <button onClick={() => showForm ? resetForm() : setShowForm(true)} style={{ ...btnStyle(showForm ? '#888' : '#27ae60'), gap: '6px' }}>
                    {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Course</>}
                  </button>
                </div>

                {showForm && (
                  <div style={{ backgroundColor: '#F3E3D0', borderRadius: '16px', padding: '30px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                    <h5 style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {editingCourse ? <><Pencil size={18} /> Edit Course</> : <><Plus size={18} /> Add New Course</>}
                    </h5>
                    <div className="row g-3">
                      <div className="col-md-6"><label style={{ fontWeight: '600' }}>Title</label><input name="title" className="form-control mt-1" value={form.title} onChange={handleFormChange} placeholder="Course title" /></div>
                      <div className="col-md-6"><label style={{ fontWeight: '600' }}>Instructor</label><input name="instructor" className="form-control mt-1" value={form.instructor} onChange={handleFormChange} placeholder="Instructor name" /></div>
                      <div className="col-md-4"><label style={{ fontWeight: '600' }}>Duration</label><input name="duration" className="form-control mt-1" value={form.duration} onChange={handleFormChange} placeholder="e.g. 5 hours" /></div>
                      <div className="col-md-4"><label style={{ fontWeight: '600' }}>Level</label>
                        <select name="level" className="form-control mt-1" value={form.level} onChange={handleFormChange}>
                          <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                        </select>
                      </div>
                      <div className="col-md-4"><label style={{ fontWeight: '600' }}>Price</label><input name="price" className="form-control mt-1" value={form.price} onChange={handleFormChange} placeholder="Free or Rs.499" /></div>
                      <div className="col-md-6"><label style={{ fontWeight: '600' }}>Image URL</label><input name="image" className="form-control mt-1" value={form.image} onChange={handleFormChange} placeholder="https://..." /></div>
                      <div className="col-md-6"><label style={{ fontWeight: '600' }}>Main Video URL</label><input name="video" className="form-control mt-1" value={form.video} onChange={handleFormChange} placeholder="https://www.youtube.com/embed/..." /></div>
                      <div className="col-12"><label style={{ fontWeight: '600' }}>Description</label><textarea name="description" className="form-control mt-1" rows="2" value={form.description} onChange={handleFormChange} /></div>
                      <div className="col-12"><label style={{ fontWeight: '600' }}>Topics (one per line)</label><textarea name="topics" className="form-control mt-1" rows="3" value={form.topics} onChange={handleFormChange} placeholder="Topic 1&#10;Topic 2" /></div>
                      <div className="col-12">
                        <label style={{ fontWeight: '700', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}><Video size={16} /> Lessons</label>
                        <div style={{ border: '1px solid #D2C4B4', borderRadius: '8px', padding: '16px', marginTop: '8px', backgroundColor: '#fff' }}>
                          {form.lessons.length === 0 && <p style={{ color: '#888', fontSize: '13px', textAlign: 'center' }}>No lessons added yet.</p>}
                          {form.lessons.map((lesson, index) => (
                            <div key={index} style={{ backgroundColor: '#F3E3D0', borderRadius: '8px', padding: '12px', marginBottom: '10px', border: '1px solid #D2C4B4' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontWeight: '700', fontSize: '13px' }}>Lesson {index + 1}</span>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button onClick={() => handleMoveLessonUp(index)} disabled={index === 0} style={{ backgroundColor: '#81A6C6', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', opacity: index === 0 ? 0.4 : 1 }}><ChevronUp size={14} /></button>
                                  <button onClick={() => handleMoveLessonDown(index)} disabled={index === form.lessons.length - 1} style={{ backgroundColor: '#81A6C6', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', opacity: index === form.lessons.length - 1 ? 0.4 : 1 }}><ChevronDown size={14} /></button>
                                  <button onClick={() => handleRemoveLesson(index)} style={{ backgroundColor: '#c0392b', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}><X size={14} /></button>
                                </div>
                              </div>
                              <div className="row g-2">
                                <div className="col-md-5"><input className="form-control" placeholder="Lesson title" value={lesson.title} onChange={e => handleLessonChange(index, 'title', e.target.value)} /></div>
                                <div className="col-md-5"><input className="form-control" placeholder="YouTube embed URL" value={lesson.video} onChange={e => handleLessonChange(index, 'video', e.target.value)} /></div>
                                <div className="col-md-2"><input className="form-control" placeholder="Duration" value={lesson.duration} onChange={e => handleLessonChange(index, 'duration', e.target.value)} /></div>
                              </div>
                            </div>
                          ))}
                          <button onClick={handleAddLesson} style={{ ...btnStyle('#81A6C6'), fontSize: '13px' }}><Plus size={14} /> Add Lesson</button>
                        </div>
                      </div>
                    </div>
                    <button onClick={handleSubmit} style={{ ...btnStyle('#1a1a2e'), marginTop: '20px', padding: '12px 32px' }}>
                      {editingCourse ? <><Pencil size={15} /> Update Course</> : <><Plus size={15} /> Add Course</>}
                    </button>
                  </div>
                )}

                <div className="row g-3">
                  {filteredCourses.map(course => (
                    <div className="col-md-4" key={course._id}>
                      <div style={{ backgroundColor: '#F3E3D0', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', height: '100%' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                          <img src={course.image} alt={course.title} style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '8px', backgroundColor: '#fff', padding: '4px', flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <h6 style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '4px' }}>{course.title}</h6>
                            <p style={{ fontSize: '12px', color: '#666', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}><GraduationCap size={12} /> {course.instructor} &nbsp;|&nbsp; <Clock size={12} /> {course.duration}</p>
                            <p style={{ fontSize: '12px', color: '#666', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}><Video size={12} /> {course.lessons?.length || 0} lessons</p>
                            <span style={{ fontSize: '11px', backgroundColor: '#81A6C6', color: '#fff', borderRadius: '4px', padding: '2px 8px', display: 'inline-block', marginTop: '4px' }}>{course.level}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
                          <button onClick={() => handleEdit(course)} style={{ flex: 1, padding: '6px', backgroundColor: '#f5a623', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}><Pencil size={12} /> Edit</button>
                          <button onClick={() => handleViewCourseStudents(course)} style={{ flex: 1, padding: '6px', backgroundColor: '#81A6C6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}><Users size={12} /> Students</button>
                          <button onClick={() => handleDelete(course._id)} style={{ flex: 1, padding: '6px', backgroundColor: '#c0392b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}><Trash2 size={12} /> Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
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
                <button onClick={() => { setSelectedUser(null); setEditingUser(null); setResetPassword({ userId: null, value: '' }) }} style={{ ...btnStyle('#1a1a2e'), marginBottom: '20px' }}>
                  <ArrowLeft size={16} /> Back to Users
                </button>
                <div style={{ backgroundColor: '#F3E3D0', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: selectedUser.banned ? '#c0392b' : '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#F3E3D0', fontWeight: '800', flexShrink: 0 }}>
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      {editingUser === selectedUser._id ? (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <input value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} style={{ ...inputStyle, maxWidth: '160px' }} placeholder="Name" />
                          <input value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} style={{ ...inputStyle, maxWidth: '200px' }} placeholder="Email" />
                          <select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })} style={{ ...inputStyle, maxWidth: '100px' }}>
                            <option value="user">User</option><option value="admin">Admin</option>
                          </select>
                          <button onClick={() => handleSaveUser(selectedUser._id)} style={{ ...btnStyle('#27ae60') }}>Save</button>
                          <button onClick={() => setEditingUser(null)} style={{ ...btnStyle('#888') }}>Cancel</button>
                        </div>
                      ) : (
                        <>
                          <h4 style={{ fontWeight: '800', color: '#1a1a2e', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {selectedUser.name}
                            {selectedUser.banned && <span style={{ fontSize: '12px', color: '#c0392b', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}><Ban size={13} /> BANNED</span>}
                          </h4>
                          <p style={{ color: '#666', margin: 0 }}>{selectedUser.email}</p>
                          <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>Role: {selectedUser.role} | Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                    <button onClick={() => handleEditUser(selectedUser)} style={{ ...btnStyle('#f5a623') }}><Pencil size={14} /> Edit Details</button>
                    <button onClick={() => handleBanUser(selectedUser._id)} style={{ ...btnStyle(selectedUser.banned ? '#27ae60' : '#e67e22') }}>
                      {selectedUser.banned ? <><CheckCircle size={14} /> Unban User</> : <><Ban size={14} /> Ban User</>}
                    </button>
                    <button onClick={() => setResetPassword({ userId: selectedUser._id, value: '' })} style={{ ...btnStyle('#81A6C6') }}><KeyRound size={14} /> Reset Password</button>
                    <button onClick={() => handleDeleteUser(selectedUser._id)} style={{ ...btnStyle('#c0392b') }}><Trash2 size={14} /> Delete User</button>
                  </div>

                  {resetPassword.userId === selectedUser._id && (
                    <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '16px', marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <KeyRound size={15} color="#1a1a2e" />
                      <span style={{ fontWeight: '700', fontSize: '13px' }}>New Password:</span>
                      <input type="password" placeholder="Enter new password" value={resetPassword.value} onChange={e => setResetPassword({ ...resetPassword, value: e.target.value })} style={{ ...inputStyle, maxWidth: '200px' }} />
                      <button onClick={() => handleResetPassword(selectedUser._id)} style={{ ...btnStyle('#27ae60') }}>Set Password</button>
                      <button onClick={() => setResetPassword({ userId: null, value: '' })} style={{ ...btnStyle('#888') }}>Cancel</button>
                    </div>
                  )}

                  <h5 style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpen size={18} /> Enrolled Courses ({selectedUser.enrolledCourses?.length || 0})
                  </h5>
                  {selectedUser.enrolledCourses?.length === 0 ? <p style={{ color: '#666' }}>No courses enrolled yet.</p> : (
                    <div className="row g-3">
                      {selectedUser.enrolledCourses?.map(course => (
                        <div className="col-md-4" key={course._id}>
                          <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <img src={course.image} alt={course.title} style={{ width: '40px', height: '40px', objectFit: 'contain', flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                              <p style={{ fontWeight: '700', color: '#1a1a2e', margin: 0, fontSize: '13px' }}>{course.title}</p>
                              <p style={{ color: '#666', margin: 0, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={11} /> {course.duration}</p>
                            </div>
                            <button onClick={() => handleUnenrollUser(selectedUser._id, course._id)} style={{ backgroundColor: '#c0392b', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px' }}><UserX size={11} /> Unenroll</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '16px', position: 'relative', maxWidth: '360px' }}>
                  <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                  <input placeholder="Search users by name or email..." value={userSearch} onChange={e => setUserSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: '34px', backgroundColor: '#F3E3D0' }} />
                </div>
                <div className="row g-3">
                  {filteredUsers.map(user => (
                    <div className="col-md-4" key={user._id}>
                      <div style={{ backgroundColor: '#F3E3D0', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', opacity: user.banned ? 0.7 : 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                          <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: user.banned ? '#c0392b' : '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#F3E3D0', fontWeight: '800', flexShrink: 0 }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h6 style={{ fontWeight: '700', color: '#1a1a2e', margin: 0, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              {user.name}
                              {user.banned && <span style={{ fontSize: '10px', backgroundColor: '#c0392b', color: '#fff', borderRadius: '4px', padding: '1px 6px', display: 'flex', alignItems: 'center', gap: '2px' }}><Ban size={9} /> BANNED</span>}
                              {user.role === 'admin' && <span style={{ fontSize: '10px', backgroundColor: '#f5a623', color: '#fff', borderRadius: '4px', padding: '1px 6px' }}>ADMIN</span>}
                            </h6>
                            <p style={{ fontSize: '12px', color: '#666', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                            <p style={{ fontSize: '12px', color: '#81A6C6', margin: 0, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}><BookOpen size={11} /> {user.enrolledCourses?.length || 0} courses</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => setSelectedUser(user)} style={{ flex: 2, padding: '6px', backgroundColor: '#1a1a2e', color: '#F3E3D0', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}><Eye size={13} /> View</button>
                          <button onClick={() => handleBanUser(user._id)} style={{ flex: 1, padding: '6px', backgroundColor: user.banned ? '#27ae60' : '#e67e22', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {user.banned ? <CheckCircle size={14} /> : <Ban size={14} />}
                          </button>
                          <button onClick={() => handleDeleteUser(user._id)} style={{ flex: 1, padding: '6px', backgroundColor: '#c0392b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={14} />
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