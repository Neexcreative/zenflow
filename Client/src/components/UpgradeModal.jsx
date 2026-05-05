import { Check, Crown, Sparkles, Zap } from 'lucide-react'
import useZenflowStore from '../store/useZenflowStore'
import ModalShell from './ModalShell'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    cadence: 'Current access',
    icon: Zap,
    tone: 'muted',
    features: ['3 active widgets', 'Pomodoro timer', 'Quick notes and tasks', 'Core ambient sounds'],
    cta: 'Current plan',
    disabled: true,
  },
  {
    id: 'pro',
    name: 'Plus Monthly',
    price: '$7',
    cadence: 'per month',
    icon: Sparkles,
    tone: 'pro',
    popular: true,
    features: ['All widgets unlocked', 'Premium themes and desk layout', 'Expanded sounds and music tools', 'Remove Zenflow branding'],
    cta: 'Coming soon',
  },
  {
    id: 'premium',
    name: 'Plus Yearly',
    price: '$59',
    cadence: 'per year',
    icon: Crown,
    tone: 'premium',
    features: ['Everything in Monthly', 'Best value for daily focus use', 'Early access to future upgrades', 'Priority product support'],
    cta: 'Coming soon',
  },
  {
    id: 'lifetime',
    name: 'Lifetime Early Bird',
    price: '$129',
    cadence: 'one-time',
    icon: Crown,
    tone: 'lifetime',
    badge: 'Launch offer',
    features: ['Everything in Yearly', 'Early adopter pricing', 'No renewal pricing changes', 'Reserved for the first wave of users'],
    cta: 'Join waitlist',
  },
]

export default function UpgradeModal() {
  const { setUpgradeOpen, setUserPlan, showToast } = useZenflowStore()
  const close = () => setUpgradeOpen(false)

  const handlePlanClick = (plan) => {
    if (plan.disabled) return
    if (plan.id === 'pro' || plan.id === 'premium') {
      showToast('Payments are not connected yet. This is a preview of the upgrade flow.')
      return
    }

    if (plan.id === 'lifetime') {
      showToast('Lifetime Early Bird is a preview offer for now.')
      return
    }

    setUserPlan(plan.id)
    close()
  }

  return (
    <ModalShell
      title="Upgrade Zenflow"
      description="A calm premium workspace, with honest pricing while payments are still offline."
      onClose={close}
      className="upgrade-modal-card"
    >
      <div className="upgrade-launch-banner">
        <span className="mini-plus-badge">Launch offer</span>
        <p>Lifetime Early Bird pricing is preview-only right now. Payments are not connected yet.</p>
      </div>

      <div className="upgrade-plan-grid">
        {PLANS.map((plan) => {
          const Icon = plan.icon
          return (
            <div key={plan.id} className={`upgrade-card tone-${plan.tone}`}>
              {plan.popular && <div className="upgrade-badge">Most popular</div>}
              {plan.badge && !plan.popular ? <div className="upgrade-card-banner">{plan.badge}</div> : null}

              <div className="upgrade-card-head">
                <div className="upgrade-card-name">
                  <Icon size={15} />
                  <span>{plan.name}</span>
                </div>
                <div className="upgrade-card-price">
                  <strong>{plan.price}</strong>
                  <span>{plan.cadence}</span>
                </div>
              </div>

              <ul className="upgrade-feature-list">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check size={13} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled={plan.disabled}
                className={`upgrade-cta ${plan.disabled ? 'is-disabled' : ''} tone-${plan.tone}`}
                onClick={() => handlePlanClick(plan)}
              >
                {plan.cta}
              </button>
            </div>
          )
        })}
      </div>
    </ModalShell>
  )
}
