import { ArrowDown, ArrowRight, GitBranch } from "lucide-react"
import { Link } from "react-router-dom"

function Hero({ eventCount, participantCount }) {
  return (
    <section className="hero-section commit-graph-bg" id="top">
      <div className="hero-copy fade-up">
        <div className="hero-kicker"><span className="status-dot" /> OPEN SOURCE MINDS. REAL-WORLD BUILDS.</div>
        <h1>Make things.<br /><span>Make them together.</span></h1>
        <p className="hero-description">
          Git Club is where CHARUSAT students learn by doing—from hands-on workshops and hackathons
          to coding contests and a community that has your back.
        </p>
        <div className="hero-actions">
          <Link className="button" to="/?section=events">Find your next event <ArrowRight size={17} /></Link>
          <Link className="text-link" to="/?section=about">Meet the club <ArrowDown size={15} /></Link>
        </div>
      </div>
      <div className="hero-stats" aria-label="Git Club at a glance">
        <div><strong>40<span>+</span></strong><span>events hosted</span></div>
        <div><strong>{participantCount.toLocaleString()}<span>+</span></strong><span>student participants</span></div>
        <div><strong>6</strong><span>hackathons shipped</span></div>
        <div className="hero-stats-mark"><GitBranch size={30} /><span>since day one</span></div>
      </div>
      <div className="hero-graphic" aria-hidden="true">
        <div className="graphic-orbit orbit-one" />
        <div className="graphic-orbit orbit-two" />
        <div className="graphic-node node-one" />
        <div className="graphic-node node-two" />
        <div className="graphic-node node-three" />
        <span className="graphic-code">git commit<br />-m "let's build"</span>
        <span className="graphic-number">0{eventCount}</span>
      </div>
    </section>
  )
}

export default Hero
