# Watch request diagnosis

The reported video ID `Z4SXUkRq92M` was traced against the current public Invidious directory on 2026-08-31. The first published HTTPS candidates returned HTTP 403, HTTP 401, or network/DNS failures for `/api/v1/videos/Z4SXUkRq92M`. This confirms the observed error is caused by the public mirror set rejecting or failing the server-side request, not by an invalid frontend watch route. The watch page therefore needs a playback fallback when all metadata mirrors are unavailable.
