# Lumina AI Workspace

Lumina is a premium AI chat workspace built for focused, multi-session conversations. It combines a clean, high-contrast interface with fast, persistent chat history and a Gemini-powered assistant.

## Tech Stack

- React 19 + Vite 6
- TypeScript
- Tailwind CSS v4
- Zustand (state + persistence)
- TanStack Query (async data)
- Gemini API via `@google/genai`

## Features

- Multi-session chat history with automatic titles
- Collapsible sidebar with session management
- Markdown rendering for assistant responses
- Prompt suggestions for quick starts
- Polished loading states and smooth animations
- Responsive layout optimized for desktop and large tablets

## Screenshots

Add screenshots to `./screenshots` and update the references below:

- `screenshots/overview.png`
- `screenshots/chat-session.png`

## Getting Started

1. Install dependencies:
   `npm install`
2. Create an `.env.local` file with your Gemini API key:
   `GEMINI_API_KEY=your_key_here`
3. Start the dev server:
   `npm run dev`

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — build for production
- `npm run preview` — preview the production build