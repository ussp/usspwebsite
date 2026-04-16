/**
 * Email integration for readiness assessment questionnaire distribution.
 * Uses Resend for transactional email delivery.
 *
 * Required env var: RESEND_API_KEY
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://tools.ussp.co";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "USSP AI Tools <noreply@ussp.co>";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(options: SendEmailOptions): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set. Email not sent:", options.subject, "→", options.to);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [options.to],
      subject: options.subject,
      html: options.html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${response.status} ${error}`);
  }
}

// --- Email Templates ---

export async function sendQuestionnaireInvitation(params: {
  to: string;
  memberName: string;
  token: string;
  assessmentName: string;
}): Promise<void> {
  const responseUrl = `${APP_URL}/readiness/respond/${params.token}`;

  await sendEmail({
    to: params.to,
    subject: "AI Readiness Assessment — Your Input Needed",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #2563EB; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">AI Readiness Assessment</h1>
        </div>
        <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi ${params.memberName},</p>
          <p>You've been invited to participate in an AI Readiness Assessment. Your responses will help us understand your team's readiness for AI adoption and identify areas for improvement.</p>
          <p>The questionnaire takes approximately <strong>5-10 minutes</strong> to complete. Your responses are confidential and will be aggregated in the final report.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${responseUrl}" style="background: #2563EB; color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">Start Questionnaire</a>
          </div>
          <p style="font-size: 13px; color: #6b7280;">You can save your progress and return later using the same link. No login required.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af;">This email was sent by USSP AI Transformation Tools. If you received this in error, you can safely ignore it.</p>
        </div>
      </div>
    `,
  });
}

export async function sendQuestionnaireReminder(params: {
  to: string;
  memberName: string;
  token: string;
}): Promise<void> {
  const responseUrl = `${APP_URL}/readiness/respond/${params.token}`;

  await sendEmail({
    to: params.to,
    subject: "Reminder: AI Readiness Assessment — Please Complete",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #d97706; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">Reminder: Complete Your Assessment</h1>
        </div>
        <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi ${params.memberName},</p>
          <p>This is a friendly reminder that your AI Readiness Assessment questionnaire is still pending. We'd appreciate your input to help generate a complete readiness report.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${responseUrl}" style="background: #d97706; color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">Continue Questionnaire</a>
          </div>
          <p style="font-size: 13px; color: #6b7280;">Your previous answers (if any) have been saved.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af;">This email was sent by USSP AI Transformation Tools.</p>
        </div>
      </div>
    `,
  });
}

export async function sendCompletionConfirmation(params: {
  to: string;
  memberName: string;
}): Promise<void> {
  await sendEmail({
    to: params.to,
    subject: "Thank You — AI Readiness Assessment Completed",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #059669; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">Assessment Complete</h1>
        </div>
        <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi ${params.memberName},</p>
          <p>Thank you for completing the AI Readiness Assessment questionnaire. Your responses have been recorded and will be included in the team's readiness report.</p>
          <p style="font-size: 13px; color: #6b7280;">No further action is needed from you.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af;">This email was sent by USSP AI Transformation Tools.</p>
        </div>
      </div>
    `,
  });
}

export async function sendAssessmentCompleteNotification(params: {
  to: string;
  assessmentName: string;
  reportUrl: string;
}): Promise<void> {
  await sendEmail({
    to: params.to,
    subject: `All Responses In — ${params.assessmentName} Readiness Report Ready`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #2563EB; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">Readiness Report Ready</h1>
        </div>
        <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>All team members have completed the questionnaire for <strong>${params.assessmentName}</strong>.</p>
          <p>The readiness report is now available for review.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${params.reportUrl}" style="background: #2563EB; color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">View Report</a>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af;">This email was sent by USSP AI Transformation Tools.</p>
        </div>
      </div>
    `,
  });
}
