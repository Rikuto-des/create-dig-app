# {{projectName}}

## 技術スタック

| 項目 | 採用技術 |
|---|---|
| フレームワーク | React + TypeScript |
| ビルドツール | Vite |
| スタイリング | Tailwind CSS |
| アイコン | {{iconLibraryName}} |
| ルーティング | React Router |
| Lint / Format | ESLint + Prettier |

## セットアップ

```bash
npm install
npm run dev
```

## ディレクトリ構造

```
src/
├── main.tsx                    # エントリポイント
├── pages/                      # ページ単位のフォルダ
│   ├── App.tsx                 # ルーティング定義 + レイアウト
│   └── Playground/             # コンポーネントプレイグラウンド
├── components/                 # 共通コンポーネント（自社製）
│   ├── Button.tsx
│   ├── SideBar.tsx
│   ├── PageLayout.tsx
│   ├── DataTable.tsx
│   └── Loading.tsx
├── mocks/                      # モックデータ（デザイナーが使用、Dev が実 API に差し替え）
├── models/                     # 型定義
├── services/
│   └── repositories/           # データ取得関数（mock → 実 API の切り替え口）
├── styles/
│   └── global.css              # Tailwind ディレクティブ + グローバルスタイル
└── guidelines/                 # AI 参照用デザインガイドライン
```

## コーディング規約

### 基本ルール
- **TypeScript strict モード**を使用する
- `any` 型は禁止
- コンポーネントは named export を使用する
- 1コンポーネント = 1ファイル

### スタイリング
- スタイリングは **Tailwind CSS のユーティリティクラスのみ** で行う
- ハードコードの色指定（`#FFFFFF` や `style={{}}` 等）は禁止
- カラーは `text-primary-500`, `bg-surface` のように Tailwind トークンを使う
- デザイントークンは `tailwind.config.ts` の `theme.extend` で定義

### アイコン
- アイコンは **{{iconLibraryName}}** を使用する
- {{iconImportExample}}
- サイズは Tailwind クラスで指定: `className="w-5 h-5"`
- カラーは `text-*` クラスで指定: `className="text-primary-500"`
- 他のアイコンライブラリは使用禁止

### コンポーネント設計
- Props は `variant` / `size` / `disabled` パターンで統一する
- 新しいコンポーネントは `src/components/` に配置する
- 外部 UI ライブラリ（MUI, Chakra UI, shadcn/ui 等）の追加は禁止

### データ取得
- デザイナーはモックデータ（`src/mocks/`）を使用する
- データ取得は `services/repositories/` 内の関数経由で行う
- Dev が後で実 API に差し替える

## スコープ

### デザイナーの担当範囲
- フロントエンドの見た目と動的な UI
- 画面内の状態管理（`useState` 等）
- モックデータでの表示確認

### Dev の担当範囲
- モックデータ → 実 API への差し替え
- グローバルな状態管理
- 認証・認可
- ビジネスロジック
- CI/CD・デプロイ

## AI での作業を始めるには

AI チャットに以下を入力してください:

```
AGENT.md を読んで
```

AI がデザインファシリテーターとして起動し、対話的に UI 構築を進めます。
