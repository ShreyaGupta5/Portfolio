const contacts = [];
const { getMissingMailConfig, isEmailConfigured, sendContactEmail, verifyMailConnection } = require("../services/mailService");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateContact(payload) {
  const name = payload.name?.trim();
  const email = payload.email?.trim();
  const subject = payload.subject?.trim();
  const message = payload.message?.trim();

  if (!name || name.length < 2) {
    return "Name must be at least 2 characters";
  }

  if (!email || !isValidEmail(email)) {
    return "A valid email is required";
  }

  if (!subject || subject.length < 3) {
    return "Subject must be at least 3 characters";
  }

  if (!message || message.length < 10) {
    return "Message must be at least 10 characters";
  }

  return null;
}

async function getContacts(req, res, next) {
  try {
    res.json(contacts);
  } catch (error) {
    next(error);
  }
}

async function getMailStatus(req, res, next) {
  try {
    const status = await verifyMailConnection();

    res.json({
      configured: status.configured,
      verified: status.verified,
      missing: status.missing,
      receiver: process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER || null,
      error: status.error || null
    });
  } catch (error) {
    next(error);
  }
}

async function createContact(req, res, next) {
  try {
    const validationError = validateContact(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const contact = {
      id: contacts.length + 1,
      name: req.body.name.trim(),
      email: req.body.email.trim(),
      subject: req.body.subject.trim(),
      message: req.body.message.trim(),
      created_at: new Date().toISOString()
    };

    contacts.unshift(contact);

    let emailResult;
    try {
      emailResult = await sendContactEmail(contact);
    } catch (emailError) {
      console.error("Email delivery failed:", emailError.message);
      return res.status(502).json({
        message: "Email delivery failed. Please check SMTP credentials in Render environment variables.",
        contact,
        emailSent: false,
        configured: false,
        error: emailError.message
      });
    }

    if (!emailResult.sent) {
      return res.status(503).json({
        message: "Email service is not configured. Add SMTP variables in Render, then redeploy.",
        contact,
        emailSent: false,
        configured: false,
        missing: getMissingMailConfig()
      });
    }

    res.status(201).json({
      message: "Message sent successfully to Shreya.",
      contact,
      emailSent: true,
      configured: true
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getContacts,
  getMailStatus,
  createContact
};
