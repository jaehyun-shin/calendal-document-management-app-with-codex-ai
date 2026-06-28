# Calendar App MVP Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first working foundation of the local-first calendar knowledge app: React + TypeScript shell, typed local storage, extended settings, Today Summary, responsive iOS-inspired styling, and Tauri-ready packaging files.

**Architecture:** The app is split into feature modules under `src/features`, shared storage/types under `src/shared`, and platform boundaries under `src/platform`. UI screens call feature hooks/services, and services call repository interfaces instead of reading Local Storage directly. This first plan creates a thin but expandable vertical slice before adding full calendar, document, and statistics CRUD in later plans.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, React Router, plain CSS files, Tauri 2 configuration.

---

## Scope

This plan implements the first shippable foundation, not the entire product spec.

Included:

- Project scaffolding for React + TypeScript.
- Test setup.
- App routes and responsive app shell.
- Shared domain types.
- Local Storage adapter and repositories.
- Extended settings with persisted start screen and theme.
- Today Summary screen backed by local sample seed data.
- Starter routes for Calendar, Documents, Statistics, and Settings-adjacent screens.
- Tauri config files prepared for later packaging.

Deferred to later plans:

- Full calendar month/day interactions.
- Schedule detail editing.
- Full document block editor.
- Attachment file persistence.
- Advanced statistics graph UI.
- Real Tauri native file APIs.

## File Structure

Create:

- `package.json`: npm scripts and dependencies for React, Vite, Vitest, Testing Library, React Router, and Tauri CLI.
- `index.html`: Vite HTML entry.
- `tsconfig.json`: TypeScript project config.
- `tsconfig.node.json`: TypeScript config for Vite config.
- `vite.config.ts`: Vite and Vitest config.
- `src/main.tsx`: React entry point.
- `src/app/App.tsx`: Root providers and route rendering.
- `src/app/routes.tsx`: Route definitions and startup redirect logic.
- `src/app/App.test.tsx`: App-level routing and settings tests.
- `src/app/providers/AppDataProvider.tsx`: Data provider for settings, schedules, documents, and derived summaries.
- `src/app/providers/AppDataProvider.test.tsx`: Provider persistence tests.
- `src/shared/types/domain.ts`: Core domain types.
- `src/shared/storage/storageKeys.ts`: Versioned Local Storage keys.
- `src/shared/storage/localStorageAdapter.ts`: Safe JSON read/write adapter.
- `src/shared/storage/localStorageAdapter.test.ts`: Adapter validation tests.
- `src/shared/storage/repositories.ts`: Typed repositories for settings, schedules, documents, attachments.
- `src/shared/storage/repositories.test.ts`: Repository behavior tests.
- `src/shared/dates/dateUtils.ts`: Today filtering and time formatting utilities.
- `src/shared/dates/dateUtils.test.ts`: Date utility tests.
- `src/shared/components/AppShell.tsx`: Desktop sidebar and mobile bottom navigation.
- `src/shared/components/StatCard.tsx`: Small dashboard metric card.
- `src/shared/components/SectionCard.tsx`: Reusable iOS-style card section.
- `src/shared/components/EmptyState.tsx`: Reusable empty state.
- `src/shared/design-system/theme.css`: CSS variables and light/dark/system theme primitives.
- `src/shared/design-system/global.css`: Global layout, typography, navigation, form, and card styling.
- `src/features/today/TodayPage.tsx`: Today Summary screen.
- `src/features/today/todaySelectors.ts`: Derived Today Summary data.
- `src/features/today/todaySelectors.test.ts`: Today Summary derivation tests.
- `src/features/settings/SettingsPage.tsx`: Extended settings screen.
- `src/features/settings/settingsOptions.ts`: Typed settings option metadata.
- `src/features/settings/settingsOptions.test.ts`: Settings option tests.
- `src/features/calendar/CalendarPage.tsx`: Calendar starter screen with planned month/day entry points.
- `src/features/documents/DocumentsPage.tsx`: Documents starter screen with local-first copy.
- `src/features/statistics/StatisticsPage.tsx`: Statistics starter screen with derived insight slots.
- `src/platform/web/isWebRuntime.ts`: Web runtime helper.
- `src/platform/tauri/isTauriRuntime.ts`: Tauri runtime helper.
- `src/test/setup.ts`: Testing Library setup.
- `src/test/testStorage.ts`: Isolated Local Storage helper for tests.
- `src-tauri/tauri.conf.json`: Tauri 2 app configuration.
- `src-tauri/Cargo.toml`: Minimal Tauri crate manifest.
- `src-tauri/src/main.rs`: Minimal Tauri app entry.
- `.gitignore`: Ignore dependencies, builds, local Tauri output, and `.superpowers` brainstorm files.

Modify:

- `docs/superpowers/specs/2026-06-28-calendar-app-design.md`: No required code change. Keep as implementation reference.

## Task 1: Project Tooling And Test Harness

**Files:**

- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/test/testStorage.ts`
- Create: `.gitignore`

- [ ] **Step 1: Create package metadata and scripts**

Create `package.json`:

```json
{
  "name": "calendar-knowledge-app",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "tauri": "tauri"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.6.0"
  },
  "devDependencies": {
    "@tauri-apps/cli": "^2.5.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.0",
    "@types/node": "^22.15.0",
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.0",
    "jsdom": "^26.1.0",
    "typescript": "^5.8.0",
    "vite": "^7.0.0",
    "vitest": "^3.2.0"
  }
}
```

- [ ] **Step 2: Create Vite HTML entry**

Create `index.html`:

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Calendar Knowledge App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Create TypeScript configs**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create Vite and Vitest config**

Create `vite.config.ts`:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    globals: true,
  },
});
```

