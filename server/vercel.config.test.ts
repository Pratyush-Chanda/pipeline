import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const vercelConfig = JSON.parse(
  readFileSync(fileURLToPath(new URL("../vercel.json", import.meta.url)), "utf8"),
) as {
  buildCommand?: string;
  outputDirectory?: string;
  rewrites?: Array<{ source?: string; destination?: string }>;
};

describe("Vercel static deployment configuration", () => {
  it("builds and serves the Vite client output", () => {
    expect(vercelConfig.buildCommand).toBe("pnpm build:client");
    expect(vercelConfig.outputDirectory).toBe("dist/public");
  });

  it("falls back client-side routes to the static shell", () => {
    expect(vercelConfig.rewrites).toContainEqual({
      source: "/(.*)",
      destination: "/index.html",
    });
  });
});
