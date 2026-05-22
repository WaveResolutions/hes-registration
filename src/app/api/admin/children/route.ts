import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function isAuthorized(req: NextRequest) {
  const token = req.cookies.get('hes_admin')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const registrations = await prisma.registration.findMany({
    include: { children: true, authorizedPickups: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(registrations);
}
