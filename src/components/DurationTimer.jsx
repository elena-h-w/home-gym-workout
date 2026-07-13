import { useState, useEffect, useRef } from 'react'
import styles from './DurationTimer.module.css'

function formatTime(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function DurationTimer({ onFinish }) {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  return (
    <div className={styles.wrap}>
      <div className={styles.bigTime}>{formatTime(seconds)}</div>
      <div className={styles.actions}>
        <button className={styles.btn} onClick={() => setRunning(r => !r)}>
          {running ? 'Pause' : seconds === 0 ? 'Start' : 'Resume'}
        </button>
        <button
          className={styles.btnPrimary}
          onClick={() => { setRunning(false); onFinish?.(seconds) }}
        >
          Finish
        </button>
      </div>
    </div>
  )
}
