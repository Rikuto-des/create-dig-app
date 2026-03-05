#!/usr/bin/env node
import inquirer from "inquirer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import chalk from "chalk";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_DIR = path.resolve(__dirname, "..", "templates");
async function main() {
    console.log(chalk.cyan("\n✨ create-dig-app v1.0.0\n"));
    // --yes フラグで非対話モード（テスト用）
    const args = process.argv.slice(2);
    const yesMode = args.includes("--yes") || args.includes("-y");
    const projectNameArg = args.find((a) => !a.startsWith("-"));
    let answers;
    if (yesMode) {
        answers = {
            projectName: projectNameArg || "my-project",
            productType: "admin",
            brandColor: "purple",
            iconLibrary: "lucide",
            figmaUrl: "",
        };
        console.log(chalk.dim("非対話モード: デフォルト設定を使用"));
    }
    else {
        answers = await inquirer.prompt([
            {
                type: "input",
                name: "projectName",
                message: "プロジェクト名:",
                default: process.argv[2] || "my-project",
                validate: (input) => /^[a-z0-9-]+$/.test(input) || "英小文字、数字、ハイフンのみ使用できます",
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
                when: (ans) => ans.brandColor === "custom",
                validate: (input) => /^#[0-9a-fA-F]{6}$/.test(input) || "#RRGGBB 形式で入力してください",
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
    console.log(chalk.green(`\n✅ ${answers.projectName} を作成しました！\n`));
    console.log(chalk.dim("  プロジェクト構成:"));
    console.log(chalk.dim(`    ${answers.projectName}/frontend/  # デザイナー作業領域`));
    console.log(chalk.dim(`    ${answers.projectName}/backend/   # Dev 実装領域\n`));
    console.log(`  ${chalk.cyan("cd")} ${answers.projectName}/frontend`);
    console.log(`  ${chalk.cyan("npm install")}`);
    console.log(`  ${chalk.cyan("npm run dev")}\n`);
    console.log(chalk.dim('  💡 VSCode で開いたら AI に「AGENT.md を読んで」と指示してください。\n'));
}
async function loadColorPreset(color, customHex) {
    if (color === "custom" && customHex) {
        return generateColorScale(customHex);
    }
    const presetPath = path.join(TEMPLATES_DIR, "colors", `${color}.json`);
    return fs.readJson(presetPath);
}
function generateColorScale(hex) {
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
function lighten(hex, amount) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const nr = Math.round(r + (255 - r) * amount);
    const ng = Math.round(g + (255 - g) * amount);
    const nb = Math.round(b + (255 - b) * amount);
    return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}
function darken(hex, amount) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const nr = Math.round(r * (1 - amount));
    const ng = Math.round(g * (1 - amount));
    const nb = Math.round(b * (1 - amount));
    return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}
async function loadIconConfig(library) {
    const configPath = path.join(TEMPLATES_DIR, "icons", `${library}.json`);
    return fs.readJson(configPath);
}
async function applyColorTokens(targetDir, colorPreset) {
    const configPath = path.join(targetDir, "tailwind.config.ts");
    let content = await fs.readFile(configPath, "utf-8");
    for (const [shade, value] of Object.entries(colorPreset.primary)) {
        content = content.replace(`{{primary${shade}}}`, value);
    }
    await fs.writeFile(configPath, content, "utf-8");
}
async function applyIconConfig(targetDir, _answers, _iconConfig) {
    // アイコンライブラリ固有の設定があればここで適用
    // 現時点ではプレースホルダー置換で対応
}
async function replacePlaceholders(targetDir, answers, iconConfig) {
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
            content = content.replace(/\{\{iconLibraryName\}\}/g, iconConfig.libraryName);
            content = content.replace(/\{\{iconImportExample\}\}/g, iconConfig.importExample);
            content = content.replace(/\{\{iconLibrary\}\}/g, iconConfig.libraryName);
            changed = true;
        }
        if (changed) {
            await fs.writeFile(file, content, "utf-8");
        }
    }
}
async function addIconDependency(targetDir, library, iconConfig) {
    const pkgPath = path.join(targetDir, "package.json");
    const pkg = await fs.readJson(pkgPath);
    if (library === "lucide") {
        pkg.dependencies["lucide-react"] = "^0.460.0";
    }
    else {
        pkg.dependencies["@heroicons/react"] = "^2.2.0";
    }
    // libraryName はログ用に使うだけ
    console.log(chalk.yellow(`🎨 アイコンライブラリ: ${iconConfig.libraryName}`));
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
}
async function getAllFiles(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.name === "node_modules" || entry.name === ".git")
            continue;
        if (entry.isDirectory()) {
            files.push(...(await getAllFiles(fullPath)));
        }
        else {
            files.push(fullPath);
        }
    }
    return files;
}
main().catch((err) => {
    console.error(chalk.red("エラーが発生しました:"), err);
    process.exit(1);
});
