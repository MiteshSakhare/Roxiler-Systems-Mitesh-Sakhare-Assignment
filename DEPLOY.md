# Deployment Guide

This guide will walk you through the process of deploying the frontend to **Vercel** and the backend to **Render**.

## 1. Backend Deployment on Render

Render is a great platform for hosting Node.js applications and PostgreSQL databases.

### Step 1: Create a PostgreSQL Database on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New > PostgreSQL**.
2. Fill in a name for your database (e.g., `rateit-db`).
3. Select your preferred region and choose the **Free** instance type.
4. Click **Create Database**.
5. Once created, copy the **Internal Database URL** (for the backend service on Render) and the **External Database URL** (if you need to connect from your local machine).

### Step 2: Deploy the NestJS Backend
1. In the Render Dashboard, click **New > Web Service**.
2. Connect your GitHub repository and select it.
3. Configure the web service:
   - **Name**: `rateit-backend` (or similar)
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm run start:prod`
4. Expand the **Advanced** section and add the following Environment Variables:
   - `PORT`: `3000`
   - `DB_HOST`: *(Extract the host from your Internal Database URL)*
   - `DB_PORT`: `5432`
   - `DB_USER`: *(Extract the username from the URL)*
   - `DB_PASSWORD`: *(Extract the password from the URL)*
   - `DB_NAME`: *(Extract the database name from the URL)*
   - `JWT_SECRET`: *(Create a strong random string)*
5. Click **Create Web Service**.
6. Wait for the deployment to finish. Once successful, note down the provided URL (e.g., `https://rateit-backend.onrender.com`).

*Note: After the first deployment, you may want to run your migrations and seeds. You can do this by opening the Render Shell for your Web Service and running `cd backend && npm run migration:run && npm run seed`.*

---

## 2. Frontend Deployment on Vercel

Vercel provides seamless deployment for Vite/React applications.

### Step 1: Prepare the Frontend
Ensure that your frontend is using the environment variable for the backend API URL. We have already updated the codebase to use `import.meta.env.VITE_API_URL` instead of hardcoded `localhost:3000`.

### Step 2: Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New > Project**.
2. Import your GitHub repository.
3. In the project configuration:
   - **Framework Preset**: Vercel should auto-detect **Vite**.
   - **Root Directory**: Click `Edit` and select `frontend`.
4. Expand the **Environment Variables** section and add:
   - **Name**: `VITE_API_URL`
   - **Value**: The URL of your deployed Render backend (e.g., `https://rateit-backend.onrender.com`).
5. Click **Deploy**.
6. Wait for the build to complete. Vercel will provide you with a live domain (e.g., `https://rateit-frontend.vercel.app`).

---

## Final Checks
- Open your Vercel frontend URL.
- Test logging in, registering, and browsing stores.
- Ensure that the frontend communicates successfully with the Render backend.

**Congratulations! Your application is now live.**
