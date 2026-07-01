import { useState, type FormEvent } from "react";
import type { AddTaskInput, Task, TaskStatus } from "../../shared/types/domain";

interface TaskModalProps {
  initialDate?: string;
  initialTask?: Task;
  onClose: () => void;
  onDelete?: () => void;
  onSave: (task: AddTaskInput) => void;
}

interface AttendeeDraft {
  name: string;
  accepted: boolean;
}

function dateInputValue(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function timeInputValue(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function defaultDate(initialDate?: string): string {
  return initialDate ?? dateInputValue(new Date());
}

function taskAttendees(task?: Task): AttendeeDraft[] {
  const attendees = task?.attendees?.map((attendee) => ({
    name: attendee.name,
    accepted: attendee.accepted,
  }));

  if (attendees && attendees.length > 0) return attendees;
  return [{ name: "", accepted: false }];
}

export function TaskModal({ initialDate, initialTask, onClose, onDelete, onSave }: TaskModalProps) {
  const isEditing = Boolean(initialTask);
  const start = initialTask ? new Date(initialTask.startsAt) : undefined;
  const end = initialTask ? new Date(initialTask.endsAt) : undefined;
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status ?? "todo");
  const [startDate, setStartDate] = useState(start ? dateInputValue(start) : defaultDate(initialDate));
  const [startTime, setStartTime] = useState(start ? timeInputValue(start) : "10:00");
  const [endDate, setEndDate] = useState(end ? dateInputValue(end) : defaultDate(initialDate));
  const [endTime, setEndTime] = useState(end ? timeInputValue(end) : "11:00");
  const [place, setPlace] = useState(initialTask?.place ?? "");
  const [owner, setOwner] = useState(initialTask?.owner ?? "");
  const [project, setProject] = useState(initialTask?.project ?? "");
  const [agenda, setAgenda] = useState(initialTask?.agenda ?? "");
  const [referenceMaterials, setReferenceMaterials] = useState(initialTask?.referenceMaterials?.join("\n") ?? "");
  const [notes, setNotes] = useState(initialTask?.notes ?? "");
  const [attendees, setAttendees] = useState<AttendeeDraft[]>(() => taskAttendees(initialTask));

  function updateAttendee(index: number, nextAttendee: Partial<AttendeeDraft>) {
    setAttendees((currentAttendees) =>
      currentAttendees.map((attendee, attendeeIndex) =>
        attendeeIndex === index ? { ...attendee, ...nextAttendee } : attendee,
      ),
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
      title,
      status,
      startDate,
      startTime,
      endDate,
      endTime,
      place,
      attendees,
      agenda,
      referenceMaterials: referenceMaterials.split(/\r?\n/),
      owner,
      project,
      notes,
    });
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal task-modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h2 id="task-modal-title">{isEditing ? "작업 수정" : "새 작업 추가"}</h2>
            <button type="button" className="ghost-button" onClick={onClose}>
              닫기
            </button>
          </div>

          <label className="task-title-field">
            <span>작업명</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} required />
          </label>

          <div className="task-property-editor">
            <label>
              <span>상태</span>
              <select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>
                <option value="todo">할 일</option>
                <option value="inProgress">진행 중</option>
                <option value="done">완료</option>
              </select>
            </label>
            <label>
              <span>시작일</span>
              <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required />
            </label>
            <label>
              <span>시작 시간</span>
              <input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} required />
            </label>
            <label>
              <span>종료일</span>
              <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} required />
            </label>
            <label>
              <span>종료 시간</span>
              <input type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} required />
            </label>
            <label>
              <span>장소</span>
              <input value={place} onChange={(event) => setPlace(event.target.value)} />
            </label>
            <label>
              <span>주관</span>
              <input value={owner} onChange={(event) => setOwner(event.target.value)} />
            </label>
            <label>
              <span>프로젝트</span>
              <input value={project} onChange={(event) => setProject(event.target.value)} />
            </label>
          </div>

          <section className="form-section">
            <h3>참석자</h3>
            {attendees.map((attendee, index) => (
              <div className="attendee-row" key={index}>
                <label>
                  <span>{`참석자 ${index + 1} 이름`}</span>
                  <input value={attendee.name} onChange={(event) => updateAttendee(index, { name: event.target.value })} />
                </label>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={attendee.accepted}
                    onChange={(event) => updateAttendee(index, { accepted: event.target.checked })}
                  />
                  <span>{`참석자 ${index + 1} 참석`}</span>
                </label>
              </div>
            ))}
            <button
              type="button"
              className="secondary-button"
              onClick={() => setAttendees((currentAttendees) => [...currentAttendees, { name: "", accepted: false }])}
            >
              참석자 추가
            </button>
          </section>

          <label className="stacked-field">
            <span>회의 안건</span>
            <textarea value={agenda} onChange={(event) => setAgenda(event.target.value)} rows={3} />
          </label>

          <label className="stacked-field">
            <span>회의 참고 자료</span>
            <textarea value={referenceMaterials} onChange={(event) => setReferenceMaterials(event.target.value)} rows={3} />
          </label>

          <label className="stacked-field">
            <span>메모</span>
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} />
          </label>

          <div className="modal-actions">
            {onDelete ? (
              <button type="button" className="danger-button" onClick={onDelete}>
                삭제
              </button>
            ) : null}
            <button type="button" className="secondary-button" onClick={onClose}>
              취소
            </button>
            <button type="submit">{isEditing ? "수정 저장" : "저장"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
