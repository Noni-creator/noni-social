import { User as UserIcon } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/");
  }

  const user = await db.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <h1 className="text-2xl font-bold">User Not Found</h1>
        <p className="text-gray-400">Please try logging in again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
      <div className="relative">
        <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-accent to-accent-blue p-1">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-black overflow-hidden relative">
            {user.avatar_url ? (
               <Image 
                src={user.avatar_url} 
                alt={user.username} 
                fill 
                className="object-cover"
               />
            ) : (
                <UserIcon size={64} className="text-gray-400" />
            )}
          </div>
        </div>
        <div className="absolute bottom-1 right-1 h-8 w-8 rounded-full border-4 border-black bg-green-500"></div>
      </div>
      <h1 className="text-4xl font-black tracking-tight tracking-widest uppercase italic">
        {user.username}
      </h1>
      <div className="flex flex-col items-center space-y-1">
        <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Social Score</span>
        <div className="text-6xl font-black text-accent drop-shadow-[0_0_15px_rgba(255,0,80,0.5)]">
            {user.social_score}
        </div>
      </div>
      <p className="text-gray-400 text-lg mt-4">Leveling up the social game 🚀</p>
    </div>
  );
}
