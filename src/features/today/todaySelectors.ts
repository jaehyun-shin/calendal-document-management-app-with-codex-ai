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
  const relatedDocuments = input.documents.filter(
    (document) => document.scheduleId && todayScheduleIds.has(document.scheduleId),
  );
  const keywords = Array.from(new Set(relatedDocuments.flatMap((document) => document.keywords))).slice(0, 6);

  return {
    scheduleCount: todaySchedules.length,
    documentCount: relatedDocuments.length,
    nextSchedule:
      todaySchedules.find((schedule) => new Date(schedule.endsAt).getTime() >= input.now.getTime()) ??
      todaySchedules[0],
    todaySchedules,
    relatedDocuments,
    keywords,
  };
}
