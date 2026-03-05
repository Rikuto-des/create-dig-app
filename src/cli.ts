#!/usr/bin/env node

import inquirer from "inquirer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import chalk from "chalk";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Answers {
  projectName: string;
  productType: "admin" | "user" | "lp";
  brandColor: "purple" | "blue" | "green" | "custom";
  customColor?: string;
  iconLibrary: "lucide" | "heroicons";
  figmaUrl?: string;
}

interface ColorPreset {
  primary: Record<string, string>;
}

interface IconConfig {
  package: string;
  libraryName: string;
  importExample: string;
  ruleText: string;
}

const TEMPLATES_DIR = path.resolve(__dirname, "..", "templates");

// 必須スキルリスト（Figma MCP 連携用）
const ESSENTIAL_SKILLS = [
  "figma/mcp-server-guide@implement-design",
];

async function installEssentialSkills() {
  console.log(chalk.yellow("\n📦 必須スキルをインストール中..."));
  
  for (const skill of ESSENTIAL_SKILLS) {
    try {
      console.log(chalk.dim(`  Installing ${skill}...`));
      execSync(`npx skills add ${skill} -g -y`, { stdio: "pipe" });
      console.log(chalk.green(`  ✓ ${skill}`));
    } catch (error) {
      console.log(chalk.red(`  ✗ ${skill} - スキップします`));
    }
  }
  
  console.log(chalk.green("\n✅ 必須スキルインストール完了"));
  console.log(chalk.dim("  💡 その他のスキルは AI が必要に応じて自動で呼び出します\n"));
}

async function main() {
  console.log(chalk.cyan("\n✨ create-dig-app v1.0.0\n"));

  // --yes フラグで非対話モード（テスト用）
  const args = process.argv.slice(2);
  const yesMode = args.includes("--yes") || args.includes("-y");
  const projectNameArg = args.find((a) => !a.startsWith("-"));

  let answers: Answers;

  if (yesMode) {
    answers = {
      projectName: projectNameArg || "my-project",
      productType: "admin",
      brandColor: "purple",
      iconLibrary: "lucide",
      figmaUrl: "",
    };
    console.log(chalk.dim("非対話モード: デフォルト設定を使用"));
  } else {
    answers = await inquirer.prompt<Answers>([
    {
      type: "input",
      name: "projectName",
      message: "プロジェクト名:",
      default: process.argv[2] || "my-project",
      validate: (input: string) =>
        /^[a-z0-9-]+$/.test(input) || "英小文字、数字、ハイフンのみ使用できます",
    },
    {
      type: "list",
      name: "productType",
      message: "プロダクトタイプ:",
      choices: [
        { name: "管理画面（サイドバー + テーブル中心）", value: "admin" },
        { name: "ユーザー向け（ヘッダー + カード中心）", value: "user" },
        { name: "LP（フルワイド + セクション構成）", value: "lp" },
      ],
    },
    {
      type: "list",
      name: "brandColor",
      message: "ブランドカラー:",
      choices: [
        { name: "パープル (#8B5CF6)", value: "purple" },
        { name: "ブルー (#3B82F6)", value: "blue" },
        { name: "グリーン (#10B981)", value: "green" },
        { name: "カスタム（HEX入力）", value: "custom" },
      ],
    },
    {
      type: "input",
      name: "customColor",
      message: "カスタムカラー (HEX):",
      when: (ans: Answers) => ans.brandColor === "custom",
      validate: (input: string) =>
        /^#[0-9a-fA-F]{6}$/.test(input) || "#RRGGBB 形式で入力してください",
    },
    {
      type: "list",
      name: "iconLibrary",
      message: "アイコンライブラリ:",
      choices: [
        { name: "Lucide（shadcn/v0 標準、1,500+ アイコン）", value: "lucide" },
        {
          name: "Heroicons（Tailwind Labs 公式、outline/solid）",
          value: "heroicons",
        },
      ],
    },
    {
      type: "input",
      name: "figmaUrl",
      message: "Figma のデザインファイル URL（スキップ: Enter）:",
      default: "",
    },
  ]);
  }

  const targetDir = path.resolve(process.cwd(), answers.projectName);

  if (await fs.pathExists(targetDir)) {
    console.log(chalk.red(`\nエラー: ${targetDir} は既に存在します。\n`));
    process.exit(1);
  }

  // 1. テンプレートをコピー（frontend + backend）
  console.log(chalk.yellow("\n📦 テンプレートを作成中..."));
  const frontendDir = path.join(TEMPLATES_DIR, "frontend");
  const backendDir = path.join(TEMPLATES_DIR, "backend");
  await fs.copy(frontendDir, path.join(targetDir, "frontend"));
  await fs.copy(backendDir, path.join(targetDir, "backend"));

  const frontendTargetDir = path.join(targetDir, "frontend");

  // 2. カラープリセットを適用
  const colorPreset = await loadColorPreset(answers.brandColor, answers.customColor);
  await applyColorTokens(frontendTargetDir, colorPreset);

  // 3. アイコンライブラリを適用
  const iconConfig = await loadIconConfig(answers.iconLibrary);
  await applyIconConfig(frontendTargetDir, answers, iconConfig);

  // 4. プレースホルダーを置換
  await replacePlaceholders(frontendTargetDir, answers, iconConfig);

  // 5. package.json にアイコンライブラリの依存を追加
  await addIconDependency(frontendTargetDir, answers.iconLibrary, iconConfig);

  // 6. 必須スキルをインストール
  await installEssentialSkills();

  console.log(chalk.green(`\n✅ ${answers.projectName} を作成しました！\n`));
  console.log(chalk.dim("  プロジェクト構成:"));
  console.log(chalk.dim(`    ${answers.projectName}/frontend/  # デザイナー作業領域`));
  console.log(chalk.dim(`    ${answers.projectName}/backend/   # Dev 実装領域\n`));
  console.log(`  ${chalk.cyan("cd")} ${answers.projectName}/frontend`);
  console.log(`  ${chalk.cyan("npm install")}`);
  console.log(`  ${chalk.cyan("npm run dev")}\n`);
  console.log(
    chalk.dim(
      '  💡 VSCode で開いたら AI に「AGENT.md を読んで」と指示してください。\n',
    ),
  );
}

