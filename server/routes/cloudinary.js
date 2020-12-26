const express = require("express");
const { authCheck, adminCheck } = require("../middleware/auth");
const { upload, remove } = require("../controllers/cloudinary");

const router = express.Router();

router.post("/uploadimages", authCheck, adminCheck, upload);
router.post("/removeimage", authCheck, adminCheck, remove);

module.exports = router;
