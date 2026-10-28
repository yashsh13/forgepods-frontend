
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Template = "NODEJS" | "PYTHON" | "REACT" | "NEXTJS";

type Project = {
  id: string;
  name: string;
  description: string | null;
  template: Template;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type Workspace = {
  id: string;
  projectId: string;
  status: string;
  accessUrl: string | null;
  podName: string | null;
  errorMessage: string | null;
  startedAt: string | null;
  stoppedAt: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const templates: {
  id: Template;
  name: string;
  description: string;
  icon: string;
}[] = [
  {
    id: "NODEJS",
    name: "Node.js",
    description: "Build APIs and backend services.",
    icon: "⬡",
  },
  {
    id: "PYTHON",
    name: "Python",
    description: "Build scripts and Python applications.",
    icon: "🐍",
  },
  {
    id: "REACT",
    name: "React",
    description: "Build interactive frontend apps.",
    icon: "⚛",
  },
  {
    id: "NEXTJS",
    name: "Next.js",
    description: "Build full-stack web applications.",
    icon: "▲",
  },
];

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [workspaces, setWorkspaces] = useState<Record<string, Workspace>>(
    {},
  );

  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<Template>("NEXTJS");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [busyProjects, setBusyProjects] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = () => localStorage.getItem("forgepods_token");

  const apiRequest = useCallback(
    async (path: string, options: RequestInit = {}) => {
      const token = getToken();

      if (!token) {
        window.location.href = "/login";
        throw new Error("Please log in to continue.");
      }

      const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("forgepods_token");
        window.location.href = "/login";
        throw new Error("Your session has expired. Please log in again.");
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "The request failed.");
      }

      return data;
    },
    [],
  );

  const refreshWorkspace = useCallback(
    async (projectId: string) => {
      const data = await apiRequest(
        `/api/projects/${projectId}/workspace`,
      );

      if (data.workspace) {
        setWorkspaces((current) => ({
          ...current,
          [projectId]: data.workspace,
        }));

        return data.workspace as Workspace;
      }

      return null;
    },
    [apiRequest],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      if (!getToken()) {
        window.location.href = "/login";
        return;
      }

      try {
        const data = await apiRequest("/api/projects");

        if (cancelled) return;

        const loadedProjects: Project[] = data.projects;
        setProjects(loadedProjects);

        const results = await Promise.allSettled(
          loadedProjects.map(async (project) => {
            const result = await apiRequest(
              `/api/projects/${project.id}/workspace`,
            );

            return {
              projectId: project.id,
              workspace: result.workspace as Workspace,
            };
          }),
        );

        if (cancelled) return;

        setWorkspaces((current) => {
          const next = { ...current };

          for (const result of results) {
            if (result.status === "fulfilled" && result.value.workspace) {
              next[result.value.projectId] = result.value.workspace;
            }
          }

          return next;
        });
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load dashboard.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [apiRequest]);

  // Poll workspaces while they are provisioning.
  useEffect(() => {
    const hasProvisioningWorkspace = Object.values(workspaces).some(
      (workspace) =>
        ["PENDING", "CREATING"].includes(workspace.status),
    );

    if (!hasProvisioningWorkspace) return;

    const timer = window.setInterval(async () => {
      const pending = Object.entries(workspaces).filter(([, workspace]) =>
        ["PENDING", "CREATING"].includes(workspace.status),
      );

      await Promise.allSettled(
        pending.map(([projectId]) => refreshWorkspace(projectId)),
      );
    }, 5000);

    return () => window.clearInterval(timer);
  }, [workspaces, refreshWorkspace]);

  async function createProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setCreating(true);

    try {
      const data = await apiRequest("/api/projects", {
        method: "POST",
        body: JSON.stringify({
          name: projectName.trim(),
          template: selectedTemplate,
        }),
      });

      setProjects((current) => [data.project, ...current]);
      setProjectName("");
      setSelectedTemplate("NEXTJS");
      setShowCreate(false);
      setSuccess("Project created successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create project.",
      );
    } finally {
      setCreating(false);
    }
  }

  async function startWorkspace(project: Project) {
    setError("");
    setSuccess("");
    setBusyProjects((current) => [...current, project.id]);

    try {
      const data = await apiRequest(
        `/api/projects/${project.id}/workspace`,
        { method: "POST" },
      );

      if (data.workspace) {
        setWorkspaces((current) => ({
          ...current,
          [project.id]: data.workspace,
        }));
      }

      setSuccess(
        data.message || "Workspace provisioning has been requested.",
      );

      await refreshWorkspace(project.id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start workspace.",
      );
    } finally {
      setBusyProjects((current) =>
        current.filter((id) => id !== project.id),
      );
    }
  }

  async function openWorkspace(project: Project) {
    setError("");
    setSuccess("");
    setBusyProjects((current) => [...current, project.id]);

    // Open the tab immediately to avoid popup blocking after the API call.
    const editorWindow = window.open("about:blank", "_blank");

    try {
      const data = await apiRequest(`/api/projects/${project.id}/open`, {
        method: "POST",
      });

      const url = data.url as string | undefined;

      if (!url) {
        throw new Error("The server did not return a workspace URL.");
      }

      if (editorWindow) {
        editorWindow.location.href = url;
      } else {
        window.location.href = url;
      }

      setSuccess(`Opening "${project.name}" in code-server.`);
    } catch (err) {
      editorWindow?.close();

      setError(
        err instanceof Error ? err.message : "Failed to open workspace.",
      );
    } finally {
      setBusyProjects((current) =>
        current.filter((id) => id !== project.id),
      );
    }
  }

  async function stopWorkspace(project: Project) {
    const confirmed = window.confirm(
      `Stop the workspace for "${project.name}"? Any unsaved files may be lost.`,
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setBusyProjects((current) => [...current, project.id]);

    try {
      await apiRequest(`/api/projects/${project.id}/workspace`, {
        method: "DELETE",
      });

      setWorkspaces((current) => {
        const next = { ...current };
        delete next[project.id];
        return next;
      });

      setSuccess(`Workspace for "${project.name}" has been stopped.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to stop workspace.",
      );
    } finally {
      setBusyProjects((current) =>
        current.filter((id) => id !== project.id),
      );
    }
  }

  function logout() {
    localStorage.removeItem("forgepods_token");
    window.location.href = "/login";
  }

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase()),
  );

  const runningCount = Object.values(workspaces).filter(
    (workspace) => workspace.status === "RUNNING",
  ).length;

  function statusStyle(status?: string) {
    switch (status) {
      case "RUNNING":
        return "bg-green-50 text-green-700";
      case "FAILED":
        return "bg-red-50 text-red-700";
      case "CREATING":
      case "PENDING":
        return "bg-amber-50 text-amber-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      <aside className="flex w-full flex-col border-b border-slate-200 bg-white p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <Link href="/" className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
            F
          </div>

          <span className="text-xl font-bold tracking-tight">
            Forge<span className="text-blue-600">Pods</span>
          </span>
        </Link>

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        <div className="flex gap-2 rounded-xl bg-blue-50 px-4 py-3 font-semibold text-blue-700">
          <span>▦</span>
          My Projects
        </div>

        <div className="mt-auto hidden rounded-2xl bg-slate-50 p-4 md:block">
          <p className="font-semibold">Code from anywhere.</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your cloud development environment, in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="mt-5 rounded-lg px-3 py-2 text-left text-sm text-slate-500 hover:bg-slate-50 hover:text-red-600"
        >
          Sign out
        </button>

        <Link
          href="/"
          className="mt-2 text-sm text-slate-500 hover:text-blue-600"
        >
          ← Back to home
        </Link>
      </aside>

      <section className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5 sm:px-10">
          <div>
            <p className="text-sm text-slate-500">Workspace / Overview</p>
            <h1 className="mt-1 text-xl font-bold">My Projects</h1>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
            F
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Your workspace
              </h2>
              <p className="mt-2 text-slate-500">
                Create projects and launch cloud coding environments.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setError("");
                setSuccess("");
                setShowCreate(true);
              }}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              + Create Project
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <p>{error}</p>

              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
                className="font-bold"
              >
                ×
              </button>
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
            >
              {success}
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Total projects</p>
              <p className="mt-2 text-3xl font-bold">
                {loading ? "—" : projects.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Available templates</p>
              <p className="mt-2 text-3xl font-bold">4</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Running workspaces</p>
              <p className="mt-2 text-3xl font-bold">
                {loading ? "—" : runningCount}
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h3 className="text-lg font-bold">Recent projects</h3>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:max-w-xs"
            />
          </div>

          {loading ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
              Loading your projects...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                {"</>"}
              </div>

              <h4 className="mt-5 text-lg font-bold">
                {projects.length === 0
                  ? "Your next idea starts here"
                  : "No projects found"}
              </h4>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {projects.length === 0
                  ? "Create your first project and set up your cloud coding workspace."
                  : "Try another search term."}
              </p>

              {projects.length === 0 && (
                <button
                  type="button"
                  onClick={() => setShowCreate(true)}
                  className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Create your first project
                </button>
              )}
            </div>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => {
                const template = templates.find(
                  (item) => item.id === project.template,
                );

                const workspace = workspaces[project.id];
                const busy = busyProjects.includes(project.id);
                const status = workspace?.status ?? "STOPPED";

                return (
                  <article
                    key={project.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl text-blue-600">
                        {template?.icon ?? "</>"}
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(status)}`}
                      >
                        {status}
                      </span>
                    </div>

                    <h4 className="mt-5 truncate text-lg font-bold">
                      {project.name}
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      {template?.name ?? project.template} · Created{" "}
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>

                    {project.description && (
                      <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                        {project.description}
                      </p>
                    )}

                    {workspace?.errorMessage && status === "FAILED" && (
                      <p className="mt-3 break-words text-xs text-red-600">
                        {workspace.errorMessage}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                      {!workspace || status === "FAILED" ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => {
                            window.location.href = `/workspace/${project.id}`
                          }}
                          className="flex-1 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                          {busy
                            ? "Starting..."
                            : status === "FAILED"
                              ? "Retry workspace"
                              : "Start workspace"}
                        </button>
                      ) : ["PENDING", "CREATING"].includes(status) ? (
                        <button
                          type="button"
                          disabled
                          className="flex-1 cursor-wait rounded-lg bg-amber-100 px-3 py-2.5 text-sm font-semibold text-amber-800"
                        >
                          Provisioning...
                        </button>
                      ) : status === "RUNNING" ? (
                        <>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => {
                              window.location.href = `/workspace/${project.id}`
                            }}
                            className="flex-1 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                          >
                            {busy ? "Opening..." : "Open Editor ↗"}
                          </button>

                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => stopWorkspace(project)}
                            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                          >
                            {busy ? "Stopping..." : "Stop"}
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => stopWorkspace(project)}
                          className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                        >
                          {busy ? "Working..." : "Remove workspace"}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <footer className="mt-12 border-t border-slate-200 py-6 text-sm text-slate-400">
            ForgePods · Your cloud, your code.
          </footer>
        </div>
      </section>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-title"
            className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 id="create-title" className="text-2xl font-bold">
                  Create a project
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Choose a name and your development environment.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreate(false)}
                aria-label="Close dialog"
                className="rounded-lg px-3 py-1 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={createProject} className="mt-6">
              <label
                htmlFor="project-name"
                className="mb-2 block text-sm font-semibold"
              >
                Project name
              </label>

              <input
                id="project-name"
                autoFocus
                required
                maxLength={100}
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="e.g. my-awesome-app"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <p className="mb-3 mt-6 text-sm font-semibold">
                Choose a template
              </p>

              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`rounded-xl border p-4 text-left transition ${
                      selectedTemplate === template.id
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <span className="text-2xl">{template.icon}</span>
                    <p className="mt-3 font-semibold">{template.name}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>

              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  disabled={creating}
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating || !projectName.trim()}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
