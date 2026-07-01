import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";
import { resetLocalStorage } from "../test/testStorage";

async function createTaskFromToday(title: string) {
  const user = userEvent.setup();

  await user.click(await screen.findByRole("button", { name: "작업 추가" }));
  await user.type(screen.getByLabelText("작업명"), title);
  await user.clear(screen.getByLabelText("시작일"));
  await user.type(screen.getByLabelText("시작일"), "2026-06-29");
  await user.clear(screen.getByLabelText("시작 시간"));
  await user.type(screen.getByLabelText("시작 시간"), "10:00");
  await user.clear(screen.getByLabelText("종료일"));
  await user.type(screen.getByLabelText("종료일"), "2026-06-29");
  await user.clear(screen.getByLabelText("종료 시간"));
  await user.type(screen.getByLabelText("종료 시간"), "11:00");
  await user.type(screen.getByLabelText("장소"), "회의실 A");
  await user.type(screen.getByLabelText("주관"), "Jay");
  await user.type(screen.getByLabelText("프로젝트"), "Calendal");
  await user.click(screen.getByRole("button", { name: "저장" }));

  expect(await screen.findByText(title)).toBeInTheDocument();
}

describe("App", () => {
  beforeEach(() => {
    resetLocalStorage();
    window.history.pushState({}, "", "/");
  });

  it("redirects to Today Summary by default", async () => {
    render(<App />);

    expect(await screen.findByRole("heading", { name: "오늘 요약" })).toBeInTheDocument();
  });

  it("renders the settings route", async () => {
    window.history.pushState({}, "", "/settings");

    render(<App />);

    expect(await screen.findByRole("heading", { name: "설정" })).toBeInTheDocument();
  });

  it("creates a task from Today and shows it on the calendar", async () => {
    const user = userEvent.setup();
    render(<App />);

    await createTaskFromToday("제품 전략 작업");
    await user.click(screen.getAllByRole("link", { name: "캘린더" })[0]);

    expect(await screen.findByRole("heading", { name: "캘린더" })).toBeInTheDocument();
    expect(screen.getByText("제품 전략 작업")).toBeInTheDocument();
    expect(screen.getByText("10:00")).toBeInTheDocument();
  });

  it("edits and deletes tasks from Today", async () => {
    const user = userEvent.setup();
    render(<App />);

    await createTaskFromToday("오늘 수정 대상");

    await user.click(screen.getByRole("button", { name: "수정 오늘 수정 대상" }));
    expect(screen.getByRole("heading", { name: "작업 수정" })).toBeInTheDocument();

    await user.clear(screen.getByLabelText("작업명"));
    await user.type(screen.getByLabelText("작업명"), "오늘 수정 완료");
    await user.click(screen.getByRole("button", { name: "수정 저장" }));

    expect(await screen.findByText("오늘 수정 완료")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "삭제 오늘 수정 완료" }));

    expect(screen.queryByText("오늘 수정 완료")).not.toBeInTheDocument();
  });

  it("adds, edits, deletes, and drags tasks in Calendar", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click((await screen.findAllByRole("link", { name: "캘린더" }))[0]);
    expect(await screen.findByRole("heading", { name: "캘린더" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "2026-06-29 작업 추가" }));
    await user.type(screen.getByLabelText("작업명"), "캘린더 추가 작업");
    await user.clear(screen.getByLabelText("시작 시간"));
    await user.type(screen.getByLabelText("시작 시간"), "15:00");
    await user.clear(screen.getByLabelText("종료 시간"));
    await user.type(screen.getByLabelText("종료 시간"), "16:00");
    await user.click(screen.getByRole("button", { name: "저장" }));

    expect(await screen.findByText("캘린더 추가 작업")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "캘린더 추가 작업 수정" }));
    await user.clear(screen.getByLabelText("작업명"));
    await user.type(screen.getByLabelText("작업명"), "캘린더 수정 작업");
    await user.click(screen.getByRole("button", { name: "수정 저장" }));

    expect(await screen.findByText("캘린더 수정 작업")).toBeInTheDocument();

    const sourceTask = screen.getByText("캘린더 수정 작업").closest(".calendar-schedule");
    const targetDay = screen.getByLabelText("2026-06-30 작업");
    expect(sourceTask).not.toBeNull();

    fireEvent.dragStart(sourceTask!);
    fireEvent.dragOver(targetDay);
    fireEvent.drop(targetDay);

    expect(within(targetDay).getByText("캘린더 수정 작업")).toBeInTheDocument();

    await user.click(within(targetDay).getByRole("button", { name: "캘린더 수정 작업 삭제" }));

    expect(screen.queryByText("캘린더 수정 작업")).not.toBeInTheDocument();
    expect(container.querySelector('[data-edge-zone="previous"]')).toBeInTheDocument();
    expect(container.querySelector('[data-edge-zone="next"]')).toBeInTheDocument();
  });

  it("uses compact icon controls for task actions", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await createTaskFromToday("Icon action task");

    const todayActionButtons = Array.from(container.querySelectorAll(".schedule-row-actions .icon-button"));
    expect(todayActionButtons.length).toBeGreaterThan(0);
    todayActionButtons.forEach((button) => {
      expect(button.textContent?.trim()).toBe("");
      expect(button.querySelector("svg")).not.toBeNull();
    });

    await user.click(container.querySelector<HTMLAnchorElement>('a[href="/calendar"]')!);

    const calendarIconButtons = Array.from(container.querySelectorAll(".day-add-button, .calendar-schedule-delete"));
    expect(calendarIconButtons.length).toBeGreaterThan(0);
    calendarIconButtons.forEach((button) => {
      expect(button.textContent?.trim()).toBe("");
      expect(button.querySelector("svg")).not.toBeNull();
    });
  });

  it("opens a selected-day task panel and compacts the calendar to one week", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await createTaskFromToday("Panel task");
    await user.click(container.querySelector<HTMLAnchorElement>('a[href="/calendar"]')!);
    await user.click(container.querySelector('time[datetime="2026-06-29"]')!.closest(".calendar-day")!);

    const selectedDayPanel = screen.getByTestId("selected-day-task-panel");
    expect(selectedDayPanel).toBeInTheDocument();
    expect(within(selectedDayPanel).getByText("Panel task")).toBeInTheDocument();
    expect(container.querySelector(".calendar-board")).toHaveClass("calendar-board-compact");
    expect(container.querySelectorAll(".calendar-day")).toHaveLength(7);
  });

  it("adds the Tasks tab after Calendar and manages tasks", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    const desktopLinks = Array.from(container.querySelectorAll(".sidebar-nav a")).map((link) => link.textContent);

    expect(desktopLinks.slice(0, 3)).toEqual(["오늘", "캘린더", "작업"]);

    await user.click(container.querySelector<HTMLAnchorElement>('a[href="/tasks"]')!);
    expect(await screen.findByRole("heading", { name: "작업" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "작업 추가" }));
    await user.type(screen.getByLabelText("작업명"), "속성 설계 초안");
    await user.clear(screen.getByLabelText("시작일"));
    await user.type(screen.getByLabelText("시작일"), "2026-06-29");
    await user.type(screen.getByLabelText("주관"), "Jay");
    await user.type(screen.getByLabelText("프로젝트"), "Calendal");
    await user.click(screen.getByRole("button", { name: "저장" }));

    expect(await screen.findByText("속성 설계 초안")).toBeInTheDocument();
    const tasksBoard = screen.getByLabelText("작업 목록");
    expect(within(tasksBoard).getAllByText("할 일").length).toBeGreaterThan(0);
    expect(within(tasksBoard).getAllByText("Calendal").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "속성 설계 초안 수정" }));
    await user.clear(screen.getByLabelText("작업명"));
    await user.type(screen.getByLabelText("작업명"), "속성 설계 완료");
    await user.selectOptions(screen.getByLabelText("상태"), "done");
    await user.click(screen.getByRole("button", { name: "수정 저장" }));

    expect(await screen.findByText("속성 설계 완료")).toBeInTheDocument();
    expect(screen.getAllByText("완료").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "속성 설계 완료 삭제" }));

    expect(screen.queryByText("속성 설계 완료")).not.toBeInTheDocument();
  });

  it("uses animated month transitions in Calendar", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(container.querySelector<HTMLAnchorElement>('a[href="/calendar"]')!);
    await user.click(screen.getByRole("button", { name: "다음" }));

    expect(container.querySelector(".calendar-board")).toHaveClass("calendar-transition-next");
  });
});
