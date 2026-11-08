import Link from "next/link";

export function Header({ email }: { email: string }) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="font-bold">adcut AI</Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-zinc-500">{email}</span>
          <form action="/auth/signout" method="post">
            <button className="rounded-lg border border-zinc-300 px-3 py-1.5 hover:bg-zinc-50">로그아웃</button>
          </form>
        </div>
      </div>
    </header>
  );
}
