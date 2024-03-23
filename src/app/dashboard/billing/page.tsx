import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import Script from 'next/script';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import RazorpaySubscriptionButton from '@/components/razorpay-subscription-button';
import { unstable_noStore as noStore } from 'next/cache';

const featureItems = [
  {
    id: 1,
    name: 'Create new notes',
  },
  {
    id: 2,
    name: 'Read/view existing notes',
  },
  {
    id: 3,
    name: 'Update/edit notes',
  },
  {
    id: 4,
    name: 'Delete notes',
  },
];

const getSubscription = async (userId: string) => {
  noStore();

  const subscription = await prisma.subscription.findUnique({
    where: {
      userId,
    },
  });

  return subscription;
};

const BillingPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect('/');
  }

  const subscription = await getSubscription(user.id);

  if (subscription && new Date() < subscription.endDate) {
    return (
      <div>
        <Card>
          <CardHeader className='flex flex-row items-center gap-x-2'>
            <div className='shrink-0'>
              <CheckCircle2 className='h-6 w-6 text-green-500' />
            </div>{' '}
            You&apos;re subscribed to the Pro Plan.
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Script
        id='razorpay-checkout-js'
        src='https://checkout.razorpay.com/v1/checkout.js'
      />
      <div className='max-w-md mx-auto space-y-4'>
        <Card className='flex flex-col'>
          <CardContent className='py-8'>
            <div>
              <h3 className='inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-primary/10 text-primary'>
                Monthly
              </h3>
            </div>
            <div className='mt-4 flex items-baseline text-6xl font-extrabold'>
              &#8377; 2499{' '}
              <span className='ml-1 text-2xl text-muted-foreground'>/mo</span>
            </div>
            <p className='mt-5 text-lg text-muted-foreground'>
              Elevate Your Notes for ₹2499/month! Take charge of your ideas.
              Subscribe today!
            </p>
          </CardContent>
          <div className='flex flex-1 flex-col justify-between px-6 pt-6 pb-8 bg-secondary rounded-lg m-1 space-y-6 sm:p-10 sm:pt-6'>
            <ul className='space-y-4'>
              {featureItems.map((featureItem) => {
                return (
                  <li key={featureItem.id} className='flex items-center'>
                    <div className='shrink-0'>
                      <CheckCircle2 className='h-6 w-6 text-green-500' />
                    </div>
                    <p className='ml-3 text-base'>{featureItem.name}</p>
                  </li>
                );
              })}
            </ul>
            <RazorpaySubscriptionButton user={user} />
          </div>
        </Card>
      </div>
    </>
  );
};

export default BillingPage;
