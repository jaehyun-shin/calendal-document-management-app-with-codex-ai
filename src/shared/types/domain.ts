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
