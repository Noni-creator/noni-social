"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, Music, MessageCircle, Share2, Disc } from "lucide-react";

export default function ReelItem({ reel }: { reel: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(reel._count?.likes || 0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {});
            setIsPlaying(true);
          } else {
            videoRef.current?.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.6 } // More aggressive snapping/play
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full h-[100dvh] bg-black overflow-hidden flex flex-col justify-center snap-start snap-always">
      {/* Video Background */}
      <video
        ref={videoRef}
        src={reel.video_url}
        loop
        playsInline
        muted={isMuted}
        className="w-full h-full object-cover cursor-pointer"
        onClick={togglePlay}
        onLoadedData={() => {
          // Play if already in view when loaded
          if (isPlaying) videoRef.current?.play().catch(() => {});
        }}
      />

      {/* Centered Play/Mute Indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="bg-black/30 backdrop-blur-md p-6 rounded-full animate-in zoom-in duration-200">
            <Heart size={64} className="text-white opacity-40" />
          </div>
        </div>
      )}

      {/* Mute Indicator Button */}
      <div className="absolute top-6 right-6 z-30">
        <button 
          onClick={toggleMute}
          className="bg-black/20 backdrop-blur-md p-3 rounded-full border border-white/10 text-white transition active:scale-90"
        >
          {isMuted ? <Music size={20} className="text-white/40" /> : <Music size={20} className="text-accent animate-pulse" />}
        </button>
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-28 flex flex-col gap-7 items-center z-30">
        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={toggleLike}
            className={`w-14 h-14 rounded-full flex items-center justify-center bg-black/20 backdrop-blur-xl border border-white/10 transition-all active:scale-75 ${liked ? 'text-accent shadow-[0_0_20px_rgba(255,0,80,0.4)]' : 'text-white'}`}
          >
            <Heart size={32} fill={liked ? "currentColor" : "none"} strokeWidth={liked ? 0 : 2} />
          </button>
          <span className="text-[13px] text-white font-black drop-shadow-lg">{likesCount.toLocaleString()}</span>
        </div>

        <div className="flex flex-col items-center gap-1 cursor-pointer active:scale-90 transition">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-black/20 backdrop-blur-xl border border-white/10">
            <MessageCircle size={32} className="text-white" />
          </div>
          <span className="text-[13px] text-white font-black drop-shadow-lg">0</span>
        </div>

        <div className="flex flex-col items-center gap-1 cursor-pointer active:scale-90 transition">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-black/20 backdrop-blur-xl border border-white/10">
            <Share2 size={28} className="text-white" />
          </div>
          <span className="text-[13px] text-white font-black drop-shadow-lg uppercase tracking-wider text-[10px]">Share</span>
        </div>

        {/* Spinning Disc (Song Icon) */}
        <div className="mt-2 relative">
          <div className="absolute -inset-1 bg-gradient-to-tr from-accent to-purple-600 rounded-full blur-sm opacity-50 animate-pulse"></div>
          <div className={`w-14 h-14 rounded-full bg-zinc-900 border-[3px] border-zinc-700/50 flex items-center justify-center overflow-hidden animate-spin-slow shadow-2xl relative z-10`}>
            {reel.song?.cover_image ? (
                <img src={reel.song.cover_image} className="w-full h-full object-cover" alt="song cover" />
            ) : (
                <Music size={24} className="text-white/40" />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Info Section */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-24 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-32 z-20 pointer-events-none">
        <div className="flex flex-col gap-4 pointer-events-auto max-w-[80%]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden bg-accent/20 flex items-center justify-center font-black italic text-lg shadow-lg">
                {reel.user?.avatar_url ? <img src={reel.user.avatar_url} className="w-full h-full object-cover" /> : reel.user?.username?.[0].toUpperCase()}
            </div>
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <h3 className="text-white font-black text-xl tracking-tight hover:underline cursor-pointer drop-shadow-md">
                    @{reel.user?.username || "anonymous"}
                    </h3>
                    <button className="bg-white text-black font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-tighter shadow-xl active:scale-95 transition">Follow</button>
                </div>
            </div>
          </div>
          
          {reel.caption && (
            <p className="text-white text-[15px] line-clamp-2 opacity-95 leading-relaxed drop-shadow-md font-medium">
              {reel.caption}
            </p>
          )}

          {/* Song Ticker */}
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-full px-4 py-2 self-start border border-white/5">
            <Music size={14} className="text-accent animate-bounce" />
            <div className="overflow-hidden w-40">
              <p className="text-white text-[11px] font-black uppercase tracking-widest whitespace-nowrap animate-marquee">
                {reel.song ? `${reel.song.title} - ${reel.song.artist}` : "Original Sound"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 10s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
