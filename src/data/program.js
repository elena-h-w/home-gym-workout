// ─── Weekly Rotation ─────────────────────────────────────────────────────────
// Each day maps to a session type. Days are movable — the rotation below is a
// sensible default, but any day can be reassigned in Settings.

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const DAY_NAMES_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function repRangeLabel(exercise) {
  if (exercise.repsLabel) return exercise.repsLabel
  if (exercise.repMin === exercise.repMax) return `${exercise.repMin}${exercise.isTimed ? 's' : ''}`
  return `${exercise.repMin}–${exercise.repMax}`
}

const STRENGTH_CYCLE = ['lower', 'upper', 'full']
const CARDIO_CYCLE = ['zone2', 'intervals', 'longFun']

// Cycles a single weekPattern day through strength focus -> cardio type -> rest -> back to strength.
export function cycleDayType(day) {
  if (day.type === 'strength') {
    const idx = STRENGTH_CYCLE.indexOf(day.strengthDay)
    if (idx < STRENGTH_CYCLE.length - 1) {
      return { day: day.day, type: 'strength', strengthDay: STRENGTH_CYCLE[idx + 1] }
    }
    return { day: day.day, type: 'cardio', cardioType: 'zone2' }
  }
  if (day.type === 'cardio') {
    const idx = CARDIO_CYCLE.indexOf(day.cardioType)
    if (idx < CARDIO_CYCLE.length - 1) {
      return { day: day.day, type: 'cardio', cardioType: CARDIO_CYCLE[idx + 1], optional: day.optional }
    }
    return { day: day.day, type: 'rest' }
  }
  return { day: day.day, type: 'strength', strengthDay: 'lower' }
}

export const CARDIO_TYPE_LABELS = {
  zone2: 'Zone 2',
  intervals: 'Intervals',
  longFun: 'Long',
}

export const PREFERRED_CARDIO_ICONS = {
  run: '🏃🏻‍♀️',
  ride: '🚴🏻‍♀️',
  swim: '🏊🏻‍♀️',
  row: '🚣🏻‍♀️',
  elliptical: '🛴',
  mixed: '💦',
}

export const PREFERRED_CARDIO_OPTIONS = [
  { id: 'run', label: 'Run' },
  { id: 'ride', label: 'Ride' },
  { id: 'swim', label: 'Swim' },
  { id: 'row', label: 'Row' },
  { id: 'elliptical', label: 'Elliptical' },
  { id: 'mixed', label: 'Mixed' },
]

export const DEFAULT_WEEK_PATTERN = [
  { day: 'Mon', type: 'strength', strengthDay: 'lower' },
  { day: 'Tue', type: 'cardio', cardioType: 'zone2' },
  { day: 'Wed', type: 'strength', strengthDay: 'upper' },
  { day: 'Thu', type: 'cardio', cardioType: 'intervals' },
  { day: 'Fri', type: 'strength', strengthDay: 'full' },
  { day: 'Sat', type: 'cardio', cardioType: 'longFun', optional: true },
  { day: 'Sun', type: 'rest' },
]

// Video ids referenced below correspond to entries in src/data/videos.js.
export const REST_DAY_VIDEOS = {
  primary: '10-min-yoga-flow',
  alt: '10-min-rise-shine-pilates',
  stretch: '30-min-full-body-stretching-rest-days',
}

export const WEEKLY_PLAN_SUMMARY =
  '3 strength days + 2 required cardio days + 1 optional cardio/fun day + 1 active-recovery day. Sessions run 30–60 min. Stretch after every session. Keep an easy or rest day between the two hardest sessions (lower-body strength and VO2 intervals).'

// ─── Strength Days ───────────────────────────────────────────────────────────
// Progressive overload: when all sets hit the TOP of the rep range with good
// form, add ~2.5–5 lb (or +1 rep) next session.

export const PROGRESSIVE_OVERLOAD_NOTE =
  'When you complete all sets at the top of the rep range with good form, add roughly 2.5–5 lb (or +1 rep) next time.'

