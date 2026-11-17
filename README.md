# JobConnect – Full Stack Job Portal

A full-stack Job Portal web application that connects job seekers with recruiters. Job seekers can create profiles, search and apply for jobs, and track their applications. Recruiters can manage company profiles, post job openings, view applicants, and update application statuses.

## Technologies Used

**Frontend:** HTML, CSS, JavaScript, Vite

**Backend:** Node.js, Express.js

**Database:** MongoDB, Mongoose

**Authentication:** JWT (JSON Web Tokens)

## Features

### Job Seeker
- Register and log in.
- Create and manage profiles.
- Search and explore job openings.
- Apply for jobs.
- Track application status.

### Recruiter
- Register and log in.
- Create and manage company profiles.
- Post and manage job openings.
- View applicants.
- Update application statuses.

## Project Structure

- `frontend/` – Multi-page frontend, shared CSS, and JavaScript modules.
- `backend/` – Express API, Mongoose models, controllers, routes, authentication middleware, and token utilities.

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/PudiYogitha/JobConnect.git
   ```

2. Navigate to the backend:

   ```bash
   cd backend
   npm install
   ```

3. Copy `.env.example` to `.env` and configure your MongoDB connection and other environment variables.

4. Start the backend:

   ```bash
   npm run dev
   ```

5. Open another terminal and navigate to the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

6. Open the Vite URL displayed in your terminal.

## Default Development URLs

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## Contributors

[PudiYogitha](https://github.com/PudiYogitha)

---

**JobConnect – Connecting Talent with Opportunities.**

