const nodemailer = require("nodemailer");

const REQUIRED_MAIL_ENV = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "CONTACT_RECEIVER_EMAIL"];

function getMissingMailConfig() {
  return REQUIRED_MAIL_ENV.filter((key) => !process.env[key]);
}

function isEmailConfigured() {
  return getMissingMailConfig().length === 0;
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

function createContactEmail(contact) {
  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER;

  return {
    from: `"Shreya Gupta Portfolio" <${fromEmail}>`,
    to: receiverEmail,
    replyTo: contact.email,
    subject: `Portfolio Contact: ${contact.subject}`,
    text: [
      `Name: ${contact.name}`,
      `Email: ${contact.email}`,
      `Subject: ${contact.subject}`,
      "",
      contact.message
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
        <h2>New portfolio contact message</h2>
        <p><strong>Name:</strong> ${escapeHtml(contact.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(contact.email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(contact.subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(contact.message).replace(/\n/g, "<br>")}</p>
      </div>
    `
  };
}

async function sendContactEmail(contact) {
  if (!isEmailConfigured()) {
    return {
      sent: false,
      configured: false,
      reason: `Missing email configuration: ${getMissingMailConfig().join(", ")}`
    };
  }

  const transporter = createTransporter();
  await transporter.sendMail(createContactEmail(contact));

  return {
    sent: true,
    configured: true
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = {
  getMissingMailConfig,
  isEmailConfigured,
  sendContactEmail
};
