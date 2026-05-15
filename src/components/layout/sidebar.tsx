"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Video,
  FileText,
  Globe,
  Send,
  Gamepad2,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "YouTube Import", href: "/youtube", icon: Video },
  { name: "Articles", href: "/articles", icon: FileText },
  { name: "Sites", href: "/sites", icon: Globe },
  { name: "Publish", href: "/publish", icon: Send },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-gaming-bg border-r border-gaming-border flex flex-col shrink-0">
      <div className="p-5 border-b border-gaming-border">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gaming-red flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">
              GameGuide
            </h1>
            <p className="text-[10px] text-muted-foreground leading-tight">
              CMS Platform
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                isActive
                  ? "bg-gaming-red/15 text-gaming-red font-medium"
                  : "text-muted-foreground hover:text-white hover:bg-white/[0.04]"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gaming-border">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
          AI-Powered
        </div>
        <p className="text-xs text-muted-foreground">
          Multi-site gaming CMS
        </p>
      </div>
    </aside>
  );
}