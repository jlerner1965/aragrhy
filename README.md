# Front Range Grow Intelligence

A local-first React, TypeScript, Vite, Tailwind CSS, Recharts, and Lucide web application for adult Colorado Front Range outdoor cultivation planning, monitoring, diagnostics, reporting, and education.

## Production readiness notes

- The app is fully client-side and persists data in `localStorage` under `front-range-grow-intelligence:v2`.
- Demo data is clearly labeled and can be reset from Settings.
- Forecast values are simulated and editable; the UI is written so a live weather adapter can replace local data later.
- Recommendations show assumptions, missing information, confidence, and verification guidance. The app does not claim guaranteed diagnoses.
- The reports module supports browser print output and journal CSV export.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Deployment

The app can be deployed as a static Vite site. `public/_redirects` supports SPA fallback routing on Netlify-compatible hosts. Other static hosts should route all paths to `index.html`.
