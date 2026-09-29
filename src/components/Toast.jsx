import { Check, X } from "lucide-react"

function Toast({ message, onClose }) {
  if (!message) return null
  return (
    <div className="toast" role="status">
      <span className="toast-check"><Check size={16} /></span>
      <span>{message}</span>
      <button type="button" aria-label="Dismiss notification" onClick={onClose}><X size={15} /></button>
    </div>
  )
}

export default Toast
