import { getCategoryColor } from "../utils/helpers.js"

function Badge({ category, children = category, className = "" }) {
  const color = category ? getCategoryColor(category) : undefined
  return (
    <span
      className={`badge ${className}`}
      style={color ? { "--badge-color": color } : undefined}
    >
      {children}
    </span>
  )
}

export default Badge
