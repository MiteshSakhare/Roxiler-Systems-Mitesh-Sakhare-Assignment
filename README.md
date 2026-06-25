# RateIT - Store Rating Platform

RateIT is a modern, full-stack web application designed for users to discover stores and submit ratings. Built with a robust **NestJS** backend, **PostgreSQL** database, and a highly responsive, glassmorphism-styled **React** frontend.

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

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL

### 1. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
npm run typeorm -- schema:drop -d src/database/data-source.ts
npm run migration:run
npm run seed
```
Configure your environment variables in `.env` (database connection details).
Start the backend development server:
```bash
npm run start:dev
```

### 2. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

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
