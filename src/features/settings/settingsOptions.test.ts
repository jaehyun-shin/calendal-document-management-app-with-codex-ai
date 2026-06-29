import { describe, expect, it } from "vitest";
import { startScreenOptions, themeOptions } from "./settingsOptions";

describe("settingsOptions", () => {
  it("includes Today Summary as the default start screen option", () => {
    expect(startScreenOptions[0]).toEqual({ value: "today", label: "오늘 요약" });
  });

  it("includes system theme", () => {
    expect(themeOptions.map((option) => option.value)).toContain("system");
  });
});
