import { MessageSquare } from "lucide-react";

export default function DMsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
      <MessageSquare size={64} className="text-accent-blue" />
      <h1 className="text-4xl font-black tracking-tight">MESSAGES</h1>
      <p className="text-gray-400 text-lg">Your private world starts here 💌</p>
    </div>
  );
}
