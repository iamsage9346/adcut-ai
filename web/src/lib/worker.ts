import { env } from "./env";

export type JobState = "PENDING" | "STARTED" | "PROGRESS" | "SUCCESS" | "FAILURE";

export async function createJob(body: { video_path: string; script_text: string; output_path: string }) {
  const res = await fetch(`${env.WORKER_URL}/jobs`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`worker error ${res.status}`);
  return (await res.json()) as { job_id: string };
}

export async function getJob(jobId: string) {
  const res = await fetch(`${env.WORKER_URL}/jobs/${jobId}`, { cache: "no-store" });
  return (await res.json()) as { job_id: string; state: JobState; info: unknown };
}
