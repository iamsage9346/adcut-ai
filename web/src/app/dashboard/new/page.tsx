import { Header } from "@/components/header";
import { ensureClinic } from "@/lib/clinic";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { NewProjectForm } from "./new-project-form";

export default async function NewProject() {
  await connection(); // 요청마다 렌더 (세션 쿠키 의존)
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("세션을 만들지 못했습니다. 새로고침해 주세요.");
  const clinic = await ensureClinic(supabase, auth.user.id);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-bold">새 영상</h1>
        <p className="mt-1 text-sm text-zinc-500">촬영 영상과 그 영상의 대본을 올려주세요. 대본에 있는 문장만 남기고 나머지는 잘라냅니다.</p>
        <NewProjectForm clinicId={clinic.id} userId={auth.user.id} />
      </main>
    </>
  );
}
