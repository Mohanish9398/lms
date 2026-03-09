# LMS Project - Learning Management System

A full-featured Learning Management System built with React.js that allows users to browse courses, enroll, and watch video content.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation & Setup](#installation--setup)
- [Features](#features)
- [Pages & Components](#pages--components)
- [Routing](#routing)
- [API & Data](#api--data)
- [State Management](#state-management)
- [Styling](#styling)
- [Dark Mode](#dark-mode)
- [Authentication Flow](#authentication-flow)
- [Enrollment Flow](#enrollment-flow)
- [Search Functionality](#search-functionality)
- [LocalStorage Usage](#localstorage-usage)

---

## Project Overview

The LMS Project is a React-based web application that replicates core features of a learning platform. Users can browse a catalog of 16 courses, view course details, enroll in courses, and watch embedded YouTube videos. The app includes login/signup functionality, dark mode toggle, course search, and persistent data using localStorage and a local JSON server.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend UI framework |
| React Router DOM | Client-side routing and navigation |
| Bootstrap 5 | CSS framework for responsive layout |
| JSON Server | Mock REST API backend |
| localStorage | Persist login state and enrolled courses |
| YouTube Embed | Video player via iframe |

---

## Folder Structure

```
LMS_PROJECT/
└── lms/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Coursecard.jsx
    │   │   └── Footer.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Coursedetails.jsx
    │   │   ├── Mycourses.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   └── Player.jsx
    │   ├── Services/
    │   │   └── API.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    ├── db.json
    └── package.json
```

---

## Installation & Setup

### Prerequisites
- Node.js installed
- npm installed

### Steps

**1. Clone or download the project**

**2. Install dependencies**
```bash
cd lms
npm install
```

**3. Install JSON Server globally**
```bash
npm install -g json-server
```

**4. Start JSON Server (mock backend)**
```bash
json-server --watch db.json --port 3001
```
This runs the API at `http://localhost:3001`

**5. Start the React app**
```bash
npm start
```
This runs the app at `http://localhost:3000`

> Both the React app and JSON Server must be running at the same time.

---

## Features

- Browse 16 courses with images, titles and Explore button
- View full course details (description, instructor, duration, level, price, topics)
- Enroll in courses and save them to My Courses
- Watch embedded YouTube videos after logging in
- Search courses by title from the navbar
- Login and Signup with form validation
- Logout functionality
- Unenroll from courses
- Dark Mode toggle that persists across sessions
- Sticky navbar on all pages
- Hover animations on course cards
- Responsive grid layout (4 columns on desktop, fewer on smaller screens)

---

## Pages & Components

### Pages

#### `Home.jsx`
- Fetches all courses from the JSON Server API on mount using `useEffect`
- Filters courses based on the search query in the URL (`?search=query`)
- Renders a responsive grid of `Coursecard` components
- Uses `useLocation` from React Router to read the search query parameter

#### `Coursedetails.jsx`
- Reads the course `id` from the URL using `useParams`
- Fetches the specific course from `http://localhost:3001/courses/:id`
- Displays full course info: image, title, instructor, duration, level, price, description, and topics list
- Has an **Enroll Now** button that saves the course to localStorage under `enrolledCourses`
- If already enrolled, button shows **Already Enrolled** and is disabled
- Has a **Back to Courses** button that navigates to Home

#### `Mycourses.jsx`
- Reads enrolled courses from localStorage on mount
- Displays enrolled courses in the same card grid as Home
- Each card has a **Start Learning** button and an **Unenroll** button
- **Start Learning** checks if user is logged in:
  - If not logged in → shows alert and redirects to Login page
  - If logged in → navigates to `/Player/:id`
- **Unenroll** removes the course from localStorage and updates the UI
- Shows a "You have not enrolled in any courses yet" message with a Browse Courses button when empty

#### `Login.jsx`
- Form with Email, Password, Remember Me checkbox, and Forgot Password link
- Validates that both fields are filled before submitting
- On successful submit: saves `isLoggedIn: true` and `userEmail` to localStorage, then redirects to Mycourses
- Shows error message if fields are empty
- Has a link to Signup page

#### `Signup.jsx`
- Form with Full Name, Email, Password, and Confirm Password fields
- Validates all fields are filled and passwords match
- On successful submit: redirects to Login page
- Shows error messages for validation failures
- Has a link to Login page

#### `Player.jsx`
- Reads course `id` from URL using `useParams`
- Fetches the course from the API to get the YouTube embed URL
- Embeds the YouTube video using an `<iframe>`
- Displays instructor, duration, and level below the video
- Has a **Back to My Courses** button

### Components

#### `Navbar.jsx`
- Sticky navbar that stays at the top on all pages
- Shows logo image imported from `src/`
- Navigation links: Home, Mycourses, Signup, Login (or Logout when logged in)
- Checks `isLoggedIn` from localStorage to show either Login/Signup or Logout button
- Logout clears `isLoggedIn` and `userEmail` from localStorage and redirects to Login
- Search bar with input and Search button
- On search submit: navigates to `/?search=<query>` which triggers filtering in Home.jsx
- Dark Mode toggle button that adds/removes `dark-mode` class on `document.body`
- Dark mode preference is saved to localStorage and restored on page load

#### `Coursecard.jsx`
- Reusable card component used in both Home and Mycourses pages
- Displays course image with fixed height and `objectFit: contain`
- Shows course title
- Explore button is a React Router `<Link>` that navigates to `/Coursedetails/:id`
- Has hover animation (lift up + shadow) via `.course-card` CSS class
- Explore button turns black on hover via `.btn.explore-btn:hover` CSS

#### `Footer.jsx`
- Simple footer displayed on all pages
- Dark background (`#1a1a2e`) with light text
- Shows contact email, phone number, and copyright year
- Copyright year is dynamically generated using `new Date().getFullYear()`

---

## Routing

Defined in `App.js` using `BrowserRouter`, `Routes`, and `Route` from React Router DOM.

| Path | Component | Description |
|---|---|---|
| `/` | `Home` | Course catalog with search |
| `/Coursedetails/:id` | `Coursedetails` | Individual course details |
| `/Mycourses` | `Mycourses` | User's enrolled courses |
| `/Login` | `Login` | Login page |
| `/Signup` | `Signup` | Signup page |
| `/Player/:id` | `Player` | YouTube video player |

The `:id` in routes is a dynamic parameter read with `useParams()` in the respective page component.

---

## API & Data

### JSON Server
The backend is a mock REST API powered by `json-server` running on port 3001.

### `Services/API.js`
```javascript
export const courses = () => {
  return fetch('http://localhost:3001/courses')
    .then(response => response.json())
}
```
This exports a `courses` function that fetches all courses from the JSON Server.

### `db.json` Structure
Each course object contains:

```json
{
  "id": 1,
  "title": "React Basics",
  "instructor": "John",
  "duration": "2 hours 25 minutes",
  "image": "https://cdn.worldvectorlogo.com/...",
  "description": "Course description text",
  "level": "Beginner",
  "price": "Free",
  "topics": ["Topic 1", "Topic 2", "Topic 3"],
  "video": "https://www.youtube.com/embed/VIDEO_ID"
}
```

The `video` field uses the YouTube embed URL format (`/embed/VIDEO_ID`) so it works directly inside an `<iframe>`.

### Fetching Single Course
In `Coursedetails.jsx` and `Player.jsx`, individual courses are fetched directly:
```javascript
fetch(`http://localhost:3001/courses/${id}`)
```
JSON Server automatically supports fetching a single item by id.

---

## State Management

The project uses React's built-in `useState` and `useEffect` hooks. There is no external state management library.

| State | Location | Purpose |
|---|---|---|
| `courses` | `Home.jsx` | All courses fetched from API |
| `filtered` | `Home.jsx` | Courses filtered by search query |
| `course` | `Coursedetails.jsx`, `Player.jsx` | Single course data |
| `enrolled` | `Coursedetails.jsx` | Whether user is already enrolled |
| `enrolledCourses` | `Mycourses.jsx` | List of enrolled courses from localStorage |
| `formData` | `Login.jsx`, `Signup.jsx` | Controlled form input values |
| `error` | `Login.jsx`, `Signup.jsx` | Validation error messages |
| `query` | `Navbar.jsx` | Search input value |
| `darkMode` | `Navbar.jsx` | Current dark mode state |

---

## Styling

### Color Palette
| Color | Hex | Used For |
|---|---|---|
| Steel Blue | `#81A6C6` | Page background, buttons, titles |
| Light Blue | `#AACDC` | Accent color |
| Warm Cream | `#F3E3D0` | Card backgrounds, text on dark |
| Warm Beige | `#D2C4B4` | Secondary buttons |
| Dark Navy | `#1a1a2e` | Footer background |

### Bootstrap Classes Used
- `container`, `row`, `col-md-3` — responsive grid
- `g-4` — gutters between cards
- `card`, `card-body`, `card-img-top` — card layout
- `h-100` — equal height cards in a row
- `d-flex`, `flex-column`, `justify-content-between` — card body layout
- `navbar`, `navbar-expand-lg`, `sticky-top` — sticky responsive navbar
- `btn`, `btn-primary`, `btn-outline-success` — buttons

### `App.css` Classes
- `.course-card` — transition for hover animation
- `.course-card:hover` — lift effect + gradient background
- `.btn.explore-btn` — custom Explore button styles
- `.btn.explore-btn:hover` — black background on hover
- `body.dark-mode` — all dark mode overrides

---

## Dark Mode

Dark mode is implemented by toggling a CSS class on `document.body`.

### How It Works
1. User clicks the Dark Mode button in the Navbar
2. `dark-mode` class is added to `document.body`
3. All `body.dark-mode` CSS rules in `App.css` apply globally
4. Preference is saved to localStorage as `darkMode: true`
5. On page reload, `useEffect` in Navbar reads localStorage and reapplies the class

### Dark Mode Colors
| Element | Dark Mode Color |
|---|---|
| Page background | `#2d2d2d` (charcoal) |
| Cards | `#3a3a3a` |
| Navbar/Footer | `#1f1f1f` |
| All text | `#F3E3D0` (warm cream) |
| Links | `#81A6C6` (steel blue) |

---

## Authentication Flow

Authentication is simulated using localStorage (no real backend auth).

1. User fills in Email and Password on Login page
2. On submit, `isLoggedIn: true` and `userEmail` are saved to localStorage
3. Navbar reads `isLoggedIn` and shows **Logout** instead of Login/Signup
4. Clicking Logout removes `isLoggedIn` and `userEmail` from localStorage
5. User is redirected to Login page

> Note: This is a frontend-only simulation. Any email/password combination will work since there is no real validation against a database.

---

## Enrollment Flow

1. User clicks **Explore** on any course card → navigates to `/Coursedetails/:id`
2. Course details are fetched from the API and displayed
3. User clicks **Enroll Now**
4. Course object is saved to localStorage under `enrolledCourses` array
5. User is redirected to `/Mycourses`
6. Mycourses reads `enrolledCourses` from localStorage and displays the cards
7. User clicks **Start Learning** → checks `isLoggedIn` in localStorage
   - Not logged in → alert + redirect to Login
   - Logged in → navigate to `/Player/:id`
8. Player fetches the course and embeds the YouTube video

---

## Search Functionality

1. User types in the search bar in the Navbar
2. On clicking Search, the app navigates to `/?search=<query>`
3. `Home.jsx` uses `useLocation` to read the URL search params
4. `useEffect` watches `location.search` and filters the courses array by title
5. Filtered results are displayed in the grid
6. If no results match, "No courses found." message is shown
7. Clearing the search and submitting shows all courses again

---

## LocalStorage Usage

| Key | Value | Set In | Read In |
|---|---|---|---|
| `isLoggedIn` | `"true"` | `Login.jsx` | `Navbar.jsx`, `Mycourses.jsx` |
| `userEmail` | email string | `Login.jsx` | — |
| `enrolledCourses` | JSON array of course objects | `Coursedetails.jsx` | `Mycourses.jsx` |
| `darkMode` | `"true"` or `"false"` | `Navbar.jsx` | `Navbar.jsx` |