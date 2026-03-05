# 変更履歴

> デザイナーが実装した内容を記録し、Dev への引き継ぎに活用します。

## 記録形式

```markdown
## YYYY-MM-DD

### デザイントークン変更
- primary-500 を #8B5CF6 から #7C3AED に変更
- 新規: success-50, success-500 を追加

### コンポーネント変更
- Button: variant="outline" を追加
- DataTable: onRowClick コールバックを追加

### 新規ファイル
- src/pages/Tasks/Tasks.tsx - タスク一覧画面
- src/mocks/tasks.ts - タスクモックデータ

### アーキテクチャ変更
- src/services/repositories/ にデータ取得関数を追加
- モックデータを src/mocks/ に分離

### 依存関係変更
- lucide-react を追加（アイコン用）

### 備考
- Figma からカラートークンを同期
- レスポンシブデザインに対応
```

## 変更ログ

### 2026-03-05
- プロジェクト初期化
- 基本コンポーネント（Button, DataTable, PageLayout, SideBar, Loading）を実装
- AGENT.md に Figma MCP 連携フローを追加
