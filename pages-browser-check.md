# GitHub Pages Browser Check

Checked `https://pratyush-chanda.github.io/pipeline/?refresh=1` in the sandbox browser on 2026-08-31.

The published app loads its own `pipeline` shell and no longer shows the previous README or repeated `/api/trpc` requests. With no backend origin configured, it shows: “This GitHub Pages build needs a server origin. Open mirror settings to connect your pipeline server.”

The mirror settings panel is visible and includes a `Server connection` HTTPS-origin input with a Save button, plus mirror selection controls. The live page reported zero healthy mirrors because no server backend is configured for this static Pages build.
