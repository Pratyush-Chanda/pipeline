import { describe, expect, it } from "vitest";
import { readLocal, removeLocal, upsertLocal } from "../client/src/lib/localState";

describe("local collection helpers", () => {
  const storage = (value: string | null): Pick<Storage, "getItem"> => ({ getItem: () => value });
  it("reads valid entries and recovers from malformed storage", () => {
    expect(readLocal(storage("[{\"id\":\"a\"}]"), "items")).toEqual([{ id: "a" }]);
    expect(readLocal(storage("not-json"), "items")).toEqual([]);
  });
  it("upserts newest entries, deduplicates, and caps history", () => {
    expect(upsertLocal([{ id: "a" }, { id: "b" }], { id: "a", title: "new" })).toEqual([{ id: "a", title: "new" }, { id: "b" }]);
    expect(upsertLocal([{ id: "a" }, { id: "b" }], { id: "c" }, 2)).toEqual([{ id: "c" }, { id: "a" }]);
  });
  it("removes a local entry by id", () => expect(removeLocal([{ id: "a" }, { id: "b" }], "a")).toEqual([{ id: "b" }]));
});
