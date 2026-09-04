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

## Invidious-only playback

- [x] Remove all `youtube.com` and `youtube-nocookie.com` embed URLs from playback code.
- [x] Replace the embed fallback with a clear Invidious-only unavailable state and mirror retry guidance.
- [x] Add regression coverage proving no YouTube embed URL remains in the watch playback path.
- [x] Run typecheck, tests, build, and save a new checkpoint.

## No-embed verification follow-up

- [x] Add an automated source-level regression test asserting watch playback contains no YouTube embed URL.
- [x] Save a fresh checkpoint after the no-embed playback change.

## Search and playback regression

- [x] Diagnose why the current Invidious search procedure returns no usable results.
- [x] Diagnose why direct stream playback fails for the reported video path.
- [x] Make search tolerate mirror API variations and return normalized result data.
- [x] Make playback select only browser-compatible direct streams and report media failures clearly.
- [x] Add regression coverage for search normalization and playback failure handling.
- [x] Re-run typecheck, tests, build, and save a repaired checkpoint.

## Search and playback verification gaps

- [x] Normalize search result shapes for video, channel, and playlist responses and test typed-search fallback.
- [x] Add native player media-error handling with an Invidious-only retry state and test-compatible stream selection.
- [x] Verify search with a working manual HTTPS Invidious mirror or clearly label public mirror unavailability.
- [x] Save a fresh checkpoint after these verified search and playback fixes.

## Player and search usability repair

- [x] Add server-side discovery of mirrors that expose a usable web frontend, separate from API health.
- [x] Add an Invidious web-page player fallback without using any YouTube-hosted embed URL.
- [x] Add an Invidious web-search fallback when API search is rejected by public mirrors.
- [x] Keep native direct media playback first, with a visible retry and open-on-mirror path when media fails.
- [x] Add tests for web-mirror selection and fallback URL generation.
- [x] Run typecheck, tests, build, and save a repaired checkpoint.

## Web fallback completion

- [x] Add a visible retry action when native media playback fails while preserving the Invidious open-on-mirror link.
- [x] Add automated tests for Invidious web watch and search fallback URL generation.
- [x] Save a fresh checkpoint after the player/search usability repair.

- [x] Save the final checkpoint after the web-fallback retry controls and fallback-URL tests.

## GitHub Pages readiness

- [x] Add a GitHub Actions Pages workflow that builds and deploys the client artifact.
- [x] Configure the Vite base path for repository-scoped GitHub Pages hosting.
- [x] Add SPA fallback handling for direct search, watch, channel, and playlist URLs.
- [x] Document GitHub Pages limitations and the required server/API deployment path for live Invidious data.
- [x] Validate the Pages build artifact; checkpoint refresh remains the final delivery step.

## Branch-based GitHub Pages correction

- [x] Remove the unnecessary GitHub Actions Pages workflow.
- [x] Add branch-based Pages publishing guidance so `dist/public` becomes the Pages source instead of README.md.
- [x] Ensure the static artifact has an `index.html` root and SPA fallback for direct routes.
- [x] Validate the corrected artifact; checkpoint refresh remains the final delivery step.

## GitHub Pages runtime repair

- [x] Stop GitHub Pages builds from calling the Pages origin for `/api/trpc` requests.
- [x] Add a configurable `VITE_API_ORIGIN` for the separately deployed server origin.
- [x] Disable development-only Manus debug collector injection in production/Pages builds.
- [x] Remove stale generated Pages artifacts before rebuilding the repository root.
- [x] Validate static assets, Pages paths, tRPC URL construction, and build output.
- [x] Save a repaired checkpoint.

## Pages server-origin follow-up

- [x] Make GitHub Pages builds fail-safe when `VITE_API_ORIGIN` is unset instead of targeting `/api/trpc` on the Pages domain.
- [x] Add automated coverage for the Pages-origin URL behavior.
- [x] Save a final checkpoint containing the runtime correction.

- [x] Save the final checkpoint after the GitHub Pages runtime-origin and debug-asset fixes.

## Live Pages browser verification

- [x] Add and verify the in-browser backend-origin setting for static GitHub Pages builds.
- [x] Confirm an unconfigured Pages build makes no `/api/trpc` requests and shows a clear setup state.
- [x] Save a fresh checkpoint containing the live Pages runtime fix.

- [x] Save a checkpoint after the live GitHub Pages browser verification and `pages-browser-check.md` update.

## No-Manus local-only cleanup

- [x] Remove visible sign-in, sign-in-for-sync, and account-sync controls from the client UI.
- [x] Remove Manus URLs and Manus-hosted asset references from client source, generated Pages artifacts, and user-facing documentation.
- [x] Preserve local history, library, and subscription functionality without account-sync copy.
- [x] Add regression checks that the built client contains no Manus URL or sign-in UI strings.
- [x] Rebuild and verify the clean Pages artifact; checkpoint refresh remains the final delivery step.

## Vercel production browser verification

- [ ] Verify `https://pipeline-manus.vercel.app` in the browser as the primary acceptance target.
- [ ] Inspect browser console and network failures for the deployed home, search, watch, and settings flows.
- [ ] Fix any repository issues identified from production evidence, preserving GitHub Pages compatibility.
- [ ] Re-run typecheck, tests, production build, and browser verification against the deployed-oriented configuration.
- [ ] Save a checkpoint after the production verification and fixes.

- [x] Remove unused template sign-in and Manus dialog surfaces from client source so the repository is fully local-only, not merely bundle-clean.
- [x] Add explicit Vercel static build/output and SPA fallback configuration for `pipeline-manus.vercel.app`.
- [x] Remove the managed-preview Vite runtime dependency and verify it is absent from production build output.
- [x] Remove stale `client/public/__manus__` debug assets so Vercel and Pages artifacts cannot ship managed-preview files.

## Vercel backend path follow-up

- [ ] Add a Vercel-compatible server entrypoint for the existing tRPC/Invidious proxy.
- [ ] Route the deployed client’s API requests to the same-origin Vercel backend when available, while preserving GitHub Pages external-origin support.
- [ ] Verify mirror discovery, search, watch, and settings through the deployed browser after the backend path is live.
- [ ] Re-run tests/build and save the final production verification checkpoint.
- [ ] Exclude `/api/*` from the SPA fallback rewrite so Vercel tRPC requests reach the catch-all function instead of returning `index.html`.
- [ ] Replace the unregistered dynamic Vercel API route with a concrete `/api/trpc` function and nested-procedure rewrite, then verify it live in the browser.
