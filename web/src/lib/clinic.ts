import type { SupabaseClient } from "@supabase/supabase-js";

/** 로그인한 사용자의 병원 레코드를 가져오고, 없으면 기본값으로 하나 만든다. */
export async function ensureClinic(supabase: SupabaseClient, userId: string, email: string) {
  const { data } = await supabase.from("clinics").select("id,name,specialty").eq("owner_id", userId).limit(1).maybeSingle();
  if (data) return data;
  const { data: created, error } = await supabase
    .from("clinics")
    .insert({ owner_id: userId, name: `${email.split("@")[0]} 병원`, specialty: null })
    .select("id,name,specialty")
    .single();
  if (error) throw error;
  return created;
}
