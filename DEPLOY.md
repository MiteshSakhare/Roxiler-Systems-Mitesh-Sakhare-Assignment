# Deployment Guide (Free Tier)

This guide will walk you through deploying the **RateIT** platform entirely for free using **Vercel** (for the Frontend) and **Render** (for the Backend API and PostgreSQL Database).

---

## Step 1: Set Up the Database (Render)

Render offers a free managed PostgreSQL database.

1. Create a free account on [Render](https://render.com/).
2. Click **New +** and select **PostgreSQL**.
3. Fill in a name for your database (e.g., `rateit-db`) and select the **Free** instance type.
4. Click **Create Database**.
5. Once created, scroll down to the **Connections** section and copy the **Internal Database URL** (it will look like `postgres://user:password@hostname/dbname`). 
6. Save this string; you will need it to connect your backend service!

---

## Step 2: Deploy the Backend (Render)

Now we will deploy the Node.js backend on Render and connect it to the database you just created.

1. Click **New +** and select **Web Service**.
2. Connect your GitHub account and select your repository.
3. Fill in the following details:
   - **Name**: `rateit-backend` (or whatever you prefer)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Instance Type**: `Free`
4. Click **Advanced** and add your Environment Variables:
   - `PORT`: `3000`
   - `JWT_SECRET`: `your_super_secret_jwt_key_here` (make up a strong random string)
   - `DATABASE_URL`: Paste the **Internal Database URL** you copied from your Render database in Step 1.
5. Click **Create Web Service**. 
6. Once deployed, Render will give you a live URL (e.g., `https://rateit-backend.onrender.com`). **Save this URL!**

> **Note on Migrations**: Once your backend web service is live, you need to run the database migrations and seed script. On your Render Web Service dashboard, click on the **Shell** tab and run:
> ```bash
> npm run migration:run
> npm run seed
> ```

---

## Step 3: Connect Frontend to the Live Backend

Before deploying the frontend, you need to tell it to talk to your new Render backend instead of `localhost:3000`.

1. In your frontend codebase locally, open `src/api/axiosClient.ts`.
2. Ensure the `baseURL` uses the environment variable:
   ```typescript
   const axiosClient = axios.create({
     baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
     headers: { 'Content-Type': 'application/json' },
   });
   ```
3. If you haven't already, commit and push this code to GitHub.

---

## Step 4: Deploy the Frontend (Vercel)

Vercel is the best platform for deploying React/Vite applications.

1. Create a free account on [Vercel](https://vercel.com/).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Open the **Environment Variables** section and add:
   - **Key**: `VITE_API_URL`
   - **Value**: Your Render Backend URL from Step 2 (e.g., `https://rateit-backend.onrender.com`)
6. Click **Deploy**.
7. Vercel will build your app and give you a live frontend URL!

---

## 🎉 You're Done!
Your application is now live on the internet completely for free. 
- Your users can access the platform via the **Vercel** URL.
- The frontend will securely talk to your **Render** API.
- The data is safely stored in your **Render** database.
