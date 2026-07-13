import styles from './BottomNav.module.css'

const TABS = [
  {
    id: 'today',
    label: 'Today',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15 15" />
      </svg>
    ),
  },
  {
    id: 'program',
    label: 'Program',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="13" y2="16" />
      </svg>
    ),
  },
  {
    id: 'videos',
    label: 'Videos',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="14" height="14" rx="2" />
        <polygon points="9 9 9 15 14 12" fill="currentColor" stroke="none" />
        <path d="M17 9.5 21 7v10l-4-2.5" />
      </svg>
    ),
  },
  {
    id: 'log',
    label: 'Log',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="4" x2="9" y2="9" />
        <line x1="15" y1="4" x2="15" y2="9" />
      </svg>
    ),
  },
]

export default function BottomNav({ active, onSelect }) {
  return (
    <nav className={styles.nav}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`${styles.tab} ${active === tab.id ? styles.active : ''}`}
          onClick={() => onSelect(tab.id)}
          aria-label={tab.label}
        >
          <span className={styles.icon}>{tab.icon}</span>
          <span className={styles.label}>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
