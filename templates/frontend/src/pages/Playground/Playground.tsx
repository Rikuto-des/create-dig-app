import { useState, useEffect } from "react";
import { Button, DataTable, Loading, PageLayout, SideBar } from "../../components";
import { getComponentList, getColorTokens, componentDocs, type ComponentInfo } from "../../utils/componentRegistry";

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

function PropsTable({ component }: { component: ComponentInfo }) {
  if (!component.props || component.props.length === 0) return null;
  return (
    <div className="mt-4 overflow-x-auto rounded border border-border">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-xs text-gray-500">
          <tr>
            <th className="px-3 py-2 font-medium">Prop</th>
            <th className="px-3 py-2 font-medium">型</th>
            <th className="px-3 py-2 font-medium">必須</th>
            <th className="px-3 py-2 font-medium">デフォルト</th>
            <th className="px-3 py-2 font-medium">説明</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {component.props.map((prop) => (
            <tr key={prop.name} className="bg-white hover:bg-gray-50">
              <td className="px-3 py-2 font-mono font-semibold text-primary-700">{prop.name}</td>
              <td className="px-3 py-2 font-mono text-xs text-gray-600">{prop.type}</td>
              <td className="px-3 py-2">
                {prop.required
                  ? <span className="rounded bg-error px-1.5 py-0.5 text-xs text-white">必須</span>
                  : <span className="text-gray-400">-</span>}
              </td>
              <td className="px-3 py-2 font-mono text-xs text-gray-500">{prop.defaultValue ?? "-"}</td>
              <td className="px-3 py-2 text-gray-600">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Playground() {
  const [colorTokens, setColorTokens] = useState(getColorTokens());
  const [detectedComponents, setDetectedComponents] = useState<string[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  useEffect(() => {
    const list = getComponentList();
    setDetectedComponents(list.map(c => c.name));

    const interval = setInterval(() => {
      setColorTokens(getColorTokens());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PageLayout title="Component Playground" description="全コンポーネントの一覧とカラートークン">
      {/* Component Overview */}
      <Section title="Component Overview">
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-600 mb-2">
            検出されたコンポーネント: {detectedComponents.length} 個
          </p>
          <div className="flex flex-wrap gap-2">
            {detectedComponents.map((name) => (
              <button
                key={name}
                onClick={() => setSelectedComponent(selectedComponent === name ? null : name)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selectedComponent === name
                    ? "bg-primary-500 text-white border-primary-500"
                    : "bg-primary-100 text-primary-800 border-primary-200 hover:bg-primary-200"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
          {selectedComponent && componentDocs[selectedComponent] && (
            <div className="mt-4">
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">{selectedComponent}</span>:{" "}
                {componentDocs[selectedComponent].description}
              </p>
              <PropsTable component={componentDocs[selectedComponent]} />
            </div>
          )}
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
