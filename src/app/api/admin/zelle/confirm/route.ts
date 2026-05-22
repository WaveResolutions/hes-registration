import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function isAuthorized(req: NextRequest) {
  const token = req.cookies.get('hes_admin')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { registrationId } = await req.json();
  const reg = await prisma.registration.update({
    where: { id: registrationId },
    data: { paymentStatus: 'CONFIRMED', paidAt: new Date() },
  });

  return NextResponse.json(reg);
}
