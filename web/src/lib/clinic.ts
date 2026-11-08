import type { SupabaseClient } from "@supabase/supabase-js";

/** 현재 세션(익명 포함)의 병원 레코드를 가져오고, 없으면 하나 만든다. */
export async function ensureClinic(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase.from("clinics").select("id,name,specialty").eq("owner_id", userId).limit(1).maybeSingle();
  if (data) return data;
  const { data: created, error } = await supabase
    .from("clinics")
    .insert({ owner_id: userId, name: "내 병원", specialty: null })
    .select("id,name,specialty")
    .single();
  if (error) throw error;
  return created;
}