- [ ] **Step 5: Create test setup helpers**

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Create `src/test/testStorage.ts`:

```ts
export function resetLocalStorage(): Storage {
  window.localStorage.clear();
  return window.localStorage;
}
```

- [ ] **Step 6: Create ignore rules**

Create `.gitignore`:

```gitignore
node_modules/
dist/
dist-ssr/
.vite/
coverage/
src-tauri/target/
.superpowers/
*.local
```

- [ ] **Step 7: Install dependencies**

Run:

```powershell
pnpm install
```

Expected: command completes and creates `pnpm-lock.yaml` plus `node_modules`.

- [ ] **Step 8: Run empty test command**

Run:

```powershell
pnpm test
```

Expected before tests exist: Vitest exits with a no-test-files message. After later tasks add tests, this command must pass.

## Task 2: Domain Types And Local Storage Adapter

**Files:**

- Create: `src/shared/types/domain.ts`
- Create: `src/shared/storage/storageKeys.ts`
- Create: `src/shared/storage/localStorageAdapter.ts`
- Create: `src/shared/storage/localStorageAdapter.test.ts`

- [ ] **Step 1: Write failing storage adapter tests**

Create `src/shared/storage/localStorageAdapter.test.ts`:

```ts
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
```

- [ ] **Step 2: Run adapter test to verify it fails**

Run:

```powershell
pnpm test src/shared/storage/localStorageAdapter.test.ts
```

Expected: FAIL because `localStorageAdapter` does not exist.

- [ ] **Step 3: Add domain types**

Create `src/shared/types/domain.ts`:

```ts
export type StartScreen = "today" | "calendar" | "documents" | "statistics" | "settings";

export type CalendarDefaultView = "month" | "day";

export type ThemeMode = "system" | "light" | "dark";

export type DocumentSummaryMode = "short" | "balanced" | "detailed";

export type ClassificationMode = "manual" | "automatic";

export type StatisticsDisplayMode = "compact" | "full";

export interface AppSettings {
  startScreen: StartScreen;
  calendarDefaultView: CalendarDefaultView;
  documentSummaryMode: DocumentSummaryMode;
  classificationMode: ClassificationMode;
  statisticsDisplayMode: StatisticsDisplayMode;
  theme: ThemeMode;
}

export interface Participant {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Schedule {
  id: string;
  title: string;
  categoryId: string;
  participantIds: string[];
  startsAt: string;
  endsAt: string;
  place: string;
  pageUrl?: string;
  memo?: string;
  documentIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentBlock {
  id: string;
  type: "paragraph" | "heading" | "checklist";
  content: string;
}

export interface DocumentRecord {
  id: string;
  title: string;
  scheduleId?: string;
  categoryId: string;
  author: string;
  summary: string;
  keywords: string[];
  blocks: DocumentBlock[];
  attachmentIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  documentId: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  localPath?: string;
  createdAt: string;
}

export interface StatisticSnapshot {
  categoryMinutes: Array<{ categoryId: string; minutes: number }>;
  frequentParticipants: Array<{ participantId: string; count: number }>;
  frequentPlaces: Array<{ place: string; count: number }>;
  keywordFrequency: Array<{ keyword: string; count: number }>;
}
```

- [ ] **Step 4: Add storage keys**

Create `src/shared/storage/storageKeys.ts`:

```ts
export const STORAGE_VERSION = "v1";

export const storageKeys = {
  settings: `calendarApp:${STORAGE_VERSION}:settings`,
  schedules: `calendarApp:${STORAGE_VERSION}:schedules`,
  documents: `calendarApp:${STORAGE_VERSION}:documents`,
  attachments: `calendarApp:${STORAGE_VERSION}:attachments`,
  participants: `calendarApp:${STORAGE_VERSION}:participants`,
  categories: `calendarApp:${STORAGE_VERSION}:categories`,
} as const;
```

- [ ] **Step 5: Implement storage adapter**

Create `src/shared/storage/localStorageAdapter.ts`:

```ts
export interface JsonStorageAdapter {
  read<T>(key: string, fallback: T): T;
  write<T>(key: string, value: T): void;
  remove(key: string): void;
}

export function createLocalStorageAdapter(storage: Storage): JsonStorageAdapter {
  return {
    read<T>(key: string, fallback: T): T {
      const raw = storage.getItem(key);
      if (raw === null) return fallback;

      try {
        return JSON.parse(raw) as T;
      } catch {
        return fallback;
      }
    },
    write<T>(key: string, value: T): void {
      storage.setItem(key, JSON.stringify(value));
    },
    remove(key: string): void {
      storage.removeItem(key);
    },
  };
}
```

- [ ] **Step 6: Run adapter tests**

Run:

```powershell
pnpm test src/shared/storage/localStorageAdapter.test.ts
```

Expected: PASS.

## Task 3: Typed Repositories And Seed Data

**Files:**

- Create: `src/shared/storage/repositories.ts`
- Create: `src/shared/storage/repositories.test.ts`

- [ ] **Step 1: Write repository tests**

