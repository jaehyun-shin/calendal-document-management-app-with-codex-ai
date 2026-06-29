import type { AppSettings, Attachment, Category, DocumentRecord, Participant, Schedule, Task } from "../types/domain";
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

export const seedTasks: Task[] = [
  {
    id: "task-1",
    title: "제품 회의 후속 작업",
    status: "todo",
    startsAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    place: "회의실 A",
    attendees: [],
    agenda: "회의 안건과 참고 자료를 정리합니다.",
    referenceMaterials: [],
    owner: "Jay",
    project: "Calendal",
    notes: "회의 안건과 참고 자료를 정리합니다.",
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

function cloneJson<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

function createCollectionRepository<T>(storage: JsonStorageAdapter, key: string, fallback: T[] = []) {
  return {
    list(): T[] {
      return cloneJson(storage.read<T[]>(key, fallback));
    },
    saveAll(items: T[]): void {
      storage.write(key, items);
    },
    clear(): void {
      storage.write(key, []);
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
    tasks: createCollectionRepository<Task>(storage, storageKeys.tasks, seedTasks),
    documents: createCollectionRepository<DocumentRecord>(storage, storageKeys.documents, seedDocuments),
    attachments: createCollectionRepository<Attachment>(storage, storageKeys.attachments),
    participants: {
      list(): Participant[] {
        return cloneJson(storage.read<Participant[]>(storageKeys.participants, seedParticipants));
      },
      saveAll(items: Participant[]): void {
        storage.write(storageKeys.participants, items);
      },
    },
    categories: {
      list(): Category[] {
        return cloneJson(storage.read<Category[]>(storageKeys.categories, seedCategories));
      },
      saveAll(items: Category[]): void {
        storage.write(storageKeys.categories, items);
      },
    },
  };
}
