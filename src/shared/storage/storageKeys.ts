export const STORAGE_VERSION = "v1";

export const storageKeys = {
  settings: `calendarApp:${STORAGE_VERSION}:settings`,
  schedules: `calendarApp:${STORAGE_VERSION}:schedules`,
  tasks: `calendarApp:${STORAGE_VERSION}:tasks`,
  documents: `calendarApp:${STORAGE_VERSION}:documents`,
  attachments: `calendarApp:${STORAGE_VERSION}:attachments`,
  participants: `calendarApp:${STORAGE_VERSION}:participants`,
  categories: `calendarApp:${STORAGE_VERSION}:categories`,
} as const;
