import { EmptyState } from "../../shared/components/EmptyState";

export function StatisticsPage() {
  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">인사이트</p>
        <h1>통계</h1>
      </header>
      <EmptyState title="사용 패턴 분석" description="분류별 시간, 자주 만나는 사람, 문서 키워드 통계를 보여줄 예정입니다." />
    </section>
  );
}
