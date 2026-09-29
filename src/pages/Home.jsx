import { useEffect, useMemo, useState } from "react"
import { ArrowRight, Code2, Compass, Lightbulb, UsersRound } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { events, pastEvents } from "../data/events.js"
import { getNextEvent } from "../utils/helpers.js"
import CategoryChips from "../components/CategoryChips.jsx"
import Countdown from "../components/Countdown.jsx"
import EventCard from "../components/EventCard.jsx"
import FeaturedEvent from "../components/FeaturedEvent.jsx"
import Footer from "../components/Footer.jsx"
import Header from "../components/Header.jsx"
import Hero from "../components/Hero.jsx"
import PastEventCard from "../components/PastEventCard.jsx"
import SearchBar from "../components/SearchBar.jsx"
import SectionHeading from "../components/SectionHeading.jsx"

const starterPath = [
  { number: "01", icon: Compass, title: "Show up curious", description: "Join a workshop or meetup. No experience is expected—just bring a question and a willingness to try." },
  { number: "02", icon: Code2, title: "Build with people", description: "Pair up on a project, learn Git together, and turn your first idea into something you can share." },
  { number: "03", icon: Lightbulb, title: "Find your people", description: "Come to an event, meet the crew, and join the club community. Your next collaborator is here." },
]

function Home() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const featured = events.find((event) => event.featured)
  const [nextEvent, setNextEvent] = useState(() => getNextEvent(events))
  const location = useLocation()
  const participantCount = pastEvents.reduce((sum, event) => sum + event.participants, 0)
  const filteredEvents = useMemo(() => {
    const searchTerm = query.trim().toLowerCase()
    return events.filter((event) => {
      const categoryMatches = category === "All" || event.category === category
      const content = [event.title, event.shortDescription, ...event.tags].join(" ").toLowerCase()
      return categoryMatches && (!searchTerm || content.includes(searchTerm))
    })
  }, [query, category])

  useEffect(() => {
    const section = new URLSearchParams(location.search).get("section")
    if (!section) return undefined
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    const frame = window.requestAnimationFrame(() => {
      if (section === "top") {
        window.scrollTo({ top: 0, behavior })
      } else {
        document.getElementById(section)?.scrollIntoView({ behavior, block: "start" })
      }
    })
    return () => window.cancelAnimationFrame(frame)
  }, [location.search, location.key])

  useEffect(() => {
    const timer = window.setInterval(() => {
      const nearest = getNextEvent(events)
      setNextEvent((current) => current?.id === nearest?.id ? current : nearest)
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  function clearFilters() {
    setQuery("")
    setCategory("All")
  }

  return (
    <div className="app-shell">
      <Header />
      <main>
        <div className="page-wrap">
          <Hero eventCount={events.length} participantCount={participantCount} />
          {nextEvent && <Countdown event={nextEvent} />}

          {featured && (
            <section className="content-section featured-section" aria-labelledby="featured-heading">
              <SectionHeading id="featured-heading" eyebrow="HAND-PICKED FOR YOU" title="The one to put on your calendar" />
              <FeaturedEvent event={featured} />
            </section>
          )}

          <section className="content-section" id="events" aria-labelledby="events-heading">
            <SectionHeading
              eyebrow="FIND YOUR NEXT THING"
              title="Upcoming events"
              id="events-heading"
              description="Good people, practical skills, and something new to try every time."
            />
            <div className="event-filters">
              <SearchBar value={query} onChange={setQuery} />
              <CategoryChips selected={category} onSelect={setCategory} />
            </div>
            <div className="results-line">
              <span>{filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"} to explore</span>
              <span>OCT — DEC 2026</span>
            </div>
            {filteredEvents.length > 0 ? (
              <div className="event-grid">
                {filteredEvents.map((event, index) => <EventCard event={event} index={index} key={event.id} />)}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon"><UsersRound size={24} /></span>
                <h3>No events found (yet).</h3>
                <p>Try another search or category. Your next favorite event is out there.</p>
                <button className="button button-quiet" type="button" onClick={clearFilters}>Clear filters</button>
              </div>
            )}
          </section>

          <section className="content-section past-section" id="past-events" aria-labelledby="past-heading">
            <SectionHeading
              eyebrow="GOOD TIMES, GREAT BUILDS"
              title="From the archives"
              id="past-heading"
              description="A few highlights from the things we’ve made and learned together."
            />
            <div className="past-stats">
              <div><strong>{pastEvents.length}</strong><span>past events</span></div>
              <div><strong>{participantCount}</strong><span>student participants</span></div>
              <div className="past-stats-note"><UsersRound size={17} /><span>Every event starts with someone showing up.</span></div>
            </div>
            <div className="past-grid">
              {pastEvents.map((event) => <PastEventCard event={event} key={event.id} />)}
            </div>
          </section>

          <section className="content-section about-section" id="about">
            <div className="about-heading">
              <p className="eyebrow">YOUR FIRST COMMIT STARTS HERE</p>
              <h2>New here? <span>You’re in the right place.</span></h2>
              <p>Everyone starts somewhere. Here’s your path from curious to collaborator.</p>
            </div>
            <div className="starter-grid">
              {starterPath.map(({ number, icon: Icon, title, description }) => (
                <article className="starter-card" key={number}>
                  <div className="starter-top"><span>{number}</span><Icon size={20} /></div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
            <Link className="about-cta" to="/?section=events">Find your first event <ArrowRight size={17} /></Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Home
