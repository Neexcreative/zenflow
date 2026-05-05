import { useState } from 'react'
import { Check, Sparkles, Zap } from 'lucide-react'
import useZenflowStore from '../store/useZenflowStore'
import ModalShell from './ModalShell'

const BILLING_OPTIONS = [
  {
    id: 'monthly',
    label: 'Monthly',
    price: '€2',
    cadence: '/month',
    badge: '',
  },
  {
    id: 'yearly',
    label: 'Yearly',
    price: '€20',
    cadence: '/year',
    badge: 'Best Value',
  },
]

const FREE_FEATURES = ['3 active widgets', 'Pomodoro timer', 'Quick notes and tasks', 'Core ambient sounds']
const PLUS_FEATURES = [
  'All widgets unlocked',
  'Premium themes and gallery access',
  'Expanded sound library',
  'No Zenflow branding',
]

export default function UpgradeModal() {
  const { authUser, authLoading, setUpgradeOpen, setLoginOpen, showToast } = useZenflowStore()
  const [billing, setBilling] = useState('monthly')
  const [loading, setLoading] = useState(false)
  const close = () => setUpgradeOpen(false)

  const activeBilling = BILLING_OPTIONS.find((item) => item.id === billing) || BILLING_OPTIONS[0]

  const handleUpgrade = async () => {
    if (authLoading) return

    if (!authUser) {
      showToast('Please log in to upgrade.')
      setLoginOpen(true)
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: billing,
          userId: authUser.id,
          email: authUser.email,
        }),
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || 'Could not start checkout.')
      }

      window.location.href = payload.url
    } catch (error) {
      showToast(error.message || 'Could not start checkout.')
      setLoading(false)
    }
  }

  return (
    <ModalShell
      title="Upgrade Zenflow"
      description="Choose test-mode billing for Zenflow Plus. Lifetime is intentionally hidden for now."
      onClose={close}
      className="upgrade-modal-card"
    >
      <div className="billing-toggle-row" role="tablist" aria-label="Billing interval">
        {BILLING_OPTIONS.map((option) => (
          <button
            key={option.id}
            className={`gallery-filter-pill ${billing === option.id ? 'is-active' : ''}`}
            onClick={() => setBilling(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="upgrade-plan-grid upgrade-plan-grid-compact">
        <div className="upgrade-card tone-muted">
          <div className="upgrade-card-head">
            <div className="upgrade-card-name">
              <Zap size={15} />
              <span>Free</span>
            </div>
            <div className="upgrade-card-price">
              <strong>€0</strong>
              <span>Current access</span>
            </div>
          </div>

          <ul className="upgrade-feature-list">
            {FREE_FEATURES.map((feature) => (
              <li key={feature}>
                <Check size={13} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button disabled className="upgrade-cta is-disabled tone-muted">
            Current plan
          </button>
        </div>

        <div className={`upgrade-card ${billing === 'yearly' ? 'tone-premium' : 'tone-pro'}`}>
          {activeBilling.badge ? <div className="upgrade-badge">{activeBilling.badge}</div> : null}

          <div className="upgrade-card-head">
            <div className="upgrade-card-name">
              <Sparkles size={15} />
              <span>Zenflow Plus</span>
            </div>
            <div className="upgrade-card-price">
              <strong>{activeBilling.price}</strong>
              <span>{activeBilling.cadence}</span>
            </div>
          </div>

          <ul className="upgrade-feature-list">
            {PLUS_FEATURES.map((feature) => (
              <li key={feature}>
                <Check size={13} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button
            className={`upgrade-cta ${billing === 'yearly' ? 'tone-premium' : 'tone-pro'}`}
            onClick={handleUpgrade}
            disabled={loading || authLoading}
          >
            {loading ? 'Redirecting...' : 'Upgrade to Zenflow Plus'}
          </button>
        </div>
      </div>
    </ModalShell>
  )
}
