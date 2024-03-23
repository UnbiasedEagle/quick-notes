import { postData } from '@/actions';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import prisma from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { unstable_noStore as noStore } from 'next/cache';

const getUserData = async (userId: string) => {
  noStore();

  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      colorScheme: true,
    },
  });

  return data;
};

const SettingsPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const userData = await getUserData(user?.id!);

  return (
    <div className='grid items-start gap-8'>
      <div className='flex items-center justify-between px-2'>
        <div className='grid gap-1'>
          <h1 className='text-3xl md:text-4xl'>Settings</h1>
          <p className='text-lg text-muted-foreground'>Your profile settings</p>
        </div>
      </div>
      <Card>
        <form action={postData.bind(null, user?.id!)}>
          <CardHeader>
            <CardTitle>General Data</CardTitle>
            <CardDescription>
              Please provide general information about yourself. Please
              don&apos;t forget to save.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-y-2'>
              <div className='space-y-1'>
                <Label>Your Name</Label>
                <Input
                  name='name'
                  type='text'
                  id='name'
                  placeholder='Your Name'
                  defaultValue={userData?.name || ''}
                />
              </div>
              <div className='space-y-1'>
                <Label>Your Email</Label>
                <Input
                  name='email'
                  type='email'
                  id='email'
                  placeholder='Your Email'
                  defaultValue={userData?.email}
                  disabled
                />
              </div>
              <div className='space-y-1'>
                <Label>Color Scheme</Label>
                <Select defaultValue={userData?.colorScheme} name='color'>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select a color' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Color</SelectLabel>
                      <SelectItem value='theme-green'>Green</SelectItem>
                      <SelectItem value='theme-blue'>Blue</SelectItem>
                      <SelectItem value='theme-violet'>Violet</SelectItem>
                      <SelectItem value='theme-yellow'>Yellow</SelectItem>
                      <SelectItem value='theme-orange'>Orange</SelectItem>
                      <SelectItem value='theme-red'>Red</SelectItem>
                      <SelectItem value='theme-rose'>Rose</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SettingsPage;
