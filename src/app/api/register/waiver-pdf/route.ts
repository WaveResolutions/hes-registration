import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateWaiverPdf } from '@/lib/pdf';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const conf = req.nextUrl.searchParams.get('conf');
  if (!conf) {
    return NextResponse.json({ error: 'Missing confirmation number' }, { status: 400 });
  }

  const registration = await prisma.registration.findUnique({
    where: { confirmationNumber: conf },
    include: { children: true },
  });

  if (!registration) {
    return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
  }

  const pdfBytes = await generateWaiverPdf({
    parentName: `${registration.parentFirstName} ${registration.parentLastName}`,
    confirmationNumber: registration.confirmationNumber,
    children: registration.children.map((c) => ({ firstName: c.firstName, lastName: c.lastName, age: c.age })),
    signatureType: (registration.waiverSignatureType as 'drawn' | 'typed') ?? 'typed',
    signatureData: registration.waiverSignatureUrl ?? registration.waiverTypedName ?? '',
    signedAt: registration.waiverSignedAt?.toISOString() ?? new Date().toISOString(),
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="waiver-${conf}.pdf"`,
    },
  });
}
