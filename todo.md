# Project TODO

- [x] Establish the YouTube-inspired visual system: responsive layout, typography, color tokens, motion, focus states, and accessible contrast.
- [x] Build the global application shell with top search, responsive sidebar, mobile navigation, account-sync status, and route-aware active states.
- [x] Add server-side tRPC Invidious proxy procedures that read `INVIDIOUS_API` only on the server and normalize upstream errors.
- [x] Add the home feed with popular/trending videos and category navigation sourced from Invidious.
- [x] Add URL-driven video search with results, functional type filters, page navigation, loading, empty, and error states.
- [x] Add watch pages with embedded playback, metadata, channel details, expandable description, actions, and related videos.
- [x] Add browsable channel pages with channel header/details and channel video listings.
- [x] Add browsable playlist pages with playlist metadata and queue navigation.
- [x] Add local subscriptions and watch-history controls with persistence and clear no-account-sync messaging.
- [x] Add reusable video cards, list rows, skeletons, empty states, error states, and responsive media layouts.
- [x] Add Vercel configuration guidance, GitHub setup documentation, and API behavior notes.
- [x] Document `INVIDIOUS_API` through the project’s environment-secret flow; the user must supply the instance URL in Vercel because the secret request was declined.
- [x] Add/update Vitest coverage for the Invidious proxy contract and key frontend state helpers.
- [x] Run typecheck, tests, build, and responsive visual verification; resolve any issues found.
- [x] Save the completed project checkpoint for repository use.

## Hardening follow-ups

- [x] Implement true route-aware active navigation states.
- [x] Normalize Invidious network, timeout, and malformed-response failures.
- [x] Add a real trending source strategy and make discovery categories meaningful.
- [x] Make search filters URL-driven and add page-based pagination.
- [x] Replace placeholder watch actions with functional sharing/copy behavior.
- [x] Render local subscriptions as channel items with usable channel links and removal controls.
- [x] Add frontend-focused tests for local history, saved items, and subscription persistence helpers.
- [x] Verify responsive behavior at a mobile viewport and document the result.

## Pipeline mirror and branding fixes

- [x] Remove the hard failure when `INVIDIOUS_API` is absent and fall back to public Invidious mirror discovery.
- [x] Add server-side mirror directory lookup from `api.invidious.io` with filtering and normalized instance URLs.
- [x] Add server-side health checks and automatic best-mirror selection with graceful fallback.
- [x] Add a frontend mirror settings panel with automatic selection and manually chosen discovered mirrors.
- [x] Keep the selected mirror in local browser state without exposing secrets or triggering search on every keystroke.
- [x] Rename all visible Watchly branding and documentation to pipeline.
- [x] Add tests for mirror parsing, selection, and fallback behavior.
- [x] Re-run typecheck, tests, build, and responsive visual verification; save a new checkpoint.

## Final mirror hardening

- [x] Retry a failed content request against another healthy discovered mirror before returning an error.
- [x] Add tests for mirror parsing, automatic ranking, manual validation, and request fallback.
- [x] Re-run desktop and mobile visual verification after the mirror settings update.
- [x] Save a fresh checkpoint containing the completed pipeline mirror architecture.

## Cached mirror retry correction

- [x] Rediscover mirrors after cached-mirror request failure and retry an alternate healthy candidate in the real proxy flow.
- [x] Add a test covering cached-mirror failure through the actual Invidious request procedure.
- [x] Save a fresh checkpoint after this final correction.

## Playback and browsing expansion

- [x] Make search results render distinct video, channel, and playlist result cards with working links.
- [x] Make watch pages play media from Invidious adaptive or format streams with safe fallback messaging.
- [x] Add a native player control for choosing available video/audio quality when formats are present.
- [x] Ensure video, channel, and playlist pages open from cards and preserve back/navigation paths.
- [x] Improve watch metadata, channel actions, playlist queue navigation, and related-video links.
- [x] Add tests for stream selection, search-result routing, and page navigation helpers.
- [x] Run typecheck, tests, build, and responsive verification; checkpoint refresh remains the final delivery step.

- [x] Route all custom pipeline paths through the application shell so search, watch, channel, and playlist URLs do not fall through to the template 404 page.

## Playback URL and route verification

- [x] Normalize relative Invidious thumbnails and media URLs against the selected mirror origin before rendering.
- [x] Add tests for video, channel, and playlist result destination routing and custom page paths.
- [x] Re-run validation after URL normalization and route-test additions.

## Watch request failure

- [x] Diagnose why `/watch/Z4SXUkRq92M` cannot be served by discovered mirrors.
- [x] Add watch-specific fallback or clearer unavailable-video handling without breaking other Invidious requests.
- [x] Add a regression test for watch request failures and affected-video behavior.
- [x] Re-run validation and save a repaired checkpoint.
