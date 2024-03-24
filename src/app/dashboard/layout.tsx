import { DashboardNav } from '@/components/dashboard-nav';
import { PropsWithChildren } from 'react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/dist/types';
import prisma from '@/lib/db';
import { unstable_noStore as noStore } from 'next/cache';

const createFirstTimeUser = async (user: KindeUser) => {
  noStore();

  const dbUser = await prisma.user.findUnique({
    where: { kindeUserId: user.id },
  });

  if (!dbUser) {
    await prisma.user.create({
      data: {
        kindeUserId: user.id,
        name: `${user.given_name} ${user.family_name}`,
        email: user.email || '',
      },
    });
  }
};

const DasboardLayout = async ({ children }: PropsWithChildren) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect('/');
  }

  await createFirstTimeUser(user);

  return (
    <div className='flex flex-col space-y-6 mt-10'>
      <div className='container grid flex-1 gap-12 md:grid-cols-[200px_1fr]'>
        <aside className='hidden w-[200px] flex-col md:flex'>
          <DashboardNav />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default DasboardLayout;
