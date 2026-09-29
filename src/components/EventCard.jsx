import { ArrowUpRight, CalendarDays, MapPin, Users } from "lucide-react"
import { Link } from "react-router-dom"
import { formatDate, getCategoryColor } from "../utils/helpers.js"
import Badge from "./Badge.jsx"

function EventCard({ event, index = 0 }) {
  const color = getCategoryColor(event.category)
  return (
    <article className="event-card fade-up" style={{ "--event-color": color, animationDelay: `${index * 55}ms` }}>
      <div className="event-card-top"><Badge category={event.category} /><span className="event-date">{formatDate(event.date)}</span></div>
      <h3>{event.title}</h3>
      <p className="event-description">{event.shortDescription}</p>
      <div className="event-meta">
        <span><CalendarDays size={15} />{event.startTime} – {event.endTime}</span>
        <span><MapPin size={15} />{event.venue}</span>
      </div>
      <div className="event-card-bottom">
        <span className="seats-left"><Users size={15} />{event.seatsLeft} seats left</span>
        <Link className="card-link" to={`/events/${event.id}`}>Details <ArrowUpRight size={15} /></Link>
      </div>
    </article>
  )
}

export default EventCard
