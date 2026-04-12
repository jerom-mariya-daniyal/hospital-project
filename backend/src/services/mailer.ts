import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

/* ─────────────────────────────────────────── transporter ── */
let _transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (_transporter) return _transporter;
  _transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.MAIL_PORT) || 587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  return _transporter;
}

/* ────────────────────────────────────── shared template ── */
function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vet-Hub Notification</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background:#0f172a;padding:24px 32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:36px;height:36px;background:#2563eb;border-radius:8px;text-align:center;vertical-align:middle;">
                    <span style="color:#fff;font-size:18px;line-height:36px;">🐾</span>
                  </td>
                  <td style="padding-left:12px;">
                    <span style="color:#ffffff;font-size:16px;font-weight:900;letter-spacing:-0.5px;">VET-HUB</span>
                    <br/>
                    <span style="color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Thanjavur Veterinary Circle</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                © ${new Date().getFullYear()} Vet-Hub · Thanjavur Circle
                &nbsp;·&nbsp;
                This is an automated notification. Do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(label: string, url: string, color = "#0f172a"): string {
  return `<table cellpadding="0" cellspacing="0" style="margin-top:28px;">
    <tr>
      <td style="background:${color};border-radius:10px;padding:0;">
        <a href="${url}" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.3px;">${label} →</a>
      </td>
    </tr>
  </table>`;
}

function badge(text: string, color: string, bg: string): string {
  return `<span style="display:inline-block;padding:4px 12px;background:${bg};color:${color};border-radius:20px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;">${text}</span>`;
}

/* ─────────────────────────────────────── priority colours ── */
const priorityStyle: Record<string, { color: string; bg: string }> = {
  Normal:   { color: "#475569", bg: "#f1f5f9" },
  Urgent:   { color: "#b45309", bg: "#fef3c7" },
  Critical: { color: "#b91c1c", bg: "#fee2e2" },
};

const tagStyle: Record<string, { color: string; bg: string }> = {
  Vaccination: { color: "#1d4ed8", bg: "#dbeafe" },
  Emergency:   { color: "#b91c1c", bg: "#fee2e2" },
  Checkup:     { color: "#065f46", bg: "#d1fae5" },
  Inspection:  { color: "#92400e", bg: "#fef3c7" },
  Campaign:    { color: "#6b21a8", bg: "#f3e8ff" },
  General:     { color: "#374151", bg: "#f3f4f6" },
};

/* ════ PUBLIC FUNCTIONS ══ */

/**
 * Notify users when a new circular is published.
 * Fire-and-forget — call without await in routes.
 */
export async function sendCircularNotification(
  circular: { title: string; body: string; priority: string; _id: string },
  recipients: { email: string; name: string; emailNotifications?: boolean }[]
): Promise<void> {
  const eligibleRecipients = recipients.filter(u => u.emailNotifications !== false && u.email);
  if (!eligibleRecipients.length) return;

  const ps = priorityStyle[circular.priority] || priorityStyle.Normal;
  const bodyPreview = circular.body.replace(/<[^>]+>/g, "").slice(0, 200);
  const dashboardUrl = `${process.env.DASHBOARD_URL || "http://localhost:5173"}/dashboard/circulars`;

  const html = baseTemplate(`
    <p style="margin:0 0 16px;font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;">New Circular</p>
    ${badge(circular.priority, ps.color, ps.bg)}
    <h1 style="margin:16px 0 12px;font-size:22px;font-weight:900;color:#0f172a;line-height:1.3;">${circular.title}</h1>
    <p style="margin:0 0 8px;font-size:14px;color:#475569;line-height:1.7;">${bodyPreview}${circular.body.replace(/<[^>]+>/g, "").length > 200 ? "…" : ""}</p>
    ${ctaButton("Open in Dashboard", dashboardUrl)}
  `);

  const transporter = getTransporter();
  for (const user of eligibleRecipients) {
    try {
      await transporter.sendMail({
        from: `"Vet-Hub Notifications" <${process.env.MAIL_USER}>`,
        to: user.email,
        subject: `[${circular.priority}] New Circular: ${circular.title}`,
        html,
      });
    } catch (err) {
      console.error(`[Mailer] Failed to send circular email to ${user.email}:`, err);
    }
  }
}

