---
trigger: always
---

# コンポーネント API 仕様

このプロジェクトの共通コンポーネントの一覧です。新しい UI を作る際は、まずこのリストから適切なコンポーネントを選んでください。

## Button

```tsx
import { Button } from "@/components";

// variant: "primary" | "secondary" | "danger" | "ghost"
// size: "sm" | "md" | "lg"

<Button variant="primary" size="md">保存</Button>
<Button variant="secondary" size="sm">キャンセル</Button>
<Button variant="danger" size="md" disabled>削除</Button>
<Button variant="ghost" size="sm">詳細を見る</Button>
```

## SideBar

```tsx
import { SideBar } from "@/components";

const items = [
  { label: "ホーム", path: "/", icon: <HomeIcon className="w-5 h-5" /> },
  { label: "ユーザー", path: "/users", icon: <UsersIcon className="w-5 h-5" /> },
];

<SideBar title="管理画面" items={items} />
```

- 現在のパスに応じてアクティブ状態が自動的に切り替わる
- `icon` は省略可能

## PageLayout

```tsx
import { PageLayout, Button } from "@/components";

<PageLayout
  title="ユーザー管理"
  description="登録済みユーザーの一覧"
  actions={<Button variant="primary">新規追加</Button>}
>
  {/* ページのメインコンテンツ */}
</PageLayout>
```

- `description` は省略可能
- `actions` にはボタン等のアクション要素を渡す

## DataTable

```tsx
import { DataTable } from "@/components";

const columns = [
  { key: "name", label: "名前" },
  { key: "email", label: "メール", width: "200px" },
  { key: "role", label: "権限", align: "center" as const },
];

const rows = [
  { name: "田中太郎", email: "tanaka@example.com", role: "管理者" },
  { name: "佐藤花子", email: "sato@example.com", role: "一般" },
];

<DataTable
  columns={columns}
  rows={rows}
  onRowClick={(row) => console.log(row)}
/>
```

- `align`: `"left"` | `"center"` | `"right"`（デフォルト: `"left"`）
- `onRowClick` は省略可能
- データが空の場合は「データがありません」を自動表示

## Loading

```tsx
import { Loading } from "@/components";

<Loading />                           // デフォルト（md）
<Loading size="sm" />                 // 小さめ
<Loading size="lg" label="送信中..." /> // 大きめ + カスタムラベル
```

## 使い分けガイド

| やりたいこと | 使うコンポーネント |
|---|---|
| ページ全体のラッパー | `PageLayout` |
| サイドナビゲーション | `SideBar` |
| データの一覧表示 | `DataTable` |
| アクションの実行 | `Button` |
| 非同期処理の待機表示 | `Loading` |
