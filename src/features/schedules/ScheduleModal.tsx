import { useState, type FormEvent } from "react";
import type { AddScheduleInput, Schedule } from "../../shared/types/domain";

interface ScheduleModalProps {
  initialDate?: string;
  initialSchedule?: Schedule;
  onClose: () => void;
  onDelete?: () => void;
  onSave: (schedule: AddScheduleInput) => void;
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

function scheduleDate(schedule?: Schedule, initialDate?: string): string {
  if (schedule) return dateInputValue(new Date(schedule.startsAt));
  return initialDate ?? dateInputValue(new Date());
}

function scheduleReferenceMaterials(schedule?: Schedule): string {
  return schedule?.referenceMaterials?.join("\n") ?? "";
}

function scheduleAttendees(schedule?: Schedule): AttendeeDraft[] {
  const attendees = schedule?.attendees?.map((attendee) => ({
    name: attendee.name,
    accepted: attendee.accepted,
  }));

  if (attendees && attendees.length > 0) return attendees;
  return [
    { name: "", accepted: false },
    { name: "", accepted: false },
  ];
}

export function ScheduleModal({ initialDate, initialSchedule, onClose, onDelete, onSave }: ScheduleModalProps) {
  const isEditing = Boolean(initialSchedule);
  const [title, setTitle] = useState(initialSchedule?.title ?? "");
  const [date, setDate] = useState(scheduleDate(initialSchedule, initialDate));
  const [startTime, setStartTime] = useState(initialSchedule ? timeInputValue(new Date(initialSchedule.startsAt)) : "10:00");
  const [endTime, setEndTime] = useState(initialSchedule ? timeInputValue(new Date(initialSchedule.endsAt)) : "11:00");
  const [place, setPlace] = useState(initialSchedule?.place ?? "");
  const [agenda, setAgenda] = useState(initialSchedule?.agenda ?? "");
  const [referenceMaterials, setReferenceMaterials] = useState(scheduleReferenceMaterials(initialSchedule));
  const [attendees, setAttendees] = useState<AttendeeDraft[]>(() => scheduleAttendees(initialSchedule));

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
      date,
      startTime,
      endTime,
      place,
      attendees: attendees.filter((attendee) => attendee.name.trim().length > 0),
      agenda,
      referenceMaterials: referenceMaterials.split(/\r?\n/),
    });
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="schedule-modal-title">
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h2 id="schedule-modal-title">{isEditing ? "일정 수정" : "새 일정 추가"}</h2>
            <button type="button" className="ghost-button" onClick={onClose}>
              닫기
            </button>
          </div>

          <div className="form-grid">
            <label>
              <span>제목</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} required />
            </label>
            <label>
              <span>날짜</span>
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
            </label>
            <label>
              <span>시작 시간</span>
              <input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} required />
            </label>
            <label>
              <span>종료 시간</span>
              <input type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} required />
            </label>
            <label className="form-grid-full">
              <span>장소</span>
              <input value={place} onChange={(event) => setPlace(event.target.value)} />
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
            <textarea
              value={referenceMaterials}
              onChange={(event) => setReferenceMaterials(event.target.value)}
              rows={3}
              placeholder="한 줄에 하나씩 입력"
            />
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
