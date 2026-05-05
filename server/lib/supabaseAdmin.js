const { createClient } = require('@supabase/supabase-js')

let warnedMissingServiceVars = false
let adminClient = null

function hasSupabaseServiceConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

function getSupabaseAdmin() {
  if (!hasSupabaseServiceConfig()) {
    if (!warnedMissingServiceVars) {
      warnedMissingServiceVars = true
      console.warn('Supabase service variables are missing. Stripe webhooks will not sync profiles yet.')
    }
    return null
  }

  if (!adminClient) {
    adminClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }

  return adminClient
}

module.exports = {
  getSupabaseAdmin,
  hasSupabaseServiceConfig,
}
