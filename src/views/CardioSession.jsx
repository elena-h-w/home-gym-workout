import { useState } from 'react'
import IntervalTimer from '../components/IntervalTimer'
import DurationTimer from '../components/DurationTimer'
import { VIDEOS } from '../data/videos'
import styles from './CardioSession.module.css'

function findVideo(id) {
  return id ? VIDEOS.find(v => v.id === id) ?? null : null
}

function VideoOffer({ icon, sub, video }) {
  if (!video) return null
  return (
    <a className={styles.videoOffer} href={video.url} target="_blank" rel="noreferrer">
      <span className={styles.videoOfferIcon}>{icon}</span>
      <span className={styles.videoOfferText}>
        <span className={styles.videoOfferTitle}>{video.title}</span>
        <span className={styles.videoOfferSub}>{sub}</span>
      </span>
    </a>
  )
}

export default function CardioSession({ cardioType, protocol, onComplete, onExit }) {
  const [phase, setPhase] = useState('info') // info | active | done
  const [durationSec, setDurationSec] = useState(null)

  const hasHrTarget = Boolean(protocol.hrZonePctMin)

  function finish(seconds) {
    setDurationSec(seconds ?? null)
    setPhase('done')
  }

  if (phase === 'done') {
    const stretchVideo = findVideo(protocol.stretchVideoId)
    return (
      <div className={styles.done + ' fade-in'}>
        <div className={styles.doneCheck}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="22" fill="var(--cardio)" />
            <polyline points="14,24 21,31 34,17" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className={styles.doneTitle}>{protocol.name} complete</h2>
        <p className={styles.doneSub}>
          {durationSec != null ? `Logged ${Math.round(durationSec / 60)} min. ` : ''}
          Nice work.
        </p>
        {stretchVideo && (
          <div className={styles.videoOffers}>
            <VideoOffer icon="🧘" sub="Stretch" video={stretchVideo} />
          </div>
        )}
        <button className={styles.doneBtn} onClick={() => onComplete(durationSec)}>Log &amp; finish</button>
      </div>
    )
  }

  if (phase === 'active') {
    if (cardioType === 'intervals') {
      return (
        <IntervalTimer
          structure={protocol.intervalStructure}
          onDone={() => finish(null)}
          onExit={() => setPhase('done')}
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
        </div>
        {hasHrTarget && (
          <div className={styles.card}>
            <div className={styles.hrBanner}>
              <span className={styles.hrLabel}>
                Target heart rate: {protocol.hrZonePctMin}–{protocol.hrZonePctMax}% of max HR
              </span>
            </div>
          </div>
        )}
        <div className={styles.card}>
          <DurationTimer onFinish={finish} />
        </div>
      </div>
    )
  }

  // info phase
  const preVideo = findVideo(protocol.preVideoId)
  const funVideo = findVideo(protocol.funVideoId)

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <button className={styles.exitBtn} onClick={onExit}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Exit
        </button>
      </div>

      <div className={styles.card}>
        <h2 className={styles.name}>{protocol.name}</h2>
        <p className={styles.desc}>{protocol.description}</p>
        <div className={styles.howTo}>{protocol.howTo}</div>

        {hasHrTarget && (
          <div className={styles.hrBanner}>
            <span className={styles.hrLabel}>
              Target heart rate: {protocol.hrZonePctMin}–{protocol.hrZonePctMax}% of max HR
            </span>
          </div>
        )}

        {(preVideo || funVideo) && (
          <div className={styles.videoOffers}>
            <VideoOffer icon="🤸" sub="Warm-up" video={preVideo} />
            <VideoOffer icon="💃" sub="Fun cardio option" video={funVideo} />
          </div>
        )}

        <button className={styles.startBtn} onClick={() => setPhase('active')}>
          {cardioType === 'intervals' ? 'Start interval timer' : 'Start session'}
        </button>
      </div>
    </div>
  )
}
