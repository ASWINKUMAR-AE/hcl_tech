# PathFinder AI — Setup & Installation Guide

## Prerequisites
1. **Node.js**: v18.0.0 or higher
2. **XAMPP**: Apache & MySQL Server running on `localhost:3306`

## Step-by-Step Launch

### 1. Database Setup
Start Apache and MySQL from XAMPP Control Panel.
*Note: The backend features auto-database creation and auto-seeding. You do NOT need to create tables manually.*

### 2. Backend Server Setup
```bash
cd backend
npm install
npm run dev
```
The server will connect to MySQL, create database `pathfinder_ai` automatically, execute table schemas, seed 30+ courses, 20+ skills, 15 projects, 10 assessments, and start listening on `http://localhost:5000`.

### 3. Frontend Web Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

## Demo Account Credentials
- **Email**: `demo@pathfinder.ai`
- **Password**: `Demo@123`
- Click **"Sign In as Demo Learner"** on the login page for instant access.
