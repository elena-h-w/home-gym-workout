import { useState, useEffect, useRef, useMemo } from 'react'
import styles from './IntervalTimer.module.css'

function buildPhases(structure) {
  const phases = [{ label: 'Warm-up', kind: 'warmup', seconds: structure.warmupSec }]
  for (let i = 0; i < structure.rounds; i++) {
    phases.push({ label: `Hard ${i + 1} / ${structure.rounds}`, kind: 'hard', seconds: structure.hardSec })
    phases.push({ label: `Easy ${i + 1} / ${structure.rounds}`, kind: 'easy', seconds: structure.easySec })
  }
  phases.push({ label: 'Cooldown', kind: 'cooldown', seconds: structure.cooldownSec })
  return phases
}

// A fresh AudioContext created outside a direct user-gesture handler (e.g. from
// a setInterval tick) starts "suspended" on some browsers and never produces
// sound. Reuse one context and unlock it explicitly on mount, which fires as a
// near-immediate result of the tap that starts the timer.
let sharedAudioCtx = null

function getAudioContext() {
  if (!sharedAudioCtx) {
    sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume()
  }
  return sharedAudioCtx
}

function beep(freq = 880, duration = 150) {
  try {
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = freq
    osc.connect(gain)
    gain.connect(ctx.destination)
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    osc.start()
    osc.stop(ctx.currentTime + duration / 1000)
  } catch {
    // audio unavailable — ignore
  }
}

function formatTime(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

const KIND_LABEL = { warmup: 'Warm-up', hard: 'Hard effort', easy: 'Easy recovery', cooldown: 'Cooldown' }

export default function IntervalTimer({ structure, onDone, onExit }) {
  const phases = useMemo(() => buildPhases(structure), [structure])
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(phases[0].seconds)
  const [running, setRunning] = useState(true)
  const [finished, setFinished] = useState(false)
  const intervalRef = useRef(null)

  const phase = phases[phaseIdx]

  useEffect(() => {
    try {
      getAudioContext()
    } catch {
      // audio unavailable — ignore
    }
  }, [])

  useEffect(() => {
    if (!running || finished) return
    intervalRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          const isLastPhase = phaseIdx >= phases.length - 1
          navigator.vibrate?.(isLastPhase ? [200, 100, 200] : 200)
          beep(isLastPhase ? 660 : 990)
          if (isLastPhase) {
            setFinished(true)
            setRunning(false)
            onDone?.()
            return 0
          }
          setPhaseIdx(p => p + 1)
          return phases[phaseIdx + 1].seconds
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, finished, phaseIdx, phases, onDone])

  function skipPhase() {
    if (phaseIdx >= phases.length - 1) {
      setFinished(true)
      setRunning(false)
      onDone?.()
      return
    }
    setPhaseIdx(p => p + 1)
    setSecondsLeft(phases[phaseIdx + 1].seconds)
  }

  const totalSeconds = useMemo(() => phases.reduce((a, p) => a + p.seconds, 0), [phases])
  const elapsedBeforePhase = useMemo(
    () => phases.slice(0, phaseIdx).reduce((a, p) => a + p.seconds, 0),
    [phases, phaseIdx]
  )
  const elapsed = elapsedBeforePhase + (phase.seconds - secondsLeft)
  const overallPct = Math.min(100, (elapsed / totalSeconds) * 100)

  if (finished) {
    return (
      <div className={styles.wrap + ' fade-in'}>
        <div className={styles.doneCheck}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="22" fill="var(--cardio)" />
            <polyline points="14,24 21,31 34,17" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className={styles.doneTitle}>Intervals complete</h2>
        <button className={styles.exitBtn2} onClick={onExit}>Continue</button>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <button className={styles.exitBtn} onClick={onExit}>Exit timer</button>

      <div className={`${styles.phaseBadge} ${styles[`phase_${phase.kind}`]}`}>{KIND_LABEL[phase.kind]}</div>
      <div className={styles.phaseLabel}>{phase.label}</div>

      <div className={styles.bigTime}>{formatTime(secondsLeft)}</div>

      <div className={styles.overallBar}>
        <div className={styles.overallFill} style={{ width: `${overallPct}%` }} />
      </div>
      <div className={styles.overallLabel}>{formatTime(elapsed)} / {formatTime(totalSeconds)} total</div>

      <div className={styles.actions}>
        <button className={styles.btn} onClick={() => setRunning(r => !r)}>{running ? 'Pause' : 'Resume'}</button>
        <button className={styles.btn} onClick={skipPhase}>Skip phase →</button>
      </div>
    </div>
  )
}
