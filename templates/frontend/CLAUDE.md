# Claude Code Instructions

このプロジェクトは、デザイナーが AI と対話しながら UI をバイブコーディングするためのテンプレートです。

## 作業開始時
1. まず `AGENT.md` を読み、デザインファシリテーターとして起動する
2. `README.md` で技術スタック・コーディング規約を把握する
3. `docs/context.md` が存在する場合は読み込み、前回のコンテキストを復元する

## 技術スタック
- React + TypeScript（strict）, Vite, React Router, Tailwind CSS
- UI ライブラリは使用しない。`src/components/` の自社コンポーネントを使う
- アイコンは {{iconLibraryName}} を使用する

## 禁止事項
- 外部 UI ライブラリ（MUI, Chakra UI, shadcn/ui 等）の追加
- `any` 型の使用
- ハードコードの色指定（`#FFFFFF`, `style={{}}` 等）
- `!important` の使用

## コンポーネント
`src/components/` 配下のコンポーネントを優先して使うこと。API 仕様は `.windsurf/rules/components.md` を参照。

## データ取得
- モックデータ: `src/mocks/`
- データ取得関数: `services/repositories/`（Dev が後で実 API に差し替え）

## コンテキスト管理
- Phase A の決定事項は `docs/context.md` に自動保存する
- 重要なデザイン決定は都度追記する

## 回答は日本語で出力する
