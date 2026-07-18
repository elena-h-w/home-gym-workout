import { useState } from 'react'
import { DAY_NAMES, STRENGTH_DAYS, CARDIO_PROTOCOLS, REST_DAY_VIDEOS, repRangeLabel, PREFERRED_CARDIO_ICONS, cycleDayType } from '../data/program'
import { VIDEOS } from '../data/videos'
import StrengthWorkout from './StrengthWorkout'
import CardioSession from './CardioSession'
import styles from './TodayView.module.css'

function dayIcon(type, preferredCardio) {
  if (type === 'strength') return '💪'
  if (type === 'cardio') return PREFERRED_CARDIO_ICONS[preferredCardio] ?? '🏃🏻‍♀️'
  return '🧘🏻‍♀️'
}

function findVideo(id) {
  return id ? VIDEOS.find(v => v.id === id) ?? null : null
}

function focusIdFor(plan) {
  if (plan.type === 'strength') return plan.strengthDay
  if (plan.type === 'cardio') return plan.cardioType
  return 'rest'
}

function WeekStrip({ pattern, todayDow, selectedDow, onSelect, preferredCardio, editMode }) {
  return (
    <div className={styles.weekStrip}>
      {DAY_NAMES.map((d, i) => (
        <button
          key={d}
          className={`${styles.dayCell} ${i === selectedDow ? styles.dayCellSelected : ''} ${i === todayDow ? styles.dayCellToday : ''} ${editMode ? styles.dayCellEditing : ''}`}
          onClick={() => onSelect(i)}
        >
          <span className={styles.dayName}>{d}</span>
          <span className={styles.dayType}>{dayIcon(pattern[i].type, preferredCardio)}</span>
        </button>
      ))}
    </div>
  )
}

export default function TodayView({ program }) {
  const [selectedDow, setSelectedDow] = useState(program.todayDow)
  const [mode, setMode] = useState(null) // null | 'strength' | 'cardio'
  const [justCompleted, setJustCompleted] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const { settings, todayDow, todayStr, getTodaySessions, logSession, setWeekPattern } = program
  const plan = settings.weekPattern[selectedDow]
  const focusId = focusIdFor(plan)
  const isSelectedToday = selectedDow === todayDow

  const todaySessions = getTodaySessions()
  const isSessionLoggedToday = plan.type !== 'rest' && todaySessions.some(s => s.focusId === focusId)

  function handleEditDay(i) {
    const nextPattern = [...settings.weekPattern]
    nextPattern[i] = cycleDayType(nextPattern[i])
    setWeekPattern(nextPattern)
    setSelectedDow(i)
  }

  function handleStrengthComplete() {
    logSession({ dayType: 'strength', focusId: plan.strengthDay })
    setMode(null)
    setJustCompleted(true)
  }

  function handleCardioComplete() {
    logSession({ dayType: 'cardio', focusId: plan.cardioType })
    setMode(null)
    setJustCompleted(true)
  }

  if (mode === 'strength') {
    const strengthDay = STRENGTH_DAYS[plan.strengthDay]
    return (
      <StrengthWorkout
        strengthDay={strengthDay}
        exercises={strengthDay.exercises}
        restDefault={settings.restTimerDefault}
        units={settings.units}
        program={program}
        onComplete={handleStrengthComplete}
        onExit={() => setMode(null)}
      />
    )
  }

  if (mode === 'cardio') {
    const protocol = CARDIO_PROTOCOLS[plan.cardioType]
    return (
      <CardioSession
        cardioType={plan.cardioType}
        protocol={protocol}
        age={settings.age}
        onComplete={handleCardioComplete}
        onExit={() => setMode(null)}
      />
    )
  }

  const today = new Date()
  const dateLabel = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const selectedDayLabel = DAY_NAMES[selectedDow]

  return (
    <div className={styles.page + ' page-scroll'}>
      <div className={styles.header}>
        <p className={styles.dateLabel}>{dateLabel}</p>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>
            {isSelectedToday ? "Today" : `${selectedDayLabel}'s session`}
          </h1>
          <button className={styles.editToggle} onClick={() => setEditMode(e => !e)}>
            {editMode ? 'Done' : 'Edit'}
          </button>
        </div>
      </div>

      <WeekStrip
        pattern={settings.weekPattern}
        todayDow={todayDow}
        selectedDow={selectedDow}
        onSelect={editMode ? handleEditDay : setSelectedDow}
        preferredCardio={settings.preferredCardio}
        editMode={editMode}
      />

      {editMode && (
        <p className={styles.overrideNote}>
          Tap a day to cycle its focus: strength → cardio → rest.
        </p>
      )}

      {!editMode && !isSelectedToday && (
        <p className={styles.overrideNote}>
          Viewing {selectedDayLabel}. <button onClick={() => setSelectedDow(todayDow)}>Back to today</button>
        </p>
      )}

      {(isSessionLoggedToday || justCompleted) && plan.type !== 'rest' && (
        <div className={styles.completeBanner + ' fade-in'}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="var(--success)" />
            <polyline points="7,12 10,15 17,9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Today's session logged.</span>
        </div>
      )}

      {plan.type === 'rest' && <RestCard />}
      {plan.type === 'strength' && (
        <StrengthPreview strengthDay={STRENGTH_DAYS[plan.strengthDay]} onStart={() => setMode('strength')} />
      )}
      {plan.type === 'cardio' && (
        <CardioPreview protocol={CARDIO_PROTOCOLS[plan.cardioType]} optional={plan.optional} onStart={() => setMode('cardio')} />
      )}
    </div>
  )
}

