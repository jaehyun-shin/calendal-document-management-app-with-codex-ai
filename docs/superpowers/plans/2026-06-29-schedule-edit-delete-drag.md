# Schedule Edit Delete Drag Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full schedule editing, deletion, date-cell creation, and drag-and-drop date movement across Today and Calendar screens.

**Architecture:** Extend `AppDataProvider` with update/delete/move operations and reuse the existing schedule modal for both creation and editing. Calendar owns interaction state for hovered day actions, clicked schedule editing, direct delete buttons, and drag/drop date changes.

**Tech Stack:** React, TypeScript, React Router, Vitest, Testing Library, native HTML drag/drop, Local Storage.

---

### Task 1: Provider Schedule Mutations

**Files:**
- Modify: `src/app/providers/AppDataProvider.tsx`
- Modify: `src/app/providers/AppDataProvider.test.tsx`

- [ ] Add failing provider tests for `updateSchedule`, `deleteSchedule`, and `moveScheduleDate`.
- [ ] Implement all three methods and persist changes through the schedule repository.
- [ ] Run provider tests.

### Task 2: Reusable Schedule Modal

**Files:**
- Modify: `src/features/schedules/ScheduleModal.tsx`

- [ ] Add initial value support from an existing schedule.
- [ ] Add configurable title/submit text and optional delete action.
- [ ] Keep the same form fields for add and edit.

### Task 3: Today Edit/Delete

**Files:**
- Modify: `src/features/today/TodayPage.tsx`
- Modify: `src/shared/design-system/global.css`
- Modify: `src/app/App.test.tsx`

- [ ] Add failing app tests for editing and deleting a Today schedule.
- [ ] Show edit/delete icon buttons on schedule row hover/focus.
- [ ] Wire edit to the shared modal and delete to provider deletion.

### Task 4: Calendar Interactions

**Files:**
- Modify: `src/features/calendar/CalendarPage.tsx`
- Modify: `src/shared/design-system/global.css`
- Modify: `src/app/App.test.tsx`

- [ ] Add failing app tests for day-cell add, calendar click edit/delete, and drag/drop date movement.
- [ ] Add day hover add buttons.
- [ ] Add schedule hover delete buttons and click-to-edit modal.
- [ ] Add drag/drop between dates and top/bottom edge month movement.

### Task 5: Verification

**Files:**
- Modify only files above if verification exposes concrete defects.

- [ ] Run `pnpm test`.
- [ ] Run `pnpm build`.
- [ ] Start or reuse Vite at `http://127.0.0.1:5173`.
- [ ] Browser-check `/today` and `/calendar` for the user to verify manually.
