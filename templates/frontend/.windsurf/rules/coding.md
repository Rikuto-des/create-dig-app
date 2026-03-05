---
trigger: always
---

# コーディング規約

## 技術スタック
- React + TypeScript（strict モード）
- Vite（ビルドツール）
- Tailwind CSS（スタイリング）
- React Router（ルーティング）
- {{iconLibraryName}}（アイコン）

## 必須ルール
- `any` 型の使用禁止
- ハードコードの色指定禁止（`#FFFFFF`, `rgb()`, `style={{ color: ... }}` 等）
- `!important` の使用禁止
- インラインスタイル（`style={{}}` 属性）の使用禁止
- 外部 UI ライブラリの追加禁止（MUI, Chakra UI, shadcn/ui, Ant Design 等）
- `console.log` の本番コードへの残留禁止
- コンポーネントは named export を使用する
- 1コンポーネント = 1ファイル

## スタイリング
- Tailwind CSS のユーティリティクラスのみ使用
- カラーは `text-primary-500`, `bg-surface` のように Tailwind トークンで参照
- デザイントークンは `tailwind.config.ts` の `theme.extend` で定義

## ファイル命名規則
- コンポーネント: PascalCase（`Button.tsx`, `DataTable.tsx`）
- ユーティリティ: camelCase（`formatDate.ts`）
- 型定義: PascalCase（`User.ts`）
- ページ: PascalCase フォルダ + `index.tsx` or `PageName.tsx`

## データ取得
- モックデータ → `src/mocks/`
- データ取得関数 → `services/repositories/`
- Dev が後で実 API に差し替えるため、必ず関数経由でデータを取得する

## 回答は日本語で出力する
