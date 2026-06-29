import { useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useAppData } from "../../app/providers/AppDataProvider";
import { SectionCard } from "../../shared/components/SectionCard";
import { StatCard } from "../../shared/components/StatCard";
import { formatTimeRange, isSameLocalDate } from "../../shared/dates/dateUtils";
import type { Task } from "../../shared/types/domain";
import { TaskModal } from "../tasks/TaskModal";

function buildTodayTasks(tasks: Task[]) {
  const now = new Date();
  const todayTasks = tasks
    .filter((task) => isSameLocalDate(task.startsAt, now))
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  return {
    todayTasks,
    nextTask:
      todayTasks.find((task) => new Date(task.endsAt).getTime() >= now.getTime()) ??
      todayTasks[0],
  };
}

export function TodayPage() {
  const { tasks, documents, addTask, updateTask, deleteTask } = useAppData();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const summary = useMemo(() => buildTodayTasks(tasks), [tasks]);

  function closeModal() {
    setIsTaskModalOpen(false);
    setEditingTask(undefined);
  }

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">오늘의 업무</p>
        <h1>오늘 요약</h1>
      </header>

      <div className="today-grid">
        <StatCard label="오늘 작업" value={`${summary.todayTasks.length}건`} tone="blue" />
        <StatCard label="연결 문서" value={`${documents.length}건`} tone="green" />
        <StatCard label="진행 작업" value={`${tasks.filter((task) => task.status !== "done").length}건`} tone="orange" />
      </div>

      <SectionCard title="다음 작업" action="작업 추가" onAction={() => setIsTaskModalOpen(true)}>
        {summary.nextTask ? (
          <article className="next-schedule">
            <h3>{summary.nextTask.title}</h3>
            <p>{formatTimeRange(summary.nextTask.startsAt, summary.nextTask.endsAt)}</p>
            <p>{summary.nextTask.place}</p>
          </article>
        ) : (
          <p className="muted">오늘 예정된 작업이 없습니다.</p>
        )}
      </SectionCard>

      <SectionCard title="오늘 작업">
        <div className="list">
          {summary.todayTasks.length === 0 ? (
            <p className="muted">오늘 작업이 비어 있습니다.</p>
          ) : (
            summary.todayTasks.map((task) => (
              <article className="list-row schedule-list-row" key={task.id}>
                <div>
                  <strong>{task.title}</strong>
                  <span>{task.place}</span>
                </div>
                <time>{formatTimeRange(task.startsAt, task.endsAt)}</time>
                <div className="schedule-row-actions" aria-label={`${task.title} 작업`}>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={`수정 ${task.title}`}
                    onClick={() => {
                      setEditingTask(task);
                      setIsTaskModalOpen(true);
                    }}
                  >
                    <Pencil aria-hidden="true" size={15} strokeWidth={2.2} />
                  </button>
                  <button
                    type="button"
                    className="icon-button danger-icon-button"
                    aria-label={`삭제 ${task.title}`}
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 aria-hidden="true" size={15} strokeWidth={2.2} />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </SectionCard>

      <SectionCard title="작업 메모">
        <div className="chips">
          {tasks.length === 0 ? (
            <p className="muted">등록된 작업이 없습니다.</p>
          ) : (
            tasks.slice(0, 5).map((task) => <span key={task.id}>{task.project || task.status}</span>)
          )}
        </div>
      </SectionCard>

      {isTaskModalOpen ? (
        <TaskModal
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
