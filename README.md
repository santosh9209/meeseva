# CARD Requisition App (Vercel + Postgres)

This application has been structured as a Full-Stack Monorepo ready for deployment on **Vercel** with **Vercel Postgres**.

## 🚀 How to Deploy to Vercel

The application is completely configured with a `vercel.json` file. Follow these steps to deploy to Vercel through GitHub.

### Step 1: Push to GitHub
1. Create a new repository on your GitHub account (do not initialize it with a README).
2. Open a terminal in this project's root folder (`card-requisition-app`).
3. Run the following commands to push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Import into Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New... -> Project**.
3. Locate your newly pushed GitHub repository and click **Import**.
4. Important: Leave the "Framework Preset" as **Other** and do not change the Root Directory. Vercel will automatically read the `vercel.json` file.
5. Click **Deploy**. (The initial build will succeed but the backend will not work until you attach a database).

### Step 3: Add Vercel Postgres Database
1. Once deployed, click **Continue to Dashboard** on Vercel.
2. Go to the **Storage** tab for your project.
3. Click **Create Database** and select **Postgres**.
4. Accept the defaults, create the database, and attach it to your Vercel project's `Production`, `Preview`, and `Development` environments.
5. Vercel will automatically inject the `POSTGRES_URL` into your environment variables.
6. Trigger a **Redeploy** of your project (Deployments -> Redeploy).

On the first successful API call to the new deployment, the server will automatically execute the table creation script using your new Vercel Postgres database!

---

## 💻 Running Locally (Development)

To run this locally, you must first connect your project to Vercel so your local environment receives the Postgres URL.

1. Ensure you have the Vercel CLI installed: `npm i -g vercel`
2. Run `vercel link` to link your local folder to your Vercel project.
3. Run `vercel env pull .env.local` to download the Postgres database credentials.
4. Rename `.env.local` to `server/.env`.
5. Start the backend: `cd server && npm start`
6. Start the frontend: `cd client && npm run dev`
