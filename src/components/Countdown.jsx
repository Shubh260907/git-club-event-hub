import { useEffect, useState } from "react"
import { ArrowUpRight, Clock3 } from "lucide-react"
import { Link } from "react-router-dom"
import { formatDate, getCountdown } from "../utils/helpers.js"

function Countdown({ event }) {
  const [time, setTime] = useState(() => getCountdown(event.date, event.startTime))

  useEffect(() => {
    const timer = window.setInterval(() => setTime(getCountdown(event.date, event.startTime)), 1000)
    return () => window.clearInterval(timer)
  }, [event.date, event.startTime])

  const units = [
    ["days", "days"],
    ["hours", "hrs"],
    ["minutes", "min"],
    ["seconds", "sec"],
  ]

  return (
    <section className="countdown-panel" aria-label="Countdown to the next event">
      <div className="countdown-event">
        <span className="countdown-icon"><Clock3 size={18} /></span>
        <div><p className="eyebrow">UP NEXT · {formatDate(event.date)}</p><strong>{event.title}</strong></div>
      </div>
      <div className="countdown-clock" aria-live="off">
        {units.map(([key, label]) => (
          <div className="countdown-unit" key={key}>
            <span>{String(time[key]).padStart(2, "0")}</span><small>{label}</small>
          </div>
        ))}
      </div>
      <Link className="countdown-link" to={`/events/${event.id}`} aria-label={`View details for ${event.title}`}>
        View details <ArrowUpRight size={16} />
      </Link>
    </section>
  )
}

export default Countdown
