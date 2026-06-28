import { describe, expect, it } from "vitest";
import type { DocumentRecord, Schedule } from "../../shared/types/domain";
import { buildTodaySummary } from "./todaySelectors";

const schedules: Schedule[] = [
  {
    id: "schedule-1",
    title: "제품 회의",
    categoryId: "work",
    participantIds: ["participant-1"],
    startsAt: "2026-06-28T14:00:00.000Z",
    endsAt: "2026-06-28T15:00:00.000Z",
    place: "회의실 A",
    documentIds: ["document-1"],
    createdAt: "2026-06-28T00:00:00.000Z",
    updatedAt: "2026-06-28T00:00:00.000Z",
  },
];

const documents: DocumentRecord[] = [
  {
    id: "document-1",
    title: "제품 회의 메모",
    scheduleId: "schedule-1",
    categoryId: "work",
    author: "Jay",
    summary: "제품 방향 논의",
    keywords: ["제품", "일정"],
    blocks: [],
    attachmentIds: [],
    createdAt: "2026-06-28T00:00:00.000Z",
    updatedAt: "2026-06-28T00:00:00.000Z",
  },
];

describe("buildTodaySummary", () => {
  it("derives today schedules and keywords", () => {
    const summary = buildTodaySummary({
      now: new Date("2026-06-28T12:00:00.000Z"),
      schedules,
      documents,
    });

    expect(summary.scheduleCount).toBe(1);
    expect(summary.nextSchedule?.title).toBe("제품 회의");
    expect(summary.documentCount).toBe(1);
    expect(summary.keywords).toContain("제품");
  });
});
