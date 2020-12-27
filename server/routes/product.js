const express = require("express");
const { authCheck, adminCheck } = require("../middleware/auth");
const {
  create,
  listAll,
  remove,
  read,
  update,
} = require("../controllers/product");

const router = express.Router();

router.post("/product", authCheck, adminCheck, create);
router.get("/products/:count", listAll);
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.get("/product/:slug", read);
router.put("/product/:slug", authCheck, adminCheck, update);

module.exports = router;
