const express = require("express");
const { createOrUpdateUser } = require("../controllers/auth");
const { authCheck } = require("../middleware/auth");

const router = express.Router();

router.post("/create-or-update-user", authCheck, createOrUpdateUser);

module.exports = router;
