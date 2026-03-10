import { Users } from "lucide-react";

export default function GroupsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
      <Users size={64} className="text-purple-500" />
      <h1 className="text-4xl font-black tracking-tight">GROUPS</h1>
      <p className="text-gray-400 text-lg">Hang out with your squad 🫂</p>
    </div>
  );
}
