# Watchly — Invidious YouTube Frontend

Watchly is a polished, responsive video discovery frontend powered by an Invidious-compatible API. It provides a calmer YouTube-inspired experience with a discovery feed, URL-driven search, watch pages, related videos, local history, and local library controls.

## Architecture

The browser communicates only with the application’s typed tRPC procedures under `/api/trpc`. The server reads `INVIDIOUS_API` from its runtime environment and requests Invidious `/api/v1` resources for popular videos, search, video details, channels, and playlists. The configured endpoint is intentionally not added to any `VITE_*` variable and is never bundled into the browser client.

The current watch page uses a privacy-friendly YouTube embed for playback while metadata and recommendations come from Invidious. This keeps the API endpoint private and leaves the playback provider replaceable for a future self-hosted player.

## Local setup

Install dependencies with `pnpm install`, then create a local environment file from `.env.example`. Set `INVIDIOUS_API` to the base URL of an available Invidious instance, without the `/api/v1` suffix. Start the app with `pnpm dev`, then open the preview URL printed by the development server. Run `pnpm check`, `pnpm test`, and `pnpm build` before committing changes.

## GitHub and Vercel

Create a new GitHub repository, add this project as the repository contents, and push the default branch. In Vercel, import the repository and add the server-side environment variable `INVIDIOUS_API` under Project Settings → Environment Variables for Preview and Production. Use the same base URL format as local development. Do not rename it to `VITE_INVIDIOUS_API`, because client-exposed Vite variables would violate the endpoint privacy requirement.

Account synchronization is intentionally not configured in this version. Subscriptions, saved items, and watch history are stored locally in the browser, and the interface communicates that state clearly rather than implying cloud persistence.

## Included routes

| Route | Purpose |
| --- | --- |
| `/` | Popular/discovery feed with category navigation |
| `/search?q=...` | URL-driven video search results and filters |
| `/watch/:videoId` | Embedded playback, metadata, description, and related videos |
| `/history` | Local watch history |
| `/library` | Local saved library |
| `/subscriptions` | Local subscription placeholder with sync messaging |
| `/playlists` | Local library view reserved for playlist organization |

## Notes

The frontend handles missing configuration, upstream errors, empty responses, and loading states explicitly. The Invidious instance remains an operational dependency: if it rate-limits or temporarily fails, Watchly presents a retry state rather than fabricating content.
