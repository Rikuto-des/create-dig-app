# コンポーネント使い分けガイド

## 画面構成の基本パターン

```
┌─────────┬──────────────────────────────┐
│         │  PageLayout                  │
│         │  ┌────────────────────────┐  │
│ SideBar │  │ title + actions        │  │
│         │  ├────────────────────────┤  │
│         │  │                        │  │
│         │  │  children（メイン）     │  │
│         │  │                        │  │
│         │  └────────────────────────┘  │
└─────────┴──────────────────────────────┘
```

## ページ作成の手順

1. `src/pages/` にフォルダを作成（例: `Users/`）
2. `PageLayout` でラッパーを作成
3. 必要なコンポーネントを配置
4. モックデータを `src/mocks/` に追加
5. `services/repositories/` にデータ取得関数を追加
6. `App.tsx` にルーティングを追加

## コンポーネント選定フローチャート

- データの一覧表示が必要？ → **DataTable**
- ユーザーのアクションが必要？ → **Button**
- ページ遷移のナビゲーション？ → **SideBar**（サイド）
- ページのタイトル + コンテンツ構成？ → **PageLayout**
- 非同期の待機表示？ → **Loading**

## 新しいコンポーネントを追加する場合

1. `src/components/` にファイルを作成
2. named export を使用
3. Props の型を明示的に定義
4. variant / size パターンで API を統一
5. `src/components/index.ts` に export を追加
6. `.windsurf/rules/components.md` に API 仕様を追記
7. `/playground` ページに表示を追加
