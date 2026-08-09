# RODIC × NASSCOM AI Checker

An AI-powered startup idea evaluation platform built for the RODIC × NASSCOM
infrastructure innovation initiative. Founders submit a startup idea and
receive a structured, AI-generated readiness review in seconds, while
administrators get a protected way to review registrations and enquiries.

## 🚀 What I Built

I designed and developed the full-stack application, including:

- The AI idea-checker workflow: form submission → prompt construction →
  structured evaluation → persisted result → rendered feedback
- The evaluation prompt and JSON output contract for the LLM
- REST APIs for idea checks, registrations, and status checks
- Rate limiting and input validation to protect the AI endpoint from abuse
- Admin-key-gated access to registration data (PII)
- MongoDB-backed persistence with Mongoose schemas
- A serverless Express backend deployed as Vercel Functions
- A responsive, animated React frontend (Framer Motion, Tailwind)

## 🧠 AI Evaluation

Submitting the idea-checker form sends the founder's input to the backend,
which calls the **Google Gemini API** (`@google/genai`) to screen the idea
and returns a strict JSON object:

```json
{
  "overall_score": 85,
  "verdict": "Promising",
  "summary": "...",
  "strengths": ["..."],
  "risks": ["..."],
  "next_steps": ["..."]
}
```

`verdict` is constrained to one of `Promising`, `Needs refinement`, or
`Early concept`. The result is rendered directly in the UI as a readiness
score out of 100, a verdict badge, a summary, and three lists (strengths,
open questions, next steps), and is also saved to MongoDB alongside the
original submission.

**Prompt design:** the system prompt frames the model as an impartial
early-stage evaluator scoped to Indian infrastructure/construction-tech,
explicitly states the output is a preliminary screening (not investment,
legal, or regulatory advice), and wraps the user's submission in
`<submission>` tags with an explicit instruction to treat that content as
data to evaluate — not as instructions to follow. This mitigates prompt
injection from submitted idea text.

The model is configurable via environment variables without touching code:

```env
GEMINI_API_KEY=your_gemini_api_key
AI_MODEL=gemini-3.6-flash
```

**Abuse protection:** the idea-check endpoint is rate-limited to 5
submissions per client per 15 minutes (separate from the general form
limiter at 20/15 min), since each submission triggers a paid LLM call.
Input is also validated server-side (email format, idea length between 80
and 6,000 characters) before it reaches the model.

## 🏗 Architecture

```text
                    ┌─────────────────────┐
                    │     React Client    │
                    │ Tailwind + Framer   │
                    │      Motion         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Vercel Serverless  │
                    │   API / Express     │
                    │ (rate limiting,     │
                    │  validation, auth)  │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
       ┌─────────────────┐          ┌─────────────────┐
       │    MongoDB      │          │  Google Gemini  │
       │ Registrations / │          │   AI Evaluation │
       │  Idea Checks    │          │                 │
       └─────────────────┘          └─────────────────┘
```

## 🛠 Tech Stack

**Frontend:** React 19, Tailwind CSS, Framer Motion, React Router
**Backend:** Node.js, Express, Vercel Serverless Functions
**Database:** MongoDB, Mongoose
**AI:** Google Gemini (`@google/genai`)
**Security/Infra:** Helmet, express-rate-limit, CORS allowlisting

## 🔐 Security

- API credentials (`GEMINI_API_KEY`) stay server-side and are never exposed
  to the frontend.
- `GET /api/registrations` — which returns contact PII (name, email,
  phone, organization, message) — is protected by an `ADMIN_API_KEY`
  checked against an `x-admin-key` header. If the key isn't configured
  server-side, the endpoint is disabled rather than left open.
- `CORS_ORIGINS` should be restricted to production domain(s); `*` is for
  local development only.
- Helmet sets standard security headers; both public write endpoints
  (registrations, idea checks) are rate-limited per client.

## ⚙️ Running Locally

### Prerequisites

- Node.js 18+
- Vercel CLI
- A MongoDB database (e.g. MongoDB Atlas)

### Installation

```bash
npm install
```

Create a `.env` file in the project root:

```env
MONGO_URL=your_mongodb_connection_string
DB_NAME=nasscom
CORS_ORIGINS=*
ADMIN_API_KEY=your_secure_admin_key
GEMINI_API_KEY=your_gemini_api_key
AI_MODEL=gemini-3.6-flash
```

Start the application (this runs the React frontend and the serverless
Express backend together, emulating production):

```bash
npx vercel dev
```

> Running `npm start` alone only starts the React frontend — API calls
> (including the idea checker) will fail without the backend running via
> the Vercel CLI.

## 📌 Engineering Highlights

- Designed an LLM-backed feature with a strict, schema-shaped JSON output
  contract rather than free-form text, so the frontend can render results
  deterministically.
- Treated user-submitted idea text as untrusted input to the model and
  scoped the prompt to reduce prompt-injection risk.
- Rate-limited and validated the AI endpoint separately from other public
  endpoints, since it's the one that costs money per request.
- Kept AI credentials and admin secrets server-side only, with the admin
  endpoint failing closed if misconfigured.
- Built the backend as Vercel Serverless Functions with a single Express
  app exported for serverless execution.

## 📄 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
instructions.
