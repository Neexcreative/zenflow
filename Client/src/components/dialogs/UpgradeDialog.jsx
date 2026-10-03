import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import useZenflowStore from '../../store/useZenflowStore'
import Dialog from '../ui/Dialog'
import SegmentedControl from '../ui/SegmentedControl'

const BILLING_OPTIONS = [
  {
    id: 'monthly',
    label: 'Monthly',
    price: '€2',
    cadence: 'per month',
    helper: 'Billed monthly.',
    features: [
      'The full ambient sound library',
      'Every scene, including Plus scenes',
      'Expanded sounds and music tools',
      'Advanced focus stats',
      'Priority product support',
    ],
  },
  {
    id: 'yearly',
    label: 'Yearly',
    badge: 'Best value',
    price: '€20',
    cadence: 'per year',
    helper: 'Two months free compared to monthly.',
    features: [
      'Everything in Monthly',
      'Best value for daily focus use',
      'Early access to future upgrades',
      'Priority product support',
    ],
  },
]

const FREE_FEATURES = ['Focus timer with custom rhythms', 'Tasks and notes', 'Core ambient sounds', 'Gradient and animated scenes']

export default function UpgradeDialog() {
  const { authUser, authLoading, isPremiumUser, setUpgradeOpen, setLoginOpen, showToast } = useZenflowStore()
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
      showToast('Sign in first, then come back to upgrade.')
      close()
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

  if (isPremiumUser) {
    return (
      <Dialog id="upgrade" size="sm" title="You have Zenflow Plus" onClose={close}>
        <p className="dialog__copy">Everything is unlocked. Thank you for supporting Zenflow.</p>
      </Dialog>
    )
  }

  return (
    <Dialog
      id="upgrade"
      size="md"
      title="Zenflow Plus"
      description="More atmosphere for the hours you spend here."
      onClose={close}
    >
      <SegmentedControl label="Billing interval" options={BILLING_OPTIONS} value={billing} onChange={setBilling} />

      <div className="plan-grid">
        <div className="plan">
          <div className="plan__head">
            <span className="plan__name">Free</span>
            <span className="plan__price">
              {'€0'}
              <small>always</small>
            </span>
          </div>
          <ul className="plan__features">
            {FREE_FEATURES.map((feature) => (
              <li key={feature}>
                <Check size={14} aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
          <span className="plan__current">Your current plan</span>
        </div>

        <div className="plan plan--plus">
          <div className="plan__head">
            <span className="plan__name">
              Plus
              {activeBilling.badge ? <span className="plus-tag">{activeBilling.badge}</span> : null}
            </span>
            <span className="plan__price">
              {activeBilling.price}
              <small>{activeBilling.cadence}</small>
            </span>
          </div>
          <ul className="plan__features">
            {activeBilling.features.map((feature) => (
              <li key={feature}>
                <Check size={14} aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
          <button type="button" className="primary-btn primary-btn--block" onClick={handleUpgrade} disabled={loading || authLoading}>
            {loading ? 'Opening checkout…' : `Upgrade · ${activeBilling.price}`}
          </button>
          <span className="plan__helper">{activeBilling.helper}</span>
        </div>
      </div>
    </Dialog>
  )
}
