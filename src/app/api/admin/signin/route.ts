import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { childId, action, staffName } = await req.json();

  const data =
    action === 'checkin'
      ? { checkedIn: true, checkedInAt: new Date(), checkedInBy: staffName }
      : { checkedOut: true, checkedOutAt: new Date(), checkedOutBy: staffName };

  const child = await prisma.child.update({ where: { id: childId }, data });
  return NextResponse.json(child);
}
