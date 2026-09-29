import { useCallback, useEffect, useRef, useState } from "react"
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Share2,
  TicketCheck,
  Users,
} from "lucide-react"
import { Link, Navigate, useParams } from "react-router-dom"
import { events, pastEvents } from "../data/events.js"
import { formatDate, generateICS, getCategoryColor, getGoogleCalendarUrl } from "../utils/helpers.js"
import { isRegistered } from "../utils/storage.js"
import Badge from "../components/Badge.jsx"
import EventCard from "../components/EventCard.jsx"
import Footer from "../components/Footer.jsx"
import RegistrationModal from "../components/RegistrationModal.jsx"
import Toast from "../components/Toast.jsx"

function EventDetail() {
  const { id } = useParams()
  const event = [...events, ...pastEvents].find((item) => item.id === id)
  const isPast = pastEvents.some((item) => item.id === id)
  const [registrationState, setRegistrationState] = useState(() => ({
    id: event?.id,
    registered: event ? isRegistered(event.id) : false,
  }))
  const registered = registrationState.id === event?.id
    ? registrationState.registered
    : Boolean(event && isRegistered(event.id))
  const [modalOpen, setModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const toastTimer = useRef(null)

  useEffect(() => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    window.scrollTo({ top: 0, behavior })
  }, [id])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const closeModal = useCallback(() => setModalOpen(false), [])

  function showToast(message) {
    window.clearTimeout(toastTimer.current)
    setToastMessage(message)
    toastTimer.current = window.setTimeout(() => setToastMessage(""), 3200)
  }

  async function shareEvent() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      showToast("Event link copied to clipboard")
    } catch {
      showToast("Could not copy the link. Please copy it from your browser.")
    }
  }

  function downloadCalendar() {
    try {
      const file = new Blob([generateICS(event)], { type: "text/calendar;charset=utf-8" })
      const url = URL.createObjectURL(file)
      const link = document.createElement("a")
      link.href = url
      link.download = `${event.id}.ics`
      document.body.append(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {
      showToast("Calendar file could not be created.")
    }
  }

  if (!event) return <Navigate to="/not-found" replace />

  const relatedEvents = events
    .filter((item) => item.id !== event.id && item.category === event.category)
    .slice(0, 3)
  const remainingSeats = Math.max(0, event.seatsLeft - (registered ? 1 : 0))
  const seatPercent = event.seatsTotal ? Math.min(100, (remainingSeats / event.seatsTotal) * 100) : 0
  const categoryColor = getCategoryColor(event.category)

  return (
    <div className="app-shell detail-shell">
      <main className="detail-main">
        <div className="detail-wrap">
          <Link to="/" className="detail-back"><ArrowLeft size={16} /> All events</Link>
          <header
            className="detail-hero fade-up"
            style={{ "--detail-color": categoryColor }}
          >
            <div className="detail-hero-copy">
              <div className="detail-badges"><Badge category={event.category} />{event.featured && <span className="detail-featured-label">FEATURED EVENT</span>}</div>
              <h1>{event.title}</h1>
              <p>{event.shortDescription}</p>
              <div className="detail-hero-meta">
                <span><CalendarDays size={16} />{formatDate(event.date)}</span>
                <span><Clock3 size={16} />{event.startTime} – {event.endTime}</span>
                <span><MapPin size={16} />{event.venue}</span>
              </div>
            </div>
            <div className="detail-hero-art" aria-hidden="true">
              <div className="detail-orbit detail-orbit-one" />
              <div className="detail-orbit detail-orbit-two" />
              <span className="detail-orbit-node node-a" />
              <span className="detail-orbit-node node-b" />
              <span className="detail-orbit-node node-c" />
              <span className="detail-art-label">GIT CLUB / {event.category.toUpperCase()}</span>
            </div>
          </header>

          <div className="detail-layout">
            <div className="detail-content">
              <section className="detail-section">
                <p className="eyebrow">THE OVERVIEW</p>
                <h2>About this event</h2>
                <div className="detail-prose">
                  {event.longDescription.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                {event.tags?.length > 0 && <div className="detail-tags">{event.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>}
              </section>

              {isPast && (
                <section className="detail-section recap-panel">
                  <p className="eyebrow">THE RECAP</p>
                  <h2>What a day.</h2>
                  <p>{event.recap}</p>
                  <div className="recap-attendance"><Users size={17} /><strong>{event.participants}</strong><span>participants joined us</span></div>
                </section>
              )}

              <section className="detail-section">
                <p className="eyebrow">THE PLAN</p>
                <h2>What to expect</h2>
                <ol className="agenda-list">
                  {event.agenda.map((item, index) => (
                    <li className="agenda-item" key={`${item.time}-${item.title}`}>
                      <span className="agenda-marker">{String(index + 1).padStart(2, "0")}</span>
                      <span className="agenda-time">{item.time}</span>
                      <span className="agenda-title">{item.title}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="detail-section">
                <p className="eyebrow">GOOD TO KNOW</p>
                <h2>Who can join</h2>
                <p className="detail-section-intro">All CHARUSAT students are welcome. Here’s what you need before you arrive:</p>
                <ul className="prerequisite-list">
                  {event.prerequisites.map((prerequisite) => <li key={prerequisite}><Check size={16} />{prerequisite}</li>)}
                </ul>
              </section>

              <section className="detail-section">
                <p className="eyebrow">YOUR HOSTS</p>
                <h2>Meet the organizers</h2>
                <div className="organizer-list">
                  {event.organizers.map((organizer) => (
                    <div className="organizer-card" key={`${organizer.name}-${organizer.role}`}>
                      <span className="organizer-avatar">{organizer.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
                      <span><strong>{organizer.name}</strong><small>{organizer.role}</small></span>
                    </div>
                  ))}
                </div>
              </section>

              {event.faqs?.length > 0 && (
                <section className="detail-section faq-section">
                  <p className="eyebrow">QUICK ANSWERS</p>
                  <h2>Frequently asked questions</h2>
                  <div className="faq-list">
                    {event.faqs.map((faq, index) => (
                      <details className="faq-item" key={faq.q}>
                        <summary><span>{faq.q}</span><span className="faq-number">0{index + 1}</span></summary>
                        <p>{faq.a}</p>
                      </details>
                    ))}
                  </div>
                </section>
              )}
              <div className="mobile-detail-actions" aria-label="Event actions">
                <button type="button" onClick={downloadCalendar}><ArrowDownToLine size={16} />Add to Calendar</button>
                <a href={getGoogleCalendarUrl(event)} target="_blank" rel="noreferrer"><CalendarDays size={16} />Google Calendar</a>
                <button type="button" onClick={shareEvent}><Share2 size={16} />Share event</button>
              </div>
            </div>

            <aside className={`detail-sidebar ${isPast ? "sidebar-past" : ""}`} aria-label="Event registration">
              <div className="sidebar-topline"><span>EVENT DETAILS</span><span className="sidebar-live-dot" /></div>
              <div className="sidebar-date-block">
                <span className="sidebar-date-day">{event.date.slice(-2)}</span>
                <span><strong>{formatDate(event.date).split(" ").slice(1).join(" ")}</strong><small>{event.startTime} – {event.endTime}</small></span>
              </div>
              <div className="sidebar-info">
                <span><MapPin size={16} /><span><small>WHERE</small><strong>{event.venue}</strong></span></span>
                <span><CalendarDays size={16} /><span><small>REGISTRATION DEADLINE</small><strong>{formatDate(event.registrationDeadline)}</strong></span></span>
              </div>
              {!isPast && (
                <>
                  <div className="seat-meter">
                    <div><span><Users size={15} /> SPOTS LEFT</span><strong>{remainingSeats} <small>/ {event.seatsTotal}</small></strong></div>
                    <div className="seat-meter-track"><span style={{ width: `${seatPercent}%` }} /></div>
                  </div>
                  <button className={`button detail-register ${registered ? "is-registered" : ""}`} type="button" onClick={() => !registered && setModalOpen(true)} disabled={registered || remainingSeats === 0}>
                    {registered ? <><Check size={17} /> Registered ✓</> : remainingSeats === 0 ? "Fully booked" : <>Register now <ArrowRight size={17} /></>}
                  </button>
                  <p className="sidebar-note">Free to join · CHARUSAT students</p>
                </>
              )}
              {isPast && <div className="registration-closed"><TicketCheck size={17} /><span>Registration closed</span></div>}
              <div className="sidebar-actions">
                <button type="button" onClick={downloadCalendar}><ArrowDownToLine size={15} />Add to Calendar</button>
                <a href={getGoogleCalendarUrl(event)} target="_blank" rel="noreferrer"><CalendarDays size={15} />Google Calendar</a>
                <button type="button" onClick={shareEvent}><Share2 size={15} />Share event</button>
              </div>
            </aside>
          </div>

          {relatedEvents.length > 0 && (
            <section className="detail-related">
              <div className="related-heading">
                <div><p className="eyebrow">KEEP THE MOMENTUM</p><h2>More in {event.category}</h2></div>
                <Link to="/?section=events">All events <ArrowRight size={15} /></Link>
              </div>
              <div className="event-grid related-grid">
                {relatedEvents.map((related, index) => <EventCard key={related.id} event={related} index={index} />)}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
      {!isPast && modalOpen && (
        <RegistrationModal
          event={event}
          onClose={closeModal}
          onSuccess={() => {
            setRegistrationState({ id: event.id, registered: true })
            showToast("Registration saved. See you there!")
          }}
        />
      )}
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      <div className="mobile-register-bar">
        {isPast ? <span><TicketCheck size={17} />Registration closed</span> : (
          <>
            <span><strong>{remainingSeats}</strong> spots left</span>
            <button className={`button ${registered ? "is-registered" : ""}`} type="button" disabled={registered || remainingSeats === 0} onClick={() => !registered && setModalOpen(true)}>
              {registered ? "Registered ✓" : remainingSeats === 0 ? "Fully booked" : "Register now"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default EventDetail
