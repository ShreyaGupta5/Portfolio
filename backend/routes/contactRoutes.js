const express = require("express");
const { getContacts, getMailStatus, createContact } = require("../controllers/contactController");

const router = express.Router();

router.get("/", getContacts);
router.get("/mail-status", getMailStatus);
router.post("/", createContact);

module.exports = router;
