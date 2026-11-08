"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">(params.get("mode") === "signin" ? "signin" : "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const supabase = createClient();
    const { error, data } =
      mode === "signup"
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setMsg(error.message);
    if (mode === "signup" && !data.session) return setMsg("가입 확인 메일을 보냈습니다. 메일의 링크를 누른 뒤 로그인하세요.");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <h1 className="text-xl font-bold">{mode === "signup" ? "계정 만들기" : "로그인"}</h1>
      <label className="mt-6 block text-sm font-medium">
        이메일
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
      </label>
      <label className="mt-4 block text-sm font-medium">
        비밀번호
        <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
      </label>
      {msg && <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{msg}</p>}
      <button disabled={loading} className="mt-6 w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
        {loading ? "처리 중…" : mode === "signup" ? "가입하기" : "로그인"}
      </button>
      <button type="button" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
        className="mt-4 w-full text-center text-sm text-zinc-500 hover:text-zinc-900">
        {mode === "signup" ? "이미 계정이 있어요 → 로그인" : "계정이 없어요 → 가입"}
      </button>
    </form>
  );
}
