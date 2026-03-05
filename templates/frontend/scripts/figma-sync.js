#!/usr/bin/env node
// Figma MCP からデザイントークンを取得して tailwind.config.ts を更新するスクリプト
// 使い方: node scripts/figma-sync.js <FigmaURL>
//
// 前提条件:
//   - Windsurf / Cursor などの Figma MCP が有効であること
//   - Figma のデザインファイルに Variables（カラー）が定義されていること

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const figmaUrl = process.argv[2];

if (!figmaUrl) {
  console.error("使い方: node scripts/figma-sync.js <FigmaURL>");
  console.error("例: node scripts/figma-sync.js https://figma.com/design/xxxxx");
  process.exit(1);
}

console.log(`\n🎨 Figma からデザイントークンを取得中...\n  URL: ${figmaUrl}\n`);
console.log(`📋 AI（Cascade / Copilot）への指示:\n`);
console.log(`----- ここからコピーして AI に貼り付け -----`);
console.log(`
以下の Figma ファイルからデザイントークン（Variables）を取得して、
tailwind.config.ts のカラーパレットを更新してください。

Figma URL: ${figmaUrl}

手順:
1. mcp0_get_variable_defs を使って Variables を取得
2. 以下のカラーを抽出:
   - Primary（ブランドカラー）: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
   - Success / Warning / Error（セマンティックカラー）
   - Surface / Border（ニュートラルカラー）
3. tailwind.config.ts の colors セクションを更新
4. docs/changelog.md に変更内容を記録:
   \`\`\`
   ## ${new Date().toISOString().split("T")[0]}
   ### デザイントークン変更
   - Figma Variables からカラートークンを同期
   - URL: ${figmaUrl}
   \`\`\`
`);
console.log(`----- ここまでコピーして AI に貼り付け -----\n`);

// tailwind.config.ts の現在の内容を表示
const tailwindPath = join(root, "tailwind.config.ts");
const current = readFileSync(tailwindPath, "utf-8");
console.log(`📄 現在の tailwind.config.ts:\n\n${current}\n`);
console.log(`✅ AI が上記の指示を実行すると tailwind.config.ts が更新されます。`);
console.log(`💡 Playground (/playground) でカラートークンの変更を確認してください。\n`);
