import { useEffect, useMemo, useRef, useState, type DragEvent, type MouseEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAppData } from "../../app/providers/AppDataProvider";
import type { Task } from "../../shared/types/domain";
import { TaskModal } from "../tasks/TaskModal";

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
type MonthDirection = -1 | 1;

function dateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function formatMonthTitle(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long" }).format(date);
}

function formatReadableDate(date: string): string {
  return new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", weekday: "long" }).format(new Date(date));
}

function formatTaskTime(task: Task): string {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(task.startsAt));
}

function buildMonthDates(monthDate: Date): Date[] {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
}

function buildWeekDates(selectedDate: string): Date[] {
  const date = new Date(selectedDate);
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay());

  return Array.from({ length: 7 }, (_, index) => {
    const weekDate = new Date(weekStart);
    weekDate.setDate(weekStart.getDate() + index);
    return weekDate;
  });
}

function groupTasksByDate(tasks: Task[]): Map<string, Task[]> {
  return tasks.reduce((groups, task) => {
    const key = dateKey(new Date(task.startsAt));
    const currentTasks = groups.get(key) ?? [];
    groups.set(
      key,
      [...currentTasks, task].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()),
    );
    return groups;
  }, new Map<string, Task[]>());
}

export function CalendarPage() {
  const { tasks, addTask, updateTask, deleteTask, moveTaskDate } = useAppData();
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [modalDate, setModalDate] = useState<string | undefined>();
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [draggedTaskId, setDraggedTaskId] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [monthTransition, setMonthTransition] = useState("");
  const edgeDelayRef = useRef<number | undefined>(undefined);
  const edgeRepeatRef = useRef<number | undefined>(undefined);
  const edgeDirectionRef = useRef<MonthDirection | undefined>(undefined);
  const transitionRef = useRef<number | undefined>(undefined);
  const monthDates = useMemo(() => buildMonthDates(visibleMonth), [visibleMonth]);
  const visibleDates = useMemo(() => (selectedDate ? buildWeekDates(selectedDate) : monthDates), [monthDates, selectedDate]);
  const tasksByDate = useMemo(() => groupTasksByDate(tasks), [tasks]);
  const selectedDateTasks = selectedDate ? (tasksByDate.get(selectedDate) ?? []) : [];

  useEffect(() => {
    return () => {
      clearEdgeTimers();
      if (transitionRef.current) window.clearTimeout(transitionRef.current);
    };
  }, []);

  function closeModal() {
    setModalDate(undefined);
    setEditingTask(undefined);
  }

  function clearEdgeTimers() {
    if (edgeDelayRef.current) window.clearTimeout(edgeDelayRef.current);
    if (edgeRepeatRef.current) window.clearInterval(edgeRepeatRef.current);
    edgeDelayRef.current = undefined;
    edgeRepeatRef.current = undefined;
    edgeDirectionRef.current = undefined;
  }

  function moveMonth(offset: MonthDirection) {
    setSelectedDate(undefined);
    setMonthTransition(offset > 0 ? "calendar-transition-next" : "calendar-transition-previous");
    setVisibleMonth((currentMonth) => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
    if (transitionRef.current) window.clearTimeout(transitionRef.current);
    transitionRef.current = window.setTimeout(() => setMonthTransition(""), 420);
  }

  function queueEdgeMonthMove(direction: MonthDirection) {
    if (edgeDirectionRef.current === direction) return;
    clearEdgeTimers();
    edgeDirectionRef.current = direction;
    edgeDelayRef.current = window.setTimeout(() => {
      moveMonth(direction);
      edgeRepeatRef.current = window.setInterval(() => moveMonth(direction), 950);
    }, 600);
  }

  function maybeMoveMonthAtEdge(event: DragEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const edgeSize = 42;

    if (event.clientY <= rect.top + edgeSize) {
      queueEdgeMonthMove(-1);
      return;
    }

    if (event.clientY >= rect.bottom - edgeSize) {
      queueEdgeMonthMove(1);
      return;
    }

    clearEdgeTimers();
  }

  function handleBoardDragLeave(event: DragEvent<HTMLElement>) {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return;
    clearEdgeTimers();
  }

  function openAddModal(event: MouseEvent<HTMLButtonElement>, date: string) {
    event.stopPropagation();
    setModalDate(date);
  }

  return (
    <section className="page">
      <header className="page-header calendar-header">
        <div>
          <p className="eyebrow">작업</p>
          <h1>캘린더</h1>
        </div>
        <div className="calendar-controls" aria-label="월 이동">
          <button type="button" onClick={() => moveMonth(-1)}>
            이전
          </button>
          <strong>{formatMonthTitle(visibleMonth)}</strong>
          <button type="button" onClick={() => moveMonth(1)}>
            다음
          </button>
        </div>
      </header>

      <section
        className={`calendar-board ${selectedDate ? "calendar-board-compact" : ""} ${monthTransition}`.trim()}
        aria-label="월간 캘린더"
        onDragOver={(event) => {
          event.preventDefault();
          maybeMoveMonthAtEdge(event);
        }}
        onDragLeave={handleBoardDragLeave}
        onDrop={clearEdgeTimers}
      >
        <div
          className="calendar-edge-zone calendar-edge-zone-previous"
          data-edge-zone="previous"
          aria-hidden="true"
          onDragEnter={() => queueEdgeMonthMove(-1)}
          onDragOver={(event) => {
            event.preventDefault();
            queueEdgeMonthMove(-1);
          }}
        />
        <div
          className="calendar-edge-zone calendar-edge-zone-next"
          data-edge-zone="next"
          aria-hidden="true"
          onDragEnter={() => queueEdgeMonthMove(1)}
          onDragOver={(event) => {
            event.preventDefault();
            queueEdgeMonthMove(1);
          }}
        />
        <div className="calendar-weekdays">
          {weekdays.map((weekday) => (
            <span key={weekday}>{weekday}</span>
          ))}
        </div>
        <div className="calendar-grid">
          {visibleDates.map((date) => {
            const key = dateKey(date);
            const dayTasks = tasksByDate.get(key) ?? [];
            const isOutsideMonth = date.getMonth() !== visibleMonth.getMonth();
            const isSelected = selectedDate === key;

            return (
              <article
                aria-label={`${key} 작업`}
                className={[
                  "calendar-day",
                  isOutsideMonth ? "calendar-day-muted" : "",
                  isSelected ? "calendar-day-selected" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={key}
                onClick={() => setSelectedDate(key)}
                onDragOver={(event) => {
                  event.preventDefault();
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  clearEdgeTimers();
                  if (draggedTaskId) {
                    moveTaskDate(draggedTaskId, key);
                    setDraggedTaskId(undefined);
                  }
                }}
              >
                <div className="calendar-day-header">
                  <time dateTime={key}>{date.getDate()}</time>
                  <button type="button" className="day-add-button" aria-label={`${key} 작업 추가`} onClick={(event) => openAddModal(event, key)}>
                    <Plus aria-hidden="true" size={15} strokeWidth={2.4} />
                  </button>
                </div>
                <div className="calendar-schedules">
                  {dayTasks.map((task) => (
                    <div
                      className="calendar-schedule"
                      draggable
                      key={task.id}
                      onDragStart={() => setDraggedTaskId(task.id)}
                      onDragEnd={() => {
                        clearEdgeTimers();
                        setDraggedTaskId(undefined);
                      }}
                    >
                      <button
                        type="button"
                        className="calendar-schedule-main"
                        aria-label={`${task.title} 수정`}
                        onClick={(event) => {
                          event.stopPropagation();
                          setEditingTask(task);
                        }}
                      >
                        <span>{formatTaskTime(task)}</span>
                        <strong>{task.title}</strong>
                      </button>
                      <button
                        type="button"
                        className="calendar-schedule-delete icon-button danger-icon-button"
                        aria-label={`${task.title} 삭제`}
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteTask(task.id);
                        }}
                      >
                        <Trash2 aria-hidden="true" size={14} strokeWidth={2.3} />
                      </button>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section
        className={selectedDate ? "selected-day-panel selected-day-panel-open" : "selected-day-panel"}
        data-testid={selectedDate ? "selected-day-task-panel" : undefined}
        aria-hidden={selectedDate ? undefined : "true"}
      >
        {selectedDate ? (
          <>
            <div className="selected-day-panel-header">
              <div>
                <p className="eyebrow">선택한 날짜</p>
                <h2>{formatReadableDate(selectedDate)}</h2>
              </div>
              <button type="button" className="ghost-button" onClick={() => setSelectedDate(undefined)}>
                닫기
              </button>
            </div>
            <div className="selected-day-list">
              {selectedDateTasks.length === 0 ? (
                <p className="muted">등록된 작업이 없습니다.</p>
              ) : (
                selectedDateTasks.map((task) => (
                  <button
                    type="button"
                    className="selected-day-row"
                    key={task.id}
                    onClick={() => setEditingTask(task)}
                  >
                    <span>{formatTaskTime(task)}</span>
                    <strong>{task.title}</strong>
                    <small>{task.place}</small>
                  </button>
                ))
              )}
            </div>
          </>
        ) : null}
      </section>

      {modalDate || editingTask ? (
        <TaskModal
          initialDate={modalDate}
          initialTask={editingTask}
          onClose={closeModal}
          onDelete={
            editingTask
              ? () => {
                  deleteTask(editingTask.id);
                  closeModal();
                }
              : undefined
          }
          onSave={(task) => {
            if (editingTask) {
              updateTask(editingTask.id, task);
            } else {
              addTask(task);
            }
            closeModal();
          }}
        />
      ) : null}
    </section>
  );
}
