import { useMemo, useState } from 'react'
import { Check, Sparkles, Zap } from 'lucide-react'
import useZenflowStore from '../store/useZenflowStore'
import ModalShell from './ModalShell'

const BILLING_OPTIONS = [
  {
    id: 'monthly',
    label: 'Monthly',
    badge: 'Monthly',
    price: '\u20ac2',
    cadence: '/ month',
    helper: '',
    tone: 'tone-pro',
    features: [
      'All widgets unlocked',
      'Premium themes and desk layouts',
      'Expanded sounds and music tools',
      'Advanced focus stats',
      'Background and mood customization',
      'Priority product support',
    ],
  },
  {
    id: 'yearly',
    label: 'Yearly',
    badge: 'Best Value',
    price: '\u20ac20',
    cadence: '/ year',
    helper: 'Save compared to monthly billing.',
    tone: 'tone-premium',
    features: [
      'Everything in Monthly',
      'Best value for daily focus use',
      'Early access to future upgrades',
      'Priority product support',
    ],
  },
]

const FREE_FEATURES = [
  '3 active widgets',
  'Pomodoro timer',
  'Quick notes and tasks',
  'Core ambient sounds',
]

export default function UpgradeModal() {
  const { authUser, authLoading, setUpgradeOpen, setLoginOpen, showToast } = useZenflowStore()
  const [billing, setBilling] = useState('monthly')
  const [loading, setLoading] = useState(false)
  const close = () => setUpgradeOpen(false)

  const activeBilling = useMemo(
    () => BILLING_OPTIONS.find((item) => item.id === billing) || BILLING_OPTIONS[0],
    [billing]
  )

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
      description="Unlock your complete focus workspace."
      onClose={close}
      className="upgrade-modal-card"
    >
      <div className="upgrade-modal-shell">
        <div className="billing-toggle-block">
          <span className="eyebrow-label">Billing</span>
          <div className="billing-toggle-row" role="tablist" aria-label="Billing interval">
            {BILLING_OPTIONS.map((option) => (
              <button
                key={option.id}
                className={`billing-toggle-pill ${billing === option.id ? 'is-active' : ''}`}
                onClick={() => setBilling(option.id)}
                type="button"
                role="tab"
                aria-selected={billing === option.id}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="upgrade-plan-grid upgrade-plan-grid-compact">
          <div className="upgrade-card tone-muted upgrade-card-free">
            <div className="upgrade-card-head">
              <div className="upgrade-card-name">
                <Zap size={15} />
                <span>Zenflow Free</span>
              </div>
              <div className="upgrade-card-price">
                <strong>{'\u20ac0'}</strong>
                <span>Current access</span>
              </div>
            </div>

            <p className="upgrade-card-helper">Current access</p>

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

          <div className={`upgrade-card upgrade-card-plus ${activeBilling.tone}`}>
            <div className="upgrade-card-topline">
              <span className="upgrade-badge upgrade-badge-inline">{activeBilling.badge}</span>
            </div>

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

            <p className="upgrade-card-helper">{activeBilling.helper || 'Complete your calm premium workspace.'}</p>

            <ul className="upgrade-feature-list">
              {activeBilling.features.map((feature) => (
                <li key={feature}>
                  <Check size={13} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button className={`upgrade-cta ${activeBilling.tone}`} onClick={handleUpgrade} disabled={loading || authLoading}>
              {loading ? 'Redirecting...' : 'Upgrade to Zenflow Plus'}
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  )
}
