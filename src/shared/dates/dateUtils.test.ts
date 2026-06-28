import { describe, expect, it } from "vitest";
import { formatTimeRange, isSameLocalDate } from "./dateUtils";

describe("dateUtils", () => {
  it("detects same local date", () => {
    expect(isSameLocalDate("2026-06-28T00:30:00.000Z", new Date("2026-06-28T12:00:00.000Z"))).toBe(true);
  });

  it("formats a time range", () => {
    expect(formatTimeRange("2026-06-28T14:00:00.000Z", "2026-06-28T15:30:00.000Z")).toContain(":");
  });
});
