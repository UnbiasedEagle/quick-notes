import { editNote } from '@/actions';
import SubmitButton from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import prisma from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';

interface EditNotePageProps {
  params: {
    id: string;
  };
}

const getNote = async (userId: string, noteId: string) => {
  noStore();

  const note = await prisma.note.findUnique({
    where: {
      userId,
      id: noteId,
    },
    select: {
      title: true,
      description: true,
      id: true,
    },
  });

  return note;
};

const EditNotePage = async ({ params: { id } }: EditNotePageProps) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const note = await getNote(user?.id as string, id);

  if (!note) {
    return notFound();
  }

  return (
    <Card>
      <form action={editNote.bind(null, user?.id!, note.id)}>
        <CardHeader>
          <CardTitle>New Note</CardTitle>
          <CardDescription>
            Right here you can now create your new notes
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-y-5'>
          <div className='gap-y-2 flex flex-col'>
            <Label>Title</Label>
            <Input
              required
              type='text'
              name='title'
              placeholder='Title for your note'
              defaultValue={note.title}
            />
          </div>

          <div className='flex flex-col gap-y-2'>
            <Label>Description</Label>
            <Textarea
              name='description'
              placeholder='Describe your note as you want'
              required
              defaultValue={note.description}
            />
          </div>
        </CardContent>

        <CardFooter className='flex justify-between'>
          <Button asChild variant='destructive'>
            <Link href='/dashboard'>Cancel</Link>
          </Button>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
};

export default EditNotePage;
