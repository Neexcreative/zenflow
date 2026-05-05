const Stripe = require('stripe')

let stripeClient = null

function getStripe() {
  if (stripeClient) return stripeClient

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe is not configured on the server.')
  }

  stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY)
  return stripeClient
}

function getPriceIdForPlan(plan) {
  if (plan === 'monthly') return process.env.STRIPE_PRICE_MONTHLY
  if (plan === 'yearly') return process.env.STRIPE_PRICE_YEARLY
  return ''
}

function getPlanFromPriceId(priceId) {
  if (!priceId) return 'free'
  if (priceId === process.env.STRIPE_PRICE_MONTHLY) return 'monthly'
  if (priceId === process.env.STRIPE_PRICE_YEARLY) return 'yearly'
  return 'free'
}

module.exports = {
  getStripe,
  getPriceIdForPlan,
  getPlanFromPriceId,
}
