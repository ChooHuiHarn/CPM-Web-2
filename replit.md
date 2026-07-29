# Cureer — Find YOUR Future Career

A static career-exploration website for students to discover jobs, take a personality quiz, and learn about career pathways.

## Stack

- Pure HTML / CSS / JavaScript (no build step)
- Data served from a Google Apps Script backend API
- Hosted with `serve` (static file server)

## Pages

| File | URL | Purpose |
|------|-----|---------|
| `index.html` | `/` | Landing page — hero, careers carousel, FAQ, contact |
| `quiz.html` | `/quiz.html` | Personality quiz (RIASEC) |
| `jobbig.html` | `/jobbig.html` | Full jobs listing / search |
| `job.html` | `/job.html#<jobID>` | Individual job detail page |

## Running the app

The workflow **Start application** runs `serve -l 5000` to serve the project root on port 5000.

```bash
serve -l 5000
```

`serve.json` rewrites `/` → `/index.html` so the root path loads the homepage.

## API

All dynamic data comes from a single Google Apps Script endpoint:

```
https://script.google.com/macros/s/AKfycbx.../exec
```

Key query params:
- `?action=job&id=<jobID>` — single job detail
- `?action=results&primary=<R|I|A|S|E|C>&secondary=<letter>` — jobs by personality type

## Career badge colours (RIASEC)

| Type | Colour |
|------|--------|
| Realistic (R) | Vibrant blue |
| Investigative (I) | Purple |
| Artistic (A) | Pink |
| Social (S) | Green |
| Enterprising (E) | Orange |
| Conventional (C) | Yellow |

## User preferences

_None recorded yet._
