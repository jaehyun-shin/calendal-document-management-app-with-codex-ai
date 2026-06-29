interface StatCardProps {
  label: string;
  value: string;
  tone?: "blue" | "green" | "orange";
}

export function StatCard({ label, value, tone = "blue" }: StatCardProps) {
  return (
    <div className={`stat-card stat-card-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
