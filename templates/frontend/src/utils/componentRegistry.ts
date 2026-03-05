/// <reference types="vite/client" />
// コンポーネントの動的インポートと登録

export interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  defaultValue?: string;
}

export interface ComponentInfo {
  name: string;
  description?: string;
  props?: PropInfo[];
}

export interface ColorTokens {
  [colorName: string]: number[];
}

// Vite の glob import でコンポーネントを自動検出
// components/*.tsx を自動スキャン
const componentModules = import.meta.glob("../components/*.tsx", { eager: true });

export function getComponentList(): ComponentInfo[] {
  return Object.keys(componentModules)
    .map((path) => {
      const name = path.replace("../components/", "").replace(".tsx", "");
      return { name };
    })
    .filter((c) => c.name !== "index");
}

// CSS Variables からリアルタイムでカラートークンを取得
export function getColorTokens(): ColorTokens {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  const colorNames = ["primary", "success", "warning", "error", "surface", "border"];
  const tokens: ColorTokens = {};

  colorNames.forEach((name) => {
    const availableShades = shades.filter((shade) => {
      const el = document.createElement("div");
      el.className = `bg-${name}-${shade}`;
      document.body.appendChild(el);
      const style = getComputedStyle(el);
      const hasColor = style.backgroundColor !== "rgba(0, 0, 0, 0)" && style.backgroundColor !== "";
      document.body.removeChild(el);
      return hasColor;
    });

    if (availableShades.length > 0) {
      tokens[name] = availableShades;
    } else {
      // フォールバック: 単色の場合
      const el = document.createElement("div");
      el.className = `bg-${name}`;
      document.body.appendChild(el);
      const style = getComputedStyle(el);
      const hasColor = style.backgroundColor !== "rgba(0, 0, 0, 0)";
      document.body.removeChild(el);
      if (hasColor) tokens[name] = [500];
    }
  });

  return tokens;
}

// コンポーネントの Props ドキュメント（手動定義 + 自動補完）
export const componentDocs: Record<string, ComponentInfo> = {
  Button: {
    name: "Button",
    description: "汎用ボタン。variant と size で見た目を制御する。",
    props: [
      { name: "variant", type: '"primary" | "secondary" | "danger" | "ghost"', required: false, defaultValue: '"primary"', description: "ボタンの見た目" },
      { name: "size", type: '"sm" | "md" | "lg"', required: false, defaultValue: '"md"', description: "ボタンのサイズ" },
      { name: "disabled", type: "boolean", required: false, defaultValue: "false", description: "無効状態" },
      { name: "onClick", type: "() => void", required: false, description: "クリック時のコールバック" },
    ],
  },
  DataTable: {
    name: "DataTable",
    description: "汎用テーブル。columns と rows でデータを表示する。",
    props: [
      { name: "columns", type: "Column[]", required: true, description: "列定義（key, label, width?, align?）" },
      { name: "rows", type: "Record<string, unknown>[]", required: true, description: "表示データ" },
      { name: "onRowClick", type: "(row) => void", required: false, description: "行クリック時のコールバック" },
    ],
  },
  Loading: {
    name: "Loading",
    description: "ローディングスピナー。",
    props: [
      { name: "size", type: '"sm" | "md" | "lg"', required: false, defaultValue: '"md"', description: "サイズ" },
      { name: "label", type: "string", required: false, description: "スクリーンリーダー向けラベル" },
    ],
  },
  PageLayout: {
    name: "PageLayout",
    description: "ページのメインコンテンツ領域。SideBar と組み合わせて使う。",
    props: [
      { name: "title", type: "string", required: true, description: "ページタイトル" },
      { name: "description", type: "string", required: false, description: "サブタイトル" },
      { name: "children", type: "React.ReactNode", required: true, description: "コンテンツ" },
    ],
  },
  SideBar: {
    name: "SideBar",
    description: "左サイドバーナビゲーション。",
    props: [
      { name: "title", type: "string", required: true, description: "アプリ名" },
      { name: "items", type: "{ label: string; path: string }[]", required: true, description: "ナビゲーション項目" },
    ],
  },
};
