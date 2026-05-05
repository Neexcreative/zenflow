import { Facebook, Gamepad2, LogOut, Mail, UserRound } from 'lucide-react'
import useZenflowStore from '../store/useZenflowStore'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import ModalShell from './ModalShell'

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
  const close = () => setLoginOpen(false)

  const handleProviderClick = async ({ provider, enabled, placeholderMessage }) => {
    if (!enabled) {
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
    <ModalShell
      title={authUser ? 'Account' : 'Sign In'}
      description={
        authUser
          ? 'Your Pomodoro workspace is connected.'
          : 'Pick a provider to connect your synced workspace.'
      }
      onClose={close}
      className="feature-modal-card login-modal-card"
    >
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
            Google uses Supabase OAuth. Any provider not configured yet shows a placeholder message instead of breaking the app.
          </p>
        </>
      )}
    </ModalShell>
  )
}
