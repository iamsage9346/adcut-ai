import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { ensureClinic } from "@/lib/clinic";
import { createClient } from "@/lib/supabase/server";
import { NewProjectForm } from "./new-project-form";

export default async function NewProject() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?mode=signin");
  const clinic = await ensureClinic(supabase, auth.user.id, auth.user.email ?? "");

  return (
    <>
      <Header email={auth.user.email ?? ""} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-bold">새 영상</h1>
        <p className="mt-1 text-sm text-zinc-500">촬영 영상과 그 영상의 대본을 올려주세요. 대본에 있는 문장만 남기고 나머지는 잘라냅니다.</p>
        <NewProjectForm clinicId={clinic.id} userId={auth.user.id} />
      </main>
    </>
  );
}
