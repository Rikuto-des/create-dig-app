# GitHub Copilot Instructions

## 技術スタック
- React + TypeScript, Vite, React Router, Tailwind CSS
- UI ライブラリは使用しない。自社コンポーネント + Tailwind で構築する
- デザイントークンは `tailwind.config.ts` の `theme.extend` で定義
- カラーは `text-primary-500`, `bg-surface` のように Tailwind クラスで参照する

## スタイリングルール
- スタイリングは Tailwind のユーティリティクラスで行う
- ハードコードの色指定（`#FFFFFF` や `style={{}}` 等）は禁止。Tailwind トークンを使う
- アイコンは {{iconLibraryName}} を使用する

## 禁止パターン
- 外部 UI ライブラリ（MUI, Chakra UI, shadcn/ui, Ant Design 等）の import・追加
- `any` 型の使用
- ハードコードの色指定（`#FFFFFF`, `rgb()`, `style={{ color: ... }}` 等）
- `!important` の使用
- インラインスタイル（`style={{}}` 属性）
- `console.log` の本番コードへの残留

## 自社共通コンポーネント一覧

### Button
- パス: `components/Button`
- Props: `variant?: "primary" | "secondary" | "danger" | "ghost"`, `size?: "sm" | "md" | "lg"`, `children: ReactNode`
- 使用例: `<Button variant="primary" size="md">保存</Button>`

### SideBar
- パス: `components/SideBar`
- Props: `title: string`, `items: { label: string; path: string; icon?: ReactNode }[]`
- 用途: サイドナビゲーション

### PageLayout
- パス: `components/PageLayout`
- Props: `title: string`, `description?: string`, `actions?: ReactNode`, `children: ReactNode`
- 用途: ページ共通のラッパー（タイトル + コンテンツエリア）

### DataTable
- パス: `components/DataTable`
- Props: `columns: { key: string; label: string; width?: string; align?: "left" | "center" | "right" }[]`, `rows: Record<string, unknown>[]`, `onRowClick?: (row) => void`

### Loading
- パス: `components/Loading`
- Props: `size?: "sm" | "md" | "lg"`, `label?: string`
- 用途: ローディング表示

## データ取得パターン
- モックデータは `src/mocks/` に配置
- データ取得関数は `services/repositories/` に配置
- Dev が後で実 API に差し替えるため、関数経由でデータを取得すること

```ts
// services/repositories/users.ts
import { mockUsers } from "../../mocks/users";
export const getUsers = async () => mockUsers;
```
