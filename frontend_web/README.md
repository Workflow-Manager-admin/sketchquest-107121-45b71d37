# SketchQuest React Frontend

## Features

- Modern, playful, minimal web UI for a real-time drawing & guessing game  
- Animated login, dashboard, featured/top drawing with pulse, masonry-style grid, floating add-drawing button  
- Drawing canvas with timer, spin wheel prompt, and Firebase integration  
- Responsive, real-time updates, page transitions, user feedback animations  
- Google Fonts for title/heading/body as per style guide  
- Vanilla JS, React hooks, styled-components, framer-motion

## Setup

- Requires Firebase project:
  - Enable Firestore, Storage, and Anonymous Auth
  - Create `.env.local` or update `src/firebase.js` with your own Firebase config keys (`apiKey`, `projectId`, etc.)

## Dev Commands

- `npm start` — dev server
- `npm run build` — production build

## Customize

Edit `/src/styles/GlobalStyle.js`, color palette in :root, or add more reusable components as needed.
