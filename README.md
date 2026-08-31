# pipeline — Invidious video frontend

pipeline is a polished, responsive video discovery frontend powered by public Invidious mirrors. It provides a calmer YouTube-inspired experience with a discovery feed, URL-driven search, watch pages, related videos, local history, and local library controls.

## Architecture

The browser communicates only with typed tRPC procedures under `/api/trpc`. The server queries `https://api.invidious.io/instances.json`, filters for public HTTPS instances, checks candidate mirrors through `/api/v1/stats`, and selects the fastest healthy mirror. No API key is required, and no mirror directory configuration is bundled into the browser. A user can pin a discovered mirror from the connection settings panel; that preference is stored locally in the browser.

The watch page uses a privacy-friendly YouTube embed for playback while metadata and recommendations come from Invidious. This keeps the mirror selection logic server-side and leaves the playback provider replaceable for a future instance-backed player.

## Local setup

Install dependencies with `pnpm install`, then start the app with `pnpm dev`. No API key or `INVIDIOUS_API` value is required. The server automatically discovers public mirrors and falls back to a healthy candidate when the preferred mirror cannot respond. Run `pnpm check`, `pnpm test`, and `pnpm build` before committing changes.

## GitHub and Vercel

Create a GitHub repository, add this project as its contents, and push the default branch. In Vercel, import the repository and deploy without API-key environment variables. The server-side mirror directory is public and requires no credential. Users can select **Automatic — fastest healthy mirror** or pin one of the currently healthy discovered mirrors from the pipeline settings control.

Account synchronization is intentionally not configured in this version. Subscriptions, saved items, and watch history are stored locally in the browser, and the interface communicates that state clearly rather than implying cloud persistence.

## Included routes

| Route | Purpose |
| --- | --- |
| `/` | Popular/discovery feed with category navigation |
| `/?tab=trending` | Invidious trending feed |
| `/search?q=...&type=video&page=1` | URL-driven search, type filters, and page navigation |
| `/watch/:videoId` | Embedded playback, metadata, description, and related videos |
| `/channel/:channelId` | Channel header and video listing |
| `/playlist/:playlistId` | Playlist metadata and queue |
| `/history` | Local watch history |
| `/library` | Local saved library |
| `/subscriptions` | Local channel subscriptions with sync messaging |

## Operational notes

The public directory and public instances can change availability and may enforce anti-abuse controls. pipeline uses request timeouts, short-lived directory caching, server-side health checks, automatic selection, and manual pinning to reduce unnecessary traffic. Search runs only after the user submits the form; typing does not trigger a request. If all candidates are unavailable, the interface presents a retry state rather than fabricating content.

The directory format and endpoint behavior are documented by [Invidious Instances](https://docs.invidious.io/instances/) and the [Invidious API documentation](https://docs.invidious.io/api/).
