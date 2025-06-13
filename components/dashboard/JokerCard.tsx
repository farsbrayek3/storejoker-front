import Image from "next/image";

export function JokerCard() {
  return (
    <div className="rounded-xl bg-[#18141c] p-4 shadow border border-[#231b2a] flex items-center gap-3 mt-2">
      <Image
        src="/joker.png"
        alt="JOKER"
        width={48}
        height={48}
        className="h-12 w-12 rounded-lg object-cover"
        style={{ background: "#222" }}
      />
      <div>
        <div className="text-green-400 font-bold text-lg leading-tight">
          JOKER
        </div>
        <div className="text-[#aaa] text-xs">Clown Prince of Crime</div>
      </div>
    </div>
  );
}
