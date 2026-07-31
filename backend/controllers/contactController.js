const contacts = [];
const { sendContactEmail } = require("../services/mailService");

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
        message: "Message saved, but email could not be delivered. Please use the email button.",
        contact,
        emailSent: false
      });
    }

    res.status(emailResult.sent ? 201 : 202).json({
      message: emailResult.sent
        ? "Message sent successfully to Shreya."
        : "Message saved, but email delivery is not configured yet.",
      contact,
      emailSent: emailResult.sent
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getContacts,
  createContact
};
