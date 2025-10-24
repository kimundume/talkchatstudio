import MainLayout from '@/components/layout/MainLayout';
import { Logo } from '@/components/shared/Logo';
import { UserMenu } from '@/components/layout/UserMenu';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { getCurrentUser } from '@/lib/auth/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Conversations', href: '/conversations', icon: 'MessageCircle' },
  { name: 'Chatbots', href: '/chatbots', icon: 'Bot' },
  { name: 'Triggers', href: '/triggers', icon: 'Zap' },
  { name: 'Team', href: '/team', icon: 'Users' },
  { name: 'Settings', href: '/settings', icon: 'Settings' },
];

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <MainLayout>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar - Always Visible */}
        <aside className="flex w-64 border-r bg-card flex-shrink-0">
          <div className="flex h-full flex-col w-full">
            <div className="flex h-16 items-center border-b px-6">
              <Logo size="sm" showText href="/dashboard" />
            </div>
            <SidebarNav items={navigation} />
          </div>
        </aside>
        
        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 items-center justify-end border-b bg-card px-6">
            <div className="flex items-center space-x-4">
              {user && <UserMenu user={user} />}
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </MainLayout>
  );
}