Create `src/shared/storage/repositories.test.ts`:

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { resetLocalStorage } from "../../test/testStorage";
import { createLocalStorageAdapter } from "./localStorageAdapter";
import { createRepositories, defaultSettings } from "./repositories";

describe("repositories", () => {
  beforeEach(() => {
    resetLocalStorage();
  });

  it("loads default settings", () => {
    const repositories = createRepositories(createLocalStorageAdapter(window.localStorage));

    expect(repositories.settings.get()).toEqual(defaultSettings);
  });

  it("persists settings", () => {
    const repositories = createRepositories(createLocalStorageAdapter(window.localStorage));

    repositories.settings.save({ ...defaultSettings, startScreen: "documents", theme: "dark" });

    expect(repositories.settings.get().startScreen).toBe("documents");
    expect(repositories.settings.get().theme).toBe("dark");
  });

  it("stores schedule collections", () => {
    const repositories = createRepositories(createLocalStorageAdapter(window.localStorage));

    repositories.schedules.saveAll([
      {
        id: "schedule-1",
        title: "제품 회의",
        categoryId: "work",
        participantIds: ["participant-1"],
        startsAt: "2026-06-28T14:00:00.000Z",
        endsAt: "2026-06-28T15:00:00.000Z",
        place: "회의실 A",
        documentIds: [],
        createdAt: "2026-06-28T00:00:00.000Z",
        updatedAt: "2026-06-28T00:00:00.000Z",
      },
    ]);

    expect(repositories.schedules.list()).toHaveLength(1);
    expect(repositories.schedules.list()[0].title).toBe("제품 회의");
  });

  it("loads seed schedules and documents before user data exists", () => {
    const repositories = createRepositories(createLocalStorageAdapter(window.localStorage));

    expect(repositories.schedules.list().length).toBeGreaterThan(0);
    expect(repositories.documents.list().length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run repository tests to verify they fail**

Run:

```powershell
pnpm test src/shared/storage/repositories.test.ts
```

Expected: FAIL because `repositories` does not exist.

- [ ] **Step 3: Implement repositories**

Create `src/shared/storage/repositories.ts`:

```ts
import type { AppSettings, Attachment, Category, DocumentRecord, Participant, Schedule } from "../types/domain";
import type { JsonStorageAdapter } from "./localStorageAdapter";
import { storageKeys } from "./storageKeys";

export const defaultSettings: AppSettings = {
  startScreen: "today",
  calendarDefaultView: "month",
  documentSummaryMode: "balanced",
  classificationMode: "manual",
  statisticsDisplayMode: "full",
  theme: "system",
};

export const seedCategories: Category[] = [
  { id: "work", name: "업무", color: "#007aff" },
  { id: "personal", name: "개인", color: "#34c759" },
  { id: "learning", name: "학습", color: "#ff9500" },
];

export const seedParticipants: Participant[] = [
  { id: "participant-1", name: "김지훈" },
  { id: "participant-2", name: "박서연" },
  { id: "participant-3", name: "이민재" },
];

export const seedSchedules: Schedule[] = [
  {
    id: "schedule-1",
    title: "제품 회의",
    categoryId: "work",
    participantIds: ["participant-1", "participant-2"],
    startsAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    place: "회의실 A",
    documentIds: ["document-1"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const seedDocuments: DocumentRecord[] = [
  {
    id: "document-1",
    title: "제품 회의 메모",
    scheduleId: "schedule-1",
    categoryId: "work",
    author: "Jay",
    summary: "제품 방향과 다음 일정 논의",
    keywords: ["제품", "회의", "일정"],
    blocks: [{ id: "block-1", type: "paragraph", content: "오늘 제품 회의의 핵심 메모입니다." }],
    attachmentIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function createCollectionRepository<T>(storage: JsonStorageAdapter, key: string, fallback: T[] = []) {
  return {
    list(): T[] {
      return storage.read<T[]>(key, fallback);
    },
    saveAll(items: T[]): void {
      storage.write(key, items);
    },
    clear(): void {
      storage.remove(key);
    },
  };
}

export function createRepositories(storage: JsonStorageAdapter) {
  return {
    settings: {
      get(): AppSettings {
        return storage.read<AppSettings>(storageKeys.settings, defaultSettings);
      },
      save(settings: AppSettings): void {
        storage.write(storageKeys.settings, settings);
      },
    },
    schedules: createCollectionRepository<Schedule>(storage, storageKeys.schedules, seedSchedules),
    documents: createCollectionRepository<DocumentRecord>(storage, storageKeys.documents, seedDocuments),
    attachments: createCollectionRepository<Attachment>(storage, storageKeys.attachments),
    participants: {
      list(): Participant[] {
        return storage.read<Participant[]>(storageKeys.participants, seedParticipants);
      },
      saveAll(items: Participant[]): void {
        storage.write(storageKeys.participants, items);
      },
    },
    categories: {
      list(): Category[] {
        return storage.read<Category[]>(storageKeys.categories, seedCategories);
      },
      saveAll(items: Category[]): void {
        storage.write(storageKeys.categories, items);
      },
    },
  };
}
```

- [ ] **Step 4: Run repository tests**

Run:

```powershell
pnpm test src/shared/storage/repositories.test.ts
```

Expected: PASS.

## Task 4: Date Utilities And Today Selectors

**Files:**

- Create: `src/shared/dates/dateUtils.ts`
- Create: `src/shared/dates/dateUtils.test.ts`
- Create: `src/features/today/todaySelectors.ts`
- Create: `src/features/today/todaySelectors.test.ts`

- [ ] **Step 1: Write date utility tests**

Create `src/shared/dates/dateUtils.test.ts`:

```ts
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
```

- [ ] **Step 2: Write Today selector tests**

Create `src/features/today/todaySelectors.test.ts`:

```ts
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
```

- [ ] **Step 3: Run tests to verify they fail**

Run:

```powershell
pnpm test src/shared/dates/dateUtils.test.ts src/features/today/todaySelectors.test.ts
```

Expected: FAIL because implementation files do not exist.

- [ ] **Step 4: Implement date utilities**

Create `src/shared/dates/dateUtils.ts`:

```ts
export function isSameLocalDate(isoDate: string, targetDate: Date): boolean {
  const date = new Date(isoDate);
  return (
    date.getFullYear() === targetDate.getFullYear() &&
    date.getMonth() === targetDate.getMonth() &&
    date.getDate() === targetDate.getDate()
  );
}

export function formatTimeRange(startsAt: string, endsAt: string): string {
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formatter.format(new Date(startsAt))} - ${formatter.format(new Date(endsAt))}`;
}
```

- [ ] **Step 5: Implement Today selectors**

Create `src/features/today/todaySelectors.ts`:

```ts
import { isSameLocalDate } from "../../shared/dates/dateUtils";
import type { DocumentRecord, Schedule } from "../../shared/types/domain";

export interface TodaySummaryInput {
  now: Date;
  schedules: Schedule[];
  documents: DocumentRecord[];
}

export interface TodaySummary {
  scheduleCount: number;
  documentCount: number;
  nextSchedule?: Schedule;
  todaySchedules: Schedule[];
  relatedDocuments: DocumentRecord[];
  keywords: string[];
}

export function buildTodaySummary(input: TodaySummaryInput): TodaySummary {
  const todaySchedules = input.schedules
    .filter((schedule) => isSameLocalDate(schedule.startsAt, input.now))
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  const todayScheduleIds = new Set(todaySchedules.map((schedule) => schedule.id));
  const relatedDocuments = input.documents.filter((document) => document.scheduleId && todayScheduleIds.has(document.scheduleId));
  const keywords = Array.from(new Set(relatedDocuments.flatMap((document) => document.keywords))).slice(0, 6);

  return {
    scheduleCount: todaySchedules.length,
    documentCount: relatedDocuments.length,
    nextSchedule: todaySchedules.find((schedule) => new Date(schedule.endsAt).getTime() >= input.now.getTime()) ?? todaySchedules[0],
    todaySchedules,
    relatedDocuments,
    keywords,
  };
}
```

- [ ] **Step 6: Run date and selector tests**

Run:

```powershell
pnpm test src/shared/dates/dateUtils.test.ts src/features/today/todaySelectors.test.ts
```

Expected: PASS.

## Task 5: App Data Provider

**Files:**

- Create: `src/app/providers/AppDataProvider.tsx`
- Create: `src/app/providers/AppDataProvider.test.tsx`

- [ ] **Step 1: Write provider persistence test**

Create `src/app/providers/AppDataProvider.test.tsx`:

```tsx
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
    const { result } = renderHook(() => useAppData(), { wrapper });

    expect(result.current.settings.startScreen).toBe("today");

    act(() => {
      result.current.updateSettings({ startScreen: "documents" });
    });

    expect(result.current.settings.startScreen).toBe("documents");
  });
});
```

- [ ] **Step 2: Run provider test to verify it fails**

Run:

```powershell
pnpm test src/app/providers/AppDataProvider.test.tsx
```

Expected: FAIL because `AppDataProvider` does not exist.

- [ ] **Step 3: Implement provider**

Create `src/app/providers/AppDataProvider.tsx`:

```tsx
import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";
import { createLocalStorageAdapter } from "../../shared/storage/localStorageAdapter";
import { createRepositories } from "../../shared/storage/repositories";
import type { AppSettings, DocumentRecord, Schedule } from "../../shared/types/domain";

