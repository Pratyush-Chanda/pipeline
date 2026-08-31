import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

type Mirror = { name: string; uri: string; region?: string; flag?: string; uptime?: number; down?: boolean; api?: boolean; cors?: boolean; published?: boolean; lastStatus?: number | null; latencyMs?: number; healthy?: boolean };
type DirectoryRow = [string, { uri?: string; region?: string; flag?: string; type?: string; api?: boolean; cors?: boolean; published?: boolean; monitor?: { uptime?: number; down?: boolean; last_status?: number } | null }];
let directoryCache: { expires: number; mirrors: Mirror[] } | null = null;
let autoMirrorCache: { expires: number; mirror: Mirror; candidates: Mirror[] } | null = null;
const selectedMirror = z.string().url().refine(value => new URL(value).protocol === "https:", "Mirror must use HTTPS");
const page = z.number().int().min(1).max(20).optional();

function clean(value: string) { return value.replace(/\/$/, ""); }
export function parseMirrorRow(row: DirectoryRow): Mirror | null { const [name, meta] = row; if (!meta?.uri || meta.type !== "https") return null; const monitor = meta.monitor; return { name, uri: clean(meta.uri), region: meta.region, flag: meta.flag, uptime: monitor?.uptime, down: monitor?.down, api: meta.api, cors: meta.cors, published: meta.published, lastStatus: monitor?.last_status }; }
export function rankMirrors(mirrors: Mirror[]): Mirror[] { return mirrors.filter(item => item.published !== false && item.down !== true && (item.uptime ?? 0) >= 90).sort((a, b) => (b.uptime ?? 0) - (a.uptime ?? 0)); }

async function fetchDirectory(): Promise<Mirror[]> {
  if (directoryCache && directoryCache.expires > Date.now()) return directoryCache.mirrors;
  const response = await fetch("https://api.invidious.io/instances.json?sort_by=type,users", { headers: { accept: "application/json" }, signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error("Mirror directory unavailable");
  const rows = await response.json() as DirectoryRow[];
  const mirrors = rows.map(parseMirrorRow).filter((item): item is Mirror => Boolean(item)).filter(item => item.published !== false && item.down !== true).slice(0, 20);
  directoryCache = { expires: Date.now() + 5 * 60_000, mirrors };
  return mirrors;
}

async function checkMirror(mirror: Mirror): Promise<Mirror> { const started = Date.now(); try { const response = await fetch(`${mirror.uri}/api/v1/stats`, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(5000) }); return { ...mirror, latencyMs: Date.now() - started, lastStatus: response.status, healthy: response.ok }; } catch { return { ...mirror, latencyMs: Date.now() - started, healthy: false }; } }

async function chooseMirror(manual?: string): Promise<{ mirror: Mirror; candidates: Mirror[] }> {
  if (!manual && autoMirrorCache && autoMirrorCache.expires > Date.now()) return { mirror: autoMirrorCache.mirror, candidates: autoMirrorCache.candidates };
  const discovered = await fetchDirectory();
  if (manual) { const found = discovered.find(item => item.uri === clean(manual)); if (found) { const checked = await checkMirror(found); if (checked.healthy) return { mirror: checked, candidates: [checked, ...discovered.filter(item => item.uri !== checked.uri)] }; } }
  const candidates = rankMirrors(discovered).slice(0, 8);
  const checked = await Promise.all(candidates.map(checkMirror));
  const healthy = checked.filter(item => item.healthy).sort((a, b) => (a.latencyMs ?? 9999) - (b.latencyMs ?? 9999) || (b.uptime ?? 0) - (a.uptime ?? 0));
  if (!healthy[0]) throw new Error("No healthy Invidious mirrors are available right now.");
  autoMirrorCache = { expires: Date.now() + 2 * 60_000, mirror: healthy[0], candidates: checked };
  return { mirror: healthy[0], candidates: checked.sort((a, b) => Number(Boolean(b.healthy)) - Number(Boolean(a.healthy)) || (b.uptime ?? 0) - (a.uptime ?? 0)) };
}

export function resetMirrorCaches() { directoryCache = null; autoMirrorCache = null; }

export async function requestWithFallback<T>(mirrors: Mirror[], request: (mirror: Mirror) => Promise<T>): Promise<T> { for (const mirror of mirrors) { try { return await request(mirror); } catch { /* try the next candidate */ } } throw new Error("No healthy Invidious mirror could serve this request. Try again shortly."); }

export function normalizeMediaUrls<T>(value: T, mirrorUri: string): T { if (Array.isArray(value)) return value.map(item => normalizeMediaUrls(item, mirrorUri)) as T; if (!value || typeof value !== "object") return value; const result = { ...(value as Record<string, unknown>) }; for (const [key, item] of Object.entries(result)) { if (typeof item === "string" && ["url", "hlsUrl", "dashUrl", "thumbnail", "playlistThumbnail"].includes(key) && item.startsWith("/")) result[key] = new URL(item, mirrorUri).toString(); else if (item && typeof item === "object") result[key] = normalizeMediaUrls(item, mirrorUri); } return result as T; }

async function invidious<T>(path: string, params?: Record<string, string | number | undefined>, manual?: string): Promise<T> {
  const requestFrom = async (selection: { mirror: Mirror; candidates: Mirror[] }) => { const attempts = [selection.mirror, ...selection.candidates.filter(item => item.uri !== selection.mirror.uri)].slice(0, 8); return requestWithFallback(attempts, async mirror => { const url = new URL(`${mirror.uri}/api/v1${path}`); Object.entries(params ?? {}).forEach(([key, value]) => value !== undefined && url.searchParams.set(key, String(value))); const response = await fetch(url, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(12000) }); if (!response.ok) throw new Error("upstream"); if (!manual) autoMirrorCache = { expires: Date.now() + 2 * 60_000, mirror, candidates: selection.candidates }; return normalizeMediaUrls(await response.json() as T, mirror.uri); }); };
  try { return await requestFrom(await chooseMirror(manual)); } catch (error) { if (manual) throw error; resetMirrorCaches(); return requestFrom(await chooseMirror()); }
}

