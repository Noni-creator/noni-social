import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900/50 p-8 rounded-[2rem] border border-white/5 backdrop-blur-xl">
        <div className="flex flex-col items-center mb-8">
            <h1 className="text-4xl font-black italic tracking-tighter text-white mb-2">NONI</h1>
            <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Welcome back, friend</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: "bg-white text-black hover:bg-gray-200 transition text-sm font-black uppercase tracking-widest py-3",
              card: "bg-transparent shadow-none border-none p-0",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "bg-white/5 border-white/5 text-white hover:bg-white/10 transition",
              socialButtonsBlockButtonText: "text-white font-bold",
              formFieldLabel: "text-white/60 font-black uppercase tracking-widest text-[10px]",
              formFieldInput: "bg-white/5 border-white/5 text-white rounded-xl py-3 focus:ring-accent",
              footerActionLink: "text-accent font-bold",
              footerActionText: "text-white/40",
              identityPreviewText: "text-white",
              identityPreviewEditButtonIcon: "text-white",
              formFieldInputShowPasswordButton: "text-white/40"
            }
          }}
        />
      </div>
    </div>
  );
}
