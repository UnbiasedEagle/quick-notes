import { createNote } from '@/actions';
import SubmitButton from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { unstable_noStore as noStore } from 'next/cache';

const NewNotePage = async () => {
  noStore();

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <Card>
      <form action={createNote.bind(null, user?.id as string)}>
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
            />
          </div>

          <div className='flex flex-col gap-y-2'>
            <Label>Description</Label>
            <Textarea
              name='description'
              placeholder='Describe your note as you want'
              required
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

export default NewNotePage;
