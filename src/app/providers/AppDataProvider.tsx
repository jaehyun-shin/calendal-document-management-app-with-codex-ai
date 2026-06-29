import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";
import type {
  AddScheduleInput,
  AddTaskInput,
  AppSettings,
  Category,
  DocumentRecord,
  Participant,
  Schedule,
  Task,
} from "../../shared/types/domain";
import { createLocalStorageAdapter } from "../../shared/storage/localStorageAdapter";
import { createRepositories } from "../../shared/storage/repositories";

interface AppDataContextValue {
  settings: AppSettings;
  schedules: Schedule[];
  tasks: Task[];
  documents: DocumentRecord[];
  participants: Participant[];
  categories: Category[];
  updateSettings(settings: Partial<AppSettings>): void;
  addSchedule(schedule: AddScheduleInput): Schedule;
  updateSchedule(id: string, schedule: AddScheduleInput): Schedule | undefined;
  deleteSchedule(id: string): void;
  moveScheduleDate(id: string, date: string): Schedule | undefined;
  addTask(task: AddTaskInput): Task;
  updateTask(id: string, task: AddTaskInput): Task | undefined;
  deleteTask(id: string): void;
  moveTaskDate(id: string, date: string): Task | undefined;
}

function attendeeId(prefix: string, index: number): string {
  return `${prefix}-attendee-${index}`;
}

