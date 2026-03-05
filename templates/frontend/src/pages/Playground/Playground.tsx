import { Button, DataTable, Loading, PageLayout } from "../../components";

const colorShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

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
  return (
    <PageLayout title="Component Playground" description="全コンポーネントの一覧とカラートークン">
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

      {/* Color Tokens */}
      <Section title="Color Tokens">
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-600">Primary</h3>
            <div className="flex gap-1">
              {colorShades.map((shade) => (
                <div key={shade} className="text-center">
                  <div
                    className={`h-10 w-14 rounded bg-primary-${shade}`}
                    style={{ backgroundColor: `var(--tw-primary-${shade}, '')` }}
                  />
                  <span className="text-xs text-gray-500">{shade}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-600">Semantic</h3>
            <div className="flex gap-3">
              <div className="text-center">
                <div className="h-10 w-14 rounded bg-success" />
                <span className="text-xs text-gray-500">success</span>
              </div>
              <div className="text-center">
                <div className="h-10 w-14 rounded bg-warning" />
                <span className="text-xs text-gray-500">warning</span>
              </div>
              <div className="text-center">
                <div className="h-10 w-14 rounded bg-error" />
                <span className="text-xs text-gray-500">error</span>
              </div>
              <div className="text-center">
                <div className="h-10 w-14 rounded bg-surface" />
                <span className="text-xs text-gray-500">surface</span>
              </div>
            </div>
          </div>
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
