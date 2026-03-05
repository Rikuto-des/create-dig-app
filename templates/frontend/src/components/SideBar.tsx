import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface SideBarItem {
  label: string;
  path: string;
  icon?: ReactNode;
}

interface SideBarProps {
  title: string;
  items: SideBarItem[];
}

export function SideBar({ title, items }: SideBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border bg-white">
      <div className="px-4 py-6">
        <h2 className="text-lg font-bold text-primary-700">{title}</h2>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {item.icon && <span className="h-5 w-5">{item.icon}</span>}
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
