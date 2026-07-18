# Lift & Stride

A mobile-first home-gym strength + cardio tracker with progressive-overload logging and a categorized workout-video library.

**[Live demo](https://lift-and-stride.vercel.app)**

---

## What it does

Lift & Stride runs a 7-day home-gym rotation — 3 strength days, 2–3 cardio days, and one active-recovery day. It tells you exactly what to do each day, logs every set, and shows your weights climbing over time.

**Strength program** (3×/week) — Lower Body, Upper Body, and Full Body / Glute sessions. Guided one-exercise-at-a-time workout mode with a built-in rest timer, last-session reference for every exercise, and a progressive-overload nudge when you're ready to add weight.

**Cardio program** — Zone 2 steady-state, a 4×4 VO2 interval protocol with a phase-cued interval timer (haptic cues), an optional long/fun cardio day, and a return-to-running progression.

**Video library** — the full linked video library, grouped by category (Core, Upper Body, Lower Body / Booty, Dance, HIIT/Cardio, Yoga/Pilates, Stretch), with "best for" notes mapping videos to specific days in the plan.

---

## Features

- **Today view** — auto-selects today's session from the weekly rotation, with an easy override to view or run any other day
- **Guided workout mode** — one exercise at a time: log weight + reps per set, rest timer, last-session reference, and a "ready to add weight?" nudge based on rep-range performance
- **Interval timer** — 5-minute warm-up → 4×(4-minute hard / 3-minute easy) → 5-minute cooldown, with clear phase labels and a haptic buzz on every transition
- **Heart-rate zones** — Zone 2 targets 60–70% of max HR, intervals target 90–95%
- **Program view** — full weekly rotation overview with drill-in detail for every strength and cardio day
- **Progress log** — session history plus a per-exercise progression view (sparkline + weight/rep history) so you can watch the numbers climb
- **PWA** — installable on your phone's home screen (iOS via Safari → Add to Home Screen; Android via Chrome), works offline

---

## Use this yourself

This app is built to be forked and adapted. All program content lives in two data files — you don't need to touch any other code.

**1. Clone**
```bash
git clone <your-fork-url>
cd home-gym-workout
npm install
```

**2. Edit the program data**

- [`src/data/program.js`](src/data/program.js) — the weekly rotation, strength-day exercises (sets/reps/cues), cardio protocols, and the heart-rate formula
- [`src/data/videos.js`](src/data/videos.js) — the categorized video library and links

**3. Run locally**
```bash
npm run dev
```

**4. Deploy**
```bash
npm install -g vercel
vercel --prod
```

Or connect the repo to Vercel via the dashboard — zero config required.

---

## Configuration (first launch)

On first launch, a setup screen collects:
- **Rest timer default** — how long to rest between strength sets
- **Units** — lb or kg
- **Preferred cardio** — Run, Ride, Swim, Row, or Elliptical
- **Weekly schedule** — tap any day to cycle its focus (strength type / cardio type / rest); days are movable

All user data (settings, sessions, strength log) is stored in `localStorage` only — nothing is baked into the codebase.

**To reset:** Log tab → scroll to bottom → **Reset all progress**.

---

## Tech Stack

- React + Vite
- CSS Modules
- localStorage only — no backend, no auth
- PWA via vite-plugin-pwa

---

## License

MIT — free to use, modify, and share.
