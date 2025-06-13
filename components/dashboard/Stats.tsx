function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-[#18141c] rounded-xl p-8 shadow border border-[#231b2a] min-w-[170px]">
      <h3 className="text-[#aaa] mb-2 text-base font-medium">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

export function Stats() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <StatCard title="Total Users" value="1,245" />
      <StatCard title="New Sessions" value="567" />
      <StatCard title="Revenue" value="$4,320" />
    </div>
  );
}
