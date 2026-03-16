"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, PlusSquare, Users, User } from "lucide-react";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "DMs", href: "/dms", icon: MessageSquare },
  { name: "Studio", href: "/studio", icon: PlusSquare },
  { name: "Groups", href: "/groups", icon: Users },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isLoaded, userId } = useAuth();

  const isSignedIn = isLoaded && userId;

  return (
    <>
      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] flex h-20 items-center justify-around bg-gradient-to-t from-black via-black/80 to-transparent px-4 md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 transition-all active:scale-90 ${
                isActive ? "text-white" : "text-white/40 hover:text-white"
              }`}
            >
              <div className="relative">
                <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>}
              </div>
            </Link>
          );
        })}
        <div className="flex flex-col items-center justify-center">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className="text-white/40 hover:text-white transition-all active:scale-90">
                <User size={26} />
              </button>
            </SignInButton>
          ) : (
            <div className="border-2 border-white/20 rounded-full p-0.5 active:scale-90 transition-all">
              <UserButton appearance={{ elements: { userButtonAvatarBox: "w-7 h-7" } }} />
            </div>
          )}
        </div>
      </nav>

      {/* Desktop Sidebar (TikTok Style) */}
      <nav className="fixed left-0 top-0 hidden h-full w-20 flex-col items-center bg-black/50 backdrop-blur-xl border-r border-white/5 py-8 md:flex lg:w-64 lg:items-start lg:px-6 z-[100]">
        <Link href="/" className="mb-12 flex items-center space-x-3 lg:px-2 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black font-black italic text-xl group-hover:rotate-6 transition-transform">
            N
          </div>
          <span className="hidden text-2xl font-black italic tracking-tighter lg:block">NONI</span>
        </Link>
        
        <div className="flex w-full flex-col space-y-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-4 rounded-2xl p-3.5 transition-all active:scale-95 ${
                  isActive
                    ? "text-white"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={28} strokeWidth={isActive ? 3 : 2} className={isActive ? "text-accent" : ""} />
                <span className={`hidden text-lg font-black lg:block ${isActive ? "" : "opacity-80"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
          
          <div className="mt-auto lg:px-2 pt-8 border-t border-white/5 w-full">
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <button className="flex items-center space-x-4 w-full rounded-2xl p-3.5 text-white/40 hover:bg-white/5 hover:text-white transition-all active:scale-95">
                  <User size={28} />
                  <span className="hidden lg:block font-black text-lg">Sign In</span>
                </button>
              </SignInButton>
            ) : (
              <div className="flex items-center space-x-4 w-full p-3.5 group cursor-pointer hover:bg-white/5 rounded-2xl transition-all">
                <div className="border-2 border-white/10 rounded-full p-0.5">
                    <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
                </div>
                <span className="hidden lg:block font-black text-lg text-white/40 group-hover:text-white transition-colors">Profile</span>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
