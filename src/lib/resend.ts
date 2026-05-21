import { Resend } from 'resend';

// Lazy initialization — only fails at runtime if API key not set
function getResend(): Resend {
  return new Resend(process.env.RESEND_API_KEY || 'placeholder');
}

export async function sendConfirmationEmail({
  to,
  parentName,
  confirmationNumber,
  children,
  authorizedPickups,
  paymentMethod,
  waiverPdfUrl,
}: {
  to: string;
  parentName: string;
  confirmationNumber: string;
  children: Array<{ firstName: string; lastName: string; age: number }>;
  authorizedPickups: Array<{ name: string }>;
  paymentMethod: 'STRIPE' | 'ZELLE' | 'FREE';
  waiverPdfUrl?: string;
}) {
  const resend = getResend();
  const subject = '✅ Registration Confirmed — HES Childcare May 30, 2026';

  const childrenList = children.map((c) => `• ${c.firstName} ${c.lastName}, Age ${c.age}`).join('\n');
  const pickupList = authorizedPickups.map((p) => p.name).join(', ');

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: #4A1078; padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Hamro Event Solutions LLC</h1>
        <p style="color: #EDE0F5; margin: 8px 0 0;">Childcare Services — May 30, 2026</p>
      </div>
      <div style="padding: 32px 24px;">
        <p>Hi ${parentName},</p>
        <p>Your registration is <strong>confirmed</strong>! Here's your summary:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; font-weight: bold; color: #4A1078;">Confirmation #</td><td style="padding: 8px;">${confirmationNumber}</td></tr>
          <tr style="background:#f9f5ff"><td style="padding: 8px; font-weight: bold; color: #4A1078;">Date</td><td style="padding: 8px;">Saturday, May 30, 2026</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #4A1078;">Service Hours</td><td style="padding: 8px;">8:00 AM – 9:00 PM</td></tr>
          <tr style="background:#f9f5ff"><td style="padding: 8px; font-weight: bold; color: #4A1078;">Registration Fee</td><td style="padding: 8px; color: #059669; font-weight: bold;">FREE</td></tr>
        </table>
        <p><strong>Children Registered:</strong></p>
        <pre style="background: #f9f5ff; padding: 12px; border-radius: 8px; font-family: sans-serif;">${childrenList}</pre>
        <p><strong>Authorized Pick-Up:</strong> ${pickupList}</p>
        <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0 0 8px; font-weight: bold;">Important Reminders:</p>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Children join parents for lunch 12:00 PM – 2:00 PM</li>
            <li>Buffet dinner at 6:30 PM includes daycare staff</li>
            <li>Valid photo ID required at pick-up</li>
            <li>No child released without ID verification</li>
          </ul>
        </div>
        <p><strong>Nearest Hospital:</strong> Endeavor Health Glenbrook Hospital</p>
        <p><strong>Questions?</strong><br>
          Kshitiz Shrestha: (312) 627-0600<br>
          Manish Chaudhary: (847) 224-4156
        </p>
        ${waiverPdfUrl ? `<p>Your signed waiver is attached. <a href="${waiverPdfUrl}" style="color: #4A1078;">Download PDF</a></p>` : ''}
        <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">See you on May 30!<br>— Hamro Event Solutions LLC</p>
      </div>
    </div>
  `;

  const [parentResult, adminResult] = await Promise.allSettled([
    resend.emails.send({ from: process.env.EMAIL_FROM!, to, subject, html }),
    resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: [process.env.EMAIL_ADMIN!, process.env.EMAIL_ADMIN_BACKUP!].filter(Boolean) as string[],
      subject: `New Registration: ${parentName} — ${children.length} child(ren)`,
      html: `<p>New registration received.</p><p><strong>Parent:</strong> ${parentName} (${to})</p><p><strong>Children:</strong> ${children.length}</p><p><strong>Confirmation #:</strong> ${confirmationNumber}</p><p><strong>Payment:</strong> ${paymentMethod}</p>`,
    }),
  ]);

  return { parentResult, adminResult };
}

export async function sendZelleConfirmedEmail({
  to,
  parentName,
  confirmationNumber,
}: {
  to: string;
  parentName: string;
  confirmationNumber: string;
}) {
  const resend = getResend();
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: 'Payment Confirmed — You\'re all set for May 30!',
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;"><div style="background: #4A1078; padding: 24px; text-align: center;"><h1 style="color: white; margin: 0;">Hamro Event Solutions LLC</h1></div><div style="padding: 32px 24px;"><p>Hi ${parentName},</p><p>Great news! Your Zelle payment has been <strong>confirmed</strong>. Your registration for May 30, 2026 is now complete.</p><p><strong>Confirmation #:</strong> ${confirmationNumber}</p><p>Questions? Call Kshitiz at (312) 627-0600 or Manish at (847) 224-4156.</p><p>— Hamro Event Solutions LLC</p></div></div>`,
  });
}
