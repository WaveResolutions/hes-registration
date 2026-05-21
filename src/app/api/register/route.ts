import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import { sendConfirmationEmail } from '@/lib/resend';
import { generateWaiverPdf } from '@/lib/pdf';
import { uploadFile } from '@/lib/storage';
import { differenceInYears } from 'date-fns';
import { isRegistrationOpen } from '@/lib/registration-deadline';

export async function POST(req: NextRequest) {
  try {
    // Enforce registration deadline server-side
    if (!isRegistrationOpen()) {
      return NextResponse.json({ error: 'Registration is closed.' }, { status: 403 });
    }

    const body = await req.json();
    const { parent, children, authorizedPickups, waiver, payment } = body;

    const isFree = !payment?.method || payment.method === 'FREE';
    const amountCents = 0; // Free registration

    // Upload signature if drawn
    let signatureUrl: string | undefined;
    if (waiver.signatureType === 'drawn' && waiver.signatureData?.startsWith('data:image')) {
      const base64 = waiver.signatureData.split(',')[1];
      const buf = Buffer.from(base64, 'base64');
      signatureUrl = await uploadFile(buf, `signatures/${Date.now()}.png`, 'image/png').catch(() => undefined);
    }

    const registration = await prisma.registration.create({
      data: {
        parentFirstName: parent.parentFirstName,
        parentLastName: parent.parentLastName,
        relationship: parent.relationship,
        email: parent.email,
        phone: parent.phone,
        address: parent.address,
        emergencyContactName: parent.emergencyContactName,
        emergencyContactPhone: parent.emergencyContactPhone,
        emergencyContactRel: parent.emergencyContactRel,
        paymentMethod: isFree ? 'FREE' : payment.method,
        paymentStatus: 'CONFIRMED',
        amountCents,
        paidAt: new Date(),
        waiverSignedAt: new Date(waiver.signedAt),
        waiverSignatureUrl: signatureUrl,
        waiverSignatureType: waiver.signatureType,
        waiverTypedName: waiver.signatureType === 'typed' ? waiver.signatureData : null,
        waiverIpAddress: req.headers.get('x-forwarded-for') || undefined,
        waiverUserAgent: req.headers.get('user-agent') || undefined,
        photoConsent: waiver.photoConsent ?? true,
        children: {
          create: children.map((c: {
            childFirstName: string;
            childLastName: string;
            dateOfBirth: string;
            gender?: string;
            allergies?: string;
            medicalConditions?: string;
            specialNotes?: string;
          }) => ({
            firstName: c.childFirstName,
            lastName: c.childLastName,
            dateOfBirth: new Date(c.dateOfBirth),
            age: differenceInYears(new Date(), new Date(c.dateOfBirth)),
            gender: c.gender,
            allergies: c.allergies,
            medicalConditions: c.medicalConditions,
            specialNotes: c.specialNotes,
          })),
        },
        authorizedPickups: {
          create: authorizedPickups.map((p: {
            pickupName: string;
            pickupRelationship: string;
            pickupPhone: string;
            pickupIDType?: string;
          }) => ({
            name: p.pickupName,
            relationship: p.pickupRelationship,
            phone: p.pickupPhone,
            idType: p.pickupIDType,
          })),
        },
      },
      include: { children: true, authorizedPickups: true },
    });

    // Generate waiver PDF
    let pdfUrl: string | undefined;
    try {
      const pdfBytes = await generateWaiverPdf({
        parentName: `${parent.parentFirstName} ${parent.parentLastName}`,
        confirmationNumber: registration.confirmationNumber,
        children: registration.children.map((c) => ({ firstName: c.firstName, lastName: c.lastName, age: c.age })),
        signatureType: waiver.signatureType,
        signatureData: waiver.signatureData,
        signedAt: waiver.signedAt,
      });
      pdfUrl = await uploadFile(Buffer.from(pdfBytes), `waivers/${registration.id}.pdf`, 'application/pdf').catch(() => undefined);
      if (pdfUrl) {
        await prisma.registration.update({ where: { id: registration.id }, data: { waiverPdfUrl: pdfUrl } });
      }
    } catch (e) {
      console.error('PDF generation failed:', e);
    }

    // Send confirmation emails
    await sendConfirmationEmail({
      to: parent.email,
      parentName: `${parent.parentFirstName} ${parent.parentLastName}`,
      confirmationNumber: registration.confirmationNumber,
      children: registration.children.map((c) => ({ firstName: c.firstName, lastName: c.lastName, age: c.age })),
      authorizedPickups: registration.authorizedPickups,
      paymentMethod: 'FREE',
      waiverPdfUrl: pdfUrl,
    }).catch(console.error);

    return NextResponse.json({ confirmationNumber: registration.confirmationNumber, registrationId: registration.id });
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
