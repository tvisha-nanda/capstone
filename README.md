# Capstone

A degree flowsheet you actually own.

I built this to plan my own dual B.S. in Mechanical Engineering + Biomedical Engineering at UMass Amherst — every term, every prerequisite, every technical elective, tracked in one place instead of a scattered spreadsheet or a static PDF flowchart that goes stale the moment a course moves. It's a plain Flask app with no database: fork it, swap in your own courses, and it's yours.

**Live pages:**
- `/` — a public landing page explaining the project
- `/plan` — the actual dashboard

## What it does

- **Term-by-term flowsheet** — collapsible term cards for the whole plan at a glance; click any term to expand it into a full detail view
- **Prereq & co-req tracking** — dependencies show up as tags right on the course, so a scheduling conflict is visible before it's a registration problem
- **Technical elective counters** — live progress bars against major-specific elective requirements, tracked separately per major (credits and course count)
- **Fall/Spring-only badges** — courses only offered in one term are flagged so you don't accidentally plan them for the wrong semester
- **Fully editable, in the UI** — click a course to edit it, "+ Add course" for a new one, drag a course card between terms to move it, or add/delete a term entirely. No hand-editing a data file for day-to-day changes.

## How it's built

- **Backend:** `app.py` — a small Flask app. `GET /api/plan` returns the plan; `PUT /api/plan` overwrites it. The frontend keeps the whole plan in memory and PUTs the full thing back after every edit — no per-field endpoints, no ORM.
- **Data:** `plan_data.json` — one JSON array, one object per term (`{"term": "Fall 3", "courses": [...]}`). Each course is `{code, title, credits, done}` plus optional `note`, `req`, `coreq`, `offered` ("F"/"S"), and `elective` ("BME"/"ME" — whatever tracks toward your major's elective requirement).
- **Frontend:** `static/plan.html` + `static/app.js` — no framework, just DOM APIs. `static/index.html` + `static/landing.js` is the public landing page, pulling live stats from the same `/api/plan` endpoint.
- **Design system:** `static/nocturne.css` — a from-scratch dark-theme component library (cards, tags, buttons, dialogs). Every color, radius, and shadow is a CSS variable in this one file.

## Run it locally

```
pip install -r requirements.txt
python app.py
```
Then open http://localhost:5050 (port 5000 is often taken by macOS AirPlay Receiver, hence 5050).

## Make it yours

1. **Fork the repo**, clone it, run `python app.py` — you have the full dashboard running locally.
2. **Add your own terms and courses** — either edit `plan_data.json` directly, or just use the dashboard: click a course to edit it, "+ Add course," drag between terms, "+ Add term."
3. **Restyle with `nocturne.css`** — change the palette without touching layout markup.

## Deploy

Scaffolding exists for both:
- **Render** — `render.yaml` (gunicorn)
- **Vercel** — `api/index.py` + `vercel.json` (Python serverless)

Neither is live yet — both need to be connected through the relevant platform's dashboard with your own account. Note: serverless platforms like Vercel have a read-only/ephemeral filesystem, so the in-app editing (`PUT /api/plan`) needs a real persistent disk (Render, a VM, or swapping `plan_data.json` for a real database) to actually work in production.

## Roadmap

- ✅ **Shipped** — edit courses in the dashboard itself (add/edit/delete/drag, plus add/delete whole terms)
- 🔜 **Planned** — upload a program's PDF flowsheet or an unofficial transcript and have it generate a starting plan, instead of building the JSON by hand
- 💡 **Idea** — shareable plans: a link you can send someone else in your program so they can start from your plan and adjust it to theirs

## Credit

Built by Tvisha Nanda.
