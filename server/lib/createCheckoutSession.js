const { getPriceIdForPlan, getStripe } = require('./stripe')

function sendJson(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

function normalizeBody(body) {
  if (!body) return {}
  if (typeof body === 'string') {
    try {
      return JSON.parse(body)
    } catch {
      return null
    }
  }
  return body
}

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function createCheckoutSessionHandler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return sendJson(res, 405, { error: 'Method not allowed.' })
  }

  const body = normalizeBody(req.body)
  if (!body) {
    return sendJson(res, 400, { error: 'Invalid JSON body.' })
  }

  const { plan, userId, email } = body

  if (!['monthly', 'yearly'].includes(plan)) {
    return sendJson(res, 400, { error: 'Invalid plan selection.' })
  }

  if (!userId || typeof userId !== 'string') {
    return sendJson(res, 400, { error: 'Missing userId.' })
  }

  if (!isValidEmail(email)) {
    return sendJson(res, 400, { error: 'A valid email is required.' })
  }

  const priceId = getPriceIdForPlan(plan)
  if (!priceId) {
    return sendJson(res, 500, { error: 'Stripe pricing is not configured.' })
  }

  if (!process.env.SITE_URL) {
    return sendJson(res, 500, { error: 'SITE_URL is not configured.' })
  }

  try {
    const stripe = getStripe()
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    })
    const existingCustomer = existingCustomers.data[0]

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: existingCustomer ? existingCustomer.id : undefined,
      customer_email: existingCustomer ? undefined : email,
      subscription_data: {
        metadata: {
          supabase_user_id: userId,
          plan,
        },
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.SITE_URL}?checkout=success`,
      cancel_url: `${process.env.SITE_URL}?checkout=cancelled`,
      metadata: {
        supabase_user_id: userId,
        plan,
      },
    })

    return sendJson(res, 200, { url: session.url })
  } catch (error) {
    console.error('Stripe checkout session creation failed:', error.message)
    return sendJson(res, 500, { error: 'Could not start checkout.' })
  }
}

module.exports = {
  createCheckoutSessionHandler,
}
