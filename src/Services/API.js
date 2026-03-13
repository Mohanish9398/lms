const BASE_URL=process.env.REACT_APP_API_URL

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

export const signupUser = (name, email, password, securityQuestion, securityAnswer) =>
  fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, securityQuestion, securityAnswer })
  }).then(res => res.json())

export const getSecurityQuestion = (email) =>
  fetch(`${BASE_URL}/api/auth/forgot-password/question?email=${encodeURIComponent(email)}`).then(res => res.json())

export const verifySecurityAnswer = (email, securityAnswer) =>
  fetch(`${BASE_URL}/api/auth/forgot-password/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, securityAnswer })
  }).then(res => res.json())

export const resetPasswordWithAnswer = (userId, newPassword) =>
  fetch(`${BASE_URL}/api/auth/forgot-password/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, newPassword })
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