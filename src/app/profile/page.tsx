import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
      <div className="relative">
        <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-accent to-accent-blue p-1">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-black">
            <User size={64} className="text-gray-400" />
          </div>
        </div>
        <div className="absolute bottom-1 right-1 h-8 w-8 rounded-full border-4 border-black bg-green-500"></div>
      </div>
      <h1 className="text-4xl font-black tracking-tight tracking-widest uppercase">PROFILE</h1>
      <p className="text-gray-400 text-lg">Your social score is waiting... 🚀</p>
    </div>
  );
}
