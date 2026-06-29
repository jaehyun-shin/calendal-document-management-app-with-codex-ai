import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/today", label: "오늘" },
  { to: "/calendar", label: "캘린더" },
  { to: "/tasks", label: "작업" },
  { to: "/documents", label: "문서" },
  { to: "/statistics", label: "통계" },
  { to: "/settings", label: "설정" },
];

function Navigation({ className }: { className: string }) {
  return (
    <nav className={className} aria-label="주요 메뉴">
      {navItems.map((item) => (
        <NavLink key={item.to} to={item.to}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export function AppShell() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Calendal</div>
        <Navigation className="sidebar-nav" />
      </aside>
      <main className="app-main">
        <Outlet />
      </main>
      <Navigation className="bottom-nav" />
    </div>
  );
}
