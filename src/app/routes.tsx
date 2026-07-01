import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../shared/components/AppShell";
import { CalendarPage } from "../features/calendar/CalendarPage";
import { DocumentsPage } from "../features/documents/DocumentsPage";
import { TasksPage } from "../features/tasks/TasksPage";
import { StatisticsPage } from "../features/statistics/StatisticsPage";
import { SettingsPage } from "../features/settings/SettingsPage";
import { TodayPage } from "../features/today/TodayPage";
import { createLocalStorageAdapter } from "../shared/storage/localStorageAdapter";
import { createRepositories } from "../shared/storage/repositories";

function startPath() {
  const repositories = createRepositories(createLocalStorageAdapter(window.localStorage));
  return `/${repositories.settings.get().startScreen}`;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to={startPath()} replace />} />
        <Route path="today" element={<TodayPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
