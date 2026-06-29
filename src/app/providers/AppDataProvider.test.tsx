import { renderHook, act } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { resetLocalStorage } from "../../test/testStorage";
import { AppDataProvider, useAppData } from "./AppDataProvider";

function wrapper({ children }: PropsWithChildren) {
  return <AppDataProvider>{children}</AppDataProvider>;
}

describe("AppDataProvider", () => {
  beforeEach(() => {
    resetLocalStorage();
  });

  it("provides default settings and persists updates", () => {
    const { result, unmount } = renderHook(() => useAppData(), { wrapper });

    expect(result.current.settings.startScreen).toBe("today");

    act(() => {
      result.current.updateSettings({ startScreen: "documents" });
    });

    expect(result.current.settings.startScreen).toBe("documents");

    unmount();
    const { result: freshResult } = renderHook(() => useAppData(), { wrapper });

    expect(freshResult.current.settings.startScreen).toBe("documents");
  });

  it("adds schedules and persists them", () => {
    const { result, unmount } = renderHook(() => useAppData(), { wrapper });

    act(() => {
      result.current.addSchedule({
        title: "제품 전략 회의",
        date: "2026-06-28",
        startTime: "10:00",
        endTime: "11:00",
        place: "회의실 A",
        attendees: [
          { name: "김지안", accepted: true },
          { name: "박서준", accepted: false },
        ],
        agenda: "3분기 출시 범위 결정",
        referenceMaterials: ["https://example.com/roadmap", "요구사항 문서"],
      });
    });

    expect(result.current.schedules.at(-1)).toMatchObject({
      title: "제품 전략 회의",
      place: "회의실 A",
      agenda: "3분기 출시 범위 결정",
      referenceMaterials: ["https://example.com/roadmap", "요구사항 문서"],
    });
    expect(result.current.schedules.at(-1)?.attendees).toEqual([
      expect.objectContaining({ name: "김지안", accepted: true }),
      expect.objectContaining({ name: "박서준", accepted: false }),
    ]);

    unmount();
    const { result: freshResult } = renderHook(() => useAppData(), { wrapper });

    expect(freshResult.current.schedules.some((schedule) => schedule.title === "제품 전략 회의")).toBe(true);
  });

  it("updates, deletes, and moves schedules", () => {
    const { result } = renderHook(() => useAppData(), { wrapper });

    let scheduleId = "";
    act(() => {
      const schedule = result.current.addSchedule({
        title: "디자인 리뷰",
        date: "2026-06-29",
        startTime: "09:00",
        endTime: "10:00",
        place: "회의실 B",
        attendees: [{ name: "김지안", accepted: true }],
        agenda: "시안 검토",
        referenceMaterials: ["초안"],
      });
      scheduleId = schedule.id;
    });

    act(() => {
      result.current.updateSchedule(scheduleId, {
        title: "디자인 리뷰 수정",
        date: "2026-06-29",
        startTime: "13:00",
        endTime: "14:00",
        place: "회의실 C",
        attendees: [{ name: "박서준", accepted: false }],
        agenda: "수정안 검토",
        referenceMaterials: ["수정안"],
      });
    });

    expect(result.current.schedules.find((schedule) => schedule.id === scheduleId)).toMatchObject({
      title: "디자인 리뷰 수정",
      place: "회의실 C",
      agenda: "수정안 검토",
      referenceMaterials: ["수정안"],
    });

    act(() => {
      result.current.moveScheduleDate(scheduleId, "2026-07-02");
    });

    expect(result.current.schedules.find((schedule) => schedule.id === scheduleId)?.startsAt).toContain("2026-07-02");

    act(() => {
      result.current.deleteSchedule(scheduleId);
    });

    expect(result.current.schedules.some((schedule) => schedule.id === scheduleId)).toBe(false);
  });
});
