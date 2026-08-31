import { describe, expect, it } from "vitest";
import { getPlayableStreams } from "../client/src/lib/playback";

describe("playback stream selection", () => {
  it("prefers playable progressive streams and removes duplicate URLs", () => {
    const streams = getPlayableStreams({ formatStreams: [{ url: "https://cdn/720.mp4", qualityLabel: "720p", container: "mp4" }, { url: "https://cdn/720.mp4", qualityLabel: "720p", container: "mp4" }], adaptiveFormats: [{ url: "https://cdn/audio-only", type: "audio/mp4" }, { url: "https://cdn/1080.mp4", type: "video/mp4; codecs=avc1,aac", qualityLabel: "1080p", container: "mp4" }] });
    expect(streams).toEqual([{ url: "https://cdn/720.mp4", label: "720p", container: "mp4" }, { url: "https://cdn/1080.mp4", label: "1080p", container: "mp4" }]);
  });

  it("returns no stream when Invidious provides only video-only adaptive formats", () => {
    expect(getPlayableStreams({ adaptiveFormats: [{ url: "https://cdn/video-only", type: "video/mp4", qualityLabel: "1080p" }] })).toEqual([]);
  });
});
