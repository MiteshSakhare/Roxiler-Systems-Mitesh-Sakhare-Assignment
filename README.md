# RateIT - Store Rating Platform

RateIT is a modern, full-stack web application designed for users to discover stores and submit ratings. Built with a robust **NestJS** backend, **PostgreSQL** database, and a highly responsive, glassmorphism-styled **React** frontend.

<img width="1917" height="865" alt="image" src="https://github.com/user-attachments/assets/edb3467e-c56d-46b7-a4b3-7ebf9b821464" />

<img width="1917" height="865" alt="image" src="https://github.com/user-attachments/assets/89b85bcc-30d0-4b84-b8bf-6618be458326" />

<img width="1917" height="862" alt="image" src="https://github.com/user-attachments/assets/50294459-87cb-450f-aaad-fe3371542f42" />

<img width="1917" height="862" alt="image" src="https://github.com/user-attachments/assets/3fdc5217-7cb9-4387-8100-897197af49de" />

## 🌟 Key Features & User Roles

The platform uses Role-Based Access Control (RBAC) with three primary roles:

### 1. System Administrator (Admin)
- **Comprehensive Dashboard**: Real-time metrics including total users, stores, platform average rating, and recent signups.
- **User Management**: Add and view all platform users (Admins, Store Owners, Normal Users).
- **Store Management**: Add and view stores. Link new stores directly to store owner accounts.
- **Advanced Filtering**: Quickly filter and sort users and stores.

### 2. Store Owner
- **Store Dashboard**: A personalized overview of their assigned store.
- **Rating Insights**: View their store's average rating and read all user feedback and ratings.
- **Profile Management**: Update personal profile details and change passwords.

### 3. User
- **Discover Stores**: Browse all registered stores on the platform.
- **Search & Filter**: Find stores by name or address.
- **Submit Ratings**: Rate any store on a 1-5 star scale. Modify your previous ratings at any time.

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- TypeScript
- Tailwind CSS (Custom styling, modern glassmorphism)
- Framer Motion (Animations)
- Recharts (Data visualization)

**Backend**
- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- JWT Authentication

## 🚀 Getting Started (Step-by-Step Local Setup)

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (or Docker Desktop)
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/MiteshSakhare/Roxiler-Systems-Mitesh-Sakhare-Assignment.git
cd "Roxiler Systems Assignment"
```

### Step 2: Database Setup (Docker)
The quickest way to start the database is using Docker. Navigate to the backend directory and spin up the PostgreSQL container:
```bash
cd backend
docker-compose up -d
```
This automatically sets up a Postgres database on port `5432` matching the default `.env` credentials.

### Step 3: Backend Setup
Install dependencies and initialize the database schema:
```bash
# Assuming you are already in the /backend directory from Step 2
npm install
npm run typeorm -- schema:drop -d src/database/data-source.ts
npm run migration:run
npm run seed
```
*(Note: If you run into NPM version errors, we have already added a `.npmrc` file to bypass legacy peer dependency conflicts automatically!)*

Start the backend development server:
```bash
npm run start:dev
```
The backend will automatically kill any stale processes on port `3000` before starting up successfully!

### Step 4: Frontend Setup
Open a **new terminal window**, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

## 🌍 Deployment
Want to deploy this project for free on the public internet? Check out our step-by-step deployment guide:
👉 **[Read DEPLOY.md for Vercel & Render Setup](DEPLOY.md)**

## 📦 Database Seeding

To quickly test the application with realistic data, you can seed the database. The seed script creates 1 Admin, 7 Store Owners/Stores, and 20 Normal Users.

Run these commands from the `backend/` directory to reset the database and run the seed script:
```bash
npm run typeorm -- schema:drop -d src/database/data-source.ts
npm run migration:run
npm run seed
```

### Test Accounts
You can log in with any of the seeded accounts using the universal password: `Password@123`

- **Admin**: `admin@storerating.com`
- **Store Owner (Prada)**: `owner.prada@storerating.com`
- **Normal User**: `john.doe@storerating.com`

## 🐛 Troubleshooting

### `Error: connect ECONNREFUSED ::1:5432` or `127.0.0.1:5432`
If you encounter this error while running database migrations, seeds, or starting the backend server, it means your **PostgreSQL service is not running**.

**How to fix:**
- **Windows**: Press `Win + R`, type `services.msc`, find `postgresql-x64-15` (or similar), right-click, and select **Start**.
- **Docker**: If you are using a Docker container for your database, ensure the container is running (`docker-compose up -d` or start it via Docker Desktop).
- **Mac/Linux**: Restart the service using `brew services start postgresql` or `sudo systemctl start postgresql`.
