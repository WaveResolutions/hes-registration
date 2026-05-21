import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendZelleConfirmedEmail } from '@/lib/resend';

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { registrationId } = await req.json();
  const reg = await prisma.registration.update({
    where: { id: registrationId },
    data: { paymentStatus: 'CONFIRMED', paidAt: new Date() },
  });

  await sendZelleConfirmedEmail({
    to: reg.email,
    parentName: `${reg.parentFirstName} ${reg.parentLastName}`,
    confirmationNumber: reg.confirmationNumber,
  }).catch(console.error);

  return NextResponse.json(reg);
}
