import { useEffect, useRef, useState } from "react"
import { ArrowDownToLine, Check, LoaderCircle, X } from "lucide-react"
import { formatDate, generateICS } from "../utils/helpers.js"
import { saveRegistration } from "../utils/storage.js"

const branches = ["CE", "IT", "CSE", "EC", "ME", "Civil", "Other"]
const years = ["1st", "2nd", "3rd", "4th"]
const initialValues = { name: "", enrollmentId: "", email: "", branch: "", year: "" }

function validate(values) {
  const errors = {}
  if (values.name.trim().length < 2) errors.name = "Enter your full name."
  if (!/^\d{2}[A-Za-z]{2}\d{3}$/.test(values.enrollmentId.trim())) {
    errors.enrollmentId = "Use the format 24CS084."
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Enter a valid email address."
  if (!branches.includes(values.branch)) errors.branch = "Choose your branch."
  if (!years.includes(values.year)) errors.year = "Choose your current year."
  return errors
}

function RegistrationModal({ event, onClose, onSuccess }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [registeredUser, setRegisteredUser] = useState(null)
  const [submitError, setSubmitError] = useState("")
  const dialogRef = useRef(null)
  const submittingRef = useRef(submitting)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    dialogRef.current?.querySelector("input")?.focus()

    function handleKeyDown(event) {
      if (event.key === "Escape" && !submittingRef.current) {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== "Tab" || !dialogRef.current) return
      const focusable = [...dialogRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )].filter((element) => element.offsetParent !== null)
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  useEffect(() => {
    if (registeredUser) dialogRef.current?.querySelector(".registration-success h2")?.focus()
  }, [registeredUser])

  function updateField(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: name === "enrollmentId" ? value.toUpperCase() : value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setSubmitError("")
  }

  async function submitRegistration(eventObject) {
    eventObject.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      dialogRef.current?.querySelector(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus()
      return
    }

    submittingRef.current = true
    setSubmitting(true)
    await new Promise((resolve) => window.setTimeout(resolve, 1000))
    const registrant = { ...values, name: values.name.trim(), email: values.email.trim() }
    if (!saveRegistration(event.id)) {
      submittingRef.current = false
      setSubmitting(false)
      setSubmitError("We couldn't save your registration on this device. Please try again.")
      return
    }
    setRegisteredUser(registrant)
    submittingRef.current = false
    setSubmitting(false)
    onSuccess()
  }

  function downloadCalendar() {
    const file = new Blob([generateICS(event)], { type: "text/calendar;charset=utf-8" })
    const url = URL.createObjectURL(file)
    const link = document.createElement("a")
    link.href = url
    link.download = `${event.id}.ics`
    document.body.append(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(clickEvent) => {
        if (clickEvent.target === clickEvent.currentTarget && !submitting) onClose()
      }}
    >
      <section
        className="registration-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-title"
        ref={dialogRef}
      >
        <button className="modal-close" type="button" aria-label="Close registration" onClick={onClose} disabled={submitting}>
          <X size={19} />
        </button>
        {registeredUser ? (
          <div className="registration-success">
            <span className="success-mark"><Check size={25} /></span>
            <p className="eyebrow">YOU’RE ON THE LIST</p>
            <h2 id="registration-title" tabIndex={-1}>You’re registered, {registeredUser.name.split(" ")[0]}.</h2>
            <p className="success-copy">Your spot for <strong>{event.title}</strong> is saved on this device.</p>
            <div className="registration-summary">
              <span>{formatDate(event.date)} · {event.startTime}</span>
              <span>{event.venue}</span>
              <span>{registeredUser.enrollmentId} · {registeredUser.branch} · {registeredUser.year} year</span>
            </div>
            <button type="button" className="button modal-calendar-button" onClick={downloadCalendar}>
              <ArrowDownToLine size={16} /> Add to calendar
            </button>
            <button type="button" className="modal-done" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <p className="eyebrow">SAVE YOUR SPOT</p>
            <h2 id="registration-title">Register for {event.title}</h2>
            <p className="modal-intro">Just a few details and you’re in. All fields are required.</p>
            <form className="registration-form" onSubmit={submitRegistration} noValidate>
              <div className="form-field">
                <label htmlFor="registration-name">Full name</label>
                <input id="registration-name" name="name" autoComplete="name" value={values.name} onChange={updateField} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
                {errors.name && <span className="field-error" id="name-error">{errors.name}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="registration-enrollment">Enrollment ID</label>
                <input id="registration-enrollment" name="enrollmentId" placeholder="24CS084" autoComplete="off" value={values.enrollmentId} onChange={updateField} aria-invalid={Boolean(errors.enrollmentId)} aria-describedby={errors.enrollmentId ? "enrollment-error" : "enrollment-hint"} />
                {errors.enrollmentId ? <span className="field-error" id="enrollment-error">{errors.enrollmentId}</span> : <span className="field-hint" id="enrollment-hint">Example: 24CS084</span>}
              </div>
              <div className="form-field">
                <label htmlFor="registration-email">Email address</label>
                <input id="registration-email" name="email" type="email" autoComplete="email" value={values.email} onChange={updateField} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
                {errors.email && <span className="field-error" id="email-error">{errors.email}</span>}
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="registration-branch">Branch</label>
                  <select id="registration-branch" name="branch" value={values.branch} onChange={updateField} aria-invalid={Boolean(errors.branch)} aria-describedby={errors.branch ? "branch-error" : undefined}>
                    <option value="">Select branch</option>
                    {branches.map((branch) => <option key={branch} value={branch}>{branch}</option>)}
                  </select>
                  {errors.branch && <span className="field-error" id="branch-error">{errors.branch}</span>}
                </div>
                <div className="form-field">
                  <label htmlFor="registration-year">Year</label>
                  <select id="registration-year" name="year" value={values.year} onChange={updateField} aria-invalid={Boolean(errors.year)} aria-describedby={errors.year ? "year-error" : undefined}>
                    <option value="">Select year</option>
                    {years.map((year) => <option key={year} value={year}>{year} year</option>)}
                  </select>
                  {errors.year && <span className="field-error" id="year-error">{errors.year}</span>}
                </div>
              </div>
              {submitError && <p className="form-submit-error" role="alert">{submitError}</p>}
              <button className="button registration-submit" type="submit" disabled={submitting}>
                {submitting ? <><LoaderCircle className="spinner" size={17} /> Saving your spot…</> : "Confirm registration"}
              </button>
              <p className="form-privacy">Your details stay in this browser and are only used for your event registration.</p>
            </form>
          </>
        )}
      </section>
    </div>
  )
}

export default RegistrationModal
