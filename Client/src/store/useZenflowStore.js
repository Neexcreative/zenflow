import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_BACKGROUND_ID } from '../data/backgrounds'

export function extractVideoId(url) {
  if (!url) return ''
  const re = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|embed)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  const m = url.match(re)
  return m ? m[1] : ''
}

const DEFAULT_DURATIONS = { focus: 25, shortBreak: 5, longBreak: 15 }
const DEFAULT_ROUNDS = 4

export const POMODORO_MODES = [
  { key: 'focus', label: 'Focus' },
  { key: 'shortBreak', label: 'Short break' },
  { key: 'longBreak', label: 'Long break' },
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

// After a focus session completes, every `rounds`-th break is a long one.
export function getNextMode(mode, sessions, rounds) {
  if (mode !== 'focus') return 'focus'
  return sessions > 0 && sessions % rounds === 0 ? 'longBreak' : 'shortBreak'
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
      selectedBackgroundId: DEFAULT_BACKGROUND_ID,
      canvasDim: 0.35,
      setBackgroundTheme: (value) => set({ backgroundTheme: value }),
      setSelectedBackgroundId: (value) => set({ selectedBackgroundId: value }),
      setCanvasDim: (value) => set({ canvasDim: Math.min(0.85, Math.max(0, Number(value) || 0)) }),

      // One focus tool open at a time: 'tasks' | 'sounds' | 'notes' | 'background' | 'settings'
      activeTool: null,
      openTool: (id) => set({ activeTool: id }),
      closeTool: () => set({ activeTool: null }),
      toggleTool: (id) => set((state) => ({ activeTool: state.activeTool === id ? null : id })),

      // Timer. `pomodoroEndsAt` is the wall-clock deadline while running, so the
      // countdown stays accurate in throttled background tabs and across reloads.
      pomodoroMode: 'focus',
      pomodoroTime: DEFAULT_DURATIONS.focus * 60,
      pomodoroRunning: false,
      pomodoroEndsAt: null,
      pomodoroSessions: 0,
      pomodoroDurations: { ...DEFAULT_DURATIONS },
      pomodoroRounds: DEFAULT_ROUNDS,
      setPomodoroMode: (mode) => {
        const { pomodoroDurations } = get()
        set({
          pomodoroMode: mode,
          pomodoroTime: pomodoroDurations[mode] * 60,
          pomodoroRunning: false,
          pomodoroEndsAt: null,
        })
      },
      startPomodoro: () => {
        const { pomodoroTime, pomodoroDurations, pomodoroMode } = get()
        const seconds = pomodoroTime > 0 ? pomodoroTime : pomodoroDurations[pomodoroMode] * 60
        set({
          pomodoroTime: seconds,
          pomodoroRunning: true,
          pomodoroEndsAt: Date.now() + seconds * 1000,
        })
      },
      pausePomodoro: () => {
        get().syncPomodoro()
        if (!get().pomodoroRunning) return
        set({ pomodoroRunning: false, pomodoroEndsAt: null })
      },
      setPomodoroRunning: (value) => (value ? get().startPomodoro() : get().pausePomodoro()),
      // Returns true when this sync completed the session.
      syncPomodoro: () => {
        const { pomodoroRunning, pomodoroEndsAt, pomodoroTime, pomodoroMode, pomodoroSessions } = get()
        if (!pomodoroRunning || !pomodoroEndsAt) return false

        const remaining = Math.max(0, Math.ceil((pomodoroEndsAt - Date.now()) / 1000))
        if (remaining <= 0) {
          set({
            pomodoroRunning: false,
            pomodoroEndsAt: null,
            pomodoroTime: 0,
            pomodoroSessions: pomodoroMode === 'focus' ? pomodoroSessions + 1 : pomodoroSessions,
          })
          return true
        }

        if (remaining !== pomodoroTime) set({ pomodoroTime: remaining })
        return false
      },
      advancePomodoro: ({ autoStart = false } = {}) => {
        const { pomodoroMode, pomodoroSessions, pomodoroRounds } = get()
        get().setPomodoroMode(getNextMode(pomodoroMode, pomodoroSessions, pomodoroRounds))
        if (autoStart) get().startPomodoro()
      },
      resetPomodoro: () => {
        const { pomodoroMode, pomodoroDurations } = get()
        set({
          pomodoroTime: pomodoroDurations[pomodoroMode] * 60,
          pomodoroRunning: false,
          pomodoroEndsAt: null,
        })
      },
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
          pomodoroEndsAt: null,
        }))
      },

      notes: '',
      setNotes: (value) => set({ notes: value }),
      clearNotes: () => set({ notes: '' }),
      tasks: [],
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
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      clearCompletedTasks: () =>
        set((state) => ({
          tasks: state.tasks.filter((task) => !task.completed),
        })),

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
      isPremiumUser: false,
      setIsPremiumUser: (value) => set({ isPremiumUser: value }),

      accentColor: '#7567FF',
      clockFormat: '24h',
      showClock: true,
      showQuote: true,
      showCompanion: false,
      customCursor: false,
      completionChime: true,
      setAccentColor: (value) => set({ accentColor: value }),
      setClockFormat: (value) => set({ clockFormat: value }),
      setShowClock: (value) => set({ showClock: value }),
      setShowQuote: (value) => set({ showQuote: value }),
      setShowCompanion: (value) => set({ showCompanion: value }),
      setCustomCursor: (value) => set({ customCursor: value }),
      setCompletionChime: (value) => set({ completionChime: value }),

      upgradeOpen: false,
      loginOpen: false,
      setUpgradeOpen: (value) => set({ upgradeOpen: value }),
      setLoginOpen: (value) => set({ loginOpen: value }),

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
      setUserPlan: (value) => set({ userPlan: value, isPremiumUser: value !== 'free' }),

      clickSoundEnabled: true,
      toggleClickSound: () =>
        set((state) => ({ clickSoundEnabled: !state.clickSoundEnabled })),
    }),
    {
      name: 'zenflow-v3',
      version: 1,
      migrate: (persisted, version) => {
        if (!persisted) return persisted
        if (version < 1) {
          // v0 seeded three blank task slots and stored a widget layout that no longer exists.
          persisted.tasks = (persisted.tasks || []).filter((task) => task.text?.trim())
          delete persisted.activeWidgets
          if (persisted.accentColor === '#6C63FF') persisted.accentColor = '#7567FF'
          persisted.pomodoroMode = 'focus'
          persisted.pomodoroTime = (persisted.pomodoroDurations?.focus || DEFAULT_DURATIONS.focus) * 60
        }
        return persisted
      },
      partialize: (state) => ({
        notes: state.notes,
        tasks: state.tasks,
        accentColor: state.accentColor,
        clockFormat: state.clockFormat,
        showClock: state.showClock,
        showQuote: state.showQuote,
        showCompanion: state.showCompanion,
        customCursor: state.customCursor,
        completionChime: state.completionChime,
        pomodoroMode: state.pomodoroMode,
        pomodoroTime: state.pomodoroTime,
        pomodoroRunning: state.pomodoroRunning,
        pomodoroEndsAt: state.pomodoroEndsAt,
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
        selectedBackgroundId: state.selectedBackgroundId,
        canvasDim: state.canvasDim,
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
