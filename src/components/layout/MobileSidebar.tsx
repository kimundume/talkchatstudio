'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { SidebarNav } from './SidebarNav';
import { Button } from '@/components/ui/button';

type NavigationItem = {
  name: string;
  href: string;
  icon: string;
};

export function MobileSidebar({ items }: { items: NavigationItem[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r z-50 md:hidden">
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center justify-between border-b px-6">
                <Logo size="sm" showText href="/dashboard" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div onClick={() => setIsOpen(false)}>
                <SidebarNav items={items} />
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
