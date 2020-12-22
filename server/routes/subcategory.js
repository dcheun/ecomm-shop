const express = require("express");
const { authCheck, adminCheck } = require("../middleware/auth");
const {
  create,
  read,
  update,
  remove,
  list,
} = require("../controllers/subcategory");

const router = express.Router();

router.post("/subcategory", authCheck, adminCheck, create);
router.get("/subcategories", list);
router.get("/subcategory/:slug", read);
router.put("/subcategory/:slug", authCheck, adminCheck, update);
router.delete("/subcategory/:slug", authCheck, adminCheck, remove);

module.exports = router;
