# Schedule Add And Calendar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add schedule creation from Today and show schedules inside a monthly calendar grid.

**Architecture:** Extend the existing local-first data provider with a schedule creation method that persists to the typed repository. Add a focused modal component for schedule input and replace the Calendar placeholder with a month grid derived from schedules.

**Tech Stack:** React, TypeScript, React Router, Vitest, Testing Library, Local Storage.

---

### Task 1: Provider Schedule Creation

**Files:**
- Modify: `src/shared/types/domain.ts`
- Modify: `src/app/providers/AppDataProvider.tsx`
- Modify: `src/app/providers/AppDataProvider.test.tsx`

- [ ] Add schedule attendee and schedule creation types.
- [ ] Add an `addSchedule` method to `AppDataProvider`.
- [ ] Verify new schedules persist and survive provider remount.

### Task 2: Today Schedule Modal

**Files:**
- Create: `src/features/schedules/ScheduleModal.tsx`
- Modify: `src/features/today/TodayPage.tsx`
- Modify: `src/app/App.test.tsx`

- [ ] Add a failing UI test that opens the schedule modal and creates a schedule.
- [ ] Implement the modal fields: title, date, times, place, attendees with accepted status, agenda, reference materials.
- [ ] Wire Today's "일정 추가" button to the modal and provider.

### Task 3: Monthly Calendar

**Files:**
- Modify: `src/features/calendar/CalendarPage.tsx`
- Modify: `src/app/App.test.tsx`

- [ ] Add a failing UI test that verifies the Calendar route renders a monthly grid with schedule items.
- [ ] Implement current-month grid, previous/next month buttons, weekday labels, and schedule chips inside day cells.

### Task 4: Verification

**Files:**
- Modify styling only if visual verification exposes layout issues.

- [ ] Run `pnpm test`.
- [ ] Run `pnpm build`.
- [ ] Start or reuse Vite dev server.
- [ ] Let the user verify `http://127.0.0.1:5173/today` in the in-app browser.
