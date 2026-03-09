
export const courses = () => {
  return fetch('http://localhost:3001/courses')
    .then(response => response.json())
}