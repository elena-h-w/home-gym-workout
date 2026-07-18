import { useState } from 'react'
import { DEFAULT_WEEK_PATTERN, DAY_NAMES, CARDIO_TYPE_LABELS, PREFERRED_CARDIO_ICONS, PREFERRED_CARDIO_OPTIONS, cycleDayType } from '../data/program'
import styles from './SetupView.module.css'

function dayIcon(type, preferredCardio) {
  if (type === 'strength') return '💪'
  if (type === 'cardio') return PREFERRED_CARDIO_ICONS[preferredCardio] ?? '🏃🏻‍♀️'
  return '🧘🏻‍♀️'
}

export default function SetupView({ onComplete }) {
  const [age, setAge] = useState('')
  const [restTimerDefault, setRestTimerDefault] = useState(60)
  const [units, setUnits] = useState('lb')
  const [preferredCardio, setPreferredCardio] = useState('run')
  const [weekPattern, setWeekPattern] = useState(DEFAULT_WEEK_PATTERN.map(d => ({ ...d })))

  function handleCycle(i) {
    setWeekPattern(prev => {
      const next = [...prev]
      next[i] = cycleDayType(next[i])
      return next
    })
  }

  function handleFinish() {
    const ageNum = Number(age)
    if (!ageNum || ageNum < 10 || ageNum > 100) {
      alert('Enter your age so heart-rate zones can be calculated.')
      return
    }
    onComplete({ age: ageNum, restTimerDefault: Number(restTimerDefault), units, preferredCardio, weekPattern })
  }

  return (
    <div className={styles.page + ' page-scroll'}>
      <div className={styles.inner}>
        <div className={styles.logoMark}>🏋🏻‍♀️</div>
        <h1 className={styles.title}>Lift &amp; Stride</h1>
        <p className={styles.sub}>Let's set up your program before we begin.</p>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Your age</h2>
          <p className={styles.cardDesc}>Used to calculate heart-rate training zones (max HR ≈ 208 − 0.7 × age).</p>
          <input
            type="number"
            inputMode="numeric"
            className={styles.textInput}
            placeholder="e.g. 30"
            value={age}
            onChange={e => setAge(e.target.value)}
          />
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Rest timer default</h2>
          <p className={styles.cardDesc}>How long to rest between strength sets. You can override this any time.</p>
          <div className={styles.pillRow}>
            {[30, 60, 90, 120].map(s => (
              <button
                key={s}
                className={`${styles.pill} ${restTimerDefault === s ? styles.pillActive : ''}`}
                onClick={() => setRestTimerDefault(s)}
              >
                {s}s
              </button>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Units</h2>
          <div className={styles.pillRow}>
            <button className={`${styles.pill} ${units === 'lb' ? styles.pillActive : ''}`} onClick={() => setUnits('lb')}>lb</button>
            <button className={`${styles.pill} ${units === 'kg' ? styles.pillActive : ''}`} onClick={() => setUnits('kg')}>kg</button>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Preferred cardio</h2>
          <div className={styles.pillRow}>
            {PREFERRED_CARDIO_OPTIONS.map(opt => (
              <button
                key={opt.id}
                className={`${styles.pill} ${preferredCardio === opt.id ? styles.pillActive : ''}`}
                onClick={() => setPreferredCardio(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Weekly schedule</h2>
          <p className={styles.cardDesc}>Tap each day to cycle between strength focus, cardio type, and rest. Days are movable — adjust any time in Settings.</p>
          <div className={styles.patternGrid}>
            {DAY_NAMES.map((d, i) => {
              const day = weekPattern[i]
              return (
                <button key={d} className={styles.dayBtn} onClick={() => handleCycle(i)}>
                  <span className={styles.dayName}>{d}</span>
                  <span className={styles.dayIcon}>{dayIcon(day.type, preferredCardio)}</span>
                  <span className={styles.dayTypeLabel}>
                    {day.type === 'strength' ? day.strengthDay : day.type === 'cardio' ? CARDIO_TYPE_LABELS[day.cardioType] : 'rest'}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <button className={styles.startBtn} onClick={handleFinish}>
          Start my program →
        </button>
      </div>
    </div>
  )
}
