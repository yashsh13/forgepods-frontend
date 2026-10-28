
const features = [
  {
    number: "01",
    title: "Instant workspaces",
    description:
      "Spin up isolated development environments without configuring your local machine.",
  },
  {
    number: "02",
    title: "Your tools, in the browser",
    description:
      "Write, edit, and run code inside a familiar VS Code-powered environment.",
  },
  {
    number: "03",
    title: "Built for your workflow",
    description:
      "Start with Node.js, Python, React, or Next.js and get straight to building.",
  },
];

const templates = [
  {
    name: "Node.js",
    detail: "Backend development",
    icon: "JS",
    color: "text-green-600",
  },
  {
    name: "Python",
    detail: "Scripts and applications",
    icon: "Py",
    color: "text-amber-600",
  },
  {
    name: "React",
    detail: "Frontend applications",
    icon: "Re",
    color: "text-sky-600",
  },
  {
    name: "Next.js",
    detail: "Full-stack applications",
    icon: "Nx",
    color: "text-slate-800",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fafc] text-slate-900">
      {/* Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-600/20">
            F
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            ForgePods
          </span>
        </a>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
          <a href="#features" className="transition hover:text-blue-600">
            Features
          </a>
          <a href="#templates" className="transition hover:text-blue-600">
            Templates
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Log in
          </a>
          <a
            href="/register"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Get started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-16 lg:grid-cols-2 lg:px-10 lg:pb-32 lg:pt-24">
        <div className="pointer-events-none absolute left-1/4 top-10 -z-0 h-72 w-72 rounded-full bg-blue-300/30 blur-[120px]" />

        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-medium text-slate-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Your development environment, in the cloud
          </div>

          <h1 className="max-w-2xl text-5xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            Your next idea
            <br />
            deserves a
            <br />
            <span className="text-blue-600">better workspace.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-slate-500 sm:text-lg">
            Create a project, launch a cloud development environment, and
            start building. No complicated local setup. Just you and your code.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="/register"
              className="rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Create your workspace <span aria-hidden="true">→</span>
            </a>
            <a
              href="#features"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
            >
              Explore features
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-500">
            <span>✓ Browser-based editor</span>
            <span>✓ Isolated workspaces</span>
            <span>✓ Four project templates</span>
          </div>
        </div>

        {/* Editor Preview */}
        <div className="relative z-10">
          <div className="absolute -inset-5 rounded-3xl bg-blue-200/40 blur-2xl" />

          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-slate-500">
                forgepods / my-project
              </span>
              <span className="text-xs font-medium text-emerald-600">
                ● Ready
              </span>
            </div>

            <div className="grid min-h-[330px] grid-cols-[125px_1fr] bg-white sm:grid-cols-[155px_1fr]">
              <aside className="border-r border-slate-200 bg-slate-50/80 p-3 sm:p-4">
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Explorer
                </p>
                <p className="mb-3 text-xs font-medium text-slate-700">
                  ⌄ my-project
                </p>

                <div className="space-y-1 pl-2 text-xs">
                  <p className="rounded-md bg-blue-50 px-2 py-2 font-medium text-blue-700">
                    TS index.ts
                  </p>
                  <p className="px-2 py-2 text-slate-500">
                    JS package.json
                  </p>
                  <p className="px-2 py-2 text-slate-500">
                    TXT README.md
                  </p>
                </div>

                <div className="mt-10 rounded-lg border border-slate-200 bg-white p-2.5">
                  <p className="text-[10px] text-slate-400">Environment</p>
                  <p className="mt-1 text-xs font-medium text-slate-700">
                    Node.js
                  </p>
                  <p className="mt-2 text-[10px] font-medium text-emerald-600">
                    Workspace ready
                  </p>
                </div>
              </aside>

              <div className="min-w-0 p-4 sm:p-6">
                <div className="mb-7 flex items-center gap-4 border-b border-slate-200 text-xs">
                  <span className="border-b-2 border-blue-600 pb-3 font-medium text-blue-700">
                    index.ts
                  </span>
                  <span className="pb-3 text-slate-400">package.json</span>
                </div>

                <div className="space-y-3 overflow-hidden font-mono text-xs leading-5 sm:text-sm">
                  <p>
                    <span className="mr-5 text-slate-300">1</span>
                    <span className="text-blue-700">const</span>{" "}
                    <span className="text-sky-700">workspace</span> = {"{"}
                  </p>
                  <p>
                    <span className="mr-5 text-slate-300">2</span>
                    {"  "}name: <span className="text-emerald-700">"my-project"</span>,
                  </p>
                  <p>
                    <span className="mr-5 text-slate-300">3</span>
                    {"  "}environment: <span className="text-emerald-700">"cloud"</span>,
                  </p>
                  <p>
                    <span className="mr-5 text-slate-300">4</span>
                    {"  "}status: <span className="text-emerald-700">"ready"</span>,
                  </p>
                  <p>
                    <span className="mr-5 text-slate-300">5</span>
                    {"};"}
                  </p>
                  <p className="pt-3">
                    <span className="mr-5 text-slate-300">6</span>
                    <span className="text-blue-700">function</span>{" "}
                    <span className="text-sky-700">buildSomething</span>() {"{"}
                  </p>
                  <p>
                    <span className="mr-5 text-slate-300">7</span>
                    {"  "}
                    <span className="text-blue-700">return</span>{" "}
                    <span className="text-emerald-700">"Your next idea."</span>;
                  </p>
                  <p>
                    <span className="mr-5 text-slate-300">8</span>
                    {"}"}
                  </p>
                </div>

                <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      Terminal
                    </span>
                    <span className="text-[10px] text-slate-400">bash</span>
                  </div>
                  <p className="font-mono text-xs text-slate-600">
                    <span className="font-bold text-blue-600">$</span> pnpm dev
                  </p>
                  <p className="mt-2 font-mono text-xs text-emerald-600">
                    ✓ Ready to build
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">
            A glimpse of your cloud development workflow
          </p>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-t border-slate-200 bg-white/70"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              Built to get out of your way
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Less setup. More building.
            </h2>
            <p className="mt-4 leading-7 text-slate-500">
              The tools you need to go from a blank project to working code,
              without the usual setup routine.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/60"
              >
                <span className="font-mono text-xs font-semibold text-blue-600">
                  {feature.number}
                </span>
                <h3 className="mt-7 text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section
        id="templates"
        className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              Start with your stack
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Pick a template. Start building.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-500">
            Choose a starting point that matches what you want to create.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <article
              key={template.name}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/60"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 font-mono text-sm font-bold ${template.color}`}
              >
                {template.icon}
              </div>
              <h3 className="mt-5 font-semibold text-slate-900">
                {template.name}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {template.detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="px-6 pb-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-8 sm:flex-row sm:items-center sm:p-12">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Your next project starts here.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Create an account and get your development workspace ready.
            </p>
          </div>
          <a
            href="/register"
            className="shrink-0 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Get started <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-7">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 ForgePods</span>
          <span>Build anywhere. Run in the cloud.</span>
        </div>
      </footer>
    </main>
  );
}
