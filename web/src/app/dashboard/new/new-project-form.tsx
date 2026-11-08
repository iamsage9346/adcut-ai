"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function NewProjectForm({ clinicId, userId }: { clinicId: string; userId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [script, setScript] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setError("영상 파일을 선택하세요.");
    setError(null);
    const supabase = createClient();

    setProgress("영상 업로드 중…");
    const ext = file.name.split(".").pop() ?? "mp4";
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("videos").upload(path, file, { contentType: file.type });
    if (upErr) { setProgress(null); return setError(`업로드 실패: ${upErr.message}`); }

    setProgress("프로젝트 저장 중…");
    const { error: dbErr } = await supabase.from("projects").insert({
      clinic_id: clinicId, title, script_text: script, source_video_path: path, status: "uploaded",
    });
    if (dbErr) { setProgress(null); return setError(`저장 실패: ${dbErr.message}`); }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-6 rounded-2xl border border-zinc-200 bg-white p-8">
      <label className="block text-sm font-medium">
        제목
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 리쥬란 오해 3가지"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
      </label>
      <label className="block text-sm font-medium">
        대본
        <textarea required rows={8} value={script} onChange={(e) => setScript(e.target.value)}
          placeholder={"문장 단위로 줄바꿈해 주세요.\n안녕하세요, 강남 OO피부과 원장입니다.\n오늘은 리쥬란에 대한 오해 세 가지를 풀어드릴게요."}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
      </label>
      <label className="block text-sm font-medium">
        영상 파일
        <input type="file" accept="video/*" required onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-1 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-semibold" />
        {file && <p className="mt-1 text-xs text-zinc-500">{file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB</p>}
      </label>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button disabled={!!progress} className="w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
        {progress ?? "업로드하고 편집 시작"}
      </button>
    </form>
  );
}
