// Uses Brevo (formerly Sendinblue) transactional email API via native fetch.
// No npm packages needed — zero Turbopack bundling issues.
// Free tier: 300 emails/day. Env vars: BREVO_API_KEY, BREVO_SENDER_EMAIL.

async function brevoSend(payload: object) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY ?? '',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo error ${res.status}: ${text}`);
  }
  return res.json();
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
  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? 'hamroeventsolutions@gmail.com';
  const sender = { name: 'HES Childcare', email: senderEmail };

  const childrenList = children
    .map((c) => `<li>${c.firstName} ${c.lastName}, Age ${c.age}</li>`)
    .join('');
  const pickupList = authorizedPickups.map((p) => p.name).join(', ');

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: #4A1078; padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Hamro Event Solutions LLC</h1>
        <p style="color: #EDE0F5; margin: 8px 0 0;">Childcare Services &mdash; May 30, 2026</p>
      </div>
      <div style="padding: 32px 24px;">
        <p>Hi ${parentName},</p>
        <p>Your signup is <strong>confirmed</strong>! Here&apos;s your summary:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; font-weight: bold; color: #4A1078;">Confirmation #</td><td style="padding: 8px;">${confirmationNumber}</td></tr>
          <tr style="background:#f9f5ff"><td style="padding: 8px; font-weight: bold; color: #4A1078;">Date</td><td style="padding: 8px;">Saturday, May 30, 2026</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #4A1078;">Service Hours</td><td style="padding: 8px;">8:00 AM &ndash; 9:00 PM</td></tr>
          <tr style="background:#f9f5ff"><td style="padding: 8px; font-weight: bold; color: #4A1078;">Signup Fee</td><td style="padding: 8px; color: #059669; font-weight: bold;">FREE</td></tr>
        </table>
        <p><strong>Children Signed Up:</strong></p>
        <ul style="background: #f9f5ff; padding: 12px 12px 12px 28px; border-radius: 8px; margin: 0 0 16px;">${childrenList}</ul>
        <p><strong>Authorized Pick-Up:</strong> ${pickupList}</p>
        <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0 0 8px; font-weight: bold;">Important Reminders:</p>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Check-in starts at 8:00 AM &mdash; bring valid photo ID</li>
            <li>Children join parents for lunch 12:00 PM &ndash; 2:00 PM</li>
            <li>Buffet dinner at 6:30 PM includes daycare staff</li>
            <li>Valid photo ID required at pick-up for all authorized pickups</li>
          </ul>
        </div>
        <p><strong>Nearest Hospital:</strong> Endeavor Health Glenbrook Hospital</p>
        <p><strong>Questions?</strong><br>
          Kshitiz Shrestha: (312) 627-0600<br>
          Manish Chaudhary: (847) 224-4156
        </p>
        <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">See you on May 30!<br>&mdash; Hamro Event Solutions LLC</p>
      </div>
    </div>
  `;

  const adminHtml = `
    <p><strong>New signup received.</strong></p>
    <p><strong>Parent:</strong> ${parentName} (${to})</p>
    <p><strong>Children:</strong> ${children.length}</p>
    <p><strong>Confirmation #:</strong> ${confirmationNumber}</p>
  `;

  const [parentResult, adminResult] = await Promise.allSettled([
    brevoSend({
      sender,
      to: [{ email: to, name: parentName }],
      subject: 'Signup Confirmed - HES Childcare May 30, 2026',
      htmlContent: html,
    }),
    brevoSend({
      sender,
      to: [{ email: senderEmail, name: 'HES Admin' }],
      subject: `New Signup: ${parentName} - ${children.length} child(ren)`,
      htmlContent: adminHtml,
    }),
  ]);

  return { parentResult, adminResult };
}
