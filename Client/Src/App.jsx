import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useZenflowStore from './store/useZenflowStore'
import { useClickSound } from './hooks/useClickSound'
import AmbientAudioPlayer from './components/AmbientAudioPlayer'
import Background from './components/Background'
import BackgroundSwitcherModal from './components/BackgroundSwitcherModal'
import BottomNav from './components/BottomNav'
import CoffeeMugTimer from './components/CoffeeMugTimer'
import CustomCursor from './components/CustomCursor'
import CustomTimerModal from './components/CustomTimerModal'
import HeaderBar from './components/HeaderBar'
import LoginModal from './components/LoginModal'
import NotesTasksPanel from './components/NotesTasksPanel'
import SettingsModal from './components/SettingsModal'
import ShareModal from './components/ShareModal'
import SoundToggle from './components/SoundToggle'
import SoundsPanel from './components/SoundsPanel'
import ToastMessage from './components/ToastMessage'
import UpgradeModal from './components/UpgradeModal'
import WidgetToolbar from './components/WidgetToolbar'
import PomodoroWidget from './components/widgets/PomodoroWidget'
import NotesWidget from './components/widgets/NotesWidget'
import WeatherWidget from './components/widgets/WeatherWidget'
import ClockWidget from './components/widgets/ClockWidget'
import VinylWidget from './components/widgets/VinylWidget'
import QuoteWidget from './components/widgets/QuoteWidget'
import { supabase } from './lib/supabaseClient'

const WIDGET_MAP = {
  pomodoro: PomodoroWidget,
  notes: NotesWidget,
  weather: WeatherWidget,
  clock: ClockWidget,
  vinyl: VinylWidget,
  quote: QuoteWidget,
}

const widgetVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: index * 0.08,
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
}

export default function App() {
  const {
    activeWidgets,
    settingsOpen,
    upgradeOpen,
    customTimerOpen,
    loginOpen,
    shareOpen,
    notesTasksOpen,
    soundsOpen,
    backgroundSwitcherOpen,
    accentColor,
    backgroundTheme,
    setAuthLoading,
    setAuthUser,
    setIsFullscreen,
  } = useZenflowStore()

  useClickSound()

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accentColor)
  }, [accentColor])

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [setIsFullscreen])

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false)
      return undefined
    }

    let mounted = true

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!mounted) return

        if (error) {
          console.warn('Supabase session check failed:', error.message)
          setAuthUser(null)
        } else {
          setAuthUser(data.session?.user ?? null)
        }

        setAuthLoading(false)
      })
      .catch((error) => {
        if (!mounted) return
        console.warn('Supabase session check failed:', error.message)
        setAuthUser(null)
        setAuthLoading(false)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null)
      setAuthLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [setAuthLoading, setAuthUser])

  return (
    <div className="app-shell" data-background-theme={backgroundTheme}>
      <Background />
      <AmbientAudioPlayer />
      <CustomCursor />
      <WidgetToolbar />
      <HeaderBar />
      <CoffeeMugTimer />

      <main className={`layout-main ${notesTasksOpen || soundsOpen ? 'has-side-panel' : ''}`}>
        <div className="widget-grid">
          <AnimatePresence mode="popLayout">
            {activeWidgets.map((id, index) => {
              const Widget = WIDGET_MAP[id]
              if (!Widget) return null

              return (
                <motion.div
                  key={id}
                  layout
                  variants={widgetVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
                  custom={index}
                >
                  <Widget />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        <div className="layout-side-panels">
          <AnimatePresence>{notesTasksOpen && <NotesTasksPanel key="notes-tasks-panel" />}</AnimatePresence>
          <AnimatePresence>{soundsOpen && <SoundsPanel key="sounds-panel" />}</AnimatePresence>
        </div>
      </main>

      <BottomNav />
      <ToastMessage />

      <AnimatePresence>{settingsOpen && <SettingsModal key="settings" />}</AnimatePresence>
      <AnimatePresence>{upgradeOpen && <UpgradeModal key="upgrade" />}</AnimatePresence>
      <AnimatePresence>{customTimerOpen && <CustomTimerModal key="custom-timer" />}</AnimatePresence>
      <AnimatePresence>{loginOpen && <LoginModal key="login" />}</AnimatePresence>
      <AnimatePresence>{shareOpen && <ShareModal key="share" />}</AnimatePresence>
      <AnimatePresence>
        {backgroundSwitcherOpen && <BackgroundSwitcherModal key="background-switcher" />}
      </AnimatePresence>

      <SoundToggle />
    </div>
  )
}
