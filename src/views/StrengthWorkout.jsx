import { useState } from 'react'
import RestTimer from '../components/RestTimer'
import { SESSION_STRETCH_VIDEO_ID, repRangeLabel } from '../data/program'
import { VIDEOS } from '../data/videos'
import styles from './StrengthWorkout.module.css'

function findVideo(id) {
  return VIDEOS.find(v => v.id === id) ?? null
}

function VideoOffer({ icon, title, sub, video }) {
  if (!video) return null
  return (
    <a className={styles.videoOffer} href={video.url} target="_blank" rel="noreferrer">
      <span className={styles.videoOfferIcon}>{icon}</span>
      <span className={styles.videoOfferText}>
        <span className={styles.videoOfferTitle}>{title}</span>
        <span className={styles.videoOfferSub}>{sub}</span>
      </span>
    </a>
  )
}

export default function StrengthWorkout({ strengthDay, exercises, restDefault, units, program, onComplete, onExit }) {
  const [exerciseIdx, setExerciseIdx] = useState(0)
  const [setNum, setSetNum] = useState(1)
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [loggedSets, setLoggedSets] = useState([])
  const [allExerciseLogs, setAllExerciseLogs] = useState({})
  const [showRest, setShowRest] = useState(false)
  const [done, setDone] = useState(false)

  const exercise = exercises[exerciseIdx]
  const isLastExercise = exerciseIdx === exercises.length - 1
  const isLastSet = setNum === exercise.sets

  const lastEntry = program.getLastExerciseEntry(exercise.id)
  const readyToAddWeight = program.readyToAddWeight(exercise)

  function commitExerciseLog(exerciseId, sets) {
    if (sets.length === 0) return
    program.logStrengthSets(exerciseId, strengthDay, sets)
    setAllExerciseLogs(prev => ({ ...prev, [exerciseId]: sets }))
  }

  function handleLogSet() {
    const w = weight === '' ? 0 : Number(weight)
    const r = reps === '' ? 0 : Number(reps)
    const nextLogged = [...loggedSets, { weight: w, reps: r }]
    setLoggedSets(nextLogged)
    setWeight('')
    setReps('')

    if (!isLastSet) {
      setShowRest(true)
    } else {
      commitExerciseLog(exercise.id, nextLogged)
      if (!isLastExercise) {
        setShowRest(true)
      } else {
        setDone(true)
      }
    }
  }

  function handleRestDone() {
    setShowRest(false)
    if (isLastSet) {
      setExerciseIdx(i => i + 1)
      setSetNum(1)
      setLoggedSets([])
    } else {
      setSetNum(n => n + 1)
    }
  }

  if (done) {
    return (
      <StrengthDone
        strengthDay={strengthDay}
        exerciseCount={exercises.length}
        onFinish={() => onComplete(allExerciseLogs)}
      />
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <button className={styles.exitBtn} onClick={onExit}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Exit
        </button>
        <span className={styles.counter}>{exerciseIdx + 1} / {exercises.length}</span>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${((exerciseIdx + (setNum - 1) / exercise.sets) / exercises.length) * 100}%` }}
        />
      </div>

      <div className={styles.card + ' fade-in'} key={exerciseIdx + '-' + setNum}>
        <h2 className={styles.name}>{exercise.name}</h2>
        <div className={styles.equipment}>{exercise.equipment}</div>

        {exercise.cue && (
          <div className={styles.cue}>
            <p>💡 {exercise.cue}</p>
          </div>
        )}

        <div className={styles.setChips}>
          {Array.from({ length: exercise.sets }).map((_, i) => (
            <span key={i} className={`${styles.chip} ${i < setNum - 1 ? styles.chipDone : i === setNum - 1 ? styles.chipCurrent : ''}`} />
          ))}
        </div>
        <div className={styles.setLabel}>Set {setNum} of {exercise.sets}</div>
        <div className={styles.repRange}>
          Target: {exercise.isTimed ? repRangeLabel(exercise) : `${repRangeLabel(exercise)} reps`}
        </div>

        {lastEntry && (
          <div className={styles.lastSession}>
            <span className={styles.lastSessionLabel}>Last time:</span>
            <span>
              {lastEntry.sets.map((s, i) => `${s.weight}${units} × ${s.reps}`).join(', ')}
            </span>
          </div>
        )}

        {readyToAddWeight && (
          <div className={styles.nudge}>
            🔼 You hit the top of the rep range on every set last time — ready to add weight? Try +2.5–5{units} or +1 rep.
          </div>
        )}

        {!exercise.isTimed ? (
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <span className={styles.inputLabel}>Weight ({units})</span>
              <input
                type="number"
                inputMode="decimal"
                className={styles.numInput}
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className={styles.inputGroup}>
              <span className={styles.inputLabel}>Reps</span>
              <input
                type="number"
                inputMode="numeric"
                className={styles.numInput}
                value={reps}
                onChange={e => setReps(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        ) : (
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <span className={styles.inputLabel}>Seconds held</span>
              <input
                type="number"
                inputMode="numeric"
                className={styles.numInput}
                value={reps}
                onChange={e => setReps(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        )}

        {loggedSets.length > 0 && (
          <div className={styles.loggedSets}>
            {loggedSets.map((s, i) => (
              <div key={i} className={styles.loggedSetRow}>
                <span>Set {i + 1}</span>
                <strong>{exercise.isTimed ? `${s.reps}s` : `${s.weight}${units} × ${s.reps}`}</strong>
              </div>
            ))}
          </div>
        )}
      </div>

      {showRest ? (
        <div className={styles.restWrap + ' fade-in'}>
          <p className={styles.restLabel}>Rest</p>
          <RestTimer defaultSeconds={restDefault} onDone={handleRestDone} />
        </div>
      ) : (
        <div style={{ padding: '0 16px' }}>
          <button className={styles.doneSetBtn} onClick={handleLogSet}>
            {isLastSet && isLastExercise ? 'Log set & finish workout' : 'Log set →'}
          </button>
        </div>
      )}
    </div>
  )
}

function StrengthDone({ strengthDay, exerciseCount, onFinish }) {
  const finisherVideo = findVideo(strengthDay.finisher.videoId)
  const coreVideo = strengthDay.finisher.coreVideoId ? findVideo(strengthDay.finisher.coreVideoId) : null
  const stretchVideo = findVideo(SESSION_STRETCH_VIDEO_ID)

  return (
    <div className={styles.done + ' fade-in'}>
      <div className={styles.doneCheck}>
        <svg width="48" height="48" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="22" fill="var(--success)" />
          <polyline points="14,24 21,31 34,17" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className={styles.doneTitle}>Strength session done</h2>
      <p className={styles.doneSub}>All {exerciseCount} exercises complete. Finish up with:</p>

      <div className={styles.videoOffers}>
        <VideoOffer icon="🔥" title={finisherVideo?.title} sub="Finisher" video={finisherVideo} />
        <VideoOffer icon="🎯" title={coreVideo?.title} sub="Core finisher" video={coreVideo} />
        <VideoOffer icon="🧘" title={stretchVideo?.title} sub="Stretch" video={stretchVideo} />
      </div>

      <button className={styles.doneBtn} onClick={onFinish}>Log &amp; finish</button>
    </div>
  )
}
