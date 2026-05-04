import { useEffect, useMemo, useState } from 'react'
import WidgetCard from '../WidgetCard'

const DEFAULT_CITY = 'Lisbon'

function formatTime(value) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(value)
}

function WeatherIcon({ kind }) {
  if (kind === 'clear') {
    return (
      <div className="weather-sun">
        <div className="weather-sun-rays" />
        <div className="weather-sun-core" />
      </div>
    )
  }

  if (kind === 'rain') {
    return (
      <div className="weather-rain">
        <svg viewBox="0 0 60 60" className="weather-cloud-svg" aria-hidden="true">
          <path
            d="M19 41h20c7.1 0 12-4.7 12-11.1 0-5.8-4-10.3-9.7-10.9C39 12.2 34.8 9 29.6 9 22.7 9 17.1 14.5 17 21.3 11.8 22.2 8 26.5 8 31.6 8 37 12.5 41 19 41Z"
            fill="rgba(255,255,255,0.15)"
            stroke="rgba(255,255,255,0.12)"
          />
        </svg>
        <span className="weather-drop one" />
        <span className="weather-drop two" />
        <span className="weather-drop three" />
      </div>
    )
  }

  return (
    <div className="weather-cloud">
      <svg viewBox="0 0 60 60" className="weather-cloud-svg" aria-hidden="true">
        <path
          d="M19 41h20c7.1 0 12-4.7 12-11.1 0-5.8-4-10.3-9.7-10.9C39 12.2 34.8 9 29.6 9 22.7 9 17.1 14.5 17 21.3 11.8 22.2 8 26.5 8 31.6 8 37 12.5 41 19 41Z"
          fill="rgba(255,255,255,0.15)"
          stroke="rgba(255,255,255,0.12)"
        />
      </svg>
    </div>
  )
}

export default function WeatherWidget() {
  const [state, setState] = useState({
    status: 'loading',
    city: DEFAULT_CITY,
    temperature: '--',
    condition: 'Loading current weather',
    updatedAt: new Date(),
  })

  useEffect(() => {
    let active = true

    fetch(`/api/weather/${DEFAULT_CITY}`)
      .then(async (response) => {
        const payload = await response.json()
        if (!active) return

        if (!response.ok || payload.cod === '404' || payload.cod === 404) {
          throw new Error(payload.message || 'Could not load weather')
        }

        setState({
          status: 'ready',
          city: payload.name || DEFAULT_CITY,
          temperature: Math.round(payload.main?.temp ?? 0),
          condition: payload.weather?.[0]?.description || 'Stable weather',
          updatedAt: new Date(),
          humidity: payload.main?.humidity ?? '--',
          wind: Math.round(payload.wind?.speed ?? 0),
          feelsLike: Math.round(payload.main?.feels_like ?? 0),
          icon: payload.weather?.[0]?.main || 'Clouds',
        })
      })
      .catch(() => {
        if (!active) return
        setState({
          status: 'fallback',
          city: 'Lisbon',
          temperature: 22,
          condition: 'Partly cloudy',
          updatedAt: new Date(),
          humidity: 65,
          wind: 12,
          feelsLike: 20,
          icon: 'Clouds',
        })
      })

    return () => {
      active = false
    }
  }, [])

  const iconKind = useMemo(() => {
    if (state.icon === 'Clear') return 'clear'
    if (['Rain', 'Drizzle', 'Thunderstorm'].includes(state.icon)) return 'rain'
    return 'cloud'
  }, [state.icon])

  return (
    <WidgetCard title="Weather">
      <div className={`weather-widget weather-theme-${iconKind}`}>
        <div className="weather-backdrop" aria-hidden="true" />
        <div className="weather-copy">
          <div className="weather-city">{state.city}</div>
          <div className="weather-temp">{state.temperature}°</div>
          <div className="weather-condition">{state.condition}</div>
        </div>

        <div className="weather-visual">
          <WeatherIcon kind={iconKind} />
        </div>
      </div>

      <div className="weather-stats">
        <div>
          <span>Feels like</span>
          <strong>{state.feelsLike}°</strong>
        </div>
        <div>
          <span>Humidity</span>
          <strong>{state.humidity}%</strong>
        </div>
        <div>
          <span>Wind</span>
          <strong>{state.wind} km/h</strong>
        </div>
      </div>

      <div className="weather-footer">
        {state.status === 'fallback'
          ? 'Demo weather mode'
          : `Updated at ${formatTime(state.updatedAt)}`}
      </div>
    </WidgetCard>
  )
}
