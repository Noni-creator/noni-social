import { PlusSquare, Film, Type, Tag } from "lucide-react";
import { createReel } from "@/lib/actions";

export default function StudioPage() {
  return (
    <div className="max-w-md mx-auto py-10">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="bg-accent/20 p-4 rounded-full mb-4">
          <PlusSquare size={48} className="text-accent" />
        </div>
        <h1 className="text-3xl font-black italic tracking-tight">STUDIO</h1>
        <p className="text-gray-400">Share your next viral moment</p>
      </div>

      <form action={createReel} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold flex items-center gap-2">
            <Film size={16} /> VIDEO URL
          </label>
          <input
            name="videoUrl"
            type="url"
            placeholder="https://example.com/video.mp4"
            required
            className="w-full bg-nav border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold flex items-center gap-2">
            <Type size={16} /> CAPTION
          </label>
          <textarea
            name="caption"
            placeholder="What's happening?"
            className="w-full bg-nav border border-white/10 rounded-xl px-4 py-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold flex items-center gap-2">
            <Tag size={16} /> CATEGORY
          </label>
          <select
            name="type"
            required
            className="w-full bg-nav border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all appearance-none"
          >
            <option value="FRIENDSHIP">Friendship (6-15s)</option>
            <option value="FUNNY">Funny (6s joke)</option>
            <option value="MUSIC">Music (MTV Style)</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-accent hover:bg-accent/90 text-white font-black py-4 rounded-xl shadow-lg shadow-accent/20 transition-all transform active:scale-95"
        >
          POST REEL
        </button>
      </form>
    </div>
  );
}