async function loadColorPreset(
  color: string,
  customHex?: string,
): Promise<ColorPreset> {
  if (color === "custom" && customHex) {
    return generateColorScale(customHex);
  }
  const presetPath = path.join(TEMPLATES_DIR, "colors", `${color}.json`);
  return fs.readJson(presetPath) as Promise<ColorPreset>;
}

function generateColorScale(hex: string): ColorPreset {
  // 簡易的なカラースケール生成（本番では chroma.js 等を使う）
  return {
    primary: {
      "50": lighten(hex, 0.95),
      "100": lighten(hex, 0.85),
      "200": lighten(hex, 0.7),
      "300": lighten(hex, 0.5),
      "400": lighten(hex, 0.3),
      "500": hex,
      "600": darken(hex, 0.15),
      "700": darken(hex, 0.3),
      "800": darken(hex, 0.45),
      "900": darken(hex, 0.6),
    },
  };
}

function lighten(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const nr = Math.round(r + (255 - r) * amount);
  const ng = Math.round(g + (255 - g) * amount);
  const nb = Math.round(b + (255 - b) * amount);
  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}

function darken(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const nr = Math.round(r * (1 - amount));
  const ng = Math.round(g * (1 - amount));
  const nb = Math.round(b * (1 - amount));
  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}

async function loadIconConfig(library: string): Promise<IconConfig> {
  const configPath = path.join(TEMPLATES_DIR, "icons", `${library}.json`);
  return fs.readJson(configPath) as Promise<IconConfig>;
}

