export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="h-8 w-48 animate-pulse rounded bg-zinc-200" />
      <div className="mt-8 h-40 animate-pulse rounded-2xl bg-zinc-200" />
    </div>
  );
}
