import { Resend } from "resend";

type EmailArgs = {
  to: string;
  name: string;
  recommendation: string;
  reason: string;
};

const BADGE: Record<string, string> = {
  "Certification Program": "#2563eb",
  DBA: "#7c3aed",
  PhD: "#059669",
  "Honorary Doctorate": "#d97706",
};

function buildHtml({ name, recommendation, reason }: EmailArgs): string {
  const color = BADGE[recommendation] ?? "#4f46e5";
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;background:#f1f5f9;padding:32px 0;font-family:Arial,Helvetica,sans-serif;">
    <table align="center" width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <tr>
        <td style="background:#4f46e5;padding:24px 32px;">
          <span style="color:#ffffff;font-size:18px;font-weight:bold;">Acdyon</span>
          <span style="color:#c7d2fe;font-size:14px;"> · Academic Pathway Engine</span>
        </td>
      </tr>
      <tr>
        <td style="padding:32px;">
          <p style="color:#334155;font-size:15px;margin:0 0 16px;">Hi ${name},</p>
          <p style="color:#475569;font-size:15px;margin:0 0 20px;">Based on your profile, our recommendation engine suggests the following academic pathway:</p>
          <div style="display:inline-block;background:${color}1a;color:${color};font-weight:bold;font-size:16px;padding:10px 18px;border-radius:999px;margin-bottom:20px;">${recommendation}</div>
          <p style="color:#475569;font-size:15px;line-height:1.6;margin:16px 0 0;">${reason}</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;" />
          <p style="color:#94a3b8;font-size:13px;margin:0;">This recommendation was generated automatically by Acdyon. Reply to this email to speak with an advisor.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/**
 * Sends the recommendation email via Resend. No-ops gracefully (never throws)
 * if RESEND_API_KEY is not configured, so a missing key can't break a submission.
 */
export async function sendRecommendationEmail(
  args: EmailArgs
): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "RESEND_API_KEY not configured" };

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Acdyon <onboarding@resend.dev>",
      to: args.to,
      subject: `Your recommended academic pathway: ${args.recommendation}`,
      html: buildHtml(args),
    });
    if (error) return { sent: false, reason: String(error) };
    return { sent: true };
  } catch (e) {
    return { sent: false, reason: e instanceof Error ? e.message : String(e) };
  }
}
