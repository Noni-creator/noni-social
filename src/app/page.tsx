import { db } from "@/lib/db";
import ReelFeed from "@/components/ReelFeed";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const reels = await db.reel.findMany({
    orderBy: { created_at: "desc" },
    include: {
      user: true,
      song: true,
      _count: {
        select: { likes: true }
      }
    }
  });

  return (
    <main className="h-[100dvh] w-full bg-black overflow-hidden relative">
      <ReelFeed reels={reels} />
      
      {/* Top Navigation Overlay */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-center gap-6 z-50 pointer-events-none">
        <div className="flex gap-8 pointer-events-auto">
          <button className="text-white font-black text-lg drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] border-b-4 border-white pb-1 transition active:scale-95">For You</button>
          <button className="text-white/50 font-black text-lg drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] pb-1 transition hover:text-white active:scale-95">Following</button>
        </div>
      </div>
    </main>
  );
}
