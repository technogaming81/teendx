'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthActions } from "@convex-dev/auth/react";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Clients',
    href: '/dashboard/clients',
  },
  {
    title: 'Invoices',
    href: '/dashboard/invoices',
  },
  {
    title: 'Expenses',
    href: '/dashboard/expenses',
  },
  {
    title: 'Projects',
    href: '/dashboard/projects',
  },
  {
    title: 'Community',
    href: '/dashboard/community',
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthActions();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/dashboard" className="font-bold text-xl mr-8">
          Teendx
        </Link>
        <nav className="flex items-center space-x-4 lg:space-x-6 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <Button variant="ghost" onClick={handleSignOut}>
          Log out
        </Button>
      </div>
    </div>
  );
}
