
import { NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function POST() {
  try {
    await execFileAsync("docker", [
      "exec",
      "forgepods-workspace",
      "sh",
      "-lc",
      `if [ -f /tmp/forgepods-server.pid ]; then
        old_pid="$(cat /tmp/forgepods-server.pid)"
        kill "$old_pid" 2>/dev/null || true
        rm -f /tmp/forgepods-server.pid
      fi

      cd /home/coder/project || exit 1
      nohup node /home/coder/project/server.js \
        >/tmp/forgepods-server.log 2>&1 &
      echo $! >/tmp/forgepods-server.pid`,
    ]);

    // Wait until the server is actually accepting requests.
    for (let i = 0; i < 30; i++) {
      try {
        await execFileAsync("docker", [
          "exec",
          "forgepods-workspace",
          "node",
          "-e",
          `fetch("http://127.0.0.1:5000")
            .then(() => process.exit(0))
            .catch(() => process.exit(1))`,
        ]);

        return NextResponse.json({
          success: true,
          message: "Server started",
          previewUrl: "http://localhost:5000",
        });
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    const { stdout, stderr } = await execFileAsync("docker", [
      "exec",
      "forgepods-workspace",
      "sh",
      "-lc",
      "cat /tmp/forgepods-server.log 2>&1",
    ]).catch((error: { stdout?: string; stderr?: string }) => ({
      stdout: error.stdout ?? "",
      stderr: error.stderr ?? "",
    }));

    return NextResponse.json(
      {
        success: false,
        error: `Server did not become ready. ${stdout} ${stderr}`.trim(),
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("Failed to start workspace:", error);

    return NextResponse.json(
      { success: false, error: "Failed to start server.js" },
      { status: 500 }
    );
  }
}
