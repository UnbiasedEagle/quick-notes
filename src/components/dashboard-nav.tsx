'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from './user-nav';

export const DashboardNav = () => {
  const pathname = usePathname();

  return (
    <nav className='grid items-start gap-2'>
      {navItems.map((navItem, idx) => {
        return (
          <Link href={navItem.href} key={idx}>
            <span
              className={cn(
                'group flex items-center rounded px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                pathname === navItem.href ? 'bg-accent' : 'bg-transparent'
              )}
            >
              <navItem.icon className='mr-2 w-4 h-4 text-primary' />
              <span>{navItem.name}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
