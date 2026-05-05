const { createCheckoutSessionHandler } = require('../server/lib/createCheckoutSession')

module.exports = async function handler(req, res) {
  if (typeof req.body === 'undefined') {
    let rawBody = ''
    for await (const chunk of req) {
      rawBody += chunk
    }
    req.body = rawBody
  }

  return createCheckoutSessionHandler(req, res)
}
