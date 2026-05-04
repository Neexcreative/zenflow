import { useEffect, useState } from 'react'
import useZenflowStore from '../../store/useZenflowStore'
import WidgetCard from '../WidgetCard'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function ClockWidget() {
  const { clockFormat } = useZenflowStore()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(intervalId)
  }, [])

  const rawHours = now.getHours()
  const hours = clockFormat === '24h' ? rawHours : rawHours % 12 || 12
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const ampm = clockFormat === '12h' ? (rawHours >= 12 ? 'PM' : 'AM') : null
  const dateString = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`

  return (
    <WidgetCard title="Clock">
      <div className="clock-widget">
        <div className="clock-primary">
          <span className="clock-major">{String(hours).padStart(2, '0')}</span>
          <span className="clock-separator">:</span>
          <span className="clock-major">{minutes}</span>
          <span className="clock-seconds">{seconds}</span>
          {ampm && <span className="clock-ampm">{ampm}</span>}
        </div>

        <div className="clock-divider" />
        <div className="clock-date">{dateString}</div>
      </div>
    </WidgetCard>
  )
}
