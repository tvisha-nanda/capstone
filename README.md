# Capstone

A Flask-backed interactive dashboard tracking a BME + ME dual-degree plan at UMass Amherst.

## Structure
- `app.py` — Flask app; serves the frontend and a `/api/plan` JSON endpoint
- `plan_data.py` — **edit this file** to update terms/courses as your plan changes
- `index.html` — layout + styles
- `app.js` — fetches `/api/plan` and renders it; checkbox persistence via localStorage

## Run locally
```
pip install -r requirements.txt
python app.py
```
Then open http://localhost:5000

## Deploy
Deploy as a standard Flask app (e.g. Render, Railway, Fly.io, or a WSGI host) — no build step required beyond installing `requirements.txt`.
