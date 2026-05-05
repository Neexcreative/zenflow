const { stripeWebhookHandler } = require('../server/lib/stripeWebhook')

module.exports = async function handler(req, res) {
  const chunks = []

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  const rawBody = Buffer.concat(chunks)
  return stripeWebhookHandler(req, res, rawBody)
}
