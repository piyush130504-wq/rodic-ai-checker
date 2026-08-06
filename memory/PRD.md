# Rodic Innovations Website (current)

> Note: this file previously described an older "RODIC × NASSCOM AI Foundry
> case-competition" build (FastAPI backend, problem bank, prizes, judges,
> FAQ). That version has been superseded — the codebase now implements the
> Rodic Innovations marketing site described below. This file was rewritten
> on 2026-07-24 to match the actual code.

## What this is
A marketing site for Rodic Innovations (a division of Rodic Consultants)
promoting industry-academia research partnerships and a startup
collaboration track in Indian infrastructure/construction tech. It includes
an AI-powered "Startup Idea Checker" that gives founders a structured,
automated first read on their idea.

## Architecture
- **Frontend**: React SPA in `src/App.js`, styled by `src/rodic.css` and
  Tailwind config. Single page with section anchors: home, about, focus,
  ecosystem, routing (startup program), idea-checker, leaders, contact.
- **Backend**: Express app in `api/index.js`, deployed as a Vercel
  Serverless Function (mounted at `/api` via `vercel.json` rewrites).
- **Database**: MongoDB via Mongoose. Collections: `registrations`
  (contact form leads), `statuscheck` (misc status pings), `ideachecks`
  (startup idea submissions + AI evaluation).
- **AI evaluation**: `POST /api/idea-checks` calls OpenAI's Responses API
  with a strict JSON schema (`overall_score`, `verdict`, `summary`,
  `strengths`, `risks`, `next_steps`) and stores the result alongside the
  submission.

## Key endpoints
- `POST /api/registrations` — public contact form submission.
- `GET /api/registrations` — **admin-only**, requires `x-admin-key` header
  matching `ADMIN_API_KEY`. Returns stored contact PII.
- `POST /api/idea-checks` — public, rate-limited (5 requests / 15 min per
  client), runs the AI evaluation and stores the result.
- `POST/GET /api/status` — lightweight status-check records.

## Security notes (fixed 2026-07-24)
- `GET /api/registrations` was previously open to anyone; it now requires
  `ADMIN_API_KEY`.
- `POST /api/idea-checks` was previously unthrottled, allowing unlimited
  OpenAI API cost/abuse; it now has a per-client rate limit.
- Added `helmet` for baseline security headers.
- The AI prompt now wraps user-submitted idea text in explicit
  `<submission>` delimiters with an instruction to treat it as data, not
  instructions, to reduce prompt-injection risk.
- `bucket-policy.json` (public S3 `GetObject` policy) is not wired into the
  documented Vercel deployment path and its real-world usage is unconfirmed;
  see `DEPLOYMENT.md` for the caveat before applying it to any real bucket.

## Backlog / Next
- Consider adding CAPTCHA/honeypot on public forms in addition to rate
  limiting.
- Consider a unique index on `registrations.email` / `ideachecks.email` to
  reduce duplicate spam submissions.
- Admin view / CSV export of captured registrations behind the same admin
  auth used by `GET /api/registrations`.
- Confirm whether `bucket-policy.json` / the S3 bucket it references are
  still in use; remove if orphaned.
