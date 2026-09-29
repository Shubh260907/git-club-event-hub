const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const CATEGORY_COLORS = {
  Workshop: "#3b82f6",
  Competition: "#f59e0b",
  Hackathon: "#f05032",
  Community: "#22c55e",
  Social: "#a855f7",
}

function parseTime(time) {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time ?? "")
  if (!match) return null
  const hour12 = Number(match[1])
  const minute = Number(match[2])
  if (hour12 < 1 || hour12 > 12 || minute > 59) return null
  let hour = hour12 % 12
  if (match[3].toUpperCase() === "PM") hour += 12
  return { hour, minute }
}

function parseEventDate(dateISO, startTime = "12:00 AM") {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateISO ?? "")
  const time = parseTime(startTime)
  if (!dateMatch || !time) return null

  const [, year, month, day] = dateMatch
  const date = new Date(Number(year), Number(month) - 1, Number(day), time.hour, time.minute)
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null
  }
  return date
}

export function formatDate(dateISO) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateISO ?? "")
  if (!match) return ""
  const [, year, month, day] = match
  const monthIndex = Number(month) - 1
  if (monthIndex < 0 || monthIndex > 11 || Number(day) < 1 || Number(day) > 31) return ""
  const date = new Date(Number(year), monthIndex, Number(day))
  if (date.getFullYear() !== Number(year) || date.getMonth() !== monthIndex || date.getDate() !== Number(day)) return ""
  return `${Number(day)} ${MONTHS[monthIndex]} ${year}`
}

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] ?? "#8b95a3"
}

export function getCountdown(dateISO, startTime) {
  const target = parseEventDate(dateISO, startTime)
  let remaining = target ? Math.max(0, target.getTime() - Date.now()) : 0
  const days = Math.floor(remaining / 86400000)
  remaining %= 86400000
  const hours = Math.floor(remaining / 3600000)
  remaining %= 3600000
  const minutes = Math.floor(remaining / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)
  return { days, hours, minutes, seconds }
}

export function getNextEvent(eventList) {
  const now = Date.now()
  return eventList
    .map((event) => ({ event, date: parseEventDate(event.date, event.startTime) }))
    .filter(({ date }) => date && date.getTime() >= now)
    .sort((a, b) => a.date - b.date)[0]?.event ?? null
}

function escapeICSText(value = "") {
  return String(value).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;")
}

function toICSDateTime(dateISO, time) {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateISO ?? "")
  const parsedTime = parseTime(time)
  if (!dateMatch || !parsedTime) return null
  const [, year, month, day] = dateMatch
  const localDate = new Date(Number(year), Number(month) - 1, Number(day))
  if (localDate.getFullYear() !== Number(year) || localDate.getMonth() !== Number(month) - 1 || localDate.getDate() !== Number(day)) return null
  const utc = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), parsedTime.hour, parsedTime.minute) - 330 * 60000)
  return `${utc.getUTCFullYear()}${String(utc.getUTCMonth() + 1).padStart(2, "0")}${String(utc.getUTCDate()).padStart(2, "0")}T${String(utc.getUTCHours()).padStart(2, "0")}${String(utc.getUTCMinutes()).padStart(2, "0")}00Z`
}

function eventTimes(event) {
  const start = toICSDateTime(event.date, event.startTime)
  const end = toICSDateTime(event.date, event.endTime)
  return start && end ? { start, end } : null
}

export function generateICS(event) {
  const times = eventTimes(event)
  if (!times) throw new RangeError("Event must have a valid date, start time, and end time.")
  const uid = `${escapeICSText(event.id || `${event.title}-${event.date}`)}@gitclubcharusat`
  const description = [event.shortDescription, event.venue && `Venue: ${event.venue}`].filter(Boolean).join("\n")
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Git Club CHARUSAT//Event Hub//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `DTSTART:${times.start}`,
    `DTEND:${times.end}`,
    `SUMMARY:${escapeICSText(event.title)}`,
    `DESCRIPTION:${escapeICSText(description)}`,
    ...(event.venue ? [`LOCATION:${escapeICSText(event.venue)}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ]
  return `${lines.join("\r\n")}\r\n`
}

export function getGoogleCalendarUrl(event) {
  const times = eventTimes(event)
  if (!times) throw new RangeError("Event must have a valid date, start time, and end time.")
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title ?? "",
    dates: `${times.start}/${times.end}`,
    details: [event.shortDescription, event.longDescription].filter(Boolean).join("\n\n"),
    location: event.venue ?? "",
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
