import { describe, expect, it } from "vitest";
import type { DocumentRecord, Schedule } from "../../shared/types/domain";
import { buildTodaySummary } from "./todaySelectors";

const schedules: Schedule[] = [
  {
    id: "schedule-1",
    title: "Product meeting",
    categoryId: "work",
    participantIds: ["participant-1"],
    startsAt: new Date(2026, 5, 28, 14, 0).toISOString(),
    endsAt: new Date(2026, 5, 28, 15, 0).toISOString(),
    place: "Room A",
    documentIds: ["document-1"],
    createdAt: new Date(2026, 5, 28, 0, 0).toISOString(),
    updatedAt: new Date(2026, 5, 28, 0, 0).toISOString(),
  },
];

const documents: DocumentRecord[] = [
  {
    id: "document-1",
    title: "Product meeting notes",
    scheduleId: "schedule-1",
    categoryId: "work",
    author: "Jay",
    summary: "Product direction discussion",
    keywords: ["product", "schedule"],
    blocks: [],
    attachmentIds: [],
    createdAt: new Date(2026, 5, 28, 0, 0).toISOString(),
    updatedAt: new Date(2026, 5, 28, 0, 0).toISOString(),
  },
];

describe("buildTodaySummary", () => {
  it("returns empty summary when there are no schedules or documents", () => {
    const summary = buildTodaySummary({
      now: new Date(2026, 5, 28, 12, 0),
      schedules: [],
      documents: [],
    });

    expect(summary.scheduleCount).toBe(0);
    expect(summary.documentCount).toBe(0);
    expect(summary.nextSchedule).toBeUndefined();
    expect(summary.todaySchedules).toEqual([]);
    expect(summary.relatedDocuments).toEqual([]);
    expect(summary.keywords).toEqual([]);
  });

  it("derives today schedules and keywords", () => {
    const summary = buildTodaySummary({
      now: new Date(2026, 5, 28, 12, 0),
      schedules,
      documents,
    });

    expect(summary.scheduleCount).toBe(1);
    expect(summary.nextSchedule?.title).toBe("Product meeting");
    expect(summary.documentCount).toBe(1);
    expect(summary.keywords).toContain("product");
  });

  it("does not mutate input schedule order when sorting today schedules", () => {
    const unorderedSchedules: Schedule[] = [
      {
        ...schedules[0],
        id: "schedule-later",
        startsAt: new Date(2026, 5, 28, 16, 0).toISOString(),
        endsAt: new Date(2026, 5, 28, 17, 0).toISOString(),
      },
      {
        ...schedules[0],
        id: "schedule-earlier",
        startsAt: new Date(2026, 5, 28, 9, 0).toISOString(),
        endsAt: new Date(2026, 5, 28, 10, 0).toISOString(),
      },
    ];

    const summary = buildTodaySummary({
      now: new Date(2026, 5, 28, 8, 0),
      schedules: unorderedSchedules,
      documents: [],
    });

    expect(summary.todaySchedules.map((schedule) => schedule.id)).toEqual(["schedule-earlier", "schedule-later"]);
    expect(unorderedSchedules.map((schedule) => schedule.id)).toEqual(["schedule-later", "schedule-earlier"]);
  });
});
