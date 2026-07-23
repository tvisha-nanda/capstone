# Degree Flowsheet Dashboard

A static, no-build interactive dashboard tracking a BME + ME dual-degree plan at UMass Amherst.

## Structure
- `index.html` — layout + styles
- `data.js` — **edit this file** to update terms/courses as your plan changes
- `app.js` — rendering + checkbox persistence (localStorage)

## Run locally
Just open `index.html` in a browser, or serve it:
```
npx serve .
```

## Deploy
No build step required — Vercel will serve it as a static site automatically once pushed to GitHub and imported (see chat walkthrough).
