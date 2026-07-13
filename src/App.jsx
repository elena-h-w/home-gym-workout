import { useState } from 'react'
import { useProgram } from './hooks/useProgram'
import BottomNav from './components/BottomNav'
import TodayView from './views/TodayView'
import ProgramView from './views/ProgramView'
import VideosView from './views/VideosView'
import LogView from './views/LogView'
import SetupView from './views/SetupView'
import styles from './App.module.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('today')
  const program = useProgram()

  if (!program.settings.setupComplete) {
    return (
      <div className={styles.root}>
        <SetupView onComplete={program.updateSettings} />
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        {activeTab === 'today' && <TodayView program={program} />}
        {activeTab === 'program' && <ProgramView program={program} />}
        {activeTab === 'videos' && <VideosView />}
        {activeTab === 'log' && <LogView program={program} />}
      </div>
      <BottomNav active={activeTab} onSelect={setActiveTab} />
    </div>
  )
}
