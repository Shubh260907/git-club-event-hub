# Git Club CHARUSAT | Event Hub

A responsive event hub for Git Club CHARUSAT. Students can explore upcoming workshops, hackathons, competitions, and community gatherings, then register locally and add events to their calendar.

## Features

- Search upcoming events by title, description, or tag and filter by category.
- View event details, agendas, prerequisites, organizers, FAQs, and past-event recaps.
- Register with student details; registration state is saved in the browser.
- Add events to a calendar with an `.ics` download or Google Calendar link.
- Share event links, see a live countdown to the next event, and browse related events.
- Responsive dark theme with keyboard-friendly navigation and reduced-motion support.

## Tech stack

- React 19 and Vite
- React Router with hash-based routes
- Tailwind CSS v4 and custom CSS design tokens
- Lucide icons
- Browser local storage for demo registrations

## Run locally

Use Node.js 20.19+ or 22.12+ with npm.

```sh
npm install
npm run dev
```

Vite prints the local development URL in the terminal. To create and preview a production build:

```sh
npm run build
npm run preview
```

Run the linter with `npm run lint`.

## Deploy to Vercel or Netlify

Import the repository into Vercel or Netlify and use the Vite defaults:

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

The application uses `HashRouter`, so event detail routes work on static hosting without additional rewrite rules. Deployments should serve the built `dist` directory.

## What I’d improve with more time

- Connect registrations to a backend, with confirmation email and organizer tools.
- Add event imagery, richer recaps, and shareable social preview images.
- Add automated component, interaction, and responsive visual regression tests.
- Give organizers a simple way to update events without editing source files.
