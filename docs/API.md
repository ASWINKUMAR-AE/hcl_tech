# PathFinder AI — REST API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Header
Protected routes require JWT Bearer header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Endpoints

### `POST /auth/register`
Creates a new learner or admin account.
- **Body**: `{ "name": "...", "email": "...", "password": "..." }`
- **Response**: `{ "success": true, "data": { "token": "...", "user": {} } }`

### `POST /auth/login`
Logs in a user or demo learner (`demo@pathfinder.ai` / `Demo@123`).
- **Body**: `{ "email": "demo@pathfinder.ai", "password": "Demo@123" }`
- **Response**: `{ "success": true, "data": { "token": "...", "user": {} } }`

### `GET /auth/me`
Retrieves current authenticated user & profile info.

---

## 2. Learner Profile & Skills

### `GET /profile`
Retrieves learner profile details, experience level, weekly hours, and goals.

### `POST /profile`
Creates or updates learner profile, known skills, and triggers skill-gap re-analysis.

### `GET /skills/profile`
Retrieves learner's skill proficiencies (0-100 scale).

---

## 3. Personalized Learning Paths & Recommendations

### `POST /learning-paths/generate`
Generates an AI-explained personalized learning roadmap based on user goal & missing prerequisites.
- **Body**: `{ "goal": "Full Stack Web Developer specializing in React and Node.js" }`

### `GET /learning-paths`
Retrieves active learning path with step sequence and completion states.

### `PUT /learning-paths/steps/:id/progress`
Updates step status (`completed`, `in_progress`, `available`) and adjusts user proficiency score.

### `GET /recommendations`
Returns top scored resource recommendations ranked by hybrid scoring formula.

### `POST /recommendations/:id/feedback`
Submits user feedback (`useful`, `not_useful`, `too_easy`, `too_hard`, `skipped`).

---

## 4. Context-Aware AI Endpoints

### `POST /ai/chat`
Conversational AI assistant. Automatically injects active milestone, mastered skills, and missing gaps.
- **Body**: `{ "message": "Why am I learning Node.js before Express?" }`

### `POST /ai/analyze-goal`
Parses natural language goal into target skill badges & estimated completion timeline.
