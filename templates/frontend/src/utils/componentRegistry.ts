// コンポーネントの動的インポートと登録

export interface ComponentInfo {
  name: string;
  path: string;
  description?: string;
}

// コンポーネントリストを動的に取得
export async function getComponentList(): Promise<ComponentInfo[]> {
  // 実際の実装ではファイルシステムをスキャン
  // ここでは既知のコンポーネントを返す
  return [
    { name: "Button", path: "../components/Button", description: "ボタンコンポーネント" },
    { name: "DataTable", path: "../components/DataTable", description: "データテーブル" },
    { name: "Loading", path: "../components/Loading", description: "ローディングインジケーター" },
    { name: "PageLayout", path: "../components/PageLayout", description: "ページレイアウト" },
    { name: "SideBar", path: "../components/SideBar", description: "サイドバー" },
  ];
}

// tailwind.config.ts からカラートークンを取得
export function getColorTokens() {
  // 将来的には tailwind.config.ts を動的に読み込む
  return {
    primary: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    secondary: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    success: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    warning: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    error: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    surface: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    border: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    text: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  };
}
