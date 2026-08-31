import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const context = {
  user: null,
  req: {} as TrpcContext["req"],
  res: {} as TrpcContext["res"],
} satisfies TrpcContext;

describe("invidious proxy", () => {
  it("reports configuration status without returning the endpoint", async () => {
    const result = await appRouter.createCaller(context).invidious.config();
    expect(result).toEqual({ configured: Boolean(process.env.INVIDIOUS_API) });
    expect(JSON.stringify(result)).not.toContain("INVIDIOUS_API");
  });

  it("rejects invalid search input before contacting upstream", async () => {
    await expect(appRouter.createCaller(context).invidious.search({ query: "" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
