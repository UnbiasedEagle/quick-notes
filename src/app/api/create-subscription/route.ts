import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function POST(req: Request, res: Response) {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  if (!user) {
    throw new Error('Unable to get user');
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID!,
    key_secret: process.env.RAZORPAY_KEY!,
  });

  const subscription = await razorpay.subscriptions.create({
    plan_id: 'plan_NpCNsykmhQJc0d',
    customer_notify: 1,
    quantity: 1,
    total_count: 2,
    notes: {
      paymentFor: 'QuickNotes Pro',
    },
  });

  return NextResponse.json(subscription);
}
