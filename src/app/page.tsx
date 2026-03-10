import { db } from "@/lib/db";
import ReelCard from "@/components/ReelCard";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const reels = await db.reel.findMany({
    include: {
      user: {
        select: {
          username: true,
          avatar_url: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto h-[calc(100vh-120px)] overflow-y-auto snap-y snap-mandatory scrollbar-hide py-4">
      {reels.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
          <div className="text-6xl animate-bounce">🎬</div>
          <h1 className="text-3xl font-black italic">NO REELS YET</h1>
          <p className="text-gray-400 max-w-xs">Be the first to post a viral moment in the Studio! 🚀</p>
        </div>
      ) : (
        reels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} />
        ))
      )}
    </div>
  );
}
