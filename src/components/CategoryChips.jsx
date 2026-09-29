const categories = ["All", "Workshop", "Competition", "Hackathon", "Community", "Social"]

function CategoryChips({ selected, onSelect }) {
  return (
    <div className="category-chips" role="group" aria-label="Filter events by category">
      {categories.map((category) => (
        <button
          className={`category-chip ${selected === category ? "is-selected" : ""}`}
          type="button"
          key={category}
          aria-pressed={selected === category}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

export default CategoryChips
