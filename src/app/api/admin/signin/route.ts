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

  const now = new Date();
  const dataMap: Record<string, object> = {
    checkin:    { checkedIn: true,   checkedInAt: now,   checkedInBy: staffName },
    checkout:   { checkedOut: true,  checkedOutAt: now,  checkedOutBy: staffName },
    lunchout:   { lunchedOut: true,  lunchedOutAt: now,  lunchedOutBy: staffName },
    lunchback:  { lunchedBack: true, lunchedBackAt: now, lunchedBackBy: staffName },
  };

  const data = dataMap[action];
  if (!data) return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  const child = await prisma.child.update({ where: { id: childId }, data });
  return NextResponse.json(child);
}
