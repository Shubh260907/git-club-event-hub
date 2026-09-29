import { GitBranch, MoveUpRight } from "lucide-react"
import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <Link className="brand footer-brand" to="/?section=top">
            <span className="brand-mark"><GitBranch size={20} /></span>
            <span>Git Club <span className="brand-divider">|</span> CHARUSAT</span>
          </Link>
          <p className="footer-note">Building skills, shipping ideas, growing together.</p>
        </div>
        <div className="footer-socials" aria-label="Social links">
          <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
            <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.68-3.75-1.32-3.75-1.32-.5-1.3-1.24-1.65-1.24-1.65-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.7 2.62 1.21 3.26.93.1-.72.39-1.21.71-1.49-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.44-2.22 1.15-3.01-.12-.28-.5-1.42.11-2.97 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.56 0c2.12-1.45 3.05-1.15 3.05-1.15.61 1.55.23 2.69.11 2.97.72.79 1.15 1.79 1.15 3.01 0 4.29-2.61 5.23-5.1 5.51.4.35.76 1.03.76 2.08V22c0 .29.2.63.76.53A11.1 11.1 0 0 0 12 .9Z" /></svg>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true"><path d="M20.45 2H3.55C2.7 2 2 2.67 2 3.5v17c0 .83.7 1.5 1.55 1.5h16.9c.85 0 1.55-.67 1.55-1.5v-17c0-.83-.7-1.5-1.55-1.5ZM7.93 18.45H4.96V9h2.97v9.45ZM6.44 7.71a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44Zm12.01 10.74h-2.96v-4.59c0-1.1-.02-2.52-1.54-2.52-1.55 0-1.79 1.2-1.79 2.44v4.67H9.2V9h2.84v1.29h.04a3.12 3.12 0 0 1 2.8-1.54c3 0 3.57 1.97 3.57 4.53v5.17Z" /></svg>
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Git Club CHARUSAT</span>
        <a href="https://github.com" target="_blank" rel="noreferrer">Built by the community <MoveUpRight size={14} /></a>
      </div>
    </footer>
  )
}

export default Footer
