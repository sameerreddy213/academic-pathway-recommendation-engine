import { Resend } from "resend";

type EmailArgs = {
  to: string;
  name: string;
  qualification: string;
  experience: string;
  profession: string;
  careerGoal: string;
  recommendation: string;
  reason: string;
};

const BADGE: Record<string, string> = {
  "Certification Program": "#2563eb",
  DBA: "#7c3aed",
  PhD: "#059669",
  "Honorary Doctorate": "#d97706",
};

/** Escape user-supplied text before interpolating into email HTML. */
function esc(v: string): string {
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function detailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;color:#94a3b8;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
    <td style="padding:8px 0 8px 16px;color:#334155;font-size:13px;">${esc(value)}</td>
  </tr>`;
}

function buildHtml(args: EmailArgs): string {
  const color = BADGE[args.recommendation] ?? "#0f766e";
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;background:#f1f5f9;padding:32px 0;font-family:Arial,Helvetica,sans-serif;">
    <table align="center" width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <tr>
        <td style="background:#0b1a2f;padding:24px 32px;">
          <span style="color:#ffffff;font-size:18px;font-weight:bold;">Acdyon</span>
          <span style="color:#7fb8e8;font-size:14px;"> · Academic Pathway Engine</span>
        </td>
      </tr>
      <tr>
        <td style="padding:32px;">
          <p style="color:#334155;font-size:15px;margin:0 0 16px;">Hi ${esc(args.name)},</p>
          <p style="color:#475569;font-size:15px;margin:0 0 20px;">Based on your profile, our recommendation engine suggests the following academic pathway:</p>
          <div style="display:inline-block;background:${color}1a;color:${color};font-weight:bold;font-size:16px;padding:10px 18px;border-radius:999px;margin-bottom:20px;">${esc(
            args.recommendation
          )}</div>
          <p style="color:#475569;font-size:15px;line-height:1.6;margin:16px 0 0;">${esc(
            args.reason
          )}</p>

          <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;" />

          <p style="color:#334155;font-size:14px;font-weight:bold;margin:0 0 8px;">The details you submitted</p>
          <table style="width:100%;border-collapse:collapse;">
            ${detailRow("Full name", args.name)}
            ${detailRow("Email", args.to)}
            ${detailRow("Highest qualification", args.qualification)}
            ${detailRow("Work experience", args.experience)}
            ${detailRow("Current profession", args.profession)}
            ${detailRow("Career goal", args.careerGoal)}
          </table>

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
