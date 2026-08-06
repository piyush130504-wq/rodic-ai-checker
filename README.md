# RODIC × NASSCOM 

Welcome to the RODIC × NASSCOM collaboration web portal. This application serves as the digital front door for infrastructure innovation, offering a premium user experience with dynamic animations, robust form handling, and a serverless backend.

## 🏗 Architecture Overview

The project is built using a modern, scalable stack designed for edge-network deployment:
- **Frontend**: React.js with Framer Motion for premium animations.
- **Styling**: Tailwind CSS, configured for custom Rodic brand guidelines.
- **Backend**: Express.js (optimized as Vercel Serverless Functions).
- **Database**: MongoDB (Mongoose ODM).

## 🚀 Getting Started

The easiest way to run the full stack (React + Backend) locally is by utilizing the Vercel CLI, which perfectly emulates the production environment on your machine.

### Prerequisites
1. Node.js (v18+)
2. Vercel CLI (`npm i -g vercel`)
3. A MongoDB database (e.g., MongoDB Atlas)

### Local Development
1. Clone or extract this repository.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```env
   MONGO_URL=your_mongodb_connection_string
   DB_NAME=nasscom
   # Use your real domain(s) in production instead of '*'
   CORS_ORIGINS=*
   # Long random secret required to call GET /api/registrations (send as the x-admin-key header)
   ADMIN_API_KEY=change_me_to_a_long_random_value
   # Keep this server-side only; never place it in a REACT_APP_ variable.
   OPENAI_API_KEY=your_openai_api_key
   # Optional: defaults to gpt-4.1-mini
   AI_MODEL=gpt-4.1-mini
   ```
4. Start the local Vercel development server:
   ```bash
   npx vercel dev
   ```
   This will simultaneously spin up your React frontend and your serverless backend APIs!

---
*For full deployment instructions to production, please see [DEPLOYMENT.md](./DEPLOYMENT.md).*
