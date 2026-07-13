import { useState } from 'react'
import {
  DAY_NAMES_FULL,
  STRENGTH_DAYS,
  CARDIO_PROTOCOLS,
  WEEKLY_PLAN_SUMMARY,
  PROGRESSIVE_OVERLOAD_NOTE,
  repRangeLabel,
} from '../data/program'
import styles from './ProgramView.module.css'

function focusLabel(plan) {
  if (plan.type === 'strength') return STRENGTH_DAYS[plan.strengthDay].name
  if (plan.type === 'cardio') return CARDIO_PROTOCOLS[plan.cardioType].name
  return 'Rest'
}

export default function ProgramView({ program }) {
  const [openDow, setOpenDow] = useState(null)
  const { weekPattern } = program.settings

  if (openDow !== null) {
    return <DayDetail dow={openDow} plan={weekPattern[openDow]} onBack={() => setOpenDow(null)} />
  }

  return (
    <div className={styles.page + ' page-scroll'}>
      <div className={styles.header}>
        <h1 className={styles.title}>Program</h1>
        <p className={styles.summary}>{WEEKLY_PLAN_SUMMARY}</p>
      </div>

      <div className={styles.dayList}>
        {weekPattern.map((plan, i) => (
          <button key={i} className={styles.dayRow} onClick={() => setOpenDow(i)}>
            <span className={`${styles.dayLetter} ${styles[`dayLetter_${plan.type}`]}`}>
              {DAY_NAMES_FULL[i].slice(0, 3)}
            </span>
            <span className={styles.dayInfo}>
              <span className={styles.dayName}>{DAY_NAMES_FULL[i]}{plan.optional ? ' · Optional' : ''}</span>
              <span className={styles.dayFocus}>{focusLabel(plan)}</span>
            </span>
            <span className={styles.chevron}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function DayDetail({ dow, plan, onBack }) {
  return (
    <div className={'page-scroll'}>
      <div className={styles.detailHeader}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Program
        </button>
      </div>

      {plan.type === 'strength' && <StrengthDetail strengthDay={STRENGTH_DAYS[plan.strengthDay]} dow={dow} />}
      {plan.type === 'cardio' && <CardioDetail protocol={CARDIO_PROTOCOLS[plan.cardioType]} dow={dow} optional={plan.optional} />}
      {plan.type === 'rest' && (
        <div className={styles.detailCard}>
          <h2 className={styles.detailTitle}>{DAY_NAMES_FULL[dow]} — Rest</h2>
          <p className={styles.detailSub}>Active recovery. A light yoga, pilates, or stretch flow keeps you moving without adding training stress.</p>
        </div>
      )}
    </div>
  )
}

function StrengthDetail({ strengthDay, dow }) {
  return (
    <div className={styles.detailCard}>
      <h2 className={styles.detailTitle}>{DAY_NAMES_FULL[dow]} — {strengthDay.name}</h2>
      <p className={styles.detailSub}>{strengthDay.subtitle}</p>

      <div className={styles.exerciseList}>
        {strengthDay.exercises.map(ex => (
          <div key={ex.id} className={styles.exerciseRow}>
            <div className={styles.exerciseTop}>
              <span className={styles.exName}>{ex.name}</span>
              <span className={styles.exSets}>{ex.sets}×{repRangeLabel(ex)}</span>
            </div>
            <div className={styles.exMeta}>{ex.equipment} · {ex.cue}</div>
          </div>
        ))}
      </div>

      <div className={styles.finisherNote}>
        Finisher ({strengthDay.finisher.minutes} min): {strengthDay.finisher.note}
      </div>
      <div className={styles.finisherNote} style={{ marginTop: 8 }}>
        {PROGRESSIVE_OVERLOAD_NOTE}
      </div>
    </div>
  )
}

function CardioDetail({ protocol, dow, optional }) {
  return (
    <div className={styles.detailCard}>
      <h2 className={styles.detailTitle}>{DAY_NAMES_FULL[dow]} — {protocol.name}{optional ? ' (Optional)' : ''}</h2>
      <p className={styles.detailSub}>{protocol.description}</p>

      <div className={styles.cardioField}>
        <div className={styles.cardioFieldLabel}>How to</div>
        <div className={styles.cardioFieldValue}>{protocol.howTo}</div>
      </div>
      <div className={styles.cardioField}>
        <div className={styles.cardioFieldLabel}>Progression</div>
        <div className={styles.cardioFieldValue}>{protocol.progression}</div>
      </div>
      {protocol.hrZonePctMin && (
        <div className={styles.cardioField}>
          <div className={styles.cardioFieldLabel}>Heart-rate target</div>
          <div className={styles.cardioFieldValue}>{protocol.hrZonePctMin}–{protocol.hrZonePctMax}% of max HR</div>
        </div>
      )}
    </div>
  )
}
