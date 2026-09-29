import { ArrowUpRight, Users } from "lucide-react"
import { Link } from "react-router-dom"
import { formatDate } from "../utils/helpers.js"
import Badge from "./Badge.jsx"

function PastEventCard({ event }) {
  return (
    <article className="past-card">
      <div className="past-card-top"><Badge category={event.category} /><span>{formatDate(event.date)}</span></div>
      <h3>{event.title}</h3>
      <p>{event.recap}</p>
      <div className="past-card-bottom">
        <span><Users size={15} />{event.participants} participants</span>
        <Link className="card-link" to={`/events/${event.id}`} aria-label={`View ${event.title} recap`}>Recap <ArrowUpRight size={15} /></Link>
      </div>
    </article>
  )
}

export default PastEventCard
