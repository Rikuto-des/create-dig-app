import { useEffect } from "react";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
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

function WelcomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const hasVisited = localStorage.getItem("dig-app-visited");
    if (!hasVisited) {
      localStorage.setItem("dig-app-visited", "true");
      navigate("/playground");
    }
  }, [navigate]);

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to {{projectName}}</h1>
        <p className="mt-2 text-gray-500">
          AI に「AGENT.md を読んで」と指示して、デザインを始めましょう。
        </p>
        <div className="mt-6 space-y-2 text-left bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <p className="font-semibold text-gray-800">🚀 はじめ方</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>AI に「AGENT.md を読んで」と入力</li>
            <li>AI の質問に答えながら要件を整理</li>
            <li><a href="/playground" className="text-primary-600 underline">Playground</a> でコンポーネントとカラーを確認</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
      </Route>
    </Routes>
  );
}
