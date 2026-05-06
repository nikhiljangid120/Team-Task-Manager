# Ethara.AI Team Task Manager

Hi there! This is my submission for the Ethara.AI Full-Stack assessment. I built a Team Task Manager that helps teams organize projects, assign tasks, and track progress with role-based access.

## What it does
- **Admins** can create new projects and assign tasks to different team members.
- **Members** can log in, view only their assigned tasks, and update their statuses (Pending -> In Progress -> Completed).
- **Dashboard** gives a quick real-time overview of the team's total, pending, and overdue tasks.

## Tech Stack
- **Framework:** Next.js (App Router) for both the React frontend and the REST API backend.
- **Database:** MongoDB with Mongoose for schema validation.
- **Styling:** Vanilla CSS with a focus on modern dark-mode aesthetics and glassmorphism.
- **Security:** Custom JWT authentication using `httpOnly` cookies.

## Running Locally
1. `npm install`
2. Create a `.env.local` file using the variables shown in `.env.example`.
3. Add your `MONGODB_URI` and a random string for `JWT_SECRET`.
4. Run `npm run dev` and go to `http://localhost:3000`.

Thanks for reviewing my code!
