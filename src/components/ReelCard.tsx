import { User } from "@prisma/client";
import { Music, Smile, Users, Heart } from "lucide-react";
import Image from "next/image";

interface ReelCardProps {
  reel: {
    id: string;
    video_url: string;
    caption: string | null;
    type: string;
    user: {
      username: string;
      avatar_url: string | null;
    };
  };
}

export default function ReelCard({ reel }: ReelCardProps) {
  const getIcon = () => {
    switch (reel.type) {
      case "MUSIC": return <Music size={14} />;
      case "FUNNY": return <Smile size={14} />;
      case "FRIENDSHIP": return <Users size={14} />;
      default: return null;
    }
  };

  return (
    <div className="relative h-[80vh] w-full max-w-[450px] mx-auto bg-nav rounded-3xl overflow-hidden shadow-2xl snap-start mb-8 transition-transform hover:scale-[1.01]">
      {/* Video Player Placeholder / Simple Video tag */}
      <video 
        src={reel.video_url} 
        className="h-full w-full object-cover"
        autoPlay 
        muted 
        loop 
        playsInline
      />

      {/* Overlays */}
      <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end space-y-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full border-2 border-accent overflow-hidden relative">
            {reel.user.avatar_url ? (
              <Image src={reel.user.avatar_url} alt={reel.user.username} fill className="object-cover" />
            ) : (
              <div className="bg-gray-800 h-full w-full flex items-center justify-center">
                <Heart size={16} className="text-accent" />
              </div>
            )}
          </div>
          <span className="font-bold text-lg drop-shadow-md">@{reel.user.username}</span>
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 bg-accent/20 text-accent text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md backdrop-blur-sm border border-accent/20">
            {getIcon()} {reel.type}
          </span>
          <p className="text-white text-sm leading-relaxed drop-shadow-sm font-medium">
            {reel.caption}
          </p>
        </div>
      </div>
    </div>
  );
}
