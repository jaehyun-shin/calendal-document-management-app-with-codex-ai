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

  it("clears schedules to an empty collection", () => {
    const repositories = createRepositories(createLocalStorageAdapter(window.localStorage));

    repositories.schedules.clear();

    expect(repositories.schedules.list()).toEqual([]);
  });

  it("does not mutate seed schedules when a listed fallback collection is changed", () => {
    const repositories = createRepositories(createLocalStorageAdapter(window.localStorage));
    const schedules = repositories.schedules.list();

    schedules.pop();

    const freshRepositories = createRepositories(createLocalStorageAdapter(window.localStorage));

    expect(freshRepositories.schedules.list().length).toBeGreaterThan(0);
  });
});
