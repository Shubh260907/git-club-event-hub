import { useState } from "react"
import { ArrowUpRight, GitBranch, Menu, X } from "lucide-react"
import { Link } from "react-router-dom"

const links = [
  { label: "Events", to: "/?section=events" },
  { label: "Past Events", to: "/?section=past-events" },
  { label: "About", to: "/?section=about" },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/?section=top" onClick={closeMenu} aria-label="Git Club CHARUSAT home">
          <span className="brand-mark"><GitBranch size={21} strokeWidth={2.2} /></span>
          <span>Git Club <span className="brand-divider">|</span> CHARUSAT</span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          {links.map((link) => (
            <Link to={link.to} key={link.to} onClick={closeMenu}>{link.label}</Link>
          ))}
          <Link className="button button-small nav-cta" to="/?section=events" onClick={closeMenu}>
            Browse events <ArrowUpRight size={16} />
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
