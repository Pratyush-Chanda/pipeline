import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chooseWebMirror, pageRoute, resultHref, webFallbackUrl } from "../client/src/lib/navigation";
import { normalizeMediaUrls } from "./routers";

describe("pipeline navigation and upstream URL helpers", () => {
  it("maps search result types to their detail routes", () => {
    expect(resultHref({ type: "video", videoId: "vid" })).toBe("/watch/vid");
    expect(resultHref({ type: "channel", authorId: "chan" })).toBe("/channel/chan");
    expect(resultHref({ type: "playlist", playlistId: "list" })).toBe("/playlist/list");
    expect(resultHref({ type: "video" })).toBeNull();
  });

  it("builds Invidious-only watch and search fallback URLs", () => {
    expect(webFallbackUrl("https://mirror.example/", { id: "abc123" })).toBe("https://mirror.example/watch?v=abc123");
    expect(webFallbackUrl("https://mirror.example", { query: "lofi & jazz" })).toBe("https://mirror.example/search?q=lofi%20%26%20jazz");
  });

  it("chooses only a web-healthy mirror for fallback pages", () => {
    expect(chooseWebMirror([{ uri: "https://blocked.example", webHealthy: false }, { uri: "https://web.example", webHealthy: true }])).toBe("https://web.example");
    expect(chooseWebMirror([{ uri: "https://blocked.example", webHealthy: false }])).toBeNull();
  });

  it("classifies every custom page path for the pipeline shell", () => {
    expect(pageRoute("/search")).toBe("search");
    expect(pageRoute("/watch/video-id")).toBe("watch");
    expect(pageRoute("/channel/channel-id")).toBe("channel");
    expect(pageRoute("/playlist/playlist-id")).toBe("playlist");
    expect(pageRoute("/history")).toBe("history");
    expect(pageRoute("/subscriptions")).toBe("subscriptions");
    expect(pageRoute("/playlists")).toBe("library");
    expect(pageRoute("/")).toBe("home");
  });

  it("keeps the watch playback path free of YouTube-hosted embeds", () => {
    const source = readFileSync(fileURLToPath(new URL("../client/src/pages/Home.tsx", import.meta.url)), "utf8");
    expect(source.toLowerCase()).not.toContain("youtube.com/embed");
    expect(source.toLowerCase()).not.toContain("youtube-nocookie.com/embed");
  });

  it("absolutizes media and thumbnail URLs without rewriting creator paths", () => {
    const normalized = normalizeMediaUrls({ formatStreams: [{ url: "/videoplayback?sig=1" }], videoThumbnails: [{ url: "/vi/id/hqdefault.jpg" }], authorUrl: "/channel/chan" }, "https://mirror.example");
    expect(normalized).toMatchObject({ formatStreams: [{ url: "https://mirror.example/videoplayback?sig=1" }], videoThumbnails: [{ url: "https://mirror.example/vi/id/hqdefault.jpg" }], authorUrl: "/channel/chan" });
  });
});
