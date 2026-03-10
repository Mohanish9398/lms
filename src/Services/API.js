const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token')

export const fetchCourses = () =>
  fetch(`${BASE_URL}/api/courses`).then(res => res.json())

export const fetchCourse = (id) =>
  fetch(`${BASE_URL}/api/courses/${id}`).then(res => res.json())

export const loginUser = (email, password) =>
  fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(res => res.json())

export const signupUser = (name, email, password) =>
  fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  }).then(res => res.json())

export const enrollCourse = (courseId) =>
  fetch(`${BASE_URL}/api/courses/enroll/${courseId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` }
  }).then(res => res.json())

export const unenrollCourse = (courseId) =>
  fetch(`${BASE_URL}/api/courses/unenroll/${courseId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` }
  }).then(res => res.json())

export const fetchMyCourses = () =>
  fetch(`${BASE_URL}/api/courses/enrolled/my`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  }).then(res => res.json())