const REGISTRATIONS_KEY = "git-club-charusat-registrations"

export function getRegistrations() {
  try {
    const registrations = JSON.parse(window.localStorage.getItem(REGISTRATIONS_KEY) ?? "[]")
    return Array.isArray(registrations) ? registrations.filter((id) => typeof id === "string") : []
  } catch {
    return []
  }
}

export function isRegistered(eventId) {
  return typeof eventId === "string" && getRegistrations().includes(eventId)
}

export function saveRegistration(eventId) {
  if (typeof eventId !== "string" || eventId.length === 0) return false
  try {
    const registrations = getRegistrations()
    if (!registrations.includes(eventId)) registrations.push(eventId)
    window.localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations))
    return true
  } catch {
    return false
  }
}

export function removeRegistration(eventId) {
  if (typeof eventId !== "string") return false
  try {
    const registrations = getRegistrations().filter((id) => id !== eventId)
    window.localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations))
    return true
  } catch {
    return false
  }
}
