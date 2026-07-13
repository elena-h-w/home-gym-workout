import { useStorage } from './useStorage'
import { DEFAULT_WEEK_PATTERN } from '../data/program'

const DEFAULT_SETTINGS = {
  age: null,
  restTimerDefault: 75,
  preferredCardio: 'run',
  units: 'lb',
  weekPattern: DEFAULT_WEEK_PATTERN,
  setupComplete: false,
}

function dateStr(d) {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function dayOfWeek(dateString) {
  // Returns 0=Mon ... 6=Sun
  const d = new Date(dateString + 'T12:00:00')
  return (d.getDay() + 6) % 7
}

export function useProgram() {
  const [settings, setSettings] = useStorage('lns_settings', DEFAULT_SETTINGS)
  const [sessions, setSessions] = useStorage('lns_sessions', [])
  const [strengthLog, setStrengthLog] = useStorage('lns_strength_log', [])

  const todayStr = dateStr(new Date())
  const todayDow = dayOfWeek(todayStr)

  function getDayPlan(dow) {
    return settings.weekPattern[dow]
  }

  function getTodaySessions() {
    return sessions.filter(s => s.date === todayStr)
  }

  function isDateComplete(dateString, dow) {
    const plan = settings.weekPattern[dow]
    if (plan.type === 'rest') return true
    return sessions.some(s => s.date === dateString && s.completed)
  }

  function updateSettings(updates) {
    setSettings(prev => ({ ...prev, ...updates, setupComplete: true }))
  }

  function setWeekPattern(newPattern) {
    setSettings(prev => ({ ...prev, weekPattern: newPattern }))
  }

  function logSession({ date = todayStr, dayType, focusId, notes = '' }) {
    const entry = {
      id: Date.now(),
      date,
      dayType,
      focusId,
      completed: true,
      notes,
    }
    setSessions(prev => [entry, ...prev])
    return entry
  }

  function logStrengthSets(exerciseId, strengthDay, sets) {
    const entry = {
      id: Date.now(),
      date: todayStr,
      exerciseId,
      strengthDay,
      sets, // [{ weight, reps }]
    }
    setStrengthLog(prev => [entry, ...prev])
    return entry
  }

  function getExerciseHistory(exerciseId) {
    return strengthLog
      .filter(e => e.exerciseId === exerciseId)
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id))
  }

  function getLastExerciseEntry(exerciseId) {
    const history = getExerciseHistory(exerciseId)
    return history.find(e => e.date !== todayStr) ?? null
  }

  // Progressive overload nudge: all sets in the last logged session hit the
  // TOP of the rep range with no missed reps.
  function readyToAddWeight(exercise) {
    const last = getLastExerciseEntry(exercise.id)
    if (!last || exercise.isTimed) return false
    if (last.sets.length < exercise.sets) return false
    return last.sets.every(s => s.reps >= exercise.repMax)
  }

  function resetAll() {
    setSettings(DEFAULT_SETTINGS)
    setSessions([])
    setStrengthLog([])
  }

  return {
    settings,
    sessions,
    strengthLog,
    todayStr,
    todayDow,
    getDayPlan,
    getTodaySessions,
    isDateComplete,
    updateSettings,
    setWeekPattern,
    logSession,
    logStrengthSets,
    getExerciseHistory,
    getLastExerciseEntry,
    readyToAddWeight,
    resetAll,
  }
}
