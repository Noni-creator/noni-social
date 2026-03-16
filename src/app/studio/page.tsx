import { db } from "@/lib/db";
import StudioRecorder from "@/components/StudioRecorder";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const songs = await db.song.findMany({
    orderBy: {
      created_at: "desc",
    },
  });

  return (
    <div className="w-full flex items-center justify-center bg-black min-h-screen py-4">
      <div className="w-full max-w-md mx-auto">
        <StudioRecorder songs={songs} />
      </div>
    </div>
  );
}
