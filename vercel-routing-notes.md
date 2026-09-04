# Vercel routing notes

The live browser test of `https://pipeline-manus.vercel.app/api/trpc/invidious.popular?...` returned HTTP 404 `NOT_FOUND` after both a root dynamic function and a nested `api/trpc/[...path].ts` function were deployed. Before the route fixes, the same URL returned HTTP 200 `text/html` containing `index.html`, proving the SPA rewrite intercepted API requests.

Vercel documentation consulted: https://vercel.com/docs/project-configuration/vercel-json

Relevant documented facts from that page: Vercel Functions are discovered from a root `api` directory; the `functions` property accepts glob keys such as `api/*.js` and `api/**/*.ts`; `rewrites` are configured separately; and the `functions` property cannot be combined with legacy `builds`. The current fallback approach is a concrete `api/index.ts` function plus explicit rewrites from `/api/trpc` and `/api/trpc/:path*` to `/api`, followed by a non-API SPA fallback.

Vercel Vite documentation consulted: https://vercel.com/docs/frameworks/frontend/vite
It documents Vite SPA rewrites to `/index.html` and points to Vercel Functions for server-side routes.
