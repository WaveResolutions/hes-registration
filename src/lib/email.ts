/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
// nodemailer is in serverExternalPackages — use require() with `any` type so
// Turbopack does NOT try to resolve the nodemailer module at build time.
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const nodemailer: any = require('nodemailer');

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

export async function sendConfirmationEmail({
  to,
  parentName,
  confirmationNumber,
  children,
  authorizedPickups,
}: {
  to: string;
  parentName: string;
  confirmationNumber: string;
  children: Array<{ firstName: string; lastName: string; age: number }>;
  authorizedPickups: Array<{ name: string }>;
}) {
  const transporter = getTransporter();
  const subject = '✅ Signup Confirmed — HES Childcare May 30, 2026';
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
        <p>Your signup is <strong>confirmed</strong>! Here's your summary:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; font-weight: bold; color: #4A1078;">Confirmation #</td><td style="padding: 8px;">${confirmationNumber}</td></tr>
          <tr style="background:#f9f5ff"><td style="padding: 8px; font-weight: bold; color: #4A1078;">Date</td><td style="padding: 8px;">Saturday, May 30, 2026</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #4A1078;">Service Hours</td><td style="padding: 8px;">8:00 AM – 9:00 PM</td></tr>
          <tr style="background:#f9f5ff"><td style="padding: 8px; font-weight: bold; color: #4A1078;">Signup Fee</td><td style="padding: 8px; color: #059669; font-weight: bold;">FREE</td></tr>
        </table>
        <p><strong>Children Signed Up:</strong></p>
        <pre style="background: #f9f5ff; padding: 12px; border-radius: 8px; font-family: sans-serif;">${childrenList}</pre>
        <p><strong>Authorized Pick-Up:</strong> ${pickupList}</p>
        <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0 0 8px; font-weight: bold;">Important Reminders:</p>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Check-in starts at 8:00 AM — bring valid photo ID</li>
            <li>Children join parents for lunch 12:00 PM – 2:00 PM</li>
            <li>Buffet dinner at 6:30 PM includes daycare staff</li>
            <li>Valid photo ID required at pick-up for all authorized pickups</li>
          </ul>
        </div>
        <p><strong>Nearest Hospital:</strong> Endeavor Health Glenbrook Hospital</p>
        <p><strong>Questions?</strong><br>
          Kshitiz Shrestha: (312) 627-0600<br>
          Manish Chaudhary: (847) 224-4156
        </p>
        <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">See you on May 30!<br>— Hamro Event Solutions LLC</p>
      </div>
    </div>
  `;

  const adminHtml = `<p>New signup received.</p>
    <p><strong>Parent:</strong> ${parentName} (${to})</p>
    <p><strong>Children:</strong> ${children.length}</p>
    <p><strong>Confirmation #:</strong> ${confirmationNumber}</p>`;

  const [parentResult, adminResult] = await Promise.allSettled([
    transporter.sendMail({ from: `"HES Childcare" <${process.env.GMAIL_USER}>`, to, subject, html }),
    transporter.sendMail({
      from: `"HES Childcare" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `New Signup: ${parentName} — ${children.length} child(ren)`,
      html: adminHtml,
    }),
  ]);

  return { parentResult, adminResult };
}
