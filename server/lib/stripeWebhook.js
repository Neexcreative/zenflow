const { getSupabaseAdmin } = require('./supabaseAdmin')
const { getPlanFromPriceId, getStripe } = require('./stripe')

function sendJson(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

function getPlanFromSession(session) {
  if (session.metadata?.plan === 'monthly' || session.metadata?.plan === 'yearly') {
    return session.metadata.plan
  }
  const lineItemPriceId = session.line_items?.data?.[0]?.price?.id
  return getPlanFromPriceId(lineItemPriceId)
}

async function upsertProfileFromSubscription({
  userId,
  email,
  isPremium,
  plan,
  stripeCustomerId,
  stripeSubscriptionId,
}) {
  const supabaseAdmin = getSupabaseAdmin()
  if (!supabaseAdmin) return

  if (!userId) {
    console.warn('Stripe webhook skipped profile sync because supabase_user_id metadata was missing.')
    return
  }

  const payload = {
    id: userId,
    email: email || null,
    is_premium: Boolean(isPremium),
    plan: plan || 'free',
    stripe_customer_id: stripeCustomerId || null,
    stripe_subscription_id: stripeSubscriptionId || null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabaseAdmin.from('profiles').upsert(payload, { onConflict: 'id' })

  if (error) {
    console.error('Supabase profile sync failed:', error.message)
  }
}

async function handleCheckoutSessionCompleted(session, stripe) {
  const expandedSession = session.line_items
    ? session
    : await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items.data.price', 'subscription'],
      })

  await upsertProfileFromSubscription({
    userId: expandedSession.metadata?.supabase_user_id,
    email: expandedSession.customer_details?.email || expandedSession.customer_email || null,
    isPremium: true,
    plan: getPlanFromSession(expandedSession),
    stripeCustomerId: expandedSession.customer || null,
    stripeSubscriptionId:
      typeof expandedSession.subscription === 'string'
        ? expandedSession.subscription
        : expandedSession.subscription?.id || null,
  })
}

async function handleSubscriptionChange(subscription) {
  const status = subscription.status || ''
  const isPremium = ['active', 'trialing', 'past_due'].includes(status)
  const priceId = subscription.items?.data?.[0]?.price?.id || null
  const plan = isPremium ? getPlanFromPriceId(priceId) : 'free'

  await upsertProfileFromSubscription({
    userId: subscription.metadata?.supabase_user_id,
    email: null,
    isPremium,
    plan,
    stripeCustomerId: subscription.customer || null,
    stripeSubscriptionId: subscription.id || null,
  })
}

async function handleInvoicePaymentFailed(invoice) {
  const subscriptionId =
    typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id || null

  if (!subscriptionId) return

  const stripe = getStripe()
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  await upsertProfileFromSubscription({
    userId: subscription.metadata?.supabase_user_id,
    email: invoice.customer_email || null,
    isPremium: false,
    plan: 'free',
    stripeCustomerId: invoice.customer || null,
    stripeSubscriptionId: subscription.id || null,
  })
}

async function processStripeEvent(event) {
  const stripe = getStripe()

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object, stripe)
      break
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await handleSubscriptionChange(event.data.object)
      break
    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object)
      break
    default:
      break
  }
}

async function stripeWebhookHandler(req, res, rawBody) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return sendJson(res, 405, { error: 'Method not allowed.' })
  }

  const signature = req.headers['stripe-signature']
  if (!signature) {
    return sendJson(res, 400, { error: 'Missing Stripe signature.' })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn('STRIPE_WEBHOOK_SECRET is missing. Stripe webhook verification cannot run.')
    return sendJson(res, 500, { error: 'Stripe webhook is not configured.' })
  }

  try {
    const stripe = getStripe()
    const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)
    await processStripeEvent(event)
    return sendJson(res, 200, { received: true })
  } catch (error) {
    console.error('Stripe webhook handling failed:', error.message)
    return sendJson(res, 400, { error: 'Webhook verification failed.' })
  }
}

module.exports = {
  stripeWebhookHandler,
}
