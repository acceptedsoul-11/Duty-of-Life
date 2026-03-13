# Duty of Life

Duty of Life is a full-stack sustainability platform built to help people make climate-conscious choices, measure their impact, and stay engaged through community, storytelling, and CSR participation.

The idea behind the project is simple: sustainability becomes much easier to follow when users can see their footprint, improve habits with guidance, join meaningful challenges, share progress with others, and feel that their actions are adding up to something real. This project brings those pieces together into one connected experience.

## What The Product Does

Duty of Life supports two major kinds of users:

- `USER`: tracks habits, joins challenges, posts updates, reads and writes blogs, and improves their sustainability score
- `ADMIN`: manages CSR contests, verifies submissions, closes challenges, generates winners, and handles reward dispatch flow

The product is designed as a sustainability ecosystem rather than a single-purpose tool. It combines personal tracking, social participation, CSR operations, analytics, and educational content in one application.

## Main Features

### 1. Commute Carbon Tracking

Users can calculate travel-related emissions by entering:

- start location
- destination
- mode of transport
- distance in kilometers

The system estimates CO2 emissions using transport-based emission factors and also suggests a greener alternative where possible.

### 2. Sustainability Advisor

The advisor accepts habit inputs such as:

- daily travel distance
- electricity usage
- meat consumption

It returns:

- practical sustainability tips
- a reduction plan
- estimated CO2 savings

### 3. Tree Offset System

Users can log carbon offset actions through tree planting. The system estimates:

- required number of trees to offset emissions
- total CO2 offset
- cumulative tree contribution over time

### 4. Smart Sustainability Score

The app computes a sustainability score using signals such as:

- emissions
- tree offsets
- challenge participation
- CSR contribution
- social/community activity

The score feeds into recognition and leaderboard ranking.

### 5. Badge System

Users can unlock sustainability badges such as:

- Carbon Reducer
- Tree Guardian
- Earth Protector
- Climate Hero

### 6. Analytics Dashboard

The platform provides visual analytics for sustainability progress, including:

- weekly emissions trend
- transport breakdown
- overall score visibility

### 7. CSR Challenge Management

Admins can create detailed CSR contests with:

- title
- description
- category
- location
- CSR partner
- start and end dates
- proof requirements
- reward details
- rules
- participant limits

Users can submit proof for participation, while admins can verify entries, close challenges, and trigger winner selection and reward generation.

### 8. Reward Dispatch Flow

After challenge verification and closure, the system supports:

- winner generation
- reward creation
- dispatch status updates
- tracking number storage

### 9. Social Sustainability Hub

Users can share eco achievements through posts, and the social section also includes:

- a quick carbon footprint calculator
- a community feed
- social motivation through catchy calls to action

### 10. Leaderboard

Users are ranked by sustainability score to encourage positive competition and engagement.

### 11. Blog Writing And Reading

The blog section is now fully backend-driven. Users can:

- write blog posts
- publish them with title, summary, content, tags, and cover image
- read published blogs in a clean reading panel on the same page

This allows the project to serve not only as a tracker, but also as a sustainability knowledge-sharing platform.

## Tech Stack

### Frontend

- React
- Vite
- Material UI
- Framer Motion
- Recharts
- Axios

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication
- bcrypt password hashing

## Project Structure

`client/`

- React frontend
- UI components and pages
- API integration layer
- lazy-loaded route sections for better performance

`server/`

- Express backend
- database models
- protected API routes
- business logic for scoring, emissions, CSR, blogs, and social features

## Backend Data Models

The application currently uses these collections:

- `users`
- `activities`
- `treeoffsets`
- `posts`
- `challenges`
- `submissions`
- `rewarddispatches`
- `blogs`

## Authentication

Authentication is role-based and JWT-backed.

Supported roles:

- `USER`
- `ADMIN`

Passwords are hashed before storage, and protected endpoints require bearer-token authentication.

## Environment Setup

### Server

Create `server/.env` using `server/.env.example`.

Required values:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/duty_of_life
CLIENT_URL=http://localhost:5173
JWT_SECRET=change_me_securely
```

### Client

Create `client/.env` using `client/.env.example`.

Required values:

```env
VITE_API_URL=http://localhost:5000/api
```

## How To Run The Project

### 1. Start MongoDB

Make sure MongoDB is running locally.

### 2. Start the backend

```powershell
cd server
npm install
npm start
```

### 3. Start the frontend

```powershell
cd client
npm install
npm run dev
```

### 4. Open the app

Frontend:

`http://localhost:5173`

Backend health check:

`http://localhost:5000/api/health`

## Current Product Flow

### Public Flow

- users land on the homepage first
- login/register appears only when clicked

### User Flow

- register or login
- calculate commute emissions
- use sustainability advisor
- offset carbon through trees
- join CSR challenges
- post eco achievements
- read and write blogs
- climb the leaderboard

### Admin Flow

- login as admin
- create detailed CSR contests
- verify submissions
- close contests
- generate rewards
- dispatch rewards with tracking details

## Performance Improvements Included

To make the app feel lighter and more production-ready, the frontend includes:

- lazy-loaded major pages and components
- chunk splitting through Vite vendor chunking
- page-specific loading states

## Final Verification Performed

This project was checked before finalizing.

Verified successfully:

- frontend dev server responds
- backend health route responds
- frontend production build passes
- backend JavaScript syntax checks pass
- auth flow works
- emissions calculation works
- sustainability advisor endpoint works
- tree offset flow works
- blog create and blog read flow works
- CSR create, submit, verify, close, and reward generation work
- social post flow works
- leaderboard route works

## Database State

The database was reset after final verification, so the project is currently in a fresh state with no demo or leftover test records.

## Why This Project Matters

Duty of Life is built around the belief that sustainability tools should not feel dry, isolated, or intimidating. People stay engaged when they can measure progress, see results, learn from others, and feel part of something larger than themselves.

That is what this project tries to deliver: a platform where personal climate action, community participation, and CSR impact can live together in one meaningful product.
