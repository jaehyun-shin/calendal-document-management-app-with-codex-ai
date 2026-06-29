import { CalendarDays, CircleDot, Clock, FolderKanban, MapPin, Pencil, Plus, Trash2, UserRound } from "lucide-react";
import { useState } from "react";
import { useAppData } from "../../app/providers/AppDataProvider";
import { formatTimeRange } from "../../shared/dates/dateUtils";
import type { Task, TaskStatus } from "../../shared/types/domain";
import { TaskModal } from "./TaskModal";

const statusLabels: Record<TaskStatus, string> = {
  todo: "할 일",
  inProgress: "진행 중",
  done: "완료",
};

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric" }).format(new Date(date));
}

function formatCreatedAt(date: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask } = useAppData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  function closeModal() {
    setIsModalOpen(false);
    setEditingTask(undefined);
  }

  return (
    <section className="page tasks-page">
      <header className="page-header tasks-header">
        <div>
          <p className="eyebrow">Task</p>
          <h1>작업</h1>
        </div>
        <button type="button" className="primary-action-button" onClick={() => setIsModalOpen(true)}>
          <Plus aria-hidden="true" size={16} />
          작업 추가
        </button>
      </header>

      <section className="tasks-board" aria-label="작업 목록">
        {tasks.map((task) => (
          <article className="task-item" key={task.id}>
            <div className="task-item-main">
              <div className="task-title-row">
                <strong>{task.title}</strong>
                <span className={`task-status task-status-${task.status}`}>{statusLabels[task.status]}</span>
              </div>
              <div className="task-properties">
                <div>
                  <CircleDot aria-hidden="true" size={15} />
                  <span>상태</span>
                  <strong>{statusLabels[task.status]}</strong>
                </div>
                <div>
                  <CalendarDays aria-hidden="true" size={15} />
                  <span>시작일</span>
                  <strong>{formatDate(task.startsAt)}</strong>
                </div>
                <div>
                  <Clock aria-hidden="true" size={15} />
                  <span>시간</span>
                  <strong>{formatTimeRange(task.startsAt, task.endsAt)}</strong>
                </div>
                <div>
                  <CalendarDays aria-hidden="true" size={15} />
                  <span>작성일시</span>
                  <strong>{formatCreatedAt(task.createdAt)}</strong>
                </div>
                <div>
                  <MapPin aria-hidden="true" size={15} />
                  <span>장소</span>
                  <strong>{task.place || "비어 있음"}</strong>
                </div>
                <div>
                  <UserRound aria-hidden="true" size={15} />
                  <span>주관</span>
                  <strong>{task.owner || "비어 있음"}</strong>
                </div>
                <div>
                  <FolderKanban aria-hidden="true" size={15} />
                  <span>프로젝트</span>
                  <strong>{task.project || "비어 있음"}</strong>
                </div>
              </div>
              {task.notes ? <p className="task-notes">{task.notes}</p> : null}
            </div>
            <div className="task-actions">
              <button
                type="button"
                className="icon-button"
                aria-label={`${task.title} 수정`}
                onClick={() => {
                  setEditingTask(task);
                  setIsModalOpen(true);
                }}
              >
                <Pencil aria-hidden="true" size={15} />
              </button>
              <button
                type="button"
                className="icon-button danger-icon-button"
                aria-label={`${task.title} 삭제`}
                onClick={() => deleteTask(task.id)}
              >
                <Trash2 aria-hidden="true" size={15} />
              </button>
            </div>
          </article>
        ))}
      </section>

      {isModalOpen ? (
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
