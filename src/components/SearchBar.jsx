import { Search, X } from "lucide-react"

function SearchBar({ value, onChange }) {
  return (
    <label className="search-field">
      <Search size={18} aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search events, topics, tags..."
        aria-label="Search events"
      />
      {value && <button type="button" aria-label="Clear search" onClick={() => onChange("")}><X size={16} /></button>}
    </label>
  )
}

export default SearchBar
