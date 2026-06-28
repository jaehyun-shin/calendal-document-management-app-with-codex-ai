import { describe, expect, it } from "vitest";
import { formatTimeRange, isSameLocalDate } from "./dateUtils";

describe("dateUtils", () => {
  it("detects same local date", () => {
    const targetDate = new Date(2026, 5, 28, 12, 0);
    const sameDate = new Date(2026, 5, 28, 9, 30).toISOString();

    expect(isSameLocalDate(sameDate, targetDate)).toBe(true);
  });

  it("formats a time range", () => {
    const startsAt = new Date(2026, 5, 28, 14, 0).toISOString();
    const endsAt = new Date(2026, 5, 28, 15, 30).toISOString();

    expect(formatTimeRange(startsAt, endsAt)).toMatch(/14\D00\s-\s15\D30/);
  });
});