export const appRouter = router({
  system: systemRouter,
  auth: router({ me: publicProcedure.query(opts => opts.ctx.user), logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }) }),
  invidious: router({
    config: publicProcedure.query(() => ({ configured: true, requiresApiKey: false })),
    mirrors: publicProcedure.query(async () => { const mirrors = await fetchDirectory(); const checked = await Promise.all(mirrors.slice(0, 12).map(checkMirror)); return checked; }),
    selectMirror: publicProcedure.input(z.object({ uri: selectedMirror })).query(async ({ input }) => checkMirror({ name: new URL(input.uri).hostname, uri: clean(input.uri) })),
    popular: publicProcedure.input(z.object({ region: z.string().length(2).optional(), mirror: selectedMirror.optional() }).optional()).query(({ input }) => invidious<unknown[]>("/popular", { region: input?.region ?? "US" }, input?.mirror)),
    trending: publicProcedure.input(z.object({ region: z.string().length(2).optional(), type: z.enum(["default", "music", "gaming", "movies"]).optional(), mirror: selectedMirror.optional() }).optional()).query(({ input }) => invidious<unknown[]>("/trending", { region: input?.region ?? "US", type: input?.type }, input?.mirror)),
    search: publicProcedure.input(z.object({ query: z.string().trim().min(1).max(120), page, type: z.enum(["video", "channel", "playlist", "all"]).default("video"), mirror: selectedMirror.optional() })).query(({ input }) => invidious<unknown[]>("/search", { q: input.query, page: input.page, type: input.type }, input.mirror)),
    video: publicProcedure.input(z.object({ id: z.string().trim().min(1).max(64), mirror: selectedMirror.optional() })).query(async ({ input }) => { try { return await invidious<unknown>(`/videos/${encodeURIComponent(input.id)}`, undefined, input.mirror); } catch (error) { return { videoId: input.id, unavailable: true, error: error instanceof Error ? error.message : "Video metadata is unavailable" }; } }),
    channel: publicProcedure.input(z.object({ id: z.string().trim().min(1).max(128), page, mirror: selectedMirror.optional() })).query(({ input }) => invidious<unknown>(`/channels/${encodeURIComponent(input.id)}`, { page: input.page }, input.mirror)),
    playlist: publicProcedure.input(z.object({ id: z.string().trim().min(1).max(128), page, mirror: selectedMirror.optional() })).query(({ input }) => invidious<unknown>(`/playlists/${encodeURIComponent(input.id)}`, { page: input.page }, input.mirror)),
  }),
});
export type AppRouter = typeof appRouter;
