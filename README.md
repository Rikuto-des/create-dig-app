# create-dig-app

デザイナーが AI（Windsurf/Copilot/Claude）と対話しながら UI をバイブコーディングするための CLI ツール + テンプレート。

## 特徴

- **AGENT.md** — AI に「読んで」と指示するだけでデザインファシリテーションが始まる
- **React + TypeScript + Tailwind CSS** — モダンなフロントエンド構成
- **自社コンポーネント** — Button, DataTable, PageLayout, SideBar, Loading
- **カラープリセット** — パープル / ブルー / グリーン（カスタムも可）
- **アイコンライブラリ選択** — Lucide React / Heroicons

## 使い方

```bash
# リポジトリをクローン
git clone https://github.com/<your-username>/create-dig-app.git
cd create-dig-app

# CLI の依存インストール
npm install

# プロジェクト生成（対話式）
node bin/cli.js

# または非対話モード（デフォルト設定）
node bin/cli.js my-project --yes
```

## 生成されるプロジェクト構成

```
<プロジェクト名>/
├── frontend/           # デザイナー作業領域
│   ├── AGENT.md        # AI に「読んで」と指示するファイル
│   ├── docs/context.md # セッション間のコンテキスト保存
│   ├── src/
│   │   ├── components/ # 自社コンポーネント
│   │   ├── pages/
│   │   ├── mocks/      # モックデータ
│   │   └── services/   # API 通信（Dev が実装）
│   ├── package.json
│   └── ...
└── backend/            # Dev 実装領域
    └── README.md
```

## ワークフロー

1. `node bin/cli.js` でプロジェクト生成
2. 生成されたプロジェクトを VSCode で開く
3. AI に「AGENT.md を読んで」と指示
4. AI がデザインファシリテーションを開始（Phase A → B → C）

## AGENT.md のフロー

- **Phase A: ディスカバリー** — ペルソナ、ユーザーストーリー、MVP ライン
- **Phase B: デザイン** — 画面構成、レイアウト、コンポーネント選定
- **Phase C: 実装** — 段階的な UI 構築

## 技術スタック

### CLI
- Node.js, TypeScript, chalk, inquirer, fs-extra

### 生成されるプロジェクト
- React 18, TypeScript (strict), Vite
- Tailwind CSS, PostCSS, Autoprefixer
- React Router
- ESLint, Prettier

## ライセンス

MIT
