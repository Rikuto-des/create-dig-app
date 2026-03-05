import { useState, useEffect } from "react";
import { Button, DataTable, Loading, PageLayout, SideBar } from "../../components";
import { getComponentList, getColorTokens } from "../../utils/componentRegistry";

const sampleColumns = [
  { key: "name", label: "名前" },
  { key: "email", label: "メール", width: "250px" },
  { key: "role", label: "権限", align: "center" as const },
];

const sampleRows = [
  { name: "田中太郎", email: "tanaka@example.com", role: "管理者" },
  { name: "佐藤花子", email: "sato@example.com", role: "一般" },
  { name: "鈴木一郎", email: "suzuki@example.com", role: "一般" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 border-b border-border pb-2 text-lg font-bold text-gray-800">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Playground() {
  const [colorTokens, setColorTokens] = useState(getColorTokens());
  const [components, setComponents] = useState<string[]>([]);

  // コンポーネントリストとカラートークンを取得
  useEffect(() => {
    const loadComponents = async () => {
      const componentList = await getComponentList();
      setComponents(componentList.map(c => c.name));
    };
    
    loadComponents();
    
    // カラートークンの変更を監視（将来的には tailwind.config.ts の監視）
    const checkColorTokens = () => {
      setColorTokens(getColorTokens());
    };
    
    // 5秒ごとにチェック（開発用）
    const interval = setInterval(() => {
      checkColorTokens();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <PageLayout title="Component Playground" description="全コンポーネントの一覧とカラートークン">
      {/* Component Overview */}
      <Section title="Component Overview">
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-600 mb-2">
            検出されたコンポーネント: {components.length} 個
          </p>
          <div className="flex flex-wrap gap-2">
            {components.map((component) => (
              <span 
                key={component}
                className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
              >
                {component}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* Button */}
      <Section title="Button">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="sm">Primary SM</Button>
            <Button variant="primary" size="md">Primary MD</Button>
            <Button variant="primary" size="lg">Primary LG</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </div>
      </Section>

      {/* DataTable */}
      <Section title="DataTable">
        <DataTable columns={sampleColumns} rows={sampleRows} />
      </Section>

      {/* DataTable Empty */}
      <Section title="DataTable (Empty)">
        <DataTable columns={sampleColumns} rows={[]} />
      </Section>

      {/* Loading */}
      <Section title="Loading">
        <div className="flex items-start gap-8">
          <Loading size="sm" label="Small" />
          <Loading size="md" />
          <Loading size="lg" label="Large loading..." />
        </div>
      </Section>

      {/* SideBar */}
      <Section title="SideBar">
        <div className="h-64 w-80 border border-border rounded">
          <SideBar 
            title="Test App" 
            items={[
              { label: "ホーム", path: "/" },
              { label: "ダッシュボード", path: "/dashboard" },
              { label: "設定", path: "/settings" },
            ]}
          />
        </div>
      </Section>

      {/* Color Tokens */}
      <Section title="Color Tokens">
        <div className="space-y-6">
          {Object.entries(colorTokens).map(([colorName, shades]) => (
            <div key={colorName}>
              <h3 className="mb-2 text-sm font-semibold text-gray-600 capitalize">{colorName}</h3>
              <div className="flex gap-1 flex-wrap">
                {shades.map((shade) => (
                  <div key={shade} className="text-center">
                    <div
                      className={`h-10 w-14 rounded border border-gray-200 bg-${colorName}-${shade}`}
                      title={`${colorName}-${shade}`}
                    />
                    <span className="text-xs text-gray-500">{shade}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <div className="space-y-2">
          <p className="text-3xl font-bold">Text 3xl Bold</p>
          <p className="text-2xl font-bold">Text 2xl Bold</p>
          <p className="text-xl font-semibold">Text xl Semibold</p>
          <p className="text-lg font-medium">Text lg Medium</p>
          <p className="text-base">Text base (default)</p>
          <p className="text-sm text-gray-500">Text sm Gray</p>
          <p className="text-xs text-gray-400">Text xs Light Gray</p>
        </div>
      </Section>

      {/* Spacing */}
      <Section title="Spacing">
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 6, 8, 10, 12, 16].map((s) => (
            <div key={s} className="text-center">
              <div
                className="bg-primary-200"
                style={{ width: `${s * 4}px`, height: `${s * 4}px` }}
              />
              <span className="text-xs text-gray-500">{s}</span>
            </div>
          ))}
        </div>
      </Section>
    </PageLayout>
  );
}
