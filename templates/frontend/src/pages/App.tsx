import { Routes, Route, Outlet } from "react-router-dom";
import { SideBar } from "../components";
import { Playground as PlaygroundPage } from "./Playground/Playground";

const sideBarItems = [
  { label: "ホーム", path: "/" },
  { label: "プレイグラウンド", path: "/playground" },
];

function Layout() {
  return (
    <div className="flex h-screen bg-surface">
      <SideBar title="{{projectName}}" items={sideBarItems} />
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
                <p className="mt-2 text-gray-500">
                  AI に「AGENT.md を読んで」と指示して、デザインを始めましょう。
                </p>
              </div>
            </div>
          }
        />
        <Route path="/playground" element={<PlaygroundPage />} />
      </Route>
    </Routes>
  );
}
