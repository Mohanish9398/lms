import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchCourse } from '../Services/API'
import { ArrowLeft, CheckCircle, PlayCircle, ChevronRight, Trophy, BookOpen, Clock, Check } from 'lucide-react'

function Player() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)

  const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail') || ''
  const progressKey = `courseProgress_${userEmail}`

  useEffect(() => {
    fetchCourse(id).then(data => {
      setCourse(data)
      if (data.lessons && data.lessons.length > 0) { setCurrentLesson(data.lessons[0]); setCurrentLessonIndex(0) }
    })
  }, [id])

  const getProgress = () => {
    const allProgress = JSON.parse(localStorage.getItem(progressKey) || '{}')
    return allProgress[id] || { completedLessons: [], overallComplete: false }
  }

  const isLessonCompleted = (lessonId) => getProgress().completedLessons?.includes(lessonId)
  const isCourseCompleted = () => getProgress().overallComplete === true

  const handleMarkLessonComplete = () => {
    const allProgress = JSON.parse(localStorage.getItem(progressKey) || '{}')
    const courseProgress = allProgress[id] || { completedLessons: [], overallComplete: false }
    const lessonId = currentLesson._id
    if (!courseProgress.completedLessons.includes(lessonId)) courseProgress.completedLessons.push(lessonId)
    if (courseProgress.completedLessons.length >= course.lessons.length) courseProgress.overallComplete = true
    allProgress[id] = courseProgress
    localStorage.setItem(progressKey, JSON.stringify(allProgress))
    setCourse({ ...course })
  }

  const handleMarkCourseComplete = () => {
    const allProgress = JSON.parse(localStorage.getItem(progressKey) || '{}')
    const courseProgress = allProgress[id] || { completedLessons: [], overallComplete: false }
    courseProgress.overallComplete = true
    if (course.lessons) courseProgress.completedLessons = course.lessons.map(l => l._id)
    allProgress[id] = courseProgress
    localStorage.setItem(progressKey, JSON.stringify(allProgress))
    setCourse({ ...course })
  }

  const getOverallProgress = () => {
    if (!course?.lessons?.length) return 0
    return Math.round((getProgress().completedLessons?.length / course.lessons.length) * 100)
  }

  if (!course) return <div className="text-center mt-5">Loading...</div>

  const hasLessons = course.lessons && course.lessons.length > 0
  const overallProgress = getOverallProgress()

  return (
    <div style={{ backgroundColor: '#81A6C6', minHeight: '100vh', padding: '20px' }}>
      <div className="container-fluid">

        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h4 style={{ color: '#F3E3D0', fontWeight: '800', margin: 0 }}>{course.title}</h4>
            <p style={{ color: '#F3E3D0', opacity: 0.8, margin: 0, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={13} /> {course.instructor} &nbsp;|&nbsp; {course.level}
            </p>
          </div>
          <button onClick={() => navigate('/Mycourses')} style={{ backgroundColor: '#1a1a2e', color: '#F3E3D0', border: 'none', borderRadius: '8px', padding: '8px 20px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> Back to My Courses
          </button>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#F3E3D0', fontWeight: '700', fontSize: '14px' }}>Overall Progress</span>
            <span style={{ color: '#F3E3D0', fontWeight: '700', fontSize: '14px' }}>{overallProgress}%</span>
          </div>
          <div style={{ height: '10px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${overallProgress}%`, backgroundColor: overallProgress === 100 ? '#27ae60' : '#f5a623', borderRadius: '50px', transition: 'width 0.4s ease' }} />
          </div>
          {isCourseCompleted() && (
            <div style={{ marginTop: '10px', color: '#27ae60', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trophy size={16} /> Course Completed!
            </div>
          )}
        </div>

        <div className="row g-3">
          <div className="col-lg-8">
            <div style={{ backgroundColor: '#F3E3D0', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              {currentLesson && (
                <h5 style={{ color: '#1a1a2e', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PlayCircle size={20} color="#f5a623" /> {currentLesson.title}
                </h5>
              )}
              <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
                <iframe width="100%" height="420" src={currentLesson ? currentLesson.video : course.video} title={currentLesson ? currentLesson.title : course.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>

              {currentLesson && (
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {isLessonCompleted(currentLesson._id) ? (
                    <div style={{ backgroundColor: '#d4edda', border: '1px solid #27ae60', borderRadius: '8px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle size={16} color="#27ae60" />
                      <span style={{ color: '#27ae60', fontWeight: '700', fontSize: '14px' }}>Lesson Completed!</span>
                    </div>
                  ) : (
                    <button onClick={handleMarkLessonComplete} style={{ backgroundColor: '#27ae60', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Check size={16} /> Mark Lesson Complete
                    </button>
                  )}
                  {currentLessonIndex < course.lessons.length - 1 && (
                    <button onClick={() => { const next = course.lessons[currentLessonIndex + 1]; setCurrentLesson(next); setCurrentLessonIndex(currentLessonIndex + 1) }} style={{ backgroundColor: '#1a1a2e', color: '#F3E3D0', border: 'none', borderRadius: '8px', padding: '10px 24px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Next Lesson <ChevronRight size={16} />
                    </button>
                  )}
                  {!isCourseCompleted() && overallProgress > 0 && (
                    <button onClick={handleMarkCourseComplete} style={{ backgroundColor: '#f5a623', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Trophy size={16} /> Mark Course Complete
                    </button>
                  )}
                </div>
              )}

              {!hasLessons && (
                <div>
                  {isCourseCompleted() ? (
                    <div style={{ backgroundColor: '#d4edda', border: '1px solid #27ae60', borderRadius: '10px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Trophy size={20} color="#27ae60" />
                      <div>
                        <div style={{ fontWeight: '700', color: '#27ae60' }}>Course Completed!</div>
                        <div style={{ fontSize: '13px', color: '#555' }}>Great job! This course is marked as complete.</div>
                      </div>
                    </div>
                  ) : (
                    <button onClick={handleMarkCourseComplete} style={{ backgroundColor: '#27ae60', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Check size={16} /> Mark as Complete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {hasLessons && (
            <div className="col-lg-4">
              <div style={{ backgroundColor: '#F3E3D0', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxHeight: '600px', overflowY: 'auto' }}>
                <h5 style={{ color: '#1a1a2e', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={18} /> Course Lessons
                  <span style={{ fontSize: '13px', fontWeight: '500', color: '#666', marginLeft: '4px' }}>
                    ({getProgress().completedLessons?.length || 0}/{course.lessons.length} done)
                  </span>
                </h5>
                {course.lessons.map((lesson, index) => {
                  const completed = isLessonCompleted(lesson._id)
                  const isActive = currentLesson?._id === lesson._id
                  return (
                    <div key={lesson._id} onClick={() => { setCurrentLesson(lesson); setCurrentLessonIndex(index) }}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', cursor: 'pointer', marginBottom: '8px', backgroundColor: isActive ? '#1a1a2e' : completed ? '#d4edda' : '#fff', border: isActive ? '2px solid #f5a623' : '2px solid transparent', transition: 'all 0.2s' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, backgroundColor: completed ? '#27ae60' : isActive ? '#f5a623' : '#81A6C6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '13px' }}>
                        {completed ? <Check size={14} /> : index + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: '600', fontSize: '13px', color: isActive ? '#F3E3D0' : '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lesson.title}</p>
                        {lesson.duration && (
                          <p style={{ margin: 0, fontSize: '11px', color: isActive ? '#81A6C6' : '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={10} /> {lesson.duration}
                          </p>
                        )}
                      </div>
                      {completed && !isActive && <CheckCircle size={16} color="#27ae60" />}
                      {isActive && <PlayCircle size={16} color="#f5a623" />}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Player