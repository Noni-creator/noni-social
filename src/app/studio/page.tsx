import { PlusSquare } from "lucide-react";

export default function StudioPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4 text-center">
      <PlusSquare size={64} className="text-accent animate-spin-slow" />
      <h1 className="text-4xl font-black tracking-tight">STUDIO</h1>
      <p className="text-gray-400 text-lg max-w-md">
        Create the next viral hit with AR filters and music! 🎵🔥
      </p>
    </div>
  );
}
