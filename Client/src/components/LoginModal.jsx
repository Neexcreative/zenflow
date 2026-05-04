import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Facebook, Gamepad2, LogOut, Mail, UserRound, X } from 'lucide-react'
import useZenflowStore from '../store/useZenflowStore'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

const PROVIDERS = [
  {
    id: 'facebook',
    label: 'Continue with Facebook',
    provider: 'facebook',
    icon: Facebook,
    enabled: false,
    placeholderMessage: 'Facebook login is not connected yet.',
  },
  {
    id: 'google',
    label: 'Continue with Google',
    provider: 'google',
    icon: Mail,
    enabled: true,
  },
  {
    id: 'discord',
    label: 'Continue with Discord',
    provider: 'discord',
    icon: Gamepad2,
    enabled: false,
    placeholderMessage: 'Discord login is not connected yet.',
  },
]

export default function LoginModal() {
  const { authUser, authLoading, setAuthUser, setLoginOpen, showToast } = useZenflowStore()

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setLoginOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setLoginOpen])

  const close = () => setLoginOpen(false)

  const handleProviderClick = async ({ provider, enabled, placeholderMessage }) => {
    if (!enabled) {
      // Connect this provider to Supabase OAuth here once it is configured.
      showToast(placeholderMessage || `${provider} login is not connected yet.`)
      return
    }

    if (!isSupabaseConfigured || !supabase) {
      showToast('Supabase environment variables are missing. Check the console for details.')
      return
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (error) {
      showToast(error.message || `Could not start ${provider} login.`)
    }
  }

  const handleLogout = async () => {
    if (!supabase) {
      showToast('Supabase is not configured.')
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) {
      showToast(error.message || 'Could not log out right now.')
      return
    }

    setAuthUser(null)
    showToast('Logged out successfully.')
  }

  const fullName =
    authUser?.user_metadata?.full_name ||
    authUser?.user_metadata?.name ||
    authUser?.user_metadata?.user_name ||
    authUser?.email ||
    'Signed-in user'
  const avatarUrl = authUser?.user_metadata?.avatar_url || authUser?.user_metadata?.picture

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overlay-modal"
      onClick={close}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 18 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="feature-modal-card login-modal-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <h2>{authUser ? 'Account' : 'Sign In'}</h2>
            <p>
              {authUser
                ? 'Your Pomodoro workspace is connected.'
                : 'Pick a provider to connect your synced workspace.'}
            </p>
          </div>
          <button type="button" onClick={close} className="btn-ghost">
            <X size={16} />
          </button>
        </div>

        {authLoading ? (
          <p className="login-helper-copy">Checking your session...</p>
        ) : authUser ? (
          <div className="account-card">
            <div className="account-profile">
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} className="account-avatar" />
              ) : (
                <div className="account-avatar fallback-avatar">
                  <UserRound size={18} />
                </div>
              )}
              <div className="account-copy">
                <strong>{fullName}</strong>
                <span>{authUser.email || 'No email available'}</span>
              </div>
            </div>

            <button className="secondary-pill logout-pill" onClick={handleLogout}>
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <>
            <div className="login-provider-list">
              {PROVIDERS.map((item) => {
                const { id, label, icon: Icon } = item
                return (
                  <button
                    key={id}
                    className="login-provider-button"
                    onClick={() => handleProviderClick(item)}
                  >
                    <span className="login-provider-icon">
                      <Icon size={16} />
                    </span>
                    <span>{label}</span>
                  </button>
                )
              })}
            </div>

            <p className="login-helper-copy">
              Google uses Supabase OAuth. Any provider not configured yet will show a clear placeholder message instead of breaking the app.
            </p>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
