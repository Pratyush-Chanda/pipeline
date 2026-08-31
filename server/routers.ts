import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";

const videoId = z.string().trim().min(1).max(64);
const page = z.number().int().min(1).max(10).optional();

function apiBase() {
  return ENV.invidiousApi.replace(/\/$/, "");
}

async function invidious<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const base = apiBase();
  if (!base) throw new Error("Invidious API is not configured. Set INVIDIOUS_API in your environment.");
  const url = new URL(`${base}/api/v1${path}`);
  Object.entries(params ?? {}).forEach(([key, value]) => value !== undefined && url.searchParams.set(key, String(value)));
  try {
    const response = await fetch(url, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error(`upstream-${response.status}`);
    const payload: unknown = await response.json();
    if (payload === null || payload === undefined) throw new Error("upstream-empty");
    return payload as T;
  } catch (error) {
    console.warn("[Invidious] Request failed", error instanceof Error ? error.message : "unknown");
    throw new Error("The Invidious service is temporarily unavailable. Please try again shortly.");
  }
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  invidious: router({
    config: publicProcedure.query(() => ({ configured: Boolean(ENV.invidiousApi) })),
    popular: publicProcedure.input(z.object({ region: z.string().length(2).optional() }).optional()).query(({ input }) => invidious<unknown[]>("/popular", { region: input?.region ?? "US" })),
    trending: publicProcedure.input(z.object({ region: z.string().length(2).optional() }).optional()).query(({ input }) => invidious<unknown[]>("/trending", { region: input?.region ?? "US" })),
    search: publicProcedure.input(z.object({ query: z.string().trim().min(1).max(120), page, type: z.enum(["video", "channel", "playlist", "all"]).default("video") })).query(({ input }) => invidious<unknown[]>("/search", { q: input.query, page: input.page, type: input.type })),
    video: publicProcedure.input(z.object({ id: videoId })).query(({ input }) => invidious<unknown>(`/videos/${encodeURIComponent(input.id)}`)),
    channel: publicProcedure.input(z.object({ id: z.string().trim().min(1).max(128), page })).query(({ input }) => invidious<unknown>(`/channels/${encodeURIComponent(input.id)}`, { page: input.page })),
    playlist: publicProcedure.input(z.object({ id: z.string().trim().min(1).max(128), page })).query(({ input }) => invidious<unknown>(`/playlists/${encodeURIComponent(input.id)}`, { page: input.page })),
  }),
});

export type AppRouter = typeof appRouter;
