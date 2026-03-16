"use client";

import { useEffect, useRef, useState } from "react";
import ReelItem from "./ReelItem";

interface Song {
  id: string;
  title: string;
  artist: string;
  audio_url: string;
  cover_image: string | null;
}

interface User {
  username: string;
  avatar_url: string | null;
}

interface Reel {
  id: string;
  video_url: string;
  caption: string | null;
  user: User;
  song: Song | null;
  _count: {
    likes: number;
  };
}

export default function ReelFeed({ reels }: { reels: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && reels.length > 0) {
          // Loop back to top
          containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [reels.length]);

  return (
    <div 
      ref={containerRef}
      className="h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory bg-black scrollbar-hide overscroll-contain"
    >
      {reels.map((reel) => (
        <ReelItem key={reel.id} reel={reel} />
      ))}
      
      {/* Sentinel for Looping */}
      <div ref={sentinelRef} className="h-10 w-full snap-start" />
      
      {reels.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-white/40">
          <p className="text-xl font-bold">No reels yet.</p>
          <p className="text-sm">Be the first to post something!</p>
        </div>
      )}
    </div>
  );
}
