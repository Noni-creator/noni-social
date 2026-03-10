"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, PlusSquare, Users, User } from "lucide-react";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "DMs", href: "/dms", icon: MessageSquare },
  { name: "Studio", href: "/studio", icon: PlusSquare },
  { name: "Groups", href: "/groups", icon: Users },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-white/10 bg-black/80 backdrop-blur-lg md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive ? "text-accent" : "text-gray-400 hover:text-white"
              }`}
            >
              <Icon size={24} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop Sidebar */}
      <nav className="fixed left-0 top-0 hidden h-full w-20 flex-col items-center border-r border-white/10 bg-black py-8 md:flex lg:w-64 lg:items-start lg:px-6">
        <Link href="/" className="mb-10 flex items-center space-x-2 lg:px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white font-bold">
            N
          </div>
          <span className="hidden text-xl font-bold tracking-tight lg:block">Noni Social</span>
        </Link>
        <div className="flex w-full flex-col space-y-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-4 rounded-xl p-3 transition-all ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={24} className={isActive ? "scale-110" : ""} />
                <span className={`hidden font-medium lg:block ${isActive ? "font-bold" : ""}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
