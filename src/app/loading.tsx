export default function Loading() {
  return (
    <main className="min-h-screen bg-ink-950 px-6 py-10 text-pearl">
      <div className="mx-auto max-w-7xl animate-pulse space-y-8">
        <div className="h-14 w-48 rounded-full bg-white/10" />
        <div className="h-[64vh] rounded-[2rem] bg-white/10" />
        <div className="grid gap-5 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-80 rounded-2xl bg-white/10" />
          ))}
        </div>
      </div>
    </main>
  );
}
