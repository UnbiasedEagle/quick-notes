import prisma from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const { subscriptionId } = await req.json();

  if (!user) throw new Error('User not found...');

  let subscription = await prisma.subscription.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!subscription) {
    subscription = await prisma.subscription.create({
      data: {
        subscriptionId,
        userId: user.id,
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json(subscription, { status: 201 });
  }

  subscription = await prisma.subscription.update({
    where: {
      userId: user.id,
    },
    data: {
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return NextResponse.json(subscription);
}
