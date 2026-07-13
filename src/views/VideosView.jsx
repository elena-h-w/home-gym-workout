import { useState, useMemo } from 'react'
import { VIDEO_CATEGORIES, VIDEOS, CHANNEL_LINKS } from '../data/videos'
import styles from './VideosView.module.css'

export default function VideosView() {
  const [activeCategory, setActiveCategory] = useState('all')

  const grouped = useMemo(() => {
    const byCategory = {}
    for (const cat of VIDEO_CATEGORIES) byCategory[cat.id] = []
    for (const v of VIDEOS) byCategory[v.category]?.push(v)
    return byCategory
  }, [])

  const categoriesToShow = activeCategory === 'all'
    ? VIDEO_CATEGORIES
    : VIDEO_CATEGORIES.filter(c => c.id === activeCategory)

  return (
    <div className={styles.page + ' page-scroll'}>
      <div className={styles.header}>
        <h1 className={styles.title}>Videos</h1>
      </div>

      <div className={styles.categoryTabs}>
        <button
          className={`${styles.categoryTab} ${activeCategory === 'all' ? styles.categoryTabActive : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        {VIDEO_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`${styles.categoryTab} ${activeCategory === cat.id ? styles.categoryTabActive : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {categoriesToShow.map(cat => (
        <div key={cat.id} className={styles.section}>
          <div className={styles.sectionTitle}>{cat.label}</div>
          <div className={styles.videoList}>
            {grouped[cat.id].map(v => (
              <a key={v.id} className={styles.videoRow} href={v.url} target="_blank" rel="noreferrer">
                <span className={styles.videoIcon}>▶</span>
                <span className={styles.videoInfo}>
                  <span className={styles.videoTitle}>{v.title}</span>
                  {v.bestFor && <div className={styles.videoBestFor}>{v.bestFor}</div>}
                </span>
              </a>
            ))}
          </div>
        </div>
      ))}

      <div className={styles.section}>
        <div className={styles.sectionTitle}>More</div>
        <div className={styles.videoList}>
          {CHANNEL_LINKS.map(link => (
            <a key={link.url} className={styles.videoRow} href={link.url} target="_blank" rel="noreferrer">
              <span className={styles.videoIcon}>▶</span>
              <span className={styles.videoInfo}>
                <span className={styles.videoTitle}>{link.label}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
