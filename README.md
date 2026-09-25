# Ashwin E — Portfolio

A responsive, dark futuristic portfolio for Ashwin E, a BCA student specializing in Generative AI and Technology Management.

## Features

- Glassmorphism AI-themed interface
- Responsive desktop, tablet, and mobile layouts
- Scroll reveal and micro-interactions
- Project detail dialogs
- Playable keyboard/touch **Project Quest** mini-game
- Accessible navigation and reduced-motion support
- Downloadable PDF resume
- Contact form that prepares an email in the visitor's mail app

## Run locally

Open `index.html` directly, or start a local server:

```bash
python -m http.server 4173
```

Then visit `http://localhost:4173`.

## Personalize before publishing

Update these values in `script.js`:

```js
const CONTACT_EMAIL = "your.email@example.com";
```

Also replace the LinkedIn and GitHub placeholder URLs in `index.html`. The contact form intentionally uses a mail-app handoff so it works without a backend.

To update the PDF resume, edit `resume.html`, print it to PDF at A4 size without browser headers or footers, and replace `assets/Ashwin-E-Resume.pdf`.

## Project Quest controls

- `←` / `A`: move left
- `→` / `D`: move right
- `Space`: pause or resume
- Touch: swipe the route or use the on-screen controls
