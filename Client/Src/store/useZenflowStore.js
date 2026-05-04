import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function extractVideoId(url) {
  if (!url) return ''
  const re = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|embed)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  const m = url.match(re)
  return m ? m[1] : ''
}

const DEFAULT_DURATIONS = { focus: 25, shortBreak: 5, longBreak: 15 }
const DEFAULT_ROUNDS = 4
const FREE_WIDGET_LIMIT = 3
const DEFAULT_TASKS = [
  { id: 'task-1', text: '', completed: false },
  { id: 'task-2', text: '', completed: false },
  { id: 'task-3', text: '', completed: false },
]

function normalizeDuration(value, fallback) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(180, Math.max(1, parsed))
}

function normalizeRounds(value) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return DEFAULT_ROUNDS
  return Math.min(12, Math.max(1, parsed))
}

function createTask(text = '') {
  return {
    id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    completed: false,
  }
}

const useZenflowStore = create(
  persist(
    (set, get) => ({
      currentVideoUrl: '',
      videoId: '',
      isPlaying: false,
      backgroundVisible: true,
      setVideoUrl: (url) => set({ currentVideoUrl: url, videoId: extractVideoId(url) }),
      setIsPlaying: (value) => set({ isPlaying: value }),
      setBackgroundVisible: (value) => set({ backgroundVisible: value }),

      backgroundTheme: 'default',
      backgroundSwitcherOpen: false,
      setBackgroundTheme: (value) => set({ backgroundTheme: value }),
      setBackgroundSwitcherOpen: (value) => set({ backgroundSwitcherOpen: value }),

      activeWidgets: ['clock', 'pomodoro', 'vinyl', 'notes'],
      toggleWidget: (id) => {
        const { activeWidgets, userPlan } = get()
        const isActive = activeWidgets.includes(id)

        if (!isActive && userPlan === 'free' && activeWidgets.length >= FREE_WIDGET_LIMIT) {
          set({ upgradeOpen: true })
          return
        }

        set({
          activeWidgets: isActive
            ? activeWidgets.filter((widgetId) => widgetId !== id)
            : [...activeWidgets, id],
        })
      },

      pomodoroMode: 'focus',
      pomodoroTime: DEFAULT_DURATIONS.focus * 60,
      pomodoroRunning: false,
      pomodoroSessions: 0,
      pomodoroDurations: { ...DEFAULT_DURATIONS },
      pomodoroRounds: DEFAULT_ROUNDS,
      setPomodoroMode: (mode) => {
        const { pomodoroDurations } = get()
        set({
          pomodoroMode: mode,
          pomodoroTime: pomodoroDurations[mode] * 60,
          pomodoroRunning: false,
        })
      },
      setPomodoroRunning: (value) => set({ pomodoroRunning: value }),
      tickPomodoro: () => {
        const { pomodoroTime, pomodoroSessions, pomodoroMode } = get()

        if (pomodoroTime <= 1) {
          set({
            pomodoroRunning: false,
            pomodoroTime: 0,
            pomodoroSessions: pomodoroMode === 'focus' ? pomodoroSessions + 1 : pomodoroSessions,
          })
          return true
        }

        set({ pomodoroTime: pomodoroTime - 1 })
        return false
      },
      resetPomodoro: () => {
        const { pomodoroMode, pomodoroDurations } = get()
        set({
          pomodoroTime: pomodoroDurations[pomodoroMode] * 60,
          pomodoroRunning: false,
        })
      },
      setPomodoroDurations: (durations) =>
        set({
          pomodoroDurations: {
            focus: normalizeDuration(durations.focus, DEFAULT_DURATIONS.focus),
            shortBreak: normalizeDuration(durations.shortBreak, DEFAULT_DURATIONS.shortBreak),
            longBreak: normalizeDuration(durations.longBreak, DEFAULT_DURATIONS.longBreak),
          },
        }),
      applyCustomTimer: ({ focus, shortBreak, longBreak, rounds }) => {
        const normalizedDurations = {
          focus: normalizeDuration(focus, DEFAULT_DURATIONS.focus),
          shortBreak: normalizeDuration(shortBreak, DEFAULT_DURATIONS.shortBreak),
          longBreak: normalizeDuration(longBreak, DEFAULT_DURATIONS.longBreak),
        }

        set((state) => ({
          pomodoroDurations: normalizedDurations,
          pomodoroRounds: normalizeRounds(rounds),
          pomodoroTime: normalizedDurations[state.pomodoroMode] * 60,
          pomodoroRunning: false,
        }))
      },

      notes: '',
      setNotes: (value) => set({ notes: value }),
      tasks: DEFAULT_TASKS,
      addTask: (text = '') =>
        set((state) => ({
          tasks: [...state.tasks, createTask(text)],
        })),
      updateTask: (id, text) =>
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, text } : task)),
        })),
      toggleTaskCompleted: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      removeTask: (id) =>
        set((state) => {
          const filtered = state.tasks.filter((task) => task.id !== id)
          return {
            tasks: filtered.length ? filtered : DEFAULT_TASKS,
          }
        }),
      clearNotes: () => set({ notes: '' }),
      productivityTab: 'notes',
      notesTasksOpen: false,
      setProductivityTab: (value) => set({ productivityTab: value }),
      setNotesTasksOpen: (value) => set({ notesTasksOpen: value }),
      openProductivityPanel: (tab) => set({ notesTasksOpen: true, productivityTab: tab }),

      selectedSoundId: '',
      ambientPlaying: false,
      ambientVolume: 0.6,
      setSelectedSoundId: (value) => set({ selectedSoundId: value }),
      setAmbientPlaying: (value) => set({ ambientPlaying: value }),
      setAmbientVolume: (value) => set({ ambientVolume: value }),
      soundsTab: 'sounds',
      setSoundsTab: (value) => set({ soundsTab: value }),
      soundFilter: 'All',
      setSoundFilter: (value) => set({ soundFilter: value }),
      customMusicUrl: '',
      setCustomMusicUrl: (value) => set({ customMusicUrl: value }),
      musicFavorites: [],
      saveMusicFavorite: (url) =>
        set((state) => {
          if (!url || state.musicFavorites.includes(url)) return state
          if (state.musicFavorites.length >= 5) return state
          return { musicFavorites: [...state.musicFavorites, url] }
        }),
      removeMusicFavorite: (url) =>
        set((state) => ({
          musicFavorites: state.musicFavorites.filter((item) => item !== url),
        })),
      soundsOpen: false,
      setSoundsOpen: (value) => set({ soundsOpen: value }),
      isPremiumUser: false,
      setIsPremiumUser: (value) => set({ isPremiumUser: value }),

      accentColor: '#6C63FF',
      clockFormat: '24h',
      setAccentColor: (value) => set({ accentColor: value }),
      setClockFormat: (value) => set({ clockFormat: value }),

      settingsOpen: false,
      upgradeOpen: false,
      customTimerOpen: false,
      loginOpen: false,
      shareOpen: false,
      setSettingsOpen: (value) => set({ settingsOpen: value }),
      setUpgradeOpen: (value) => set({ upgradeOpen: value }),
      setCustomTimerOpen: (value) => set({ customTimerOpen: value }),
      setLoginOpen: (value) => set({ loginOpen: value }),
      setShareOpen: (value) => set({ shareOpen: value }),

      coffeeMugPosition: { x: null, y: null },
      setCoffeeMugPosition: (value) => set({ coffeeMugPosition: value }),

      toast: null,
      showToast: (message) => set({ toast: { id: Date.now(), message } }),
      clearToast: () => set({ toast: null }),

      authUser: null,
      authLoading: true,
      setAuthUser: (value) => set({ authUser: value }),
      setAuthLoading: (value) => set({ authLoading: value }),

      isFullscreen: false,
      setIsFullscreen: (value) => set({ isFullscreen: value }),

      userPlan: 'free',
      setUserPlan: (value) =>
        set((state) => ({
          userPlan: value,
          isPremiumUser: value !== 'free',
          activeWidgets:
            value === 'free'
              ? state.activeWidgets.slice(0, FREE_WIDGET_LIMIT)
              : state.activeWidgets,
        })),

      clickSoundEnabled: true,
      toggleClickSound: () =>
        set((state) => ({ clickSoundEnabled: !state.clickSoundEnabled })),
    }),
    {
      name: 'zenflow-v3',
      partialize: (state) => ({
        notes: state.notes,
        tasks: state.tasks,
        activeWidgets: state.activeWidgets,
        accentColor: state.accentColor,
        clockFormat: state.clockFormat,
        pomodoroDurations: state.pomodoroDurations,
        pomodoroSessions: state.pomodoroSessions,
        pomodoroRounds: state.pomodoroRounds,
        userPlan: state.userPlan,
        isPremiumUser: state.isPremiumUser,
        clickSoundEnabled: state.clickSoundEnabled,
        currentVideoUrl: state.currentVideoUrl,
        videoId: state.videoId,
        backgroundVisible: state.backgroundVisible,
        backgroundTheme: state.backgroundTheme,
        selectedSoundId: state.selectedSoundId,
        ambientPlaying: state.ambientPlaying,
        ambientVolume: state.ambientVolume,
        soundsTab: state.soundsTab,
        soundFilter: state.soundFilter,
        customMusicUrl: state.customMusicUrl,
        musicFavorites: state.musicFavorites,
        coffeeMugPosition: state.coffeeMugPosition,
      }),
    }
  )
)

export default useZenflowStore
