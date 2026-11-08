import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="font-bold">adcut AI</Link>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">체험 모드</span>
      </div>
    </header>
  );
}
