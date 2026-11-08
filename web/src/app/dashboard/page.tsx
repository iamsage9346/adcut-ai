import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { ensureClinic } from "@/lib/clinic";
import { createClient } from "@/lib/supabase/server";

const STATUS: Record<string, string> = {
  draft: "초안", uploaded: "업로드됨", processing: "편집 중", done: "완료", failed: "실패",
};

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?mode=signin");

  const clinic = await ensureClinic(supabase, auth.user.id, auth.user.email ?? "");
  const { data: projects } = await supabase
    .from("projects")
    .select("id,title,status,created_at")
    .eq("clinic_id", clinic.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <Header email={auth.user.email ?? ""} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{clinic.name}</h1>
            <p className="mt-1 text-sm text-zinc-500">영상 프로젝트 {projects?.length ?? 0}개</p>
          </div>
          <Link href="/dashboard/new" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700">
            + 새 영상
          </Link>
        </div>

        {!projects?.length ? (
          <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white p-16 text-center">
            <p className="font-semibold">아직 프로젝트가 없습니다</p>
            <p className="mt-2 text-sm text-zinc-500">촬영한 영상과 대본을 올리면 자동 편집이 시작됩니다.</p>
            <Link href="/dashboard/new" className="mt-6 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
              첫 영상 올리기
            </Link>
          </div>
        ) : (
          <ul className="mt-8 divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            {projects.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-xs text-zinc-500">{new Date(p.created_at).toLocaleString("ko-KR")}</p>
                </div>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold">{STATUS[p.status] ?? p.status}</span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
