const express = require("express");
const { authCheck, adminCheck } = require("../middleware/auth");
const { create, list } = require("../controllers/product");

const router = express.Router();

router.post("/product", authCheck, adminCheck, create);
router.get("/products", list);

module.exports = router;
