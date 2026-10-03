import { useEffect, useRef } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import useZenflowStore from './store/useZenflowStore'
import { useClickSound } from './hooks/useClickSound'
import { useFocusTimer } from './hooks/useFocusTimer'
import { useIdle } from './hooks/useIdle'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import AmbientAudioPlayer from './components/AmbientAudioPlayer'
import CoffeeMugTimer from './components/CoffeeMugTimer'
import CustomCursor from './components/CustomCursor'
import ToastMessage from './components/ToastMessage'
import SceneBackground from './components/focus/SceneBackground'
import FocusHeader from './components/focus/FocusHeader'
import FocusTimer from './components/focus/FocusTimer'
import FocusDock from './components/focus/FocusDock'
import TasksPanel from './components/panels/TasksPanel'
import NotesPanel from './components/panels/NotesPanel'
import SoundsPanel from './components/panels/SoundsPanel'
import BackgroundPanel from './components/panels/BackgroundPanel'
import SettingsPanel from './components/panels/SettingsPanel'
import AccountDialog from './components/dialogs/AccountDialog'
import UpgradeDialog from './components/dialogs/UpgradeDialog'
import { supabase } from './lib/supabaseClient'

const TOOL_PANELS = {
  tasks: TasksPanel,
  sounds: SoundsPanel,
  notes: NotesPanel,
  background: BackgroundPanel,
  settings: SettingsPanel,
}

// Clicks on these never dismiss the open panel.
const KEEP_OPEN_SELECTOR =
  '[data-tool-panel], [data-dock], [data-dialog], button, a, input, textarea, select, label, iframe'

function ToolLayer() {
  const activeTool = useZenflowStore((state) => state.activeTool)
  const closeTool = useZenflowStore((state) => state.closeTool)
  const previousToolRef = useRef(null)

  // Clicking empty canvas closes the panel; controls on the canvas stay usable.
  useEffect(() => {
    if (!activeTool) return undefined
    const onPointerDown = (event) => {
      if (event.target.closest?.(KEEP_OPEN_SELECTOR)) return
      closeTool()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [activeTool, closeTool])

  // Return focus to the dock button that opened the panel, if focus would otherwise be lost.
  useEffect(() => {
    const previous = previousToolRef.current
    previousToolRef.current = activeTool
    if (activeTool || !previous) return

    // The panel is still mounted during its exit animation, so focus inside it counts as lost.
    const active = document.activeElement
    const focusLost = !active || active === document.body || active.closest('[data-tool-panel]')
    if (focusLost) {
      document.querySelector(`[data-tool-trigger="${previous}"]`)?.focus({ preventScroll: true })
    }
  }, [activeTool])

  const Panel = activeTool ? TOOL_PANELS[activeTool] : null
  return <AnimatePresence>{Panel ? <Panel key={activeTool} onClose={closeTool} /> : null}</AnimatePresence>
}

export default function App() {
  const {
    upgradeOpen,
    loginOpen,
    activeTool,
    accentColor,
    pomodoroMode,
    pomodoroRunning,
    showCompanion,
    customCursor,
    showToast,
    setAuthLoading,
    setAuthUser,
    setIsFullscreen,
    setUserPlan,
  } = useZenflowStore()

  useClickSound()
  useFocusTimer()
  useKeyboardShortcuts()

  const idle = useIdle(pomodoroRunning && !activeTool && !upgradeOpen && !loginOpen)

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

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="focus-app"
        data-mode={pomodoroMode}
        data-running={pomodoroRunning}
        data-idle={idle}
        data-tool-open={Boolean(activeTool)}
      >
        <SceneBackground />
        <AmbientAudioPlayer />

        <FocusHeader />
        <main className="focus-stage">
          <h1 className="visually-hidden">Zenflow focus timer</h1>
          <FocusTimer />
        </main>
        <FocusDock />

        <ToolLayer />
        {showCompanion ? <CoffeeMugTimer /> : null}
        <ToastMessage />

        <AnimatePresence>{upgradeOpen ? <UpgradeDialog key="upgrade" /> : null}</AnimatePresence>
        <AnimatePresence>{loginOpen ? <AccountDialog key="account" /> : null}</AnimatePresence>
      </div>
      {customCursor ? <CustomCursor /> : null}
    </MotionConfig>
  )
}
