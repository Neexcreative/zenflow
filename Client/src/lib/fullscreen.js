export const fullscreenSupported =
  typeof document !== 'undefined' && Boolean(document.fullscreenEnabled)

// `isFullscreen` in the store is kept in sync by the `fullscreenchange` listener in App.
export async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
    } else {
      await document.exitFullscreen()
    }
  } catch {
    // Denied or unsupported; the listener leaves state untouched.
  }
}
