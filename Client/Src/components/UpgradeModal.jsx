import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Crown, Sparkles, X, Zap } from 'lucide-react'
import useZenflowStore from '../store/useZenflowStore'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '0',
    period: '',
    icon: Zap,
    tone: 'muted',
    features: ['3 active widgets', 'Core Pomodoro', 'Simple notes', 'Zenflow branding visible'],
    cta: 'Current plan',
    disabled: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '2',
    period: '/month',
    icon: Sparkles,
    tone: 'pro',
    popular: true,
    features: ['All widgets unlocked', 'Premium themes and atmosphere', 'Unlimited YouTube mood layers', 'No Zenflow branding', 'Priority support'],
    cta: 'Start Pro',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '5',
    period: '/month',
    icon: Crown,
    tone: 'premium',
    features: ['Everything in Pro', 'Future AI tools', 'Exclusive integrations', 'Signature premium themes', 'Advanced workspace layer'],
    cta: 'Start Premium',
  },
]

export default function UpgradeModal() {
  const { setUpgradeOpen, setUserPlan } = useZenflowStore()
  const close = () => setUpgradeOpen(false)

  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'Escape') close()
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overlay-modal"
      onClick={close}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 28 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 28 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="upgrade-modal-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <h2>Choose your plan</h2>
            <p>Unlock the full premium Zenflow experience.</p>
          </div>
          <button onClick={close} className="btn-ghost">
            <X size={17} />
          </button>
        </div>

        <div className="upgrade-plan-grid">
          {PLANS.map((plan) => {
            const Icon = plan.icon
            return (
              <div key={plan.id} className={`upgrade-card tone-${plan.tone}`}>
                {plan.popular && <div className="upgrade-badge">Most popular</div>}

                <div className="upgrade-card-head">
                  <div className="upgrade-card-name">
                    <Icon size={15} />
                    <span>{plan.name}</span>
                  </div>
                  <div className="upgrade-card-price">
                    <strong>{plan.price}</strong>
                    <span>{plan.period}</span>
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
                  onClick={() => {
                    if (plan.disabled) return
                    setUserPlan(plan.id)
                    close()
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}
