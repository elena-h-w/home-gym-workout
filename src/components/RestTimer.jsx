import { useState, useEffect, useRef } from 'react'
import styles from './RestTimer.module.css'

export default function RestTimer({ defaultSeconds = 75, onDone }) {
  const [seconds, setSeconds] = useState(defaultSeconds)
  const [running, setRunning] = useState(true)
  const intervalRef = useRef(null)
  const onDoneRef = useRef(onDone)
  useEffect(() => { onDoneRef.current = onDone }, [onDone])

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            navigator.vibrate?.(200)
            onDoneRef.current?.()
            return 0
          }
          return s - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const circumference = 2 * Math.PI * 40
  const progress = (seconds / defaultSeconds) * circumference
  const pct = seconds / defaultSeconds

  return (
    <div className={styles.wrap}>
      <svg className={styles.ring} viewBox="0 0 100 100" width="96" height="96">
        <circle cx="50" cy="50" r="40" className={styles.track} />
        <circle
          cx="50" cy="50" r="40"
          className={styles.fill}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{ stroke: pct > 0.4 ? 'var(--accent)' : pct > 0.2 ? 'var(--warning)' : 'var(--danger)' }}
        />
      </svg>
      <div className={styles.label}>
        <span className={styles.time}>{seconds}</span>
        <span className={styles.unit}>sec</span>
      </div>
      <div className={styles.actions}>
        <button className={styles.btn} onClick={() => setRunning(r => !r)}>
          {running ? 'Pause' : 'Resume'}
        </button>
        <button className={styles.btn} onClick={() => { setSeconds(0); setRunning(false); onDone?.() }}>
          Skip
        </button>
      </div>
    </div>
  )
}
