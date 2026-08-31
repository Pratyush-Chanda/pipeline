import { describe, expect, it, vi } from "vitest";
import { appRouter, normalizeSearchResults, parseMirrorRow, rankMirrors, requestWithFallback, resetMirrorCaches, searchInvidious } from "./routers";
import type { TrpcContext } from "./_core/context";

const context = { user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] } satisfies TrpcContext;

describe("invidious mirror proxy", () => {
  it("reports zero-key configuration without returning a mirror or secret", async () => {
    const result = await appRouter.createCaller(context).invidious.config();
    expect(result).toEqual({ configured: true, requiresApiKey: false });
    expect(JSON.stringify(result)).not.toContain("INVIDIOUS_API");
  });

  it("rejects invalid search input before contacting upstream", async () => {
    await expect(appRouter.createCaller(context).invidious.search({ query: "" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects non-HTTPS manual mirror choices", async () => {
    await expect(appRouter.createCaller(context).invidious.selectMirror({ uri: "http://example.com" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("returns structured unavailability for a video no mirror can serve", async () => {
    resetMirrorCaches();
    vi.stubGlobal("fetch", vi.fn(async (input: URL | string) => { const url = String(input); if (url.includes("instances.json")) return Response.json([["only.example", { uri: "https://only.example", type: "https", published: true, monitor: { uptime: 99, down: false, last_status: 200 } }]]); if (url.endsWith("/api/v1/stats")) return Response.json({ version: "test" }); return new Response("missing", { status: 404 }); }));
    const result = await appRouter.createCaller(context).invidious.video({ id: "Z4SXUkRq92M" });
    expect(result).toMatchObject({ videoId: "Z4SXUkRq92M", unavailable: true });
    vi.unstubAllGlobals();
    resetMirrorCaches();
  });

  it("normalizes typed search results and retries video search without type", async () => {
    expect(normalizeSearchResults([{ authorId: "channel", author: "Creator" }, { playlistId: "playlist", playlistTitle: "Queue" }, { videoId: "video", title: "Clip" }])).toMatchObject([{ type: "channel", title: "Creator" }, { type: "playlist", title: "Queue" }, { type: "video", title: "Clip" }]);
    resetMirrorCaches();
    vi.stubGlobal("fetch", vi.fn(async (input: URL | string) => { const url = String(input); if (url.includes("instances.json")) return Response.json([]); if (url.endsWith("/api/v1/stats")) return Response.json({ version: "test" }); if (url.includes("/api/v1/search") && url.includes("type=video")) return new Response("unsupported", { status: 400 }); return Response.json([{ videoId: "video", title: "Clip" }]); }));
    const result = await searchInvidious("music", 1, "video", "https://manual.example");
    expect(result).toMatchObject([{ videoId: "video", type: "video" }]);
    vi.unstubAllGlobals();
    resetMirrorCaches();
  });

  it("parses only HTTPS directory rows and ranks healthy uptime", () => {
    const https = parseMirrorRow(["good.example", { uri: "https://good.example/", type: "https", published: true, monitor: { uptime: 99.5, down: false, last_status: 200 } }]);
    const http = parseMirrorRow(["bad.example", { uri: "http://bad.example", type: "http" }]);
    expect(https?.uri).toBe("https://good.example");
    expect(http).toBeNull();
    expect(rankMirrors([{ name: "low", uri: "https://low", uptime: 91 }, { name: "high", uri: "https://high", uptime: 99 }, { name: "disabled", uri: "https://disabled", uptime: 100, api: false }]).map(item => item.name)).toEqual(["high", "low"]);
  });

  it("falls through to the next mirror when the first request fails", async () => {
    const calls: string[] = [];
    const result = await requestWithFallback([{ name: "one", uri: "https://one" }, { name: "two", uri: "https://two" }], async mirror => { calls.push(mirror.name); if (mirror.name === "one") throw new Error("down"); return "ok"; });
    expect(result).toBe("ok");
    expect(calls).toEqual(["one", "two"]);
  });

  it("retries the real content procedure after a cached mirror fails", async () => {
    resetMirrorCaches();
    let contentCalls = 0;
    const directory = [["fast.example", { uri: "https://fast.example", type: "https", published: true, monitor: { uptime: 99, down: false, last_status: 200 } }], ["backup.example", { uri: "https://backup.example", type: "https", published: true, monitor: { uptime: 98, down: false, last_status: 200 } }]];
    vi.stubGlobal("fetch", vi.fn(async (input: URL | string) => { const url = String(input); if (url.includes("instances.json")) return Response.json(directory); if (url.endsWith("/api/v1/stats")) return Response.json({ version: "test" }); if (url.includes("fast.example/api/v1/popular")) { contentCalls += 1; return contentCalls === 1 ? Response.json([{ videoId: "first" }]) : new Response("down", { status: 503 }); } if (url.includes("backup.example/api/v1/popular")) return Response.json([{ videoId: "fallback" }]); return new Response("not found", { status: 404 }); }));
    await appRouter.createCaller(context).invidious.popular({ region: "US" });
    const result = await appRouter.createCaller(context).invidious.popular({ region: "US" });
    expect(result).toEqual([{ videoId: "fallback" }]);
    vi.unstubAllGlobals();
    resetMirrorCaches();
  });
});
