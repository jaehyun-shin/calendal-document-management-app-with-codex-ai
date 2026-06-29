export type StartScreen = "today" | "calendar" | "tasks" | "documents" | "statistics" | "settings";

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
  attendees?: ScheduleAttendee[];
  startsAt: string;
  endsAt: string;
  place: string;
  agenda?: string;
  referenceMaterials?: string[];
  pageUrl?: string;
  memo?: string;
  documentIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleAttendee {
  id: string;
  name: string;
  accepted: boolean;
}

export interface AddScheduleInput {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  place: string;
  attendees: Array<{
    name: string;
    accepted: boolean;
  }>;
  agenda: string;
  referenceMaterials: string[];
}

export type TaskStatus = "todo" | "inProgress" | "done";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  startsAt: string;
  endsAt: string;
  place: string;
  attendees?: ScheduleAttendee[];
  agenda?: string;
  referenceMaterials?: string[];
  owner: string;
  project: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddTaskInput {
  title: string;
  status: TaskStatus;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  place: string;
  attendees: Array<{
    name: string;
    accepted: boolean;
  }>;
  agenda: string;
  referenceMaterials: string[];
  owner: string;
  project: string;
  notes: string;
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
