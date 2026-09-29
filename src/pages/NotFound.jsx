import { ArrowLeft, GitBranch } from "lucide-react"
import { Link } from "react-router-dom"

function NotFound() {
  return (
    <main className="placeholder-page">
      <div className="placeholder-card">
        <span className="placeholder-icon"><GitBranch size={23} /></span>
        <p className="eyebrow">404 · LOST IN THE REPOSITORY</p>
        <h1>This page took a different branch.</h1>
        <p>The page you’re looking for isn’t here. Let’s get you back to the event hub.</p>
        <Link to="/" className="button"><ArrowLeft size={16} /> Return home</Link>
      </div>
    </main>
  )
}

export default NotFound