function dateInputValue(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function timeInputValue(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function scheduleInputToTaskInput(input: AddScheduleInput): AddTaskInput {
  return {
    title: input.title,
    status: "todo",
    startDate: input.date,
    startTime: input.startTime,
    endDate: input.date,
    endTime: input.endTime,
    place: input.place,
    attendees: input.attendees,
    agenda: input.agenda,
    referenceMaterials: input.referenceMaterials,
    owner: "",
    project: "",
    notes: "",
  };
}

function taskToSchedule(task: Task, categoryId: string): Schedule {
  return {
    id: task.id,
    title: task.title,
    categoryId,
    participantIds: task.attendees?.map((attendee) => attendee.id) ?? [],
    attendees: task.attendees,
    startsAt: task.startsAt,
    endsAt: task.endsAt,
    place: task.place,
    agenda: task.agenda,
    referenceMaterials: task.referenceMaterials,
    memo: task.notes,
    documentIds: [],
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

function scheduleToTask(schedule: Schedule): Task {
  return {
    id: schedule.id,
    title: schedule.title,
    status: "todo",
    startsAt: schedule.startsAt,
    endsAt: schedule.endsAt,
    place: schedule.place,
    attendees: schedule.attendees ?? [],
    agenda: schedule.agenda ?? "",
    referenceMaterials: schedule.referenceMaterials ?? [],
    owner: "",
    project: "",
    notes: schedule.memo ?? "",
    createdAt: schedule.createdAt,
    updatedAt: schedule.updatedAt,
  };
}

function buildTaskFromInput(input: AddTaskInput, options: { id: string; createdAt: string }): Task {
  const now = new Date().toISOString();
  const attendeePrefix = options.id;

  return {
    id: options.id,
    title: input.title.trim(),
    status: input.status,
    startsAt: new Date(`${input.startDate}T${input.startTime}:00`).toISOString(),
    endsAt: new Date(`${input.endDate}T${input.endTime}:00`).toISOString(),
    place: input.place.trim(),
    attendees: input.attendees
      .filter((attendee) => attendee.name.trim().length > 0)
      .map((attendee, index) => ({
        id: attendeeId(attendeePrefix, index),
        name: attendee.name.trim(),
        accepted: attendee.accepted,
      })),
    agenda: input.agenda.trim(),
    referenceMaterials: input.referenceMaterials.map((material) => material.trim()).filter(Boolean),
    owner: input.owner.trim(),
    project: input.project.trim(),
    notes: input.notes.trim(),
    createdAt: options.createdAt,
    updatedAt: now,
  };
}

function taskToInput(task: Task): AddTaskInput {
  const start = new Date(task.startsAt);
  const end = new Date(task.endsAt);

  return {
    title: task.title,
    status: task.status,
    startDate: dateInputValue(start),
    startTime: timeInputValue(start),
    endDate: dateInputValue(end),
    endTime: timeInputValue(end),
    place: task.place,
    attendees: task.attendees?.map((attendee) => ({ name: attendee.name, accepted: attendee.accepted })) ?? [],
    agenda: task.agenda ?? "",
    referenceMaterials: task.referenceMaterials ?? [],
    owner: task.owner,
    project: task.project,
    notes: task.notes,
  };
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: PropsWithChildren) {
  const repositories = useMemo(() => createRepositories(createLocalStorageAdapter(window.localStorage)), []);
  const [settings, setSettings] = useState(() => repositories.settings.get());
  const [tasks, setTasks] = useState(() => {
    const storedTasks = repositories.tasks.list();
    if (storedTasks.length > 0) return storedTasks;
    return repositories.schedules.list().map(scheduleToTask);
  });
  const [documents] = useState(() => repositories.documents.list());
  const [participants] = useState(() => repositories.participants.list());
  const [categories] = useState(() => repositories.categories.list());

  const schedules = useMemo(
    () => tasks.map((task) => taskToSchedule(task, categories[0]?.id ?? "work")),
    [categories, tasks],
  );

  const value = useMemo<AppDataContextValue>(
    () => ({
      settings,
      schedules,
      tasks,
      documents,
      participants,
      categories,
      updateSettings(nextSettings) {
        setSettings((currentSettings) => {
          const updatedSettings = { ...currentSettings, ...nextSettings };
          repositories.settings.save(updatedSettings);
          return updatedSettings;
        });
      },
      addTask(input) {
        const now = new Date().toISOString();
        const createdTask = buildTaskFromInput(input, {
          id: `task-${Date.now()}`,
          createdAt: now,
        });

        setTasks((currentTasks) => {
          const nextTasks = [...currentTasks, createdTask];
          repositories.tasks.saveAll(nextTasks);
          return nextTasks;
        });

        return createdTask;
      },
      updateTask(id, input) {
        let updatedTask: Task | undefined;

        setTasks((currentTasks) => {
          const nextTasks = currentTasks.map((task) => {
            if (task.id !== id) return task;
            updatedTask = buildTaskFromInput(input, {
              id: task.id,
              createdAt: task.createdAt,
            });
            return updatedTask;
          });
          repositories.tasks.saveAll(nextTasks);
          return nextTasks;
        });

        return updatedTask;
      },
      deleteTask(id) {
        setTasks((currentTasks) => {
          const nextTasks = currentTasks.filter((task) => task.id !== id);
          repositories.tasks.saveAll(nextTasks);
          return nextTasks;
        });
      },
      moveTaskDate(id, date) {
        let movedTask: Task | undefined;

        setTasks((currentTasks) => {
          const nextTasks = currentTasks.map((task) => {
            if (task.id !== id) return task;

            const start = new Date(task.startsAt);
            const end = new Date(task.endsAt);
            const durationMs = end.getTime() - start.getTime();
            const startTime = timeInputValue(start);
            const nextStart = new Date(`${date}T${startTime}:00`);
            const nextEnd = new Date(nextStart.getTime() + durationMs);

            movedTask = {
              ...task,
              startsAt: nextStart.toISOString(),
              endsAt: nextEnd.toISOString(),
              updatedAt: new Date().toISOString(),
            };
            return movedTask;
          });
          repositories.tasks.saveAll(nextTasks);
          return nextTasks;
        });

        return movedTask;
      },
      addSchedule(input) {
        const now = new Date().toISOString();
        const createdTask = buildTaskFromInput(scheduleInputToTaskInput(input), {
          id: `task-${Date.now()}`,
          createdAt: now,
        });

        setTasks((currentTasks) => {
          const nextTasks = [...currentTasks, createdTask];
          repositories.tasks.saveAll(nextTasks);
          return nextTasks;
        });

        return taskToSchedule(createdTask, categories[0]?.id ?? "work");
      },
      updateSchedule(id, input) {
        let updatedTask: Task | undefined;

        setTasks((currentTasks) => {
          const nextTasks = currentTasks.map((task) => {
            if (task.id !== id) return task;
            updatedTask = buildTaskFromInput(
              {
                ...taskToInput(task),
                ...scheduleInputToTaskInput(input),
              },
              {
                id: task.id,
                createdAt: task.createdAt,
              },
            );
            return updatedTask;
          });
          repositories.tasks.saveAll(nextTasks);
          return nextTasks;
        });

        return updatedTask ? taskToSchedule(updatedTask, categories[0]?.id ?? "work") : undefined;
      },
      deleteSchedule(id) {
        setTasks((currentTasks) => {
          const nextTasks = currentTasks.filter((task) => task.id !== id);
          repositories.tasks.saveAll(nextTasks);
          return nextTasks;
        });
      },
      moveScheduleDate(id, date) {
        let movedTask: Task | undefined;

        setTasks((currentTasks) => {
          const nextTasks = currentTasks.map((task) => {
            if (task.id !== id) return task;

            const start = new Date(task.startsAt);
            const end = new Date(task.endsAt);
            const durationMs = end.getTime() - start.getTime();
            const nextStart = new Date(`${date}T${timeInputValue(start)}:00`);
            const nextEnd = new Date(nextStart.getTime() + durationMs);

            movedTask = {
              ...task,
              startsAt: nextStart.toISOString(),
              endsAt: nextEnd.toISOString(),
              updatedAt: new Date().toISOString(),
            };
            return movedTask;
          });
          repositories.tasks.saveAll(nextTasks);
          return nextTasks;
        });

        return movedTask ? taskToSchedule(movedTask, categories[0]?.id ?? "work") : undefined;
      },
    }),
    [categories, documents, participants, repositories, schedules, settings, tasks],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider");
  }

  return context;
}
