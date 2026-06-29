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
  { value: "tasks", label: "작업" },
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