export const STRENGTH_DAYS = {
  lower: {
    id: 'lower',
    name: 'Lower Body + Core',
    subtitle: 'Squat, hinge, and single-leg strength with a core finisher.',
    exercises: [
      {
        id: 'goblet-squat',
        name: 'Goblet / DB Squat',
        equipment: 'Dumbbell',
        sets: 3,
        repMin: 10,
        repMax: 12,
        cue: 'Quads and glutes. Controlled descent.',
      },
      {
        id: 'db-rdl',
        name: 'DB Romanian Deadlift',
        equipment: 'Dumbbell',
        sets: 3,
        repMin: 10,
        repMax: 12,
        cue: 'Hamstrings and glutes. Hinge at the hips, keep a flat back.',
      },
      {
        id: 'bulgarian-split-squat',
        name: 'Bulgarian Split Squat',
        equipment: 'Dumbbell + bench',
        sets: 3,
        repMin: 8,
        repMax: 10,
        repsLabel: '8–10/leg',
        cue: 'Single-leg strength. Rear foot up on the bench.',
      },
      {
        id: 'lateral-step-up',
        name: 'Lateral Step-Up',
        equipment: 'Plyo box + dumbbell',
        sets: 3,
        repMin: 10,
        repMax: 10,
        repsLabel: '10/side',
        cue: 'Lateral strength and stability through the hip and knee.',
      },
      {
        id: 'leg-curl',
        name: 'Leg Curl',
        equipment: 'Machine',
        sets: 3,
        repMin: 12,
        repMax: 15,
        cue: 'Hamstring isolation — a machine lets you push closer to failure safely.',
      },
      {
        id: 'weighted-hip-thrust',
        name: 'Weighted Hip Thrust',
        equipment: 'Dumbbell + bench',
        sets: 3,
        repMin: 12,
        repMax: 12,
        cue: 'Glute driver.',
      },
      {
        id: 'balance-hold',
        name: 'Single-Leg Balance Hold',
        equipment: 'Balance pad (optional)',
        sets: 2,
        repMin: 30,
        repMax: 30,
        repsLabel: '30s/leg',
        isTimed: true,
        cue: 'Proprioception and ankle stability.',
      },
    ],
    finisher: {
      minutes: '10–15',
      note: 'Lower-body/booty video + a core video.',
      videoId: '10-min-booty-workout',
      coreVideoId: '10-min-lower-ab-workout',
    },
  },
  upper: {
    id: 'upper',
    name: 'Upper Body + Core',
    subtitle: 'Push/pull balance for posture and upper-body tone.',
    exercises: [
      {
        id: 'chest-press',
        name: 'Seated Chest Press (or DB Bench)',
        equipment: 'Machine or dumbbell + bench',
        sets: 3,
        repMin: 8,
        repMax: 12,
        cue: 'Chest and triceps. A machine lets you push hard safely.',
      },
      {
        id: 'lat-pulldown',
        name: 'Lat Pulldown',
        equipment: 'Machine',
        sets: 3,
        repMin: 10,
        repMax: 12,
        cue: 'Back width. Pull to upper chest, control the way up.',
      },
      {
        id: 'seated-cable-row',
        name: 'Seated Cable Row',
        equipment: 'Cable / functional trainer',
        sets: 3,
        repMin: 10,
        repMax: 12,
        cue: 'Back thickness. Squeeze the shoulder blades together.',
      },
      {
        id: 'db-shoulder-press',
        name: 'DB Shoulder Press',
        equipment: 'Dumbbell + bench',
        sets: 3,
        repMin: 10,
        repMax: 12,
        cue: 'Shoulders.',
      },
      {
        id: 'face-pull-lateral-raise',
        name: 'Cable Face Pull or DB Lateral Raise',
        equipment: 'Cable or dumbbell',
        sets: 3,
        repMin: 12,
        repMax: 15,
        cue: 'Rear delts and shoulder health. Light, controlled.',
      },
      {
        id: 'pushdown-curl-superset',
        name: 'Cable Rope Pushdown + DB Curl (superset)',
        equipment: 'Cable + dumbbell',
        sets: 3,
        repMin: 12,
        repMax: 12,
        cue: 'Arms — back-to-back sets to save time.',
      },
    ],
    finisher: {
      minutes: '10',
      note: 'Toned-arms or upper-body video + a core video.',
      videoId: '10-min-upper-body-workout',
      coreVideoId: '10-min-strong-waist',
    },
  },
  full: {
    id: 'full',
    name: 'Full Body / Glute + Core',
    subtitle: 'Compound-heavy day with anti-rotation core and unilateral leg work.',
    exercises: [
      {
        id: 'db-kb-deadlift',
        name: 'DB or KB Deadlift',
        equipment: 'Dumbbell or kettlebell',
        sets: 3,
        repMin: 8,
        repMax: 10,
        cue: 'Posterior chain — no barbell needed.',
      },
      {
        id: 'walking-lunges',
        name: 'Walking DB Lunges',
        equipment: 'Dumbbell',
        sets: 3,
        repMin: 10,
        repMax: 10,
        repsLabel: '10/leg',
        cue: 'Legs and balance.',
      },
      {
        id: 'box-step-up',
        name: 'Box Step-Up, Weighted',
        equipment: 'Plyo box + dumbbell',
        sets: 3,
        repMin: 10,
        repMax: 10,
        repsLabel: '10/leg',
        cue: 'Unilateral leg and glute strength.',
      },
      {
        id: 'incline-db-press',
        name: 'Incline DB Press',
        equipment: 'Dumbbell + bench',
        sets: 3,
        repMin: 10,
        repMax: 10,
        cue: 'Upper-body push.',
      },
      {
        id: 'cable-pallof-press',
        name: 'Cable Pallof Press',
        equipment: 'Cable / functional trainer',
        sets: 3,
        repMin: 10,
        repMax: 10,
        repsLabel: '10/side',
        cue: 'Anti-rotation core stability.',
      },
      {
        id: 'assisted-pull-up',
        name: 'Assisted Pull-Up (band) or Pulldown',
        equipment: 'Band or machine',
        sets: 3,
        repMin: 8,
        repMax: 10,
        cue: 'Vertical pull — band-assist as needed.',
      },
    ],
    finisher: {
      minutes: '10–12',
      note: 'Core or booty video.',
      videoId: '12-min-grow-your-booty',
      coreVideoId: '10-min-strong-waist',
    },
  },
}

