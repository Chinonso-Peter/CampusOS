# CampusOS — Hackathon Build Plan for Replit AI

Paste everything below (including the instructions) directly into Replit's AI agent as your starting prompt.

---

## Instructions for the AI (paste as-is)

You are building "CampusOS," a hackathon MVP web app. Work through the phases below in order. Before writing any code, create a new GitHub repository named `campusos` (or `campusos-hackathon` if taken), initialize this Replit project with git, and push after each completed phase with a clear commit message. Use a simple, working tech stack — prioritize speed and demo-readiness over polish. Confirm each phase works before moving to the next. Ask me before making irreversible decisions (e.g., picking a paid API).

---

## Phase 0 — Setup (30 min)
- [ ] Create GitHub repo, connect it to this Replit, push initial commit
- [ ] Scaffold a full-stack app: React (or plain HTML/JS if faster) frontend + Node/Express or Python/Flask backend
- [ ] Set up a database (SQLite or Replit DB — no need for Postgres at hackathon scale)
- [ ] Create `.env` for API keys (OpenAI/Anthropic key for the chatbot + AI logic), add `.env` to `.gitignore`
- [ ] Basic auth: simple email/password or magic-link login (don't over-engineer — a mock login is fine for demo)

## Phase 1 — Core data model (30–45 min)
Define and implement these entities:
- **User** (name, school, basic profile)
- **MoodCheckIn** (user_id, date, mood_score 1–5, optional note)
- **Assignment** (user_id, title, due_date, status: pending/late/submitted)
- **FinanceEvent** (user_id, type: FAFSA_deadline/expense/income, date, amount optional)
- **WorkHours** (user_id, week, hours_worked)
- **SleepLog** (user_id, date, hours_slept)

Build simple CRUD endpoints/forms for each — this is the raw data the cross-domain engine will read.

## Phase 2 — Three pillar dashboards (60–90 min)
Build minimal UI for each, using mock/seeded data so it looks alive immediately:
- **Mind**: 2-tap daily mood check-in widget, mood history mini-chart, chatbot stub (can be wired to real AI in Phase 4)
- **Money**: list of upcoming financial deadlines (FAFSA, scholarships), simple budget tracker (expenses vs income), a placeholder "stress-impact score"
- **Grind**: list/calendar of assignments with due dates and status, simple workload visualizer (e.g., bar chart of assignments per week)

Keep these functional but simple — a working form + list + one chart per pillar is enough.

## Phase 3 — The killer feature: cross-domain signal engine (90–120 min)
This is what makes CampusOS different — prioritize this over visual polish.

Build a rules engine (a single backend function is fine, no need for real ML at hackathon scale) that checks combinations of recent data and returns actionable nudges. Implement at least these four rules:

1. `late_submissions >= 3 AND mood_trend == declining` → suggest workload rebalance + link to tutoring
2. `fafsa_deadline within 14 days AND mood_drop detected` → push "money stress" micro-action + link to aid office
3. `work_hours >= 25/week AND sleep_avg < 6hrs` → burnout warning + suggest part-time job swap
4. `gpa_trend == declining AND financial_stress == high` → surface emergency grant info

Display these as a "Signals" feed on the main dashboard — this is your hero feature for the demo. Hardcode/seed data so at least 2–3 signals reliably fire during the live demo.

## Phase 4 — AI chatbot (60 min)
- Wire the Mind pillar chatbot to a real LLM API (OpenAI or Anthropic) with a system prompt framed around CBT-style supportive listening
- Add a simple keyword-based crisis escalation: if certain phrases appear (self-harm, suicide, etc.), show a hard-coded crisis resource message and a "contact campus counseling" button instead of an AI response
- Keep this simple — it does not need to be clinically validated, just demo-safe

## Phase 5 — Unified dashboard + narrative polish (45–60 min)
- [ ] Build one home screen that shows all three pillars at a glance + the Signals feed front and center
- [ ] Add the "pattern insight" demo moment: a hardcoded/seeded example like *"You're 3x more likely to crash after midterms when you've also had a money worry that week"* — this is your emotional hook, make sure it's visible
- [ ] Clean up UI: consistent colors per pillar (Mind/Money/Grind), simple nav, mobile-friendly if time allows

## Phase 6 — Demo prep (30 min)
- [ ] Seed the database with a realistic fake student's data so the Signals feed fires live during the pitch
- [ ] Write a 1-paragraph README explaining the concept (use the one-liner + table from the pitch)
- [ ] Final commit + push to GitHub
- [ ] Do a dry run of the 30-second pitch alongside the live app

---

## Cut list (if running out of time)
Drop in this order: mobile polish → real chatbot (use canned responses instead) → auth (use a single demo user) → budget tracker detail. **Never cut Phase 3** — the cross-domain signals are the entire differentiator.
