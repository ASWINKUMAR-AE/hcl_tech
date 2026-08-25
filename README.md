# PathFinder AI

### AI-Powered Personalized Learning Path Recommender

> *"Learn what matters. In the right order."*

PathFinder AI is a production-quality full-stack prototype designed to provide intelligent, adaptive, and personalized learning roadmaps based on learner goals, existing skills, and prerequisite dependency graphs.

---

## 🌟 Key Features

1. **Automatic Database Management**: Connects to MySQL (XAMPP), automatically creates the `pathfinder_ai` database, generates 18 relational schema tables, and auto-seeds initial data on launch.
2. **AI Profiling Engine**: Analyzes natural language career goals (e.g., *"I want to become a Full Stack Web Developer specializing in React and Node.js"*), extracts target skills, missing prerequisites, and timelines.
3. **Skill Graph Engine**: Directed Acyclic Graph (DAG) for skill prerequisite relationships (e.g. JavaScript ➔ React, JavaScript ➔ Node.js ➔ Express). Prevents recommending advanced topics prematurely.
4. **Hybrid Recommendation Engine**: Combines rule-based logic, database skills data, skill graph topological sorting, vector search abstraction layer, and Hosit AI reasoning to compute confidence scores (0-100).
5. **Context-Aware Floating AI Assistant**: Persistent orb chat assistant pre-loaded with learner state (career goal, active step, mastered vs missing skills).
6. **Adaptive Learning**: Updates skill scores, unlocks downstream milestones, and adjusts recommendations when users complete resources or submit feedback.
7. **Ultra-Modern SaaS UI**: Built with React, Vite, Tailwind CSS, Framer Motion, Recharts, and Lucide React icons.

---

## 🚀 Quick Start Instructions

### Prerequisites
- Node.js (v18+)
- XAMPP with Apache & MySQL running on port 3306

### 1. Start Backend Server
```bash
cd backend
npm install
npm run dev
```
*Backend will run on `http://localhost:5000` and auto-initialize the database.*

### 2. Start Frontend Application
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
*Frontend will launch on `http://localhost:5173`.*

---

## 🔑 Demo Account Credentials
- **Email**: `demo@pathfinder.ai`
- **Password**: `Demo@123`
- Click **"Sign In as Demo Learner"** on the login page for immediate demo evaluation.

---

## 🏗️ Project Architecture

```
pathfinder-ai/
├── backend/
│   ├── src/
│   │   ├── config/ (db.js auto-creation & env.js)
│   │   ├── controllers/ (auth, profile, skill, course, path, ai, admin)
│   │   ├── middleware/ (auth JWT, errorHandler)
│   │   ├── routes/ (REST API endpoints)
│   │   ├── services/ (aiService, skillGraphService, recommendationService, vectorSearchService)
│   │   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/ (Navbar, LearningRoadmap, RoadmapNode, AIOrb, SkillChart, SkillGapCard)
│   │   ├── context/ (AuthContext, PathContext)
│   │   ├── pages/ (LandingPage, LoginPage, OnboardingPage, RoadmapPage, DashboardPage, AdminPage)
│   │   └── services/ (Axios API client)
├── database/
│   ├── schema.sql
│   └── seed.sql
└── docs/
    ├── API.md
    ├── ARCHITECTURE.md
    └── SETUP.md
```
# hcl_tech
