require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))

const QUOTES = [
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: "It always seems impossible until it's done.", author: 'Nelson Mandela' },
  { text: "Don't watch the clock; do what it does. Keep going.", author: 'Sam Levenson' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: "Believe you can and you're halfway there.", author: 'Theodore Roosevelt' },
]

app.get('/', (req, res) => {
  res.send('Zenflow API is running')
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Zenflow API is running',
    timestamp: new Date().toISOString(),
  })
})

app.get('/api/quotes', (req, res) => {
  res.json({ quotes: QUOTES })
})

app.post('/api/user/plan', (req, res) => {
  const { plan } = req.body

  if (!['free', 'pro', 'premium'].includes(plan)) {
    return res.status(400).json({ error: 'Invalid plan' })
  }

  return res.json({ success: true, plan })
})

app.get('/api/weather/:city', async (req, res) => {
  const { city } = req.params
  const apiKey = process.env.OPENWEATHER_API_KEY

  if (!apiKey || apiKey === 'your_api_key_here') {
    return res.status(503).json({ error: 'OPENWEATHER_API_KEY is not configured in .env' })
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=en`
    )
    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json(data)
    }

    return res.json(data)
  } catch (error) {
    return res.status(500).json({
      error: 'Could not load weather data',
      detail: error.message,
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
