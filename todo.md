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
- [ ] Provide `INVIDIOUS_API` through the project’s environment-secret flow (request was declined; user can add it in Vercel).
- [x] Add/update Vitest coverage for the Invidious proxy contract and key frontend state helpers.
- [x] Run typecheck, tests, build, and responsive visual verification; resolve any issues found.
- [ ] Save the completed project checkpoint for repository use.

## Hardening follow-ups

- [x] Implement true route-aware active navigation states.
- [x] Normalize Invidious network, timeout, and malformed-response failures.
- [x] Add a real trending source strategy and make discovery categories meaningful.
- [x] Make search filters URL-driven and add page-based pagination.
- [x] Replace placeholder watch actions with functional sharing/copy behavior.
- [x] Render local subscriptions as channel items with usable channel links and removal controls.
- [x] Add frontend-focused tests for local history, saved items, and subscription persistence helpers.
- [x] Verify responsive behavior at a mobile viewport and document the result.
