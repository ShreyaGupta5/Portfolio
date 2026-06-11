const contacts = [];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateContact(payload) {
  const name = payload.name?.trim();
  const email = payload.email?.trim();
  const message = payload.message?.trim();

  if (!name || name.length < 2) {
    return "Name must be at least 2 characters";
  }

  if (!email || !isValidEmail(email)) {
    return "A valid email is required";
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
      message: req.body.message.trim(),
      created_at: new Date().toISOString()
    };

    contacts.unshift(contact);

    res.status(201).json({
      message: "Message received successfully",
      contact
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getContacts,
  createContact
};