interface AppDataContextValue {
  settings: AppSettings;
  schedules: Schedule[];
  documents: DocumentRecord[];
  updateSettings(patch: Partial<AppSettings>): void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: PropsWithChildren) {
  const repositories = useMemo(() => createRepositories(createLocalStorageAdapter(window.localStorage)), []);
  const [settings, setSettings] = useState(() => repositories.settings.get());
  const [schedules] = useState(() => repositories.schedules.list());
  const [documents] = useState(() => repositories.documents.list());

  function updateSettings(patch: Partial<AppSettings>) {
    const nextSettings = { ...settings, ...patch };
    repositories.settings.save(nextSettings);
    setSettings(nextSettings);
  }

  return (
    <AppDataContext.Provider value={{ settings, schedules, documents, updateSettings }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData(): AppDataContextValue {
  const value = useContext(AppDataContext);
  if (!value) {
    throw new Error("useAppData must be used inside AppDataProvider");
  }
  return value;
}
```

- [ ] **Step 4: Run provider test**

Run:

```powershell
pnpm test src/app/providers/AppDataProvider.test.tsx
```

Expected: PASS.

## Task 6: Routes, Shell, And Placeholder Screens

**Files:**

- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/app/routes.tsx`
- Create: `src/app/App.test.tsx`
- Create: `src/shared/components/AppShell.tsx`
- Create: `src/shared/components/EmptyState.tsx`
- Create: `src/features/calendar/CalendarPage.tsx`
- Create: `src/features/documents/DocumentsPage.tsx`
- Create: `src/features/statistics/StatisticsPage.tsx`

- [ ] **Step 1: Write app routing tests**

Create `src/app/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { resetLocalStorage } from "../test/testStorage";
import { App } from "./App";

describe("App", () => {
  beforeEach(() => {
    resetLocalStorage();
    window.history.pushState({}, "", "/");
  });

  it("routes missing startup screen to today", async () => {
    render(<App />);

    expect(await screen.findByRole("heading", { name: "오늘 요약" })).toBeInTheDocument();
  });

  it("renders settings route", async () => {
    window.history.pushState({}, "", "/settings");

    render(<App />);

    expect(await screen.findByRole("heading", { name: "설정" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run routing tests to verify they fail**

Run:

```powershell
pnpm test src/app/App.test.tsx
```

Expected: FAIL because app files do not exist.

- [ ] **Step 3: Add app shell**

Create `src/shared/components/AppShell.tsx`:

```tsx
import { NavLink, Outlet } from "react-router-dom";

const navigationItems = [
  { to: "/today", label: "오늘" },
  { to: "/calendar", label: "캘린더" },
  { to: "/documents", label: "문서" },
  { to: "/statistics", label: "통계" },
  { to: "/settings", label: "설정" },
];

export function AppShell() {
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="주요 메뉴">
        <div className="brand">Calendar</div>
        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="app-main">
        <Outlet />
      </main>
      <nav className="bottom-nav" aria-label="모바일 주요 메뉴">
        {navigationItems.map((item) => (
          <NavLink key={item.to} to={item.to}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
```

Create `src/shared/components/EmptyState.tsx`:

```tsx
interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
```

- [ ] **Step 4: Add starter screens**

Create `src/features/calendar/CalendarPage.tsx`:

```tsx
import { EmptyState } from "../../shared/components/EmptyState";

export function CalendarPage() {
  return <EmptyState title="캘린더" description="월간 보기와 일간 보기에서 일정을 탐색하는 화면입니다." />;
}
```

Create `src/features/documents/DocumentsPage.tsx`:

```tsx
import { EmptyState } from "../../shared/components/EmptyState";

export function DocumentsPage() {
  return <EmptyState title="문서" description="일정에 연결된 메모와 문서를 관리하는 화면입니다." />;
}
```

Create `src/features/statistics/StatisticsPage.tsx`:

```tsx
import { EmptyState } from "../../shared/components/EmptyState";

export function StatisticsPage() {
  return <EmptyState title="통계" description="일정과 문서에서 계산한 로컬 인사이트를 보여주는 화면입니다." />;
}
```

- [ ] **Step 5: Add app routes**

Create `src/app/routes.tsx`:

```tsx
import { Navigate, createBrowserRouter } from "react-router-dom";
import { AppShell } from "../shared/components/AppShell";
import { CalendarPage } from "../features/calendar/CalendarPage";
import { DocumentsPage } from "../features/documents/DocumentsPage";
import { SettingsPage } from "../features/settings/SettingsPage";
import { StatisticsPage } from "../features/statistics/StatisticsPage";
import { TodayPage } from "../features/today/TodayPage";

export function createAppRouter(startPath = "/today") {
  return createBrowserRouter([
    {
      path: "/",
      element: <AppShell />,
      children: [
        { index: true, element: <Navigate to={startPath} replace /> },
        { path: "today", element: <TodayPage /> },
        { path: "calendar", element: <CalendarPage /> },
        { path: "documents", element: <DocumentsPage /> },
        { path: "statistics", element: <StatisticsPage /> },
        { path: "settings", element: <SettingsPage /> },
      ],
    },
  ]);
}
```

- [ ] **Step 6: Add app root and entry point**

Create `src/app/App.tsx`:

```tsx
import { RouterProvider } from "react-router-dom";
import { AppDataProvider } from "./providers/AppDataProvider";
import { createAppRouter } from "./routes";
import { createLocalStorageAdapter } from "../shared/storage/localStorageAdapter";
import { createRepositories } from "../shared/storage/repositories";

const startScreenToPath = {
  today: "/today",
  calendar: "/calendar",
  documents: "/documents",
  statistics: "/statistics",
  settings: "/settings",
} as const;

export function App() {
  const repositories = createRepositories(createLocalStorageAdapter(window.localStorage));
  const settings = repositories.settings.get();
  const router = createAppRouter(startScreenToPath[settings.startScreen] ?? "/today");

  return (
    <AppDataProvider>
      <RouterProvider router={router} />
    </AppDataProvider>
  );
}
```

Create `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./shared/design-system/theme.css";
import "./shared/design-system/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 7: Run routing tests**

Run:

```powershell
pnpm test src/app/App.test.tsx
```

Expected: still FAIL because `TodayPage` and `SettingsPage` do not exist. This is acceptable until Tasks 7 and 8.

## Task 7: Settings Feature

**Files:**

- Create: `src/features/settings/settingsOptions.ts`
- Create: `src/features/settings/settingsOptions.test.ts`
- Create: `src/features/settings/SettingsPage.tsx`

- [ ] **Step 1: Write settings option tests**

Create `src/features/settings/settingsOptions.test.ts`:

```ts
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
```

- [ ] **Step 2: Run settings option tests to verify they fail**

Run:

```powershell
pnpm test src/features/settings/settingsOptions.test.ts
```

Expected: FAIL because `settingsOptions` does not exist.

- [ ] **Step 3: Implement settings options**

Create `src/features/settings/settingsOptions.ts`:

```ts
import type {
  CalendarDefaultView,
  ClassificationMode,
  DocumentSummaryMode,
  StartScreen,
  StatisticsDisplayMode,
  ThemeMode,
} from "../../shared/types/domain";

interface Option<TValue extends string> {
  value: TValue;
  label: string;
}

export const startScreenOptions: Option<StartScreen>[] = [
  { value: "today", label: "오늘 요약" },
  { value: "calendar", label: "캘린더" },
  { value: "documents", label: "문서" },
  { value: "statistics", label: "통계" },
  { value: "settings", label: "설정" },
];

export const calendarViewOptions: Option<CalendarDefaultView>[] = [
  { value: "month", label: "월간" },
  { value: "day", label: "일간" },
];

export const documentSummaryOptions: Option<DocumentSummaryMode>[] = [
  { value: "short", label: "짧게" },
  { value: "balanced", label: "균형" },
  { value: "detailed", label: "자세히" },
];

export const classificationOptions: Option<ClassificationMode>[] = [
  { value: "manual", label: "수동" },
  { value: "automatic", label: "자동" },
];

export const statisticsDisplayOptions: Option<StatisticsDisplayMode>[] = [
  { value: "compact", label: "간단히" },
  { value: "full", label: "전체" },
];

export const themeOptions: Option<ThemeMode>[] = [
  { value: "system", label: "시스템" },
  { value: "light", label: "라이트" },
  { value: "dark", label: "다크" },
];
```

- [ ] **Step 4: Implement Settings page**

Create `src/features/settings/SettingsPage.tsx`:

```tsx
import { useAppData } from "../../app/providers/AppDataProvider";
import {
  calendarViewOptions,
  classificationOptions,
  documentSummaryOptions,
  startScreenOptions,
  statisticsDisplayOptions,
  themeOptions,
} from "./settingsOptions";

export function SettingsPage() {
  const { settings, updateSettings } = useAppData();

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">앱 설정</p>
        <h1>설정</h1>
      </header>

      <div className="settings-group">
        <h2>앱 시작</h2>
        <label className="settings-row">
          <span>시작 화면</span>
          <select value={settings.startScreen} onChange={(event) => updateSettings({ startScreen: event.target.value as typeof settings.startScreen })}>
            {startScreenOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="settings-row">
          <span>캘린더 기본 보기</span>
          <select value={settings.calendarDefaultView} onChange={(event) => updateSettings({ calendarDefaultView: event.target.value as typeof settings.calendarDefaultView })}>
            {calendarViewOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="settings-group">
        <h2>문서</h2>
        <label className="settings-row">
          <span>문서 요약 옵션</span>
          <select value={settings.documentSummaryMode} onChange={(event) => updateSettings({ documentSummaryMode: event.target.value as typeof settings.documentSummaryMode })}>
            {documentSummaryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="settings-row">
          <span>기본 문서 분류</span>
          <select value={settings.classificationMode} onChange={(event) => updateSettings({ classificationMode: event.target.value as typeof settings.classificationMode })}>
            {classificationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="settings-group">
        <h2>화면</h2>
        <label className="settings-row">
          <span>통계 표시</span>
          <select value={settings.statisticsDisplayMode} onChange={(event) => updateSettings({ statisticsDisplayMode: event.target.value as typeof settings.statisticsDisplayMode })}>
            {statisticsDisplayOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="settings-row">
          <span>테마</span>
          <select value={settings.theme} onChange={(event) => updateSettings({ theme: event.target.value as typeof settings.theme })}>
            {themeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run settings tests**

Run:

```powershell
pnpm test src/features/settings/settingsOptions.test.ts
```

Expected: PASS.

## Task 8: Today Summary UI And Shared Cards

**Files:**

- Create: `src/shared/components/SectionCard.tsx`
- Create: `src/shared/components/StatCard.tsx`
- Create: `src/features/today/TodayPage.tsx`

- [ ] **Step 1: Create shared card components**

Create `src/shared/components/SectionCard.tsx`:

```tsx
import type { PropsWithChildren } from "react";

interface SectionCardProps extends PropsWithChildren {
  title: string;
  action?: string;
}

export function SectionCard({ title, action, children }: SectionCardProps) {
  return (
    <section className="section-card">
      <div className="section-card-header">
        <h2>{title}</h2>
        {action ? <button type="button">{action}</button> : null}
      </div>
      {children}
    </section>
  );
}
```

Create `src/shared/components/StatCard.tsx`:

```tsx
interface StatCardProps {
  label: string;
  value: string;
  tone?: "blue" | "green" | "orange";
}

export function StatCard({ label, value, tone = "blue" }: StatCardProps) {
  return (
    <div className={`stat-card stat-card-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
```

- [ ] **Step 2: Implement Today page**

Create `src/features/today/TodayPage.tsx`:

```tsx
import { useMemo } from "react";
import { useAppData } from "../../app/providers/AppDataProvider";
import { formatTimeRange } from "../../shared/dates/dateUtils";
import { SectionCard } from "../../shared/components/SectionCard";
import { StatCard } from "../../shared/components/StatCard";
import { buildTodaySummary } from "./todaySelectors";

export function TodayPage() {
  const { schedules, documents } = useAppData();
  const summary = useMemo(() => buildTodaySummary({ now: new Date(), schedules, documents }), [schedules, documents]);

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">오늘의 업무판</p>
        <h1>오늘 요약</h1>
      </header>

      <div className="today-grid">
        <StatCard label="오늘 일정" value={`${summary.scheduleCount}건`} tone="blue" />
        <StatCard label="연결 문서" value={`${summary.documentCount}건`} tone="green" />
        <StatCard label="키워드" value={`${summary.keywords.length}개`} tone="orange" />
      </div>

      <SectionCard title="다음 일정" action="일정 추가">
        {summary.nextSchedule ? (
          <article className="next-schedule">
            <h3>{summary.nextSchedule.title}</h3>
            <p>{formatTimeRange(summary.nextSchedule.startsAt, summary.nextSchedule.endsAt)}</p>
            <p>{summary.nextSchedule.place}</p>
          </article>
        ) : (
          <p className="muted">오늘 예정된 일정이 없습니다.</p>
        )}
      </SectionCard>

      <SectionCard title="오늘 일정">
        <div className="list">
          {summary.todaySchedules.length === 0 ? (
            <p className="muted">오늘 일정이 비어 있습니다.</p>
          ) : (
            summary.todaySchedules.map((schedule) => (
              <article className="list-row" key={schedule.id}>
                <div>
                  <strong>{schedule.title}</strong>
                  <span>{schedule.place}</span>
                </div>
                <time>{formatTimeRange(schedule.startsAt, schedule.endsAt)}</time>
              </article>
            ))
          )}
        </div>
      </SectionCard>

      <SectionCard title="오늘 키워드">
        <div className="chips">
          {summary.keywords.length === 0 ? <p className="muted">연결된 문서 키워드가 없습니다.</p> : summary.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
        </div>
      </SectionCard>
    </section>
  );
}
```

- [ ] **Step 3: Run app and selector tests**

Run:

```powershell
pnpm test src/app/App.test.tsx src/features/today/todaySelectors.test.ts
```

Expected: PASS after Settings page from Task 7 exists.

## Task 9: iOS-Inspired Styling

**Files:**

- Create: `src/shared/design-system/theme.css`
- Create: `src/shared/design-system/global.css`

- [ ] **Step 1: Add theme variables**

Create `src/shared/design-system/theme.css`:

```css
:root {
  color-scheme: light;
  --color-bg: #f5f5f7;
  --color-surface: #ffffff;
  --color-surface-muted: #f2f2f7;
  --color-text: #1d1d1f;
  --color-muted: #6e6e73;
  --color-border: #e5e5ea;
  --color-blue: #007aff;
  --color-green: #34c759;
  --color-orange: #ff9500;
  --shadow-card: 0 12px 30px rgba(0, 0, 0, 0.07);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
    --color-bg: #000000;
    --color-surface: #1c1c1e;
    --color-surface-muted: #2c2c2e;
    --color-text: #f5f5f7;
    --color-muted: #a1a1a6;
    --color-border: #38383a;
    --shadow-card: 0 12px 30px rgba(0, 0, 0, 0.32);
  }
}
```

- [ ] **Step 2: Add global layout CSS**

Create `src/shared/design-system/global.css`:

```css
* {
  box-sizing: border-box;
}

html,
body,
#root {
  min-height: 100%;
  margin: 0;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
}

button,
select {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
}

.sidebar {
  padding: 24px;
  border-right: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(18px);
}

.brand {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 24px;
}

.sidebar-nav,
.bottom-nav {
  display: flex;
  gap: 8px;
}

.sidebar-nav {
  flex-direction: column;
}

.sidebar-nav a,
.bottom-nav a {
  color: var(--color-muted);
  text-decoration: none;
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 700;
}

.sidebar-nav a.active,
.bottom-nav a.active {
  color: var(--color-blue);
  background: var(--color-surface);
}

.app-main {
  padding: 32px;
  max-width: 1180px;
  width: 100%;
}

.bottom-nav {
  display: none;
}

.page {
  display: grid;
  gap: 18px;
}

.page-header h1 {
  font-size: 34px;
  line-height: 1.1;
  margin: 4px 0 0;
}

.eyebrow,
.muted {
  color: var(--color-muted);
}

.eyebrow {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
}

.today-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.stat-card,
.section-card,
.settings-group,
.empty-state {
  background: var(--color-surface);
  border-radius: 20px;
  box-shadow: var(--shadow-card);
}

.stat-card {
  padding: 18px;
  display: grid;
  gap: 8px;
}

.stat-card span {
  color: var(--color-muted);
  font-size: 13px;
}

.stat-card strong {
  font-size: 28px;
}

.stat-card-blue strong {
  color: var(--color-blue);
}

.stat-card-green strong {
  color: var(--color-green);
}

.stat-card-orange strong {
  color: var(--color-orange);
}

.section-card,
.settings-group,
.empty-state {
  padding: 18px;
}

.section-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.section-card h2,
.settings-group h2,
.empty-state h2 {
  margin: 0;
  font-size: 18px;
}

.section-card button {
  border: 0;
  color: #ffffff;
  background: var(--color-blue);
  border-radius: 999px;
  padding: 8px 12px;
  font-weight: 700;
}

.next-schedule h3 {
  margin: 0 0 8px;
  font-size: 22px;
}

.list {
  display: grid;
  gap: 10px;
}

.list-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: 14px;
  background: var(--color-surface-muted);
}

.list-row div {
  display: grid;
  gap: 4px;
}

.list-row span,
.list-row time {
  color: var(--color-muted);
  font-size: 13px;
}

.chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chips span {
  padding: 8px 12px;
  background: var(--color-surface-muted);
  border-radius: 999px;
  color: var(--color-blue);
  font-weight: 700;
}

.settings-group {
  display: grid;
  gap: 0;
  overflow: hidden;
}

.settings-row {
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border-top: 1px solid var(--color-border);
}

.settings-row select {
  border: 0;
  color: var(--color-muted);
  background: transparent;
  text-align: right;
}

.empty-state {
  min-height: 260px;
  display: grid;
  place-content: center;
  text-align: center;
}

@media (max-width: 760px) {
  .app-shell {
    display: block;
    padding-bottom: 78px;
  }

  .sidebar {
    display: none;
  }

  .app-main {
    padding: 18px;
  }

  .bottom-nav {
    position: fixed;
    left: 12px;
    right: 12px;
    bottom: 12px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    background: rgba(255, 255, 255, 0.78);
    backdrop-filter: blur(18px);
    border: 1px solid var(--color-border);
    border-radius: 22px;
    padding: 8px;
    box-shadow: var(--shadow-card);
  }

  .bottom-nav a {
    font-size: 12px;
    text-align: center;
    padding: 10px 6px;
  }

  .today-grid {
    grid-template-columns: 1fr;
  }

  .page-header h1 {
    font-size: 30px;
  }
}
```

- [ ] **Step 3: Run build**

Run:

```powershell
pnpm build
```

Expected: PASS.

## Task 10: Tauri Packaging Skeleton

**Files:**

- Create: `src/platform/web/isWebRuntime.ts`
- Create: `src/platform/tauri/isTauriRuntime.ts`
- Create: `src-tauri/tauri.conf.json`
- Create: `src-tauri/Cargo.toml`
- Create: `src-tauri/src/main.rs`

- [ ] **Step 1: Add runtime helpers**

Create `src/platform/web/isWebRuntime.ts`:

```ts
export function isWebRuntime(): boolean {
  return typeof window !== "undefined" && !("__TAURI_INTERNALS__" in window);
}
```

Create `src/platform/tauri/isTauriRuntime.ts`:

```ts
export function isTauriRuntime(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}
```

- [ ] **Step 2: Add Tauri config**

Create `src-tauri/tauri.conf.json`:

```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "Calendar Knowledge App",
  "version": "0.1.0",
  "identifier": "com.local.calendar-knowledge-app",
  "build": {
    "beforeDevCommand": "pnpm dev",
    "devUrl": "http://127.0.0.1:5173",
    "beforeBuildCommand": "pnpm build",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "Calendar Knowledge App",
        "width": 1180,
        "height": 820,
        "minWidth": 390,
        "minHeight": 680
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": []
  }
}
```

Create `src-tauri/Cargo.toml`:

```toml
[package]
name = "calendar-knowledge-app"
version = "0.1.0"
description = "Local-first calendar knowledge app"
authors = ["Calendar Knowledge App"]
edition = "2021"

[lib]
name = "calendar_knowledge_app_lib"
crate-type = ["staticlib", "cdylib", "rlib"]

[build-dependencies]
tauri-build = { version = "2", features = [] }

[dependencies]
tauri = { version = "2", features = [] }
tauri-plugin-opener = "2"
```

Create `src-tauri/src/main.rs`:

```rust
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

- [ ] **Step 3: Run web build**

Run:

```powershell
pnpm build
```

Expected: PASS.

- [ ] **Step 4: Validate Tauri command availability**

Run:

```powershell
pnpm tauri --version
```

Expected: prints Tauri CLI version. If Rust or platform SDK pieces are missing, record the missing prerequisite and continue with web app verification.

## Task 11: Final Verification And Handoff

**Files:**

- Modify only files created in previous tasks if verification reveals concrete defects.

- [ ] **Step 1: Run full test suite**

Run:

```powershell
pnpm test
```

Expected: PASS.

- [ ] **Step 2: Run production build**

Run:

```powershell
pnpm build
```

Expected: PASS and creates `dist/`.

- [ ] **Step 3: Start local dev server**

Run:

```powershell
pnpm dev
```

Expected: Vite dev server starts at `http://127.0.0.1:5173`.

- [ ] **Step 4: Browser smoke test**

Open `http://127.0.0.1:5173` and verify:

- `/` redirects to Today Summary.
- Sidebar or bottom navigation is visible depending on viewport width.
- Settings page renders.
- Changing start screen in Settings persists after reload.
- Today Summary does not visually overlap at desktop and mobile widths.

- [ ] **Step 5: Record verification result**

Add a short note to the final response with:

- Test command result.
- Build command result.
- Dev server URL.
- Any Tauri prerequisite that is missing locally.

- [ ] **Step 6: Compound Engineering follow-up**

If the `compound-engineering` plugin is loaded, run `compound-engineering:ce-compound` or `/ce-compound` after review is complete. Capture mistakes, lessons, repeated failure patterns, and process improvements from the execution-review cycle.

If the plugin is not loaded in the current thread, write a manual note under `docs/solutions/` with the same purpose.