async function applyColorTokens(
  targetDir: string,
  colorPreset: ColorPreset,
): Promise<void> {
  const configPath = path.join(targetDir, "tailwind.config.ts");
  let content = await fs.readFile(configPath, "utf-8");

  for (const [shade, value] of Object.entries(colorPreset.primary)) {
    content = content.replace(`{{primary${shade}}}`, value);
  }

  await fs.writeFile(configPath, content, "utf-8");
}

async function applyIconConfig(
  targetDir: string,
  _answers: Answers,
  _iconConfig: IconConfig,
): Promise<void> {
  // アイコンライブラリ固有の設定があればここで適用
  // 現時点ではプレースホルダー置換で対応
}

async function replacePlaceholders(
  targetDir: string,
  answers: Answers,
  iconConfig: IconConfig,
): Promise<void> {
  const files = await getAllFiles(targetDir);

  for (const file of files) {
    // バイナリファイルはスキップ
    const ext = path.extname(file);
    if ([".png", ".jpg", ".ico", ".svg", ".woff", ".woff2"].includes(ext)) {
      continue;
    }

    let content = await fs.readFile(file, "utf-8");
    let changed = false;

    if (content.includes("{{")) {
      content = content.replace(/\{\{projectName\}\}/g, answers.projectName);
      content = content.replace(
        /\{\{iconLibraryName\}\}/g,
        iconConfig.libraryName,
      );
      content = content.replace(
        /\{\{iconImportExample\}\}/g,
        iconConfig.importExample,
      );
      content = content.replace(/\{\{iconLibrary\}\}/g, iconConfig.libraryName);
      changed = true;
    }

    if (changed) {
      await fs.writeFile(file, content, "utf-8");
    }
  }
}

async function addIconDependency(
  targetDir: string,
  library: string,
  iconConfig: IconConfig,
): Promise<void> {
  const pkgPath = path.join(targetDir, "package.json");
  const pkg = await fs.readJson(pkgPath);

  if (library === "lucide") {
    pkg.dependencies["lucide-react"] = "^0.460.0";
  } else {
    pkg.dependencies["@heroicons/react"] = "^2.2.0";
  }

  // libraryName はログ用に使うだけ
  console.log(
    chalk.yellow(`🎨 アイコンライブラリ: ${iconConfig.libraryName}`),
  );

  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
}

