import type { PropsWithChildren } from "react";

interface SectionCardProps extends PropsWithChildren {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionCard({ title, action, onAction, children }: SectionCardProps) {
  return (
    <section className="section-card">
      <div className="section-card-header">
        <h2>{title}</h2>
        {action ? (
          <button type="button" onClick={onAction}>
            {action}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}
