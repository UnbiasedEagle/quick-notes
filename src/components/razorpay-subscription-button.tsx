'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/dist/types';
import { useRouter } from 'next/navigation';

interface RazorpaySubscriptionButtonProps {
  user: KindeUser;
}

const RazorpaySubscriptionButton = ({
  user,
}: RazorpaySubscriptionButtonProps) => {
  const router = useRouter();

  const [pending, setPending] = useState(false);

  const buySubscription = async () => {
    setPending(true);
    try {
      const createSubscriptionResponse = await axios.post(
        '/api/create-subscription'
      );
      makePayment(createSubscriptionResponse.data.id);
    } catch (error) {
      toast.error('Payment Unsuccessful! Try Again.');
    } finally {
      setPending(false);
    }
  };

  const makePayment = (subscriptionId: string) => {
    try {
      const paymentOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_ID,
        subscription_id: subscriptionId,
        name: 'Quick Notes',
        description: 'Monthly Pro Plan',
        prefill: {
          name: `${user.given_name} ${user.family_name}`,
          email: user.email,
        },
        theme: {
          color: '#F37254',
        },
        handler: async (paymentResponse: {
          razorpay_subscription_id: string;
        }) => {
          createMembership(paymentResponse.razorpay_subscription_id);
        },
      };

      const razorpay = new (window as any).Razorpay(paymentOptions);
      razorpay.open();
    } catch (error) {
      throw new Error('Payment failed');
    }
  };

  const createMembership = async (subscriptionId: string) => {
    try {
      await axios.post('/api/memberships', { subscriptionId });
      toast.success("Congratulations! You're now upgraded to Pro!");
      router.refresh();
    } catch (error) {
      throw new Error('Failed to create membership');
    }
  };

  return (
    <>
      {pending ? (
        <Button disabled className='w-fit'>
          <Loader2 className='mr-2 w-4 h-4 animate-spin' /> Please Wait
        </Button>
      ) : (
        <Button onClick={buySubscription} className='w-fit'>
          Buy Subscription
        </Button>
      )}
    </>
  );
};

export default RazorpaySubscriptionButton;
