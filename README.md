# 🚀 CareerPilot AI

> AI-Powered Career Preparation Platform — Resume Analysis, Interview Prep, Career Roadmaps

![CareerPilot AI](https://img.shields.io/badge/CareerPilot-AI%20Powered-6366F1?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss)

---

## ✨ Features

- 📄 **AI Resume Analyzer** — ATS score, skill gaps, keyword detection, improvement suggestions
- 💻 **Technical Interview Generator** — Role-specific questions with difficulty tags and answers
- 🤝 **HR Interview Coach** — STAR-method behavioral answers with insider tips
- 🗺️ **Career Roadmap Generator** — Personalized learning plans, resources, milestones
- 📊 **Progress Dashboard** — Charts, activity history, score trends
- 🔐 **JWT Authentication** — Secure login/register with protected routes

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite, Tailwind CSS v4, Framer Motion, Recharts |
| Backend | Node.js, Express.js, MongoDB Atlas, Mongoose |
| AI | Groq API (Llama 3 70B) |
| Auth | JWT + bcryptjs |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend** — copy `backend/.env.example` to `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/careerpilot
JWT_SECRET=your_secret_key_here
GROQ_API_KEY=gsk_your_groq_key_here
NODE_ENV=development
```

**Frontend** — copy `frontend/.env.example` to `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
careerpilot/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, upload, errors
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Groq AI service
│   ├── uploads/         # Temp PDF storage
│   └── server.js
│
└── frontend/
    └── src/
        ├── context/     # AuthContext
        ├── layouts/     # DashboardLayout
        ├── pages/       # All pages
        ├── routes/      # ProtectedRoute
        ├── services/    # API calls
        └── main.jsx
```

---

## 🌐 API Endpoints

```
POST   /api/auth/register      Register user
POST   /api/auth/login         Login
GET    /api/auth/profile       Get profile (protected)
PUT    /api/auth/profile       Update profile (protected)

POST   /api/resume/analyze     Analyze PDF resume (protected)
GET    /api/resume/history     Get analysis history (protected)

POST   /api/interview/generate Generate technical questions (protected)
GET    /api/interview/history  Get session history (protected)

POST   /api/hr/generate        Generate HR questions (protected)
GET    /api/hr/history         Get HR history (protected)

POST   /api/roadmap/generate   Generate career roadmap (protected)
GET    /api/roadmap/history    Get roadmap history (protected)

GET    /api/dashboard/stats    Dashboard analytics (protected)
```

---

## ☁️ Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Push to GitHub, import in Vercel
# Set environment variable: VITE_API_URL=https://your-backend.onrender.com/api
```

### Backend → Render
1. Push `backend/` folder to GitHub
2. Create new Web Service on Render
3. Set Build Command: `npm install`
4. Set Start Command: `npm start`
5. Add all `.env` variables in Render dashboard

### Database → MongoDB Atlas
1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Add your Render server IP to Network Access (or use `0.0.0.0/0`)
3. Copy connection string to `MONGODB_URI`

---

## 🔑 Getting a Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for free
3. Create an API key
4. Add to `.env` as `GROQ_API_KEY`

Groq offers free tier with generous rate limits for Llama 3 70B.

---

## 📸 Color Palette

| Color | Hex |
|-------|-----|
| Background | `#0F172A` |
| Primary | `#6366F1` |
| Secondary | `#8B5CF6` |
| Accent | `#06B6D4` |
| Success | `#22C55E` |
| Warning | `#F59E0B` |
| Error | `#EF4444` |

---

## 📝 License

MIT © 2026 CareerPilot AI

---

**Built with ❤️ for ambitious job seekers. Star ⭐ if this helps your career!**
