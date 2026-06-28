import { beforeEach, describe, expect, it } from "vitest";
import { resetLocalStorage } from "../../test/testStorage";
import { createLocalStorageAdapter } from "./localStorageAdapter";

describe("createLocalStorageAdapter", () => {
  beforeEach(() => {
    resetLocalStorage();
  });

  it("returns fallback when key is missing", () => {
    const storage = createLocalStorageAdapter(window.localStorage);

    expect(storage.read("missing", { value: "fallback" })).toEqual({
      value: "fallback",
    });
  });

  it("writes and reads JSON values", () => {
    const storage = createLocalStorageAdapter(window.localStorage);

    storage.write("settings", { startScreen: "today" });

    expect(storage.read("settings", { startScreen: "settings" })).toEqual({
      startScreen: "today",
    });
  });

  it("returns fallback for invalid JSON", () => {
    window.localStorage.setItem("broken", "{");
    const storage = createLocalStorageAdapter(window.localStorage);

    expect(storage.read("broken", { safe: true })).toEqual({ safe: true });
  });

  it("removes values", () => {
    const storage = createLocalStorageAdapter(window.localStorage);
    storage.write("temporary", { value: 1 });

    storage.remove("temporary");

    expect(storage.read("temporary", { value: 0 })).toEqual({ value: 0 });
  });
});
