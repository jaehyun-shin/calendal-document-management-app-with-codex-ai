import { EmptyState } from "../../shared/components/EmptyState";

export function DocumentsPage() {
  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">기록</p>
        <h1>문서</h1>
      </header>
      <EmptyState title="로컬 문서 저장소" description="일정과 연결되는 문서, 메모, 첨부 메타데이터가 이곳에 모입니다." />
    </section>
  );
}
