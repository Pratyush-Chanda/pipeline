import { describe, expect, it } from "vitest";
import { pageRoute, resultHref } from "../client/src/lib/navigation";
import { normalizeMediaUrls } from "./routers";

describe("pipeline navigation and upstream URL helpers", () => {
  it("maps search result types to their detail routes", () => {
    expect(resultHref({ type: "video", videoId: "vid" })).toBe("/watch/vid");
    expect(resultHref({ type: "channel", authorId: "chan" })).toBe("/channel/chan");
    expect(resultHref({ type: "playlist", playlistId: "list" })).toBe("/playlist/list");
    expect(resultHref({ type: "video" })).toBeNull();
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

  it("absolutizes media and thumbnail URLs without rewriting creator paths", () => {
    const normalized = normalizeMediaUrls({ formatStreams: [{ url: "/videoplayback?sig=1" }], videoThumbnails: [{ url: "/vi/id/hqdefault.jpg" }], authorUrl: "/channel/chan" }, "https://mirror.example");
    expect(normalized).toMatchObject({ formatStreams: [{ url: "https://mirror.example/videoplayback?sig=1" }], videoThumbnails: [{ url: "https://mirror.example/vi/id/hqdefault.jpg" }], authorUrl: "/channel/chan" });
  });
});
