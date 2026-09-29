import { ArrowRight, CalendarDays, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import { formatDate } from "../utils/helpers.js"
import Badge from "./Badge.jsx"

function FeaturedEvent({ event }) {
  return (
    <article className="featured-card fade-up">
      <div className="featured-content">
        <div className="featured-topline"><Badge category={event.category} /> <span className="featured-label">EDITOR'S PICK</span></div>
        <h3>{event.title}</h3>
        <p>{event.shortDescription}</p>
        <div className="event-meta featured-meta">
          <span><CalendarDays size={16} />{formatDate(event.date)} <i>·</i> {event.startTime}</span>
          <span><MapPin size={16} />{event.venue}</span>
        </div>
        <Link className="button" to={`/events/${event.id}`}>Explore the event <ArrowRight size={17} /></Link>
      </div>
      <div className="featured-art" aria-hidden="true">
        <div className="art-ring art-ring-large" />
        <div className="art-ring art-ring-small" />
        <div className="art-branch"><span /><span /><span /><span /></div>
        <code>git push origin<br /><b>your-next-idea</b></code>
        <span className="art-stamp">01 / GIT CLUB</span>
      </div>
    </article>
  )
}

export default FeaturedEvent
