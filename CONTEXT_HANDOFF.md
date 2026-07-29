# Context for a new Claude session

Project: `/Users/tvishananda/degree-dashboard` — a personal degree-planning dashboard for Tvisha Nanda (dual B.S. Mechanical Engineering + Biomedical Engineering, UMass Amherst). GitHub: tvisha-nanda/capstone (auto-push after every commit here, no need to ask).

**Stack:** Flask backend (`app.py`) serving a static frontend (`static/index.html`, `static/app.js`) styled with a design system in `static/nocturne.css`. All course/plan data lives in `plan_data.py` as a `PLAN` list — one dict per term (`Fall N` / `Spring N` / `Summer N` naming, N = year of program), each with a `courses` list. Course fields: `code`, `title`, `credits`, `done`, and optional `note`, `req`, `coreq`, `offered` (F/S badge), `elective` ("BME" or "ME", tracked by the Tech Electives counter panel).

**Run locally:** `/usr/bin/python3 app.py` (port 5050 — 5000 is taken by macOS AirPlay). Test visually with puppeteer-core + the cached "Chrome for Testing" binary at `~/.cache/puppeteer/chrome/...` (headless screenshot, since there's no browser devtools here).

**Current state:** BME tech electives 5/5, ME tech electives 4/4 (both exactly on target). Senior Design I/II (BMED-ENG 414/415) removed from the plan — Tvisha is doing Honors Thesis (499T/499P) instead, tracked as BME electives; a footer note flags this. Deployment scaffolding exists for both Render (`render.yaml`) and Vercel (`api/index.py`, `vercel.json`) but neither has actually been deployed yet — that requires Tvisha's own account login.

Read `plan_data.py`, `static/app.js`, and `static/index.html` directly for the exact current state — this file is just a summary, the code is the source of truth. Ask Tvisha what she wants to work on next.
