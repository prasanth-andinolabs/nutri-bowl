# Nutri Bowl

Static marketing site for the Nutri Bowl subscription service, built with
React, TypeScript, Vite, and Tailwind CSS.

## Prerequisites

- Node.js 18+ (or later LTS)
- npm (bundled with Node.js)

## Getting Started

1. Install dependencies:
   - `npm install`
2. Start the development server:
   - `npm run dev`
3. Open the local URL shown in the terminal (typically `http://localhost:5173`).

## Run the Backend (Orders & Inventory)

1. In a new terminal, start the API server:
   - `npm run server`
2. The API listens on `http://localhost:5174`.
3. The frontend is already configured to proxy `/api` to the backend in dev.
4. Orders and inventory are stored in Postgres. Configure `DATABASE_URL` in `.env`.
5. Set admin credentials in `.env` (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_API_KEY`).
6. To reseed inventory from `data/inventory.json`, call with the admin key:
   - `curl -X POST http://localhost:5174/api/inventory/reset -H "x-admin-key: <ADMIN_API_KEY>"`

## Production Build

- Build the app:
  - `npm run build`
- Preview the production build locally:
  - `npm run preview`

## Project Structure

- `src/App.tsx` - Main landing page content
- `src/main.tsx` - React app entry point
- `src/index.css` - Tailwind base imports