/**
 * Notify admins when a staff member submits a new activity report.
 * Fire-and-forget.
 */
export async function sendNewReportNotification(
  activity: { title: string; tag: string; _id: string },
  authorName: string,
  admins: { email: string; name: string; emailNotifications?: boolean }[]
): Promise<void> {
  const eligibleAdmins = admins.filter(u => u.emailNotifications !== false && u.email);
  if (!eligibleAdmins.length) return;

  const ts = tagStyle[activity.tag] || tagStyle.General;
  const dashboardUrl = `${process.env.DASHBOARD_URL || "http://localhost:5173"}/dashboard/admin`;

  const html = baseTemplate(`
    <p style="margin:0 0 16px;font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Review Required</p>
    ${badge(activity.tag, ts.color, ts.bg)}
    <h1 style="margin:16px 0 8px;font-size:22px;font-weight:900;color:#0f172a;line-height:1.3;">${activity.title}</h1>
    <p style="margin:0 0 20px;font-size:14px;color:#475569;line-height:1.7;">
      <strong>${authorName}</strong> has submitted a new field activity report for your review.
      Please check the review queue and approve or hold the submission.
    </p>
    <table cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:0;width:100%;">
      <tr>
        <td style="padding:14px 18px;">
          <span style="font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px;">Submitted by</span><br/>
          <span style="font-size:14px;font-weight:700;color:#0f172a;">${authorName}</span>
        </td>
        <td style="padding:14px 18px;border-left:1px solid #e2e8f0;">
          <span style="font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px;">Category</span><br/>
          <span style="font-size:14px;font-weight:700;color:#0f172a;">${activity.tag}</span>
        </td>
      </tr>
    </table>
    ${ctaButton("Go to Review Queue", dashboardUrl, "#2563eb")}
  `);

  const transporter = getTransporter();
  for (const admin of eligibleAdmins) {
    try {
      await transporter.sendMail({
        from: `"Vet-Hub Notifications" <${process.env.MAIL_USER}>`,
        to: admin.email,
        subject: `New Report for Review: ${activity.title}`,
        html,
      });
    } catch (err) {
      console.error(`[Mailer] Failed to send report notification to ${admin.email}:`, err);
    }
  }
}

/**
 * Notify a staff member when their activity report is published to the portal.
 * Fire-and-forget.
 */
export async function sendReportPublishedNotification(
  activity: { title: string; tag: string; _id: string },
  author: { email: string; name: string; emailNotifications?: boolean }
): Promise<void> {
  if (!author.email || author.emailNotifications === false) return;

  const ts = tagStyle[activity.tag] || tagStyle.General;
  const portalUrl = `${process.env.PORTAL_URL || "http://localhost:3001"}/activities/${activity._id}`;

  const html = baseTemplate(`
    <p style="margin:0 0 16px;font-size:13px;font-weight:700;color:#065f46;text-transform:uppercase;letter-spacing:1px;">✓ Report Published</p>
    ${badge(activity.tag, ts.color, ts.bg)}
    <h1 style="margin:16px 0 8px;font-size:22px;font-weight:900;color:#0f172a;line-height:1.3;">${activity.title}</h1>
    <p style="margin:0 0 20px;font-size:14px;color:#475569;line-height:1.7;">
      Great work, <strong>${author.name}</strong>! Your activity report has been approved by an administrator and is now live on the public portal for everyone to see.
    </p>
    <table cellpadding="0" cellspacing="0" style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:10px;padding:0;width:100%;">
      <tr>
        <td style="padding:14px 18px;">
          <span style="font-size:13px;font-weight:700;color:#065f46;">🎉 Your report is now publicly visible on the Vet-Hub portal.</span>
        </td>
      </tr>
    </table>
    ${ctaButton("View on Portal", portalUrl, "#059669")}
  `);

  const transporter = getTransporter();
  try {
    await transporter.sendMail({
      from: `"Vet-Hub Notifications" <${process.env.MAIL_USER}>`,
      to: author.email,
      subject: `Your report "${activity.title}" is now live on the portal!`,
      html,
    });
  } catch (err) {
    console.error(`[Mailer] Failed to send published notification to ${author.email}:`, err);
  }
}
