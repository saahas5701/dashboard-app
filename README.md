# Full-Stack Dashboard App

A production-ready full-stack dashboard application for managing projects and user profiles.

## Tech Stack

**Backend**
- Node.js + Express — REST API server
- PostgreSQL — relational database
- JWT (jsonwebtoken) — stateless authentication
- bcryptjs — password hashing
- dotenv — environment variable management

**Frontend**
- React.js 18 — UI library
- React Router v6 — client-side routing
- Axios — HTTP client
- Context API — global auth state management

---

## Features

- User registration and login with JWT authentication
- Protected routes — unauthenticated users redirected to login
- Dashboard with live project statistics
- Full CRUD for projects (create, edit, delete, list)
- User profile page with editable name and bio
- Responsive design — works on desktop and mobile
- Clean, minimal UI with status badges and modal forms

---

## Project Structure

```
dashboard-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js     # register, login, profile
│   │   │   └── projectController.js  # CRUD + stats
│   │   ├── middleware/
│   │   │   └── auth.js               # JWT verification middleware
│   │   ├── routes/
│   │   │   ├── auth.js               # /api/auth routes
│   │   │   └── projects.js           # /api/projects routes
│   │   ├── db/
│   │   │   └── index.js              # PostgreSQL pool + table init
│   │   └── index.js                  # Express server entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.js            # Navigation sidebar
    │   │   └── ProtectedRoute.js     # Auth guard component
    │   ├── context/
    │   │   └── AuthContext.js        # Global auth state
    │   ├── pages/
    │   │   ├── Landing.js            # Public landing page
    │   │   ├── Login.js              # Login form
    │   │   ├── Register.js           # Register form
    │   │   ├── Dashboard.js          # Stats + recent projects
    │   │   ├── Projects.js           # Project list + CRUD
    │   │   └── Profile.js            # User profile editor
    │   ├── App.js                    # Routes
    │   ├── index.js                  # React entry
    │   └── index.css                 # Global styles
    └── package.json
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL running locally

### 1. Clone the repository
```bash
git clone https://github.com/saahas5701/dashboard-app.git
cd dashboard-app
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your values:
```
PORT=5000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/dashboard_db
JWT_SECRET=pick_any_long_random_string_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

Create the PostgreSQL database:
```bash
psql -U postgres -c "CREATE DATABASE dashboard_db;"
```

Start the backend:
```bash
npm run dev
```

The server will auto-create the `users` and `projects` tables on first run.

### 3. Set up the Frontend

```bash
cd ../frontend
npm install
npm start
```

React app opens at `http://localhost:3000`

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login, get token |
| GET | /api/auth/profile | Yes | Get current user |
| PUT | /api/auth/profile | Yes | Update name/bio |

### Projects
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/projects | Yes | Get all projects |
| GET | /api/projects/stats | Yes | Dashboard stats |
| GET | /api/projects/:id | Yes | Get single project |
| POST | /api/projects | Yes | Create project |
| PUT | /api/projects/:id | Yes | Update project |
| DELETE | /api/projects/:id | Yes | Delete project |

All protected endpoints require `Authorization: Bearer <token>` header.

---

## Design Decisions & Assumptions

**Why JWT over sessions?**
JWT is stateless — the server doesn't need to store session data. Each request carries its own proof of identity in the token. This scales better and is simpler for a REST API consumed by a React frontend.

**Why PostgreSQL over MongoDB?**
Projects have a clear relationship to users (foreign key). Relational data fits PostgreSQL naturally. Also practiced EXPLAIN ANALYZE for query optimization in previous work.

**Why Context API over Redux?**
For an app of this size, Context API + useState is sufficient. Redux adds complexity that isn't justified here. The auth state (user, login, logout) is the only global state needed.

***Why Partialupdates?**
The API allows users to update only the fields they want to change without sending the entire object again. Existing values are preserved when a field is not provided.

**Assumptions**
- One user can have many projects (1:N relationship)
- Projects are private to each user — no sharing
- Email cannot be changed after registration
- Passwords stored as bcrypt hashes, never plain text
- JWT expires in 7 days — user must log in again after expiry

---

## Demo Video
A complete walkthrough of the application is available below:

Loom Video: https://www.loom.com/share/d3c06dd8e602438abee0ee1bb1548b23

The demo covers:
- User Registration
- User Login
- Dashboard Overview
- Project Creation
- Project Management (Create, Edit, Delete)
- Profile Updates
- Protected Routes & Authentication

## Known Limitations

- No email verification on registration
- No password reset flow
- No image upload for avatar (uses initials)
- No pagination on projects list (works fine up to ~100 projects)
- Mobile sidebar not yet togglable

These are known tradeoffs made to meet the project deadline. All are straightforward to add.

---

## Author

Saahas Reddy Koppula
