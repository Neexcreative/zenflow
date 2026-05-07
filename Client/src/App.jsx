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

const LEFT_COLUMN_WIDGETS = ['clock', 'weather']
const RIGHT_COLUMN_WIDGETS = ['notes', 'vinyl', 'quote']

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
    showToast,
    setAuthLoading,
    setAuthUser,
    setIsFullscreen,
    setUserPlan,
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
    const params = new URLSearchParams(window.location.search)
    const checkoutResult = params.get('checkout')

    if (!checkoutResult) return

    if (checkoutResult === 'success') {
      showToast('Payment successful. Your Plus access is being activated.')
    }

    if (checkoutResult === 'cancelled') {
      showToast('Checkout cancelled.')
    }

    params.delete('checkout')
    const nextQuery = params.toString()
    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}${window.location.hash}`
    window.history.replaceState({}, '', nextUrl)
  }, [showToast])

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false)
      return undefined
    }

    let mounted = true
    const syncUserProfile = async (user) => {
      if (!user || !supabase) {
        setUserPlan('free')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('is_premium, plan')
        .eq('id', user.id)
        .maybeSingle()

      if (error) {
        console.warn('Supabase profile sync failed:', error.message)
        return
      }

      if (!mounted) return
      setUserPlan(data?.is_premium ? data.plan || 'monthly' : 'free')
    }

    supabase.auth
      .getSession()
      .then(async ({ data, error }) => {
        if (!mounted) return

        if (error) {
          console.warn('Supabase session check failed:', error.message)
          setAuthUser(null)
          setUserPlan('free')
        } else {
          const user = data.session?.user ?? null
          setAuthUser(user)
          await syncUserProfile(user)
        }

        setAuthLoading(false)
      })
      .catch((error) => {
        if (!mounted) return
        console.warn('Supabase session check failed:', error.message)
        setAuthUser(null)
        setUserPlan('free')
        setAuthLoading(false)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null
      setAuthUser(user)
      await syncUserProfile(user)
      setAuthLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [setAuthLoading, setAuthUser, setUserPlan])

  const activeSet = new Set(activeWidgets)
  const leftWidgets = LEFT_COLUMN_WIDGETS.filter((id) => activeSet.has(id))
  const rightWidgets = RIGHT_COLUMN_WIDGETS.filter((id) => activeSet.has(id))
  const overflowWidgets = activeWidgets.filter(
    (id) => id !== 'pomodoro' && !LEFT_COLUMN_WIDGETS.includes(id) && !RIGHT_COLUMN_WIDGETS.includes(id)
  )
  const rightStack = [...rightWidgets, ...overflowWidgets]
  const hasHero = activeSet.has('pomodoro')

  return (
    <div className="app-shell" data-background-theme={backgroundTheme}>
      <Background />
      <AmbientAudioPlayer />
      <CustomCursor />
      <WidgetToolbar />
      <HeaderBar />
      <CoffeeMugTimer />

      <main className={`layout-main ${notesTasksOpen || soundsOpen ? 'has-side-panel' : ''}`}>
        <div className="dashboard-shell">
          <section className="dashboard-overview">
            <div className="dashboard-stack dashboard-stack-left">
              <AnimatePresence mode="popLayout">
                {leftWidgets.map((id, index) => {
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
          </section>

          <section className="dashboard-hero">
            <div className="dashboard-hero-card">
              <AnimatePresence mode="popLayout">
                {hasHero ? (
                  <motion.div
                    key="pomodoro"
                    layout
                    variants={widgetVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
                    custom={0}
                  >
                    <PomodoroWidget />
                  </motion.div>
                ) : (
                  <motion.div
                    key="pomodoro-empty"
                    className="dashboard-empty-state"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                  >
                    <span className="eyebrow-label">Timer hidden</span>
                    <h3>Bring the Pomodoro timer back into view</h3>
                    <p>Use the sidebar to make the focus timer your dashboard hero again.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          <section className="dashboard-side">
            <div className="dashboard-stack dashboard-stack-right">
              <AnimatePresence mode="popLayout">
                {rightStack.map((id, index) => {
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
          </section>
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
