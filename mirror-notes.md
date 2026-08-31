# Mirror discovery notes

The live public directory is `https://api.invidious.io/instances.json?pretty=1&sort_by=type,users`. It returns an array of `[hostname, metadata]` tuples. Useful fields include `type`, `uri`, `cors`, `api`, `monitor.down`, `monitor.uptime`, `monitor.last_status`, and `published`.

The current directory includes public HTTPS hosts whose directory `api` field is not consistently true, so the application should not rely solely on that field. It should restrict candidates to HTTPS clearnet URLs, prefer published instances with `monitor.down !== true`, then perform a live lightweight request to `/api/v1/stats` before selecting a mirror. The Invidious API documentation confirms `/api/v1/stats`, `/api/v1/trending`, `/api/v1/popular`, `/api/v1/search`, and `/api/v1/playlists/:plid` as public JSON endpoints.

The public directory and documentation warn that public instances can change availability and that instance operators apply anti-abuse measures. The app therefore needs timeouts, short-lived server caching, automatic fallback, a manual mirror setting, and explicit unavailable states. Mirror URLs are user-selectable public endpoints, not secret API keys.
