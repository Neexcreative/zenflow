import { useEffect, useState } from 'react'
import { UserRound } from 'lucide-react'
import useZenflowStore from '../../store/useZenflowStore'

function HeaderClock({ format }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 10000)
    return () => window.clearInterval(intervalId)
  }, [])

  const label = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: format === '12h',
  }).format(now)

  return (
    <time className="focus-header__clock" dateTime={now.toISOString()}>
      {label}
    </time>
  )
}

export function getDisplayName(user) {
  return (
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.user_name ||
    user?.email ||
    'Account'
  )
}

export default function FocusHeader() {
  const { authUser, authLoading, isPremiumUser, showClock, clockFormat, setLoginOpen, setUpgradeOpen } =
    useZenflowStore()

  const userName = getDisplayName(authUser)
  const avatarUrl = authUser?.user_metadata?.avatar_url || authUser?.user_metadata?.picture

  return (
    <header className="focus-header chrome">
      <span className="wordmark">Zenflow</span>

      <div className="focus-header__end">
        {showClock ? <HeaderClock format={clockFormat} /> : null}

        {isPremiumUser ? (
          <span className="plus-mark">Plus</span>
        ) : (
          <button type="button" className="plus-link" onClick={() => setUpgradeOpen(true)}>
            Plus
          </button>
        )}

        <button
          type="button"
          className={`account-btn ${authUser ? 'is-signed-in' : ''}`}
          onClick={() => setLoginOpen(true)}
          aria-label={authUser ? `Account, signed in as ${userName}` : 'Sign in'}
          disabled={authLoading}
        >
          {authUser && avatarUrl ? (
            <img src={avatarUrl} alt="" className="account-btn__avatar" referrerPolicy="no-referrer" />
          ) : (
            <UserRound size={16} aria-hidden="true" />
          )}
          {!authUser && !authLoading ? <span className="account-btn__label">Sign in</span> : null}
        </button>
      </div>
    </header>
  )
}
