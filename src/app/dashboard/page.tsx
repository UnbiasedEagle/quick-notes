import { deleteNote } from '@/actions';
import { TrashDelete } from '@/components/delete-note-button';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import prisma from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Edit, File } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';

const getUserData = async (userId: string) => {
  noStore();

  const user = await prisma.user.findUnique({
    where: {
      kindeUserId: userId,
    },
    select: {
      Note: {
        select: {
          title: true,
          createdAt: true,
          description: true,
          id: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      },
      Subscription: {
        select: {
          endDate: true,
        },
      },
    },
  });

  return user;
};

const DashboardPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const userData = await getUserData(user?.id!);

  if (!userData) {
    return redirect('/');
  }

  return (
    <div className='grid items-start gap-y-8'>
      <div className='flex items-center justify-between px-2'>
        <div className='grid gap-1'>
          <h1 className='text-3xl md:text-4xl'>Your Notes</h1>
          <p className='text-lg text-muted-foreground'>
            Here you can see and create new notes
          </p>
        </div>

        {userData?.Subscription &&
        new Date() < userData.Subscription.endDate ? (
          <Button asChild>
            <Link href='/dashboard/new'>Create a new Note</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href='/dashboard/billing'>Create a new Note</Link>
          </Button>
        )}
      </div>

      {userData.Note?.length === 0 ? (
        <div className='flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50'>
          <div className='flex h-20 w-20 items-center justify-center rounded-full bg-primary/10'>
            <File className='w-10 h-10 text-primary' />
          </div>

          <h2 className='mt-6 text-xl font-semibold'>
            You dont have any notes created
          </h2>
          <p className='mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto'>
            You currently dont have any notes. please create some so that you
            can see them right here.
          </p>
          {userData?.Subscription &&
          new Date() < userData.Subscription.endDate ? (
            <Button asChild>
              <Link href='/dashboard/new'>Create a new Note</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href='/dashboard/billing'>Create a new Note</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className='flex flex-col gap-y-4'>
          {userData.Note.map((item) => (
            <Card
              key={item.id}
              className='flex items-center justify-between p-4'
            >
              <div>
                <h2 className='font-semibold text-xl text-primary'>
                  {item.title}
                </h2>
                <p>
                  {new Intl.DateTimeFormat('en-US', {
                    dateStyle: 'full',
                  }).format(new Date(item.createdAt))}
                </p>
              </div>

              <div className='flex gap-x-4'>
                <Link href={`/dashboard/new/${item.id}`}>
                  <Button variant='outline' size='icon'>
                    <Edit className='w-4 h-4' />
                  </Button>
                </Link>
                <form
                  action={deleteNote.bind(null, user?.id as string, item.id)}
                >
                  <input type='hidden' name='noteId' value={item.id} />
                  <TrashDelete />
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
