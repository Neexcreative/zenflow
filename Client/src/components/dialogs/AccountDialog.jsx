import { Facebook, Gamepad2, LogOut, Mail, UserRound } from 'lucide-react'
import useZenflowStore from '../../store/useZenflowStore'
import { isSupabaseConfigured, supabase } from '../../lib/supabaseClient'
import Dialog from '../ui/Dialog'
import { getDisplayName } from '../focus/FocusHeader'

// Flip `enabled` once a provider is configured in Supabase; disabled ones stay hidden.
const PROVIDERS = [
  { id: 'google', label: 'Continue with Google', provider: 'google', icon: Mail, enabled: true },
  { id: 'facebook', label: 'Continue with Facebook', provider: 'facebook', icon: Facebook, enabled: false },
  { id: 'discord', label: 'Continue with Discord', provider: 'discord', icon: Gamepad2, enabled: false },
]

export default function AccountDialog() {
  const { authUser, authLoading, isPremiumUser, userPlan, setAuthUser, setLoginOpen, setUpgradeOpen, showToast } =
    useZenflowStore()
  const close = () => setLoginOpen(false)

  const handleProviderClick = async ({ provider }) => {
    if (!isSupabaseConfigured || !supabase) {
      showToast('Sign-in isn’t available right now.')
      console.warn('Supabase environment variables are missing.')
      return
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (error) {
      showToast(error.message || `Could not start ${provider} sign-in.`)
    }
  }

  const handleLogout = async () => {
    if (!supabase) {
      showToast('Sign-in isn’t available right now.')
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) {
      showToast(error.message || 'Could not sign out right now.')
      return
    }

    setAuthUser(null)
    showToast('Signed out.')
  }

  const fullName = getDisplayName(authUser)
  const avatarUrl = authUser?.user_metadata?.avatar_url || authUser?.user_metadata?.picture

  return (
    <Dialog
      id="account"
      size="sm"
      title={authUser ? 'Account' : 'Sign in'}
      description={authUser ? null : 'Sign in to keep your Plus plan with you on any device.'}
      onClose={close}
    >
      {authLoading ? (
        <p className="meta-text">Checking your session…</p>
      ) : authUser ? (
        <div className="account-detail">
          <div className="account-row">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="account-row__avatar account-row__avatar--lg" referrerPolicy="no-referrer" />
            ) : (
              <span className="account-row__avatar account-row__avatar--lg">
                <UserRound size={18} aria-hidden="true" />
              </span>
            )}
            <span className="account-row__copy">
              <span className="account-row__name">{fullName}</span>
              <span className="account-row__meta">{authUser.email || 'No email on file'}</span>
            </span>
          </div>

          <div className="account-plan">
            <span>{isPremiumUser ? `Zenflow Plus · ${userPlan}` : 'Zenflow Free'}</span>
            {!isPremiumUser ? (
              <button
                type="button"
                className="text-btn text-btn--plus"
                onClick={() => {
                  close()
                  setUpgradeOpen(true)
                }}
              >
                See Plus
              </button>
            ) : null}
          </div>

          <button type="button" className="secondary-btn secondary-btn--block" onClick={handleLogout}>
            <LogOut size={14} aria-hidden="true" />
            Sign out
          </button>
        </div>
      ) : (
        <div className="provider-list">
          {PROVIDERS.filter((item) => item.enabled).map((item) => {
            const Icon = item.icon
            return (
              <button key={item.id} type="button" className="provider-btn" onClick={() => handleProviderClick(item)}>
                <Icon size={16} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </Dialog>
  )
}
