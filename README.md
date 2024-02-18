# Lumina AI Workspace

<p align="center">
  <strong>Premium AI chat workspace with multi-session history, markdown rendering, and a focused UI.</strong>
</p>

<p align="center">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-6.x-646CFF?style=flat&logo=vite&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white" />
  <img alt="Tailwind" src="https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=flat&logo=tailwindcss&logoColor=white" />
  <img alt="Zustand" src="https://img.shields.io/badge/Zustand-State-000000?style=flat" />
  <img alt="Gemini" src="https://img.shields.io/badge/Gemini-API-4285F4?style=flat&logo=google&logoColor=white" />
</p>

---

## Overview

Lumina is a polished AI chat workspace focused on speed, clarity, and multi-session workflows. It provides a distraction-free interface with session persistence, markdown rendering, and a Gemini-powered assistant.

## Features

- Multi-session chat history with automatic titles
- Collapsible sidebar and session management controls
- Markdown rendering for assistant responses
- Prompt suggestions for quick starts
- Smooth loading states and subtle animations
- Responsive layout optimized for desktop and large tablets

## Tech Stack

- React 19 + Vite 6
- TypeScript
- Tailwind CSS v4
- Zustand (state + persistence)
- TanStack Query (async data)
- Gemini API via `@google/genai`

## Screenshots

Add screenshots to `./screenshots` and update these references:

- `screenshots/overview.png`
- `screenshots/chat-session.png`

## Getting Started

1. Install dependencies:
   `npm install`
2. Create an `.env.local` file in the project root and add your Gemini API key:
   `GEMINI_API_KEY=your_key_here`
3. Start the dev server:
   `npm run dev`

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes | Gemini API key used for chat completions |
| `APP_URL` | Optional | Base URL of the app when deployed |

See `.env.example` for a template.

## Production Build

- `npm run build` creates a production bundle in `dist/`
- `npm run preview` serves the built app locally

## Deploy to Vercel

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Set the `GEMINI_API_KEY` environment variable in Vercel.
4. Use the default build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`

A `vercel.json` file is included for clarity and repeatability.

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — build for production
- `npm run preview` — preview the production build
- `npm run lint` — typecheck the project

## License

MIT License. See `LICENSE` for details.