import sgMail from "@sendgrid/mail";
import { ENV } from "../../config/env.js";

if (!ENV.SENDGRID_API_KEY?.startsWith("SG.")) {
  throw new Error("Invalid SendGrid API Key");
}

sgMail.setApiKey(ENV.SENDGRID_API_KEY);

const FROM_EMAIL = "mhatresarthak3@gmail.com"; // verified sender

//Common email sender function
export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  const msg = {
    to,
    from: FROM_EMAIL,
    subject,
    html
  };

  await sgMail.send(msg);
}

//Verfication Email Function
export async function sendVerificationEmail(
  to: string,
  verificationLink: string
) {
  const html = `
    <h3>Email Verification</h3>
    <p>Click the link below to verify your email:</p>
    <a href="${verificationLink}">Verify Email</a>
    <p>This link will expire in 15 minutes.</p>
  `;

  await sendEmail(to, "Verify your email", html);
}

//Authority Invite Email Function
// Authority Invite Email Function
export async function sendAuthorityInviteEmail(
  email: string,
  inviteLink: string,
  instructions?: string
) {
  const html = `
    <h3>Authority Invitation</h3>
    <p>You have been invited to join the Complaint Management System as an Authority.</p>

    ${
      instructions
        ? `<p><strong>Instructions:</strong></p><p>${instructions}</p>`
        : ""
    }

    <p>Click the link below to set your password and activate your account:</p>
    <a href="${inviteLink}">Accept Invitation</a>
    <p>This link will expire in 24 hours.</p>
  `;

  await sendEmail(email, "You are invited as an Authority", html);
}

