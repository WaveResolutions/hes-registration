import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function isAuthorized(req: NextRequest) {
  const token = req.cookies.get('hes_admin')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { childId, action, staffName } = await req.json();

  const data =
    action === 'checkin'
      ? { checkedIn: true, checkedInAt: new Date(), checkedInBy: staffName }
      : { checkedOut: true, checkedOutAt: new Date(), checkedOutBy: staffName };

  const child = await prisma.child.update({ where: { id: childId }, data });
  return NextResponse.json(child);
}
