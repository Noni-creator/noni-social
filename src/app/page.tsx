import { Home } from "lucide-react";

export default function FeedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
      <Home size={64} className="text-accent animate-pulse" />
      <h1 className="text-4xl font-black tracking-tight italic">FEED</h1>
      <p className="text-gray-400 text-lg">Swipe up for infinite fun ✨</p>
    </div>
  );
}
