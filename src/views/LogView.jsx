import { useState, useMemo } from 'react'
import { STRENGTH_DAYS, CARDIO_PROTOCOLS } from '../data/program'
import Sparkline from '../components/Sparkline'
import styles from './LogView.module.css'

const ALL_EXERCISES = Object.values(STRENGTH_DAYS).flatMap(d => d.exercises)

function formatDate(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

function focusLabel(entry) {
  if (entry.dayType === 'strength') return STRENGTH_DAYS[entry.focusId]?.name ?? entry.focusId
  if (entry.dayType === 'cardio') return CARDIO_PROTOCOLS[entry.focusId]?.name ?? entry.focusId
  return entry.focusId
}

export default function LogView({ program }) {
  const [tab, setTab] = useState('history')
  const [confirmReset, setConfirmReset] = useState(false)
  const { sessions, strengthLog, settings, resetAll, updateSettings } = program

  const loggedExerciseIds = useMemo(() => {
    const ids = new Set(strengthLog.map(e => e.exerciseId))
    return ALL_EXERCISES.filter(ex => ids.has(ex.id))
  }, [strengthLog])

  const [selectedExerciseId, setSelectedExerciseId] = useState(null)
  const activeExerciseId = selectedExerciseId ?? loggedExerciseIds[0]?.id ?? null

  function handleReset() {
    if (confirmReset) {
      resetAll()
      setConfirmReset(false)
    } else {
      setConfirmReset(true)
    }
  }

  return (
    <div className={styles.page + ' page-scroll'}>
      <div className={styles.header}>
        <h1 className={styles.title}>Log</h1>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'history' ? styles.tabActive : ''}`} onClick={() => setTab('history')}>History</button>
        <button className={`${styles.tab} ${tab === 'progress' ? styles.tabActive : ''}`} onClick={() => setTab('progress')}>Progress</button>
      </div>

      {tab === 'history' && (
        <HistoryTab
          sessions={sessions}
          settings={settings}
          updateSettings={updateSettings}
        />
      )}

      {tab === 'progress' && (
        <ProgressTab
          loggedExerciseIds={loggedExerciseIds}
          activeExerciseId={activeExerciseId}
          onSelect={setSelectedExerciseId}
          getExerciseHistory={program.getExerciseHistory}
          units={settings.units}
        />
      )}

      <div className={styles.resetSection}>
        {confirmReset ? (
          <div className={styles.resetConfirm + ' fade-in'}>
            <p className={styles.resetWarning}>This will erase all progress, sessions, and settings.</p>
            <div className={styles.resetActions}>
              <button className={styles.resetCancel} onClick={() => setConfirmReset(false)}>Cancel</button>
              <button className={styles.resetConfirmBtn} onClick={handleReset}>Yes, reset everything</button>
            </div>
          </div>
        ) : (
          <button className={styles.resetBtn} onClick={handleReset}>Reset all progress</button>
        )}
      </div>
    </div>
  )
}

function HistoryTab({ sessions, settings, updateSettings }) {
  return (
    <>
      <div className={styles.settingsCard}>
        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>Age</span>
          <span className={styles.settingValue}>
            <input
              type="number"
              value={settings.age ?? ''}
              onChange={e => updateSettings({ age: Number(e.target.value) || null })}
              style={{ width: 48, textAlign: 'right', border: 'none', background: 'none', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14 }}
            />
          </span>
        </div>
        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>Rest timer default</span>
          <span className={styles.settingValue}>{settings.restTimerDefault}s</span>
        </div>
        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>Units</span>
          <span className={styles.settingValue}>{settings.units}</span>
        </div>
        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>Preferred cardio machine</span>
          <span className={styles.settingValue}>{settings.cardioMachine}</span>
        </div>
        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>Sessions logged</span>
          <span className={styles.settingValue}>{sessions.length}</span>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className={styles.empty}>
          <p>No sessions logged yet.</p>
          <p>Complete today's workout to get started.</p>
        </div>
      ) : (
        <div className={styles.entries}>
          {sessions.map(entry => (
            <div key={entry.id} className={styles.entry}>
              <div className={styles.entryLeft}>
                <span className={entry.dayType === 'strength' ? styles.badgeStrength : styles.badgeCardio}>
                  {entry.dayType}
                </span>
                <div>
                  <div className={styles.entryDate}>{formatDate(entry.date)}</div>
                  <div className={styles.entryFocus}>{focusLabel(entry)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function ProgressTab({ loggedExerciseIds, activeExerciseId, onSelect, getExerciseHistory, units }) {
  if (loggedExerciseIds.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No strength sets logged yet.</p>
        <p>Progress charts appear here once you log a workout.</p>
      </div>
    )
  }

  const exercise = loggedExerciseIds.find(e => e.id === activeExerciseId) ?? loggedExerciseIds[0]
  const history = getExerciseHistory(exercise.id) // most recent first
  const chronological = [...history].reverse()
  const topSetWeights = chronological.map(e => Math.max(...e.sets.map(s => s.weight)))

  const best = topSetWeights.length ? Math.max(...topSetWeights) : 0
  const latest = topSetWeights.length ? topSetWeights[topSetWeights.length - 1] : 0
  const first = topSetWeights.length ? topSetWeights[0] : 0
  const delta = latest - first

  return (
    <>
      <div className={styles.exercisePicker}>
        {loggedExerciseIds.map(ex => (
          <button
            key={ex.id}
            className={`${styles.exerciseChip} ${ex.id === exercise.id ? styles.exerciseChipActive : ''}`}
            onClick={() => onSelect(ex.id)}
          >
            {ex.name}
          </button>
        ))}
      </div>

      <div className={styles.progressCard}>
        <h2 className={styles.progressTitle}>{exercise.name}</h2>
        <p className={styles.progressSub}>{history.length} session{history.length === 1 ? '' : 's'} logged</p>

        <div className={styles.progressStats}>
          <div className={styles.statBlock}>
            <span className={styles.statValue}>{latest}{units}</span>
            <span className={styles.statLabel}>Latest top set</span>
          </div>
          <div className={styles.statBlock}>
            <span className={styles.statValue}>{best}{units}</span>
            <span className={styles.statLabel}>Best</span>
          </div>
          <div className={styles.statBlock}>
            <span className={styles.statValue} style={{ color: delta >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              {delta >= 0 ? '+' : ''}{delta}{units}
            </span>
            <span className={styles.statLabel}>Since first log</span>
          </div>
        </div>

        <div className={styles.sparklineWrap}>
          <Sparkline points={topSetWeights} />
        </div>

        <div className={styles.entryList}>
          {history.map(e => (
            <div key={e.id} className={styles.progressEntry}>
              <span className={styles.progressEntryDate}>{formatDate(e.date)}</span>
              <span className={styles.progressEntrySets}>
                {e.sets.map(s => `${s.weight}${units}×${s.reps}`).join(', ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
