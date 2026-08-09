# RODIC × NASSCOM Site Deployment Guide

This is the deployment guide for the Rodic Innovations AI Checker — an AI-powered platform that evaluates startup idea submissions using the OpenAI API. It's a full-stack React application with a Node.js (Express) backend connecting to MongoDB. The project has been restructured so it can be deployed on platforms like **Vercel** with zero configuration.

## Pre-requisites

1. You must have a MongoDB database running (e.g. MongoDB Atlas).
2. You need these environment variables:
   - `MONGO_URL`: Your MongoDB connection string.
   - `DB_NAME`: The name of the database (e.g. `nasscom`).
   - `CORS_ORIGINS`: Allowed origins. In production, set this to your actual site domain(s) (comma-separated), not `*` — the API stores contact PII and a wildcard origin lets any website's browser JS call it.
   - `ADMIN_API_KEY`: A long random secret. Required to read `GET /api/registrations` (send it as the `x-admin-key` header). Without this set, the endpoint is disabled rather than left open.
   - `OPENAI_API_KEY`: Server-side only, powers the AI idea checker. Never expose this as a `REACT_APP_` variable.
   - `AI_MODEL` (optional): defaults to `gpt-4.1-mini`.

## A note on `bucket-policy.json`

This repo includes an S3 bucket policy (`bucket-policy.json`) granting public `s3:GetObject` on `rodic-nasscom-site-piyush`. **It is not used by the Vercel deployment path documented here.** It was created for a prior/alternate static-hosting experiment and is not required for this app to run.

If you don't need S3 static hosting, delete this file — leaving an unused public-bucket policy in the repo root is more confusing than helpful. If you do keep it for reference, only apply it to a bucket that holds *exclusively* public static site assets (built JS/CSS/HTML/media) — never one that also stores backups, credentials, or other non-public files, since the policy makes every object in the bucket world-readable.

---

## Method 1: Deploying to Vercel (Recommended, ~2 minutes)

Vercel will automatically detect the React frontend at the root, and seamlessly deploy the backend inside the `api/` folder as Serverless Functions.

**Option A: Using GitHub (Easiest)**

1. Create a new repository on GitHub and push this entire folder to it.
2. Go to your [Vercel Dashboard](https://vercel.com/new).
3. Click **"Add New Project"** and import your newly created GitHub repository.
4. In the "Environment Variables" section, add `MONGO_URL`, `DB_NAME`, and `CORS_ORIGINS`.
5. Click **Deploy**. Vercel will build the frontend and set up the backend APIs automatically!

**Option B: Using Vercel CLI (Fastest)**

1. Open a terminal in this folder.
2. Run `npm install -g vercel` (if you don't have it).
3. Run `npx vercel`. Follow the prompts.
4. Run `npx vercel env add` to add your environment variables to your Vercel project.
5. Run `npx vercel --prod` to deploy to production.

---

## Method 2: Running Locally

Because this project uses Vercel Serverless Functions in the `api/` directory (which export the Express app rather than explicitly calling `app.listen()`), **the recommended way to run this locally is using the Vercel CLI**.

1. Open a terminal in this folder.
2. Run `npm install` to install all dependencies.
3. Make sure you have a `.env` file at the root containing your database credentials.
4. Start the local Vercel emulator:
   ```bash
   npx vercel dev
   ```
5. The Vercel CLI will automatically start your React app (typically on `http://localhost:3000`) and the serverless Express APIs seamlessly!

*(Note: If you run `npm start` instead of `npx vercel dev`, only the React frontend will run, and API calls will fail because the backend won't be running).*

---

## Important Note About "Drag-and-Drop"

Because this project contains a Node.js backend (in the `api/` folder) to handle database registrations, **you cannot use the drag-and-drop deployment method** on Vercel or Netlify. Drag-and-drop only works for simple static HTML sites. You must use the CLI or GitHub integrations so Vercel knows to spin up the serverless backend.