function StrengthPreview({ strengthDay, onStart }) {
  return (
    <div className={styles.sessionCard}>
      <div className={styles.sessionMeta}>
        <span className={styles.badge + ' ' + styles.badgeStrength}>Strength</span>
        <span className={styles.sessionDetail}>{strengthDay.exercises.length} exercises · ~40–60 min</span>
      </div>
      <h2 className={styles.sessionTitle}>{strengthDay.name}</h2>
      <p className={styles.sessionDesc}>{strengthDay.subtitle}</p>

      <div className={styles.exerciseList}>
        {strengthDay.exercises.map((ex, i) => (
          <div key={ex.id} className={styles.exerciseRow}>
            <span className={styles.exNum}>{i + 1}</span>
            <span className={styles.exName}>{ex.name}</span>
            <span className={styles.exSets}>{ex.sets}×{repRangeLabel(ex)}</span>
          </div>
        ))}
      </div>

      <button className={styles.primaryBtn + ' ' + styles.strengthBtn} onClick={onStart}>
        Start workout
      </button>
    </div>
  )
}

function CardioPreview({ protocol, optional, onStart }) {
  return (
    <div className={styles.sessionCard}>
      <div className={styles.sessionMeta}>
        <span className={styles.badge + ' ' + styles.badgeCardio}>Cardio{optional ? ' · Optional' : ''}</span>
        <span className={styles.sessionDetail}>
          {protocol.durationMin ? `${protocol.durationMin}–${protocol.durationMaxMin ?? protocol.durationMin} min` : ''}
        </span>
      </div>
      <h2 className={styles.sessionTitle}>{protocol.name}</h2>
      <p className={styles.sessionDesc}>{protocol.description}</p>

      <button className={styles.primaryBtn + ' ' + styles.cardioBtn} onClick={onStart}>
        Start session
      </button>
    </div>
  )
}

function RestCard() {
  const primary = findVideo(REST_DAY_VIDEOS.primary)
  const alt = findVideo(REST_DAY_VIDEOS.alt)
  const stretch = findVideo(REST_DAY_VIDEOS.stretch)

  return (
    <div className={styles.restCard}>
      <div className={styles.restEmoji}>🧘🏻‍♀️</div>
      <h2 className={styles.restTitle}>Rest day</h2>
      <p className={styles.restText}>Recovery is part of the program. Let your body absorb the work — a light yoga, pilates, or stretch flow is a great option.</p>

      <div className={styles.restVideoLinks}>
        {[primary, alt, stretch].filter(Boolean).map(v => (
          <a key={v.id} className={styles.restVideoLink} href={v.url} target="_blank" rel="noreferrer">
            <span className={styles.restVideoIcon}>▶</span>
            <span className={styles.restVideoTitle}>{v.title}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
