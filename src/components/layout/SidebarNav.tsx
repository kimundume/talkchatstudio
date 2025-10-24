'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Bot, Settings, LayoutDashboard, Users, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

type NavigationItem = {
  name: string;
  href: string;
  icon: string;
};

// Map icon names to components
const iconMap = {
  LayoutDashboard,
  MessageCircle,
  Bot,
  Zap,
  Users,
  Settings,
};

export function SidebarNav({ items }: { items: NavigationItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 p-4">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        const Icon = iconMap[item.icon as keyof typeof iconMap];
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
