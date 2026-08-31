import { describe, expect, it } from "vitest";
import { getTrpcUrl } from "../client/src/lib/apiOrigin";

describe("GitHub Pages API origin", () => {
  it("uses the same-origin API locally", () => {
    expect(getTrpcUrl(undefined)).toBe("/api/trpc");
  });

  it("avoids the Pages origin when no server is configured", () => {
    expect(getTrpcUrl(undefined, true)).toBe("/__pipeline_server_required__");
  });

  it("normalizes a separately deployed server origin", () => {
    expect(getTrpcUrl("https://api.example.com/")).toBe("https://api.example.com/api/trpc");
  });
});