// Stretch video offered at the end of every strength or cardio session.
export const SESSION_STRETCH_VIDEO_ID = '10-min-full-body-stretch'

export const CORE_FINISHER_ROTATION_NOTE =
  'Vary the core finisher — rotate between lower-ab, obliques, and circuit-style videos from the Core category.'

// ─── Cardio Protocols ────────────────────────────────────────────────────────

export const CARDIO_PROTOCOLS = {
  zone2: {
    id: 'zone2',
    name: 'Zone 2 (Easy)',
    description: 'Steady, conversational-pace cardio — the aerobic-base and fat-burning workhorse.',
    howTo: 'Incline treadmill walk or elliptical at an easy, steady effort. Should feel easy enough to talk in full sentences.',
    progression: 'Add 5 minutes every 1–2 weeks up to ~45 minutes, then nudge incline or speed up slightly.',
    durationMin: 30,
    durationMaxMin: 45,
    hrZonePctMin: 60,
    hrZonePctMax: 70,
    stretchVideoId: '8-min-flowing-stretch',
  },
  intervals: {
    id: 'intervals',
    name: 'Intervals / VO2 (4×4)',
    description: 'The biggest VO2 driver in the program.',
    howTo: "5' warm-up → 4 × [4' hard / 3' easy recovery] → 5' cooldown. Treadmill (raise speed/incline) or elliptical (raise resistance) for a lower-impact option.",
    progression: 'Set the work-interval intensity to hit 90–95% max HR. As it gets easier, raise the effort.',
    hrZonePctMin: 90,
    hrZonePctMax: 95,
    intervalStructure: {
      warmupSec: 5 * 60,
      cooldownSec: 5 * 60,
      rounds: 4,
      hardSec: 4 * 60,
      easySec: 3 * 60,
    },
    preVideoId: '5-min-quick-mobility',
    stretchVideoId: '5-min-basic-stretch',
  },
  longFun: {
    id: 'longFun',
    name: 'Long / Fun',
    description: 'Keeps weekly volume up without added stress — good for adherence.',
    howTo: 'A longer easy incline walk or elliptical session (60–90 min), or a dance-cardio video plus a short walk.',
    progression: 'Optional — skip if the week feels heavy.',
    durationMin: 60,
    durationMaxMin: 90,
    funVideoId: '15-min-dance-cardio-workout',
  },
  returnToRun: {
    id: 'returnToRun',
    name: 'Return-to-Running (Phase In)',
    description: 'As cleared, swap one cardio day for a walk/jog progression to rebuild running fitness.',
    howTo: 'Follow a gradual walk:jog ratio progression, adding running minutes over time. Keep incline walking or the elliptical as a low-impact complement.',
    progression: "Incline walking has a ceiling — running fitness ultimately needs running. Add it gradually.",
  },
}

// ─── Heart Rate ──────────────────────────────────────────────────────────────

export function maxHR(age) {
  return Math.round(208 - 0.7 * age)
}

export function hrRange(age, pctMin, pctMax) {
  const max = maxHR(age)
  return {
    min: Math.round(max * (pctMin / 100)),
    max: Math.round(max * (pctMax / 100)),
  }
}
