type Item = { id: number; text: string; ago: string };

const activity: Item[] = [
  { id: 1, text: "Alice added a new post", ago: "1 mo ago" },
  { id: 2, text: "Bob updated his profile", ago: "3 hours ago" },
  { id: 3, text: "You know i’m an agent of chaos", ago: "3 hours ago" },
];

export function Activity() {
  return (
    <section className="rounded-xl bg-[#18141c] p-6 shadow border border-[#231b2a] space-y-4">
      <h3 className="text-white text-lg font-semibold mb-2">Recent Activity</h3>
      <ul className="space-y-3">
        {activity.map(({ id, text, ago }) => (
          <li key={id} className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#38E54D]" />
            <p className="flex-1 text-white">{text}</p>
            <span className="text-sm text-[#8e8e8e] whitespace-nowrap">
              {ago}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
