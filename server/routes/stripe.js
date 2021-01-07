const express = require("express");
const { authCheck } = require("../middleware/auth");
const { createPaymentIntent } = require("../controllers/stripe");

const router = express.Router();

router.post("/create-payment-intent", authCheck, createPaymentIntent);

module.exports = router;
