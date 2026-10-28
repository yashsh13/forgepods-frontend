
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
        pid="$(cat /tmp/forgepods-server.pid)"
        kill "$pid" 2>/dev/null || true
        rm -f /tmp/forgepods-server.pid
      fi`,
    ]);

    return NextResponse.json({
      success: true,
      message: "Server stopped",
    });
  } catch (error) {
    console.error("Failed to stop workspace:", error);

    return NextResponse.json(
      { success: false, error: "Failed to stop server.js" },
      { status: 500 }
    );
  }
}
