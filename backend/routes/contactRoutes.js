const express = require("express");
const { getContacts, createContact } = require("../controllers/contactController");

const router = express.Router();

router.get("/", getContacts);
router.post("/", createContact);

module.exports = router;
