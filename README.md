# pipeline — Invidious video frontend

pipeline is a polished, responsive video discovery frontend powered by public Invidious mirrors. It provides a calmer YouTube-inspired experience with a discovery feed, URL-driven search, watch pages, related videos, local history, and local library controls.

## Architecture

The browser communicates only with typed tRPC procedures under `/api/trpc`. The server queries `https://api.invidious.io/instances.json`, filters for public HTTPS instances, checks candidate mirrors through `/api/v1/stats`, and selects the fastest healthy mirror. No API key is required, and no mirror directory configuration is bundled into the browser. A user can pin a discovered mirror from the connection settings panel; that preference is stored locally in the browser.

The watch page prefers direct media returned by Invidious and falls back only to the selected Invidious web interface. No YouTube-hosted embed is used.

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
| `/watch/:videoId` | Invidious direct playback or Invidious web fallback, metadata, description, and related videos |
| `/channel/:channelId` | Channel header and video listing |
| `/playlist/:playlistId` | Playlist metadata and queue |
| `/history` | Local watch history |
| `/library` | Local saved library |
| `/subscriptions` | Local channel subscriptions with sync messaging |

## Operational notes

The public directory and public instances can change availability and may enforce anti-abuse controls. pipeline uses request timeouts, short-lived directory caching, server-side health checks, automatic selection, and manual pinning to reduce unnecessary traffic. Search runs only after the user submits the form; typing does not trigger a request. If all candidates are unavailable, the interface presents a retry state rather than fabricating content.

## GitHub Pages

The repository includes `.github/workflows/deploy-pages.yml`, which builds the client-only artifact, creates `404.html` for direct SPA routes, and deploys `dist/public` through GitHub Pages. The Vite build uses `/pipeline/` as its repository-scoped base path in GitHub Actions. If the repository name differs from `pipeline`, update the `base` value in `vite.config.ts`.

GitHub Pages hosts the static interface but cannot run this project’s Express/tRPC server. Native API-powered feeds, search, metadata, and direct media therefore require the full server deployment or a browser-accessible API configuration. Use GitHub Pages for the static shell and the project hosting flow for the full server-backed application.

The directory format and endpoint behavior are documented by [Invidious Instances](https://docs.invidious.io/instances/) and the [Invidious API documentation](https://docs.invidious.io/api/).
