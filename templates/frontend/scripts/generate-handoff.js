#!/usr/bin/env node
// Dev への引き継ぎ資料を自動生成するスクリプト
// 使い方: node scripts/generate-handoff.js

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function readFile(path) {
  const fullPath = join(root, path);
  return existsSync(fullPath) ? readFileSync(fullPath, "utf-8") : "";
}

const context = readFile("docs/context.md");
const changelog = readFile("docs/changelog.md");
const date = new Date().toISOString().split("T")[0];

const output = `# Dev 引き継ぎ資料

> 自動生成: ${date}
> 生成コマンド: \`node scripts/generate-handoff.js\`

---

## 1. プロダクトコンテキスト

${context}

---

## 2. 実装変更履歴

${changelog}

---

## 3. フロントエンド構成

\`\`\`
frontend/
├── src/
│   ├── components/    # 自社コンポーネント（再利用可能）
│   ├── pages/         # 画面ごとのコンポーネント
│   ├── mocks/         # モックデータ（→ 実 API に差し替え）
│   ├── services/
│   │   └── repositories/  # データ取得関数（← ここを実 API に変更）
│   └── utils/
├── docs/
│   ├── context.md     # 要件・ペルソナ・ユーザーストーリー
│   └── changelog.md   # 実装変更履歴
└── ...
\`\`\`

## 4. Dev が対応すべき項目

- [ ] \`src/mocks/\` のモックデータを実 API に差し替える
- [ ] \`src/services/repositories/\` の関数に実 API 呼び出しを実装する
- [ ] バックエンド（\`../backend/\`）の API を実装する
- [ ] 認証・認可を実装する
- [ ] 環境変数（\`.env\`）を設定する

## 5. 動作確認

\`\`\`bash
cd frontend
npm install
npm run dev   # http://localhost:5173
\`\`\`
`;

const outputPath = join(root, "docs/handoff.md");
writeFileSync(outputPath, output, "utf-8");
console.log(`✅ 引き継ぎ資料を生成しました: docs/handoff.md`);