async function getAllFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.name === "node_modules" || entry.name === ".git") continue;

    if (entry.isDirectory()) {
      files.push(...(await getAllFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

// ─────────────────────────────────────────────
// migrate コマンド
// ─────────────────────────────────────────────

/** template 側の既知コンポーネントとそのレイヤー */
const BUILTIN_COMPONENTS: Record<string, string> = {
  Button: "atoms",
  Loading: "atoms",
  DataTable: "organisms",
  SideBar: "organisms",
  PageLayout: "templates",
};

async function migrate() {
  console.log(chalk.cyan("\n🔄 create-dig-app migrate\n"));

  // 1. 実行場所を特定（frontend/ 直下 or プロジェクトルート/frontend/）
  let frontendDir = process.cwd();

  if (!await fs.pathExists(path.join(frontendDir, "AGENT.md"))) {
    const candidate = path.join(frontendDir, "frontend");
    if (await fs.pathExists(path.join(candidate, "AGENT.md"))) {
      frontendDir = candidate;
    } else {
      console.log(chalk.red("エラー: create-dig-app プロジェクトが見つかりません。"));
      console.log(chalk.dim("  frontend/ ディレクトリ内か、プロジェクトルートで実行してください。\n"));
      process.exit(1);
    }
  }

  console.log(chalk.dim(`  対象: ${frontendDir}\n`));

  // 2. ユーザーのカスタムコンポーネントを検出
  const componentsDir = path.join(frontendDir, "src", "components");
  const customComponents: string[] = [];

  if (await fs.pathExists(componentsDir)) {
    const entries = await fs.readdir(componentsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(".tsx")) {
        const name = entry.name.replace(".tsx", "");
        if (name !== "index" && !BUILTIN_COMPONENTS[name]) {
          customComponents.push(name);
        }
      }
    }
  }

  // 3. 変更内容を表示
  console.log(chalk.yellow("📋 以下を更新します:"));
  console.log(chalk.dim("  ✓ src/components/ → atoms/molecules/organisms/templates/ 構造に再編"));
  console.log(chalk.dim("  ✓ src/utils/componentRegistry.ts（レイヤー対応版に更新）"));
  console.log(chalk.dim("  ✓ src/pages/Playground/Playground.tsx（レイヤー別表示に更新）"));
  console.log(chalk.dim("  ✓ scripts/generate-handoff.js, figma-sync.js（追加/更新）"));
  console.log(chalk.dim("  ✓ AGENT.md（アトミックデザインセクションを追記）"));

  if (customComponents.length > 0) {
    console.log(chalk.yellow(`\n⚠️  カスタムコンポーネントが見つかりました: ${customComponents.join(", ")}`));
    console.log(chalk.dim("  → molecules/ に仮配置します。後で適切なレイヤーに移動してください。"));
  }

  console.log(chalk.dim("\n  ⚠️  変更しないもの: tailwind.config.ts / docs/ / src/mocks/ / src/pages/ (Playground以外)\n"));

  // 4. 確認
  const { confirmed } = await inquirer.prompt<{ confirmed: boolean }>([
    {
      type: "confirm",
      name: "confirmed",
      message: "更新を実行しますか？",
      default: true,
    },
  ]);

  if (!confirmed) {
    console.log(chalk.yellow("キャンセルしました。\n"));
    return;
  }

  const templateFrontend = path.join(TEMPLATES_DIR, "frontend");

  // 5a. atomic ディレクトリを作成・コピー
  console.log(chalk.yellow("\n⚙️  適用中..."));

  for (const layer of ["atoms", "molecules", "organisms", "templates"] as const) {
    const srcLayer = path.join(templateFrontend, "src", "components", layer);
    const dstLayer = path.join(componentsDir, layer);
    if (await fs.pathExists(srcLayer)) {
      await fs.copy(srcLayer, dstLayer, { overwrite: true });
      console.log(chalk.dim(`  ✓ src/components/${layer}/ を更新`));
    }
  }

  // 5b. カスタムコンポーネントを molecules/ に退避
  for (const name of customComponents) {
    const src = path.join(componentsDir, `${name}.tsx`);
    const dst = path.join(componentsDir, "molecules", `${name}.tsx`);
    if (await fs.pathExists(src)) {
      await fs.move(src, dst, { overwrite: false });
      console.log(chalk.dim(`  ⚠️  ${name}.tsx → molecules/${name}.tsx に移動（レイヤーを後で確認）`));
    }
  }

  // 5c. molecules/index.ts にカスタムコンポーネントの export を追加
  if (customComponents.length > 0) {
    const moleculesIndex = path.join(componentsDir, "molecules", "index.ts");
    let indexContent = await fs.readFile(moleculesIndex, "utf-8");
    for (const name of customComponents) {
      const exportLine = `export { ${name} } from "./${name}";`;
      if (!indexContent.includes(exportLine)) {
        indexContent += `\n${exportLine}`;
      }
    }
    await fs.writeFile(moleculesIndex, indexContent, "utf-8");
  }

  // 5d. ルートの index.ts を新しい形式に更新
  const rootIndexSrc = path.join(templateFrontend, "src", "components", "index.ts");
  const rootIndexDst = path.join(componentsDir, "index.ts");
  await fs.copy(rootIndexSrc, rootIndexDst, { overwrite: true });
  console.log(chalk.dim("  ✓ src/components/index.ts を更新"));

  // 5e. 旧フラットコンポーネントファイルを削除
  for (const name of Object.keys(BUILTIN_COMPONENTS)) {
    const oldFile = path.join(componentsDir, `${name}.tsx`);
    if (await fs.pathExists(oldFile)) {
      await fs.remove(oldFile);
    }
  }

  // 5f. componentRegistry.ts を更新
  const registrySrc = path.join(templateFrontend, "src", "utils", "componentRegistry.ts");
  const registryDst = path.join(frontendDir, "src", "utils", "componentRegistry.ts");
  if (await fs.pathExists(registrySrc)) {
    await fs.copy(registrySrc, registryDst, { overwrite: true });
    console.log(chalk.dim("  ✓ src/utils/componentRegistry.ts を更新"));
  }

  // 5g. Playground.tsx を更新
  const playgroundSrc = path.join(templateFrontend, "src", "pages", "Playground", "Playground.tsx");
  const playgroundDst = path.join(frontendDir, "src", "pages", "Playground", "Playground.tsx");
  if (await fs.pathExists(playgroundSrc)) {
    await fs.copy(playgroundSrc, playgroundDst, { overwrite: true });
    console.log(chalk.dim("  ✓ src/pages/Playground/Playground.tsx を更新"));
  }

  // 5h. scripts/ を更新（追加のみ、上書き）
  const scriptsSrc = path.join(templateFrontend, "scripts");
  const scriptsDst = path.join(frontendDir, "scripts");
  if (await fs.pathExists(scriptsSrc)) {
    await fs.copy(scriptsSrc, scriptsDst, { overwrite: true });
    console.log(chalk.dim("  ✓ scripts/ を更新"));
  }

  // 5i. AGENT.md にアトミックデザインセクションを追記（未追加の場合）
  const agentMdPath = path.join(frontendDir, "AGENT.md");
  if (await fs.pathExists(agentMdPath)) {
    let agentContent = await fs.readFile(agentMdPath, "utf-8");
    if (!agentContent.includes("アトミックデザイン方針")) {
      const atomicSection = `\n## アトミックデザイン方針\n\nコンポーネントは **Atomic Design** に基づいて設計・配置する。\n\n| レイヤー | ディレクトリ | 説明 | 例 |\n|---|---|---|---|\n| **Atoms** | \`src/components/atoms/\` | それ以上分割できない最小単位 | Button, Loading, Badge, Icon |\n| **Molecules** | \`src/components/molecules/\` | Atoms を組み合わせた小さな UI 単位 | FormField, SearchBar, Card |\n| **Organisms** | \`src/components/organisms/\` | Molecules + Atoms で構成される複合 UI | DataTable, SideBar, Header |\n| **Templates** | \`src/components/templates/\` | ページの骨格・レイアウト | PageLayout |\n| **Pages** | \`src/pages/\` | 実際のページコンポーネント | Playground, Dashboard |\n\n### Figma との粒度の対応\n- **Figma の Component / Variant** → コードの \`atoms\` または \`molecules\`\n- **Figma の Frame（複合）** → コードの \`organisms\`\n- **Figma のページレイアウト** → コードの \`templates\`\n`;
      agentContent += atomicSection;
      await fs.writeFile(agentMdPath, agentContent, "utf-8");
      console.log(chalk.dim("  ✓ AGENT.md にアトミックデザインセクションを追記"));
    }
  }

  // 完了
  console.log(chalk.green("\n✅ マイグレーション完了！\n"));
  if (customComponents.length > 0) {
    console.log(chalk.yellow("📌 次のステップ:"));
    for (const name of customComponents) {
      console.log(chalk.dim(`  - ${name}: src/components/molecules/${name}.tsx を適切なレイヤーに移動し、そのレイヤーの index.ts に export を追加してください`));
    }
    console.log();
  }
  console.log(chalk.dim("  💡 componentRegistry.ts の componentDocs に layer フィールドを追加してください。\n"));
}

// ─────────────────────────────────────────────
// エントリポイント
// ─────────────────────────────────────────────

const args = process.argv.slice(2);
if (args[0] === "migrate") {
  migrate().catch((err) => {
    console.error(chalk.red("エラーが発生しました:"), err);
    process.exit(1);
  });
} else {
  main().catch((err) => {
    console.error(chalk.red("エラーが発生しました:"), err);
    process.exit(1);
  });
}
