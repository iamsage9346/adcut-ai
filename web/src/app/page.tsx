import Link from "next/link";
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">병원 전용</span>
      <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
        원장님이 찍기만 하면,<br />숏폼은 자동으로 완성됩니다
      </h1>
      <p className="mt-6 max-w-xl text-lg text-zinc-600">
        대본과 영상을 올리면 NG·침묵 구간을 잘라내고 병원 브랜드 자막을 입힙니다.
        의료광고법 위반 표현은 자동으로 잡아냅니다.
      </p>
      <div className="mt-10 flex gap-3">
        <Link href="/dashboard" className="rounded-lg bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-700">
          바로 시작하기
        </Link>
      </div>
      <ul className="mt-16 grid max-w-3xl gap-6 text-left sm:grid-cols-3">
        {[
          ["대본 기준 자동 컷", "말 더듬은 곳, 재촬영, 긴 침묵을 대본과 대조해 잘라냅니다."],
          ["브랜드 자막", "병원별 폰트·색상 템플릿으로 자막을 입힙니다."],
          ["의료광고법 검수", "'100%', '효과 보장' 같은 표현을 발행 전에 경고합니다."],
        ].map(([t, d]) => (
          <li key={t} className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="font-semibold">{t}</p>
            <p className="mt-2 text-sm text-zinc-600">{d}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
