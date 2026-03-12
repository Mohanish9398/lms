import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Users, Search, Plus, X, Pencil, Trash2, ChevronUp, ChevronDown, Video, KeyRound, Ban, CheckCircle, Eye, UserX, ArrowLeft, GraduationCap, Clock } from 'lucide-react'

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000'

export default function Admin() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('courses')
  const [courses, setCourses] = useState([]); const [fcourses, setFcourses] = useState([])
  const [cSearch, setCSearch] = useState('')
  const [users, setUsers] = useState([]);   const [fusers, setFusers] = useState([])
  const [uSearch, setUSearch] = useState('')
  const [selUser, setSelUser] = useState(null)
  const [selCourse, setSelCourse] = useState(null); const [students, setStudents] = useState([])
  const [showForm, setShowForm] = useState(false); const [editCourse, setEditCourse] = useState(null)
  const [msg, setMsg] = useState({ text:'', ok:true })
  const [editUser, setEditUser] = useState(null); const [uForm, setUForm] = useState({ name:'', email:'', role:'user' })
  const [resetPwd, setResetPwd] = useState({ id:null, val:'' })
  const blank = { title:'', instructor:'', duration:'', image:'', description:'', level:'Beginner', price:'Free', topics:'', video:'', lessons:[] }
  const [form, setForm] = useState(blank)

  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const role  = localStorage.getItem('userRole') || sessionStorage.getItem('userRole')

  useEffect(() => {
    if (!token || role !== 'admin') { navigate('/Login'); return }
    loadCourses(); loadUsers()
  }, [token, role])    

  useEffect(() => { setFcourses(courses.filter(c => c.title.toLowerCase().includes(cSearch.toLowerCase()) || c.instructor.toLowerCase().includes(cSearch.toLowerCase()))) }, [cSearch, courses])
  useEffect(() => { setFusers(users.filter(u => u.name.toLowerCase().includes(uSearch.toLowerCase()) || u.email.toLowerCase().includes(uSearch.toLowerCase()))) }, [uSearch, users])

  const toast = (text, ok=true) => { setMsg({text,ok}); setTimeout(()=>setMsg({text:'',ok:true}),3000) }
  const hdr = () => ({ Authorization: `Bearer ${token}` })
  const jsonHdr = () => ({ 'Content-Type':'application/json', ...hdr() })

  const loadCourses = () => fetch(`${BASE}/api/courses`).then(r=>r.json()).then(d=>{setCourses(d);setFcourses(d)})
  const loadUsers   = () => fetch(`${BASE}/api/auth/users`,{headers:hdr()}).then(r=>r.json()).then(d=>{if(Array.isArray(d)){setUsers(d);setFusers(d)}})
  const loadStudents= id=> fetch(`${BASE}/api/courses/${id}/students`,{headers:hdr()}).then(r=>r.json()).then(setStudents)

  const handleFormChange = e => setForm({...form,[e.target.name]:e.target.value})
  const addLesson   = () => setForm({...form,lessons:[...form.lessons,{title:'',video:'',duration:''}]})
  const chLesson    = (i,f,v) => { const u=[...form.lessons];u[i][f]=v;setForm({...form,lessons:u}) }
  const rmLesson    = i => setForm({...form,lessons:form.lessons.filter((_,j)=>j!==i)})
  const mvUp        = i => { if(!i)return; const u=[...form.lessons];[u[i-1],u[i]]=[u[i],u[i-1]];setForm({...form,lessons:u}) }
  const mvDown      = i => { if(i===form.lessons.length-1)return; const u=[...form.lessons];[u[i],u[i+1]]=[u[i+1],u[i]];setForm({...form,lessons:u}) }

  const submitCourse = async () => {
    const body = {...form, topics:form.topics.split('\n').filter(t=>t.trim()), lessons:form.lessons.filter(l=>l.title&&l.video)}
    const url = editCourse ? `${BASE}/api/courses/${editCourse._id}` : `${BASE}/api/courses`
    const res = await fetch(url,{method:editCourse?'PUT':'POST',headers:jsonHdr(),body:JSON.stringify(body)})
    const d = await res.json()
    if(d._id||d.title){toast(editCourse?'Course updated.':'Course added.');resetForm();loadCourses()}
    else toast('Something went wrong.', false)
  }

  const editC = c => {
    setEditCourse(c)
    setForm({title:c.title,instructor:c.instructor,duration:c.duration,image:c.image,description:c.description,level:c.level,price:c.price,topics:c.topics.join('\n'),video:c.video,lessons:c.lessons||[]})
    setShowForm(true); window.scrollTo(0,0)
  }

  const delCourse = async id => {
    if(!window.confirm('Delete this course?')) return
    await fetch(`${BASE}/api/courses/${id}`,{method:'DELETE',headers:hdr()})
    toast('Course deleted.'); loadCourses()
  }

  const resetForm = () => { setShowForm(false); setEditCourse(null); setForm(blank) }

  const saveUser = async id => {
    const res = await fetch(`${BASE}/api/auth/users/${id}`,{method:'PUT',headers:jsonHdr(),body:JSON.stringify(uForm)})
    const d = await res.json()
    if(d._id){toast('User updated.');setEditUser(null);loadUsers();if(selUser?._id===id)setSelUser({...selUser,...uForm})}
  }
  const delUser = async id => {
    if(!window.confirm('Delete this user?')) return
    await fetch(`${BASE}/api/auth/users/${id}`,{method:'DELETE',headers:hdr()})
    toast('User deleted.'); setSelUser(null); loadUsers()
  }
  const banUser = async id => {
    const res = await fetch(`${BASE}/api/auth/users/${id}/ban`,{method:'PUT',headers:hdr()})
    const d = await res.json(); toast(d.message); loadUsers()
    if(selUser?._id===id) setSelUser({...selUser,banned:d.banned})
  }
  const resetPassword = async id => {
    if(!resetPwd.val){toast('Enter a new password.',false);return}
    const res = await fetch(`${BASE}/api/auth/users/${id}/reset-password`,{method:'PUT',headers:jsonHdr(),body:JSON.stringify({newPassword:resetPwd.val})})
    const d = await res.json(); toast(d.message); setResetPwd({id:null,val:''})
  }
  const unenroll = async (uid,cid) => {
    if(!window.confirm('Unenroll this user?')) return
    await fetch(`${BASE}/api/auth/users/${uid}/unenroll/${cid}`,{method:'PUT',headers:hdr()})
    toast('Unenrolled.'); loadUsers()
    const updated = await fetch(`${BASE}/api/auth/users/${uid}`,{headers:hdr()}).then(r=>r.json())
    setSelUser(updated)
  }

  const tabBtn = t => (
    <button onClick={()=>setTab(t)} style={{ display:'flex',alignItems:'center',gap:7,padding:'8px 16px',borderRadius:'var(--r-sm)',border:'none',background:tab===t?'var(--bg-4)':'transparent',color:tab===t?'var(--t-hi)':'var(--t-mid)',fontFamily:'var(--font-body)',fontSize:13,fontWeight:tab===t?600:500,cursor:'pointer',transition:'all 0.15s' }}>
      {t==='courses'?<BookOpen size={14}/>:<Users size={14}/>}
      {t==='courses'?`Courses (${courses.length})`:`Users (${users.length})`}
    </button>
  )

  const Section = ({children}) => (
    <div style={{background:'var(--bg-2)',border:'1px solid var(--b-1)',borderRadius:'var(--r-lg)',padding:'22px 24px'}}>
      {children}
    </div>
  )

  return (
    <div style={{ background:'var(--bg-0)', minHeight:'100vh', padding:'40px 20px' }}>
      <div style={{ maxWidth:1280, margin:'0 auto' }}>

        
        <div style={{ marginBottom:24 }}>
          <div className="eyebrow" style={{ marginBottom:8 }}>Administration</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(20px,3.5vw,28px)', fontWeight:800, letterSpacing:'-0.03em' }}>Dashboard</h1>
        </div>

        
        {msg.text && (
          <div className={msg.ok?'toast toast-ok':'toast toast-err'} style={{ marginBottom:16 }}>
            {msg.ok?<CheckCircle size={14}/>:<X size={14}/>} {msg.text}
          </div>
        )}

        
        <div style={{ background:'var(--bg-2)', border:'1px solid var(--b-1)', borderRadius:'var(--r-md)', padding:4, marginBottom:20, display:'inline-flex' }}>
          {tabBtn('courses')}{tabBtn('users')}
        </div>

        
        {tab === 'courses' && (
          selCourse ? (
            <div>
              <button onClick={()=>setSelCourse(null)} className="btn-ghost" style={{ marginBottom:16, color:'var(--t-lo)', fontSize:12 }}>
                <ArrowLeft size={13}/> Back
              </button>
              <Section>
                <div style={{ display:'flex', gap:16, alignItems:'center', marginBottom:20, flexWrap:'wrap' }}>
                  <div style={{ width:56, height:56, borderRadius:10, background:'var(--bg-3)', border:'1px solid var(--b-1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <img src={selCourse.image} alt="" style={{ maxWidth:38, maxHeight:38, objectFit:'contain' }}/>
                  </div>
                  <div>
                    <h3 style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:700, letterSpacing:'-0.02em', marginBottom:3 }}>{selCourse.title}</h3>
                    <p style={{ fontSize:12, color:'var(--t-lo)', fontFamily:'var(--font-mono)', display:'flex', alignItems:'center', gap:8 }}>
                      <GraduationCap size={11}/>{selCourse.instructor} · <Clock size={11}/>{selCourse.duration}
                    </p>
                  </div>
                </div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:600, color:'var(--t-hi)', marginBottom:14, display:'flex', alignItems:'center', gap:6 }}>
                  <Users size={14} color="var(--accent)"/> Enrolled Students ({students.length})
                </div>
                {students.length===0 ? <p style={{ fontSize:13, color:'var(--t-lo)' }}>No students enrolled yet.</p> : (
                  <div className="row g-2">
                    {students.map(s=>(
                      <div className="col-md-4" key={s._id}>
                        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'var(--bg-3)', border:'1px solid var(--b-1)', borderRadius:'var(--r-md)' }}>
                          <div style={{ width:30, height:30, borderRadius:7, background:'var(--accent-soft)', border:'1px solid var(--accent-border)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-mono)', fontSize:12, fontWeight:700, color:'var(--accent)', flexShrink:0 }}>
                            {s.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontSize:13, fontWeight:500, color:'var(--t-hi)', margin:0 }}>{s.name}</p>
                            <p style={{ fontSize:11, color:'var(--t-lo)', margin:0, fontFamily:'var(--font-mono)' }}>{s.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            </div>
          ) : (
            <>
              <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:16, flexWrap:'wrap' }}>
                <div className="search-wrap" style={{ flex:1, maxWidth:320 }}>
                  <Search size={13} color="var(--t-lo)"/>
                  <input placeholder="Search courses…" value={cSearch} onChange={e=>setCSearch(e.target.value)}/>
                </div>
                <button onClick={()=>showForm?resetForm():setShowForm(true)} className={showForm?'btn-outline':'btn-success'} style={{ fontSize:13 }}>
                  {showForm?<><X size={13}/>Cancel</>:<><Plus size={13}/>Add course</>}
                </button>
              </div>

              {showForm && (
                <Section>
                  <h3 style={{ fontFamily:'var(--font-display)', fontSize:15, fontWeight:700, marginBottom:18, display:'flex', alignItems:'center', gap:7, color:'var(--t-hi)' }}>
                    {editCourse?<><Pencil size={14}/>Edit Course</>:<><Plus size={14}/>New Course</>}
                  </h3>
                  <div className="row g-3">
                    <div className="col-md-6"><label>Title</label><input name="title" className="form-control" value={form.title} onChange={handleFormChange} placeholder="Course title"/></div>
                    <div className="col-md-6"><label>Instructor</label><input name="instructor" className="form-control" value={form.instructor} onChange={handleFormChange} placeholder="Instructor name"/></div>
                    <div className="col-md-4"><label>Duration</label><input name="duration" className="form-control" value={form.duration} onChange={handleFormChange} placeholder="e.g. 5 hours"/></div>
                    <div className="col-md-4"><label>Level</label>
                      <select name="level" className="form-control" value={form.level} onChange={handleFormChange}>
                        <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                      </select>
                    </div>
                    <div className="col-md-4"><label>Price</label><input name="price" className="form-control" value={form.price} onChange={handleFormChange} placeholder="Free"/></div>
                    <div className="col-md-6"><label>Image URL</label><input name="image" className="form-control" value={form.image} onChange={handleFormChange} placeholder="https://…"/></div>
                    <div className="col-md-6"><label>Main Video URL</label><input name="video" className="form-control" value={form.video} onChange={handleFormChange} placeholder="https://youtube.com/embed/…"/></div>
                    <div className="col-12"><label>Description</label><textarea name="description" className="form-control" rows="2" value={form.description} onChange={handleFormChange}/></div>
                    <div className="col-12"><label>Topics (one per line)</label><textarea name="topics" className="form-control" rows="3" value={form.topics} onChange={handleFormChange} placeholder="Topic 1&#10;Topic 2"/></div>

                    <div className="col-12">
                      <label style={{ display:'flex', alignItems:'center', gap:5, marginBottom:8 }}><Video size={12}/>Lessons</label>
                      <div style={{ background:'var(--bg-3)', border:'1px solid var(--b-1)', borderRadius:'var(--r-md)', padding:14 }}>
                        {form.lessons.length===0 && <p style={{ fontSize:12, color:'var(--t-lo)', textAlign:'center', marginBottom:12 }}>No lessons yet.</p>}
                        {form.lessons.map((l,i)=>(
                          <div key={i} style={{ background:'var(--bg-4)', border:'1px solid var(--b-1)', borderRadius:'var(--r-md)', padding:'12px', marginBottom:8 }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                              <span style={{ fontSize:11, fontFamily:'var(--font-mono)', color:'var(--t-lo)' }}>LESSON {i+1}</span>
                              <div style={{ display:'flex', gap:4 }}>
                                {[<ChevronUp size={12}/>,<ChevronDown size={12}/>,<X size={12}/>].map((icon,j)=>(
                                  <button key={j} onClick={[()=>mvUp(i),()=>mvDown(i),()=>rmLesson(i)][j]}
                                    style={{ width:26,height:26,background:'var(--bg-3)',border:'1px solid var(--b-1)',borderRadius:'var(--r-xs)',cursor:'pointer',color:'var(--t-mid)',display:'flex',alignItems:'center',justifyContent:'center',opacity:((j===0&&i===0)||(j===1&&i===form.lessons.length-1))?0.35:1 }}>
                                    {icon}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="row g-2">
                              <div className="col-md-5"><input className="form-control" placeholder="Lesson title" value={l.title} onChange={e=>chLesson(i,'title',e.target.value)}/></div>
                              <div className="col-md-5"><input className="form-control" placeholder="YouTube embed URL" value={l.video} onChange={e=>chLesson(i,'video',e.target.value)}/></div>
                              <div className="col-md-2"><input className="form-control" placeholder="Duration" value={l.duration} onChange={e=>chLesson(i,'duration',e.target.value)}/></div>
                            </div>
                          </div>
                        ))}
                        <button onClick={addLesson} className="btn-outline" style={{ fontSize:12, padding:'7px 13px' }}><Plus size={12}/> Add lesson</button>
                      </div>
                    </div>
                  </div>
                  <button onClick={submitCourse} className="btn-accent" style={{ marginTop:18, padding:'10px 22px' }}>
                    {editCourse?<><Pencil size={13}/>Update</>:<><Plus size={13}/>Create course</>}
                  </button>
                </Section>
              )}

              <div className="row g-3" style={{ marginTop: showForm ? 16 : 0 }}>
                {fcourses.map(c=>(
                  <div className="col-md-4" key={c._id}>
                    <div style={{ background:'var(--bg-2)', border:'1px solid var(--b-1)', borderRadius:'var(--r-lg)', padding:'16px', transition:'border-color 0.18s' }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(6,255,210,0.22)';e.currentTarget.style.boxShadow='0 0 0 1px rgba(6,255,210,0.08), 0 0 24px rgba(6,255,210,0.07), 0 0 60px rgba(6,255,210,0.04)'}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--b-1)';e.currentTarget.style.boxShadow='none'}}>
                      <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:12 }}>
                        <div style={{ width:40,height:40,borderRadius:8,background:'var(--bg-3)',border:'1px solid var(--b-1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                          <img src={c.image} alt="" style={{ maxWidth:26,maxHeight:26,objectFit:'contain' }}/>
                        </div>
                        <div style={{ flex:1,minWidth:0 }}>
                          <h6 style={{ fontFamily:'var(--font-display)',fontSize:13,fontWeight:700,color:'var(--t-hi)',marginBottom:3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{c.title}</h6>
                          <p style={{ fontSize:11,color:'var(--t-lo)',fontFamily:'var(--font-mono)',display:'flex',alignItems:'center',gap:5 }}>
                            <GraduationCap size={10}/>{c.instructor}
                          </p>
                          <div style={{ display:'flex',gap:5,marginTop:4 }}>
                            <span className="badge badge-muted">{c.level}</span>
                            <span className="badge badge-muted"><Video size={9}/>{c.lessons?.length||0}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={()=>editC(c)} className="btn-warn" style={{ flex:1,justifyContent:'center',fontSize:11,padding:'6px 8px' }}><Pencil size={11}/>Edit</button>
                        <button onClick={()=>{setSelCourse(c);loadStudents(c._id)}} className="btn-outline" style={{ flex:1,justifyContent:'center',fontSize:11,padding:'6px 8px' }}><Users size={11}/>Students</button>
                        <button onClick={()=>delCourse(c._id)} className="btn-danger" style={{ flex:1,justifyContent:'center',fontSize:11,padding:'6px 8px' }}><Trash2 size={11}/>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )
        )}

        
        {tab === 'users' && (
          selUser ? (
            <div>
              <button onClick={()=>{setSelUser(null);setEditUser(null);setResetPwd({id:null,val:''})}} className="btn-ghost" style={{ marginBottom:16, color:'var(--t-lo)', fontSize:12 }}>
                <ArrowLeft size={13}/> Back
              </button>
              <Section>
                
                <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20, flexWrap:'wrap' }}>
                  <div style={{ width:52,height:52,borderRadius:12,background:selUser.banned?'rgba(248,113,113,0.12)':'var(--accent-soft)',border:`1px solid ${selUser.banned?'rgba(248,113,113,0.2)':'var(--accent-border)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-mono)',fontWeight:700,fontSize:20,color:selUser.banned?'var(--red)':'var(--accent)',flexShrink:0 }}>
                    {selUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex:1 }}>
                    {editUser === selUser._id ? (
                      <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
                        <input value={uForm.name} onChange={e=>setUForm({...uForm,name:e.target.value})} className="form-control" style={{ maxWidth:160 }} placeholder="Name"/>
                        <input value={uForm.email} onChange={e=>setUForm({...uForm,email:e.target.value})} className="form-control" style={{ maxWidth:200 }} placeholder="Email"/>
                        <select value={uForm.role} onChange={e=>setUForm({...uForm,role:e.target.value})} className="form-control" style={{ maxWidth:100 }}>
                          <option value="user">User</option><option value="admin">Admin</option>
                        </select>
                        <button onClick={()=>saveUser(selUser._id)} className="btn-success" style={{ fontSize:12 }}>Save</button>
                        <button onClick={()=>setEditUser(null)} className="btn-outline" style={{ fontSize:12 }}>Cancel</button>
                      </div>
                    ) : (
                      <>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <h3 style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:700, letterSpacing:'-0.02em' }}>{selUser.name}</h3>
                          {selUser.banned && <span className="badge badge-red"><Ban size={9}/>Banned</span>}
                          {selUser.role==='admin' && <span className="badge badge-orange">Admin</span>}
                        </div>
                        <p style={{ fontSize:12, color:'var(--t-lo)', fontFamily:'var(--font-mono)', marginTop:3 }}>{selUser.email}</p>
                        <p style={{ fontSize:11, color:'var(--t-lo)', fontFamily:'var(--font-mono)', marginTop:2 }}>Joined {new Date(selUser.createdAt).toLocaleDateString()}</p>
                      </>
                    )}
                  </div>
                </div>

                
                <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:20, paddingBottom:20, borderBottom:'1px solid var(--b-1)' }}>
                  <button onClick={()=>{setEditUser(selUser._id);setUForm({name:selUser.name,email:selUser.email,role:selUser.role})}} className="btn-warn" style={{ fontSize:12 }}><Pencil size={12}/>Edit</button>
                  <button onClick={()=>banUser(selUser._id)} className={selUser.banned?'btn-success':'btn-warn'} style={{ fontSize:12 }}>
                    {selUser.banned?<><CheckCircle size={12}/>Unban</>:<><Ban size={12}/>Ban</>}
                  </button>
                  <button onClick={()=>setResetPwd({id:selUser._id,val:''})} className="btn-outline" style={{ fontSize:12, color:'var(--blue)', borderColor:'rgba(96,165,250,0.2)' }}><KeyRound size={12}/>Reset password</button>
                  <button onClick={()=>delUser(selUser._id)} className="btn-danger" style={{ fontSize:12 }}><Trash2 size={12}/>Delete</button>
                </div>

                
                {resetPwd.id === selUser._id && (
                  <div style={{ background:'var(--bg-3)', border:'1px solid var(--b-1)', borderRadius:'var(--r-md)', padding:'14px', marginBottom:20, display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                    <KeyRound size={13} color="var(--accent)"/>
                    <input type="password" className="form-control" style={{ maxWidth:200 }} placeholder="New password" value={resetPwd.val} onChange={e=>setResetPwd({...resetPwd,val:e.target.value})}/>
                    <button onClick={()=>resetPassword(selUser._id)} className="btn-success" style={{ fontSize:12 }}>Set</button>
                    <button onClick={()=>setResetPwd({id:null,val:''})} className="btn-outline" style={{ fontSize:12 }}>Cancel</button>
                  </div>
                )}

                
                <div style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:600, marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
                  <BookOpen size={13} color="var(--accent)"/> Enrolled Courses ({selUser.enrolledCourses?.length||0})
                </div>
                {!selUser.enrolledCourses?.length ? <p style={{ fontSize:13,color:'var(--t-lo)' }}>No courses enrolled.</p> : (
                  <div className="row g-2">
                    {selUser.enrolledCourses.map(c=>(
                      <div className="col-md-4" key={c._id}>
                        <div style={{ display:'flex',gap:10,alignItems:'center',padding:'10px 12px',background:'var(--bg-3)',border:'1px solid var(--b-1)',borderRadius:'var(--r-md)' }}>
                          <img src={c.image} alt="" style={{ width:30,height:30,objectFit:'contain',flexShrink:0 }}/>
                          <div style={{ flex:1,minWidth:0 }}>
                            <p style={{ fontSize:12,fontWeight:500,color:'var(--t-hi)',margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{c.title}</p>
                            <p style={{ fontSize:10,color:'var(--t-lo)',margin:0,fontFamily:'var(--font-mono)',display:'flex',alignItems:'center',gap:3 }}><Clock size={9}/>{c.duration}</p>
                          </div>
                          <button onClick={()=>unenroll(selUser._id,c._id)} className="btn-danger" style={{ padding:'4px 8px',fontSize:10,flexShrink:0 }}><UserX size={10}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            </div>
          ) : (
            <>
              <div style={{ marginBottom:14, maxWidth:320 }}>
                <div className="search-wrap">
                  <Search size={13} color="var(--t-lo)"/>
                  <input placeholder="Search users…" value={uSearch} onChange={e=>setUSearch(e.target.value)}/>
                </div>
              </div>
              <div className="row g-3">
                {fusers.map(u=>(
                  <div className="col-md-4" key={u._id}>
                    <div style={{ background:'var(--bg-2)',border:'1px solid var(--b-1)',borderRadius:'var(--r-lg)',padding:'16px',opacity:u.banned?0.75:1,transition:'border-color 0.18s' }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(6,255,210,0.22)';e.currentTarget.style.boxShadow='0 0 0 1px rgba(6,255,210,0.08), 0 0 24px rgba(6,255,210,0.07), 0 0 60px rgba(6,255,210,0.04)'}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--b-1)';e.currentTarget.style.boxShadow='none'}}>
                      <div style={{ display:'flex',gap:10,alignItems:'center',marginBottom:12 }}>
                        <div style={{ width:36,height:36,borderRadius:8,background:u.banned?'rgba(248,113,113,0.1)':'var(--accent-soft)',border:`1px solid ${u.banned?'rgba(248,113,113,0.2)':'var(--accent-border)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-mono)',fontWeight:700,fontSize:14,color:u.banned?'var(--red)':'var(--accent)',flexShrink:0 }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex:1,minWidth:0 }}>
                          <div style={{ display:'flex',alignItems:'center',gap:5,flexWrap:'wrap' }}>
                            <span style={{ fontSize:13,fontWeight:600,color:'var(--t-hi)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{u.name}</span>
                            {u.banned && <span className="badge badge-red" style={{ fontSize:9 }}><Ban size={8}/>Banned</span>}
                            {u.role==='admin' && <span className="badge badge-orange" style={{ fontSize:9 }}>Admin</span>}
                          </div>
                          <p style={{ fontSize:11,color:'var(--t-lo)',fontFamily:'var(--font-mono)',margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{u.email}</p>
                          <p style={{ fontSize:11,color:'var(--t-lo)',margin:0,display:'flex',alignItems:'center',gap:3,marginTop:2 }}><BookOpen size={9}/>{u.enrolledCourses?.length||0} courses</p>
                        </div>
                      </div>
                      <div style={{ display:'flex',gap:5 }}>
                        <button onClick={()=>setSelUser(u)} className="btn-outline" style={{ flex:2,justifyContent:'center',fontSize:11,padding:'6px 8px' }}><Eye size={11}/>View</button>
                        <button onClick={()=>banUser(u._id)} style={{ flex:1,justifyContent:'center',fontSize:11,padding:'6px 8px',display:'flex',alignItems:'center',background:u.banned?'rgba(52,211,153,0.07)':'rgba(251,146,60,0.07)',color:u.banned?'var(--green)':'var(--orange)',border:`1px solid ${u.banned?'rgba(52,211,153,0.14)':'rgba(251,146,60,0.14)'}`,borderRadius:'var(--r-md)',cursor:'pointer',transition:'all 0.15s' }}>
                          {u.banned?<CheckCircle size={11}/>:<Ban size={11}/>}
                        </button>
                        <button onClick={()=>delUser(u._id)} className="btn-danger" style={{ flex:1,justifyContent:'center',fontSize:11,padding:'6px 8px' }}><Trash2 size={11}/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )
        )}

      </div>
    </div>
  )
}