
"use client";

import { use, useState } from "react";
import Link from "next/link";

export default function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [message, setMessage] = useState("Your app preview will appear here.");

  async function handleRun() {
    setLoading(true);
    setMessage("Starting your Node.js server...");

    try {
      const response = await fetch("/api/workspace/run", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to start server");
      }

      setRunning(true);
      setMessage("Server started. Loading preview...");
      setPreviewKey((key) => key + 1);
    } catch (error) {
      setRunning(false);
      setMessage(
        error instanceof Error ? error.message : "Failed to start server"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleStop() {
    setLoading(true);
    setMessage("Stopping your Node.js server...");

    try {
      const response = await fetch("/api/workspace/stop", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to stop server");
      }

      setRunning(false);
      setMessage("Server stopped.");
      setPreviewKey((key) => key + 1);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to stop server"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-white text-slate-900">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-5">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm text-slate-500 transition hover:text-slate-900"
          >
            ← Dashboard
          </Link>

          <div className="h-5 w-px bg-slate-200" />

          <div>
            <h1 className="text-sm font-semibold">ForgePods Workspace</h1>
            <p className="text-xs text-slate-500">Project: {id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span
              className={`h-2 w-2 rounded-full ${
                running ? "bg-green-500" : "bg-slate-300"
              }`}
            />
            {running ? "Running" : "Stopped"}
          </div>

          {!running ? (
            <button
              onClick={handleRun}
              disabled={loading}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Starting..." : "▶ Run"}
            </button>
          ) : (
            <button
              onClick={handleStop}
              disabled={loading}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Stopping..." : "■ Stop"}
            </button>
          )}
        </div>
      </header>

      {/* Workspace panels */}
      <section className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,24%)]">
        {/* Code editor */}
        <div className="flex min-h-0 flex-col border-b border-slate-200 lg:border-b-0 lg:border-r">
          <div className="flex h-10 shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Code Editor
            </span>
            <span className="text-xs text-slate-400">
              Node.js · Python
            </span>
          </div>

          <div className="min-h-0 flex-1 bg-white">
            <iframe
              src="http://localhost:8080"
              title="ForgePods Code Editor"
              className="h-full w-full border-0"
              allow="clipboard-read; clipboard-write"
            />
          </div>
        </div>

        {/* Output preview */}
        <div className="flex min-h-0 flex-col bg-white">
          <div className="flex h-10 shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Preview
            </span>

            <button
              onClick={() => setPreviewKey((key) => key + 1)}
              disabled={!running}
              title="Refresh preview"
              className="rounded-md px-2 py-1 text-xs text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ↻ Refresh
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            {running ? (
              <iframe
                key={previewKey}
                src="http://localhost:5000"
                title="Application Preview"
                className="h-full w-full flex-1 border-0 bg-white"
              />
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center px-5 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xl">
                  ▶
                </div>

                <h2 className="text-sm font-semibold text-slate-800">
                  Nothing running yet
                </h2>

                <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500">
                  {message}
                </p>

                <button
                  onClick={handleRun}
                  disabled={loading}
                  className="mt-5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? "Starting..." : "Run application"}
                </button>
              </div>
            )}
          </div>

          <div className="flex min-h-10 shrink-0 items-center gap-2 border-t border-slate-200 px-3 py-2">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                running ? "bg-green-500" : "bg-slate-300"
              }`}
            />
            <p className="truncate text-xs text-slate-500">{message}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
