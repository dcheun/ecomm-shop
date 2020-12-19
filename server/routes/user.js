const express = require("express");

const router = express.Router();

router.get("/user", (req, res) => {
  res.json({
    data: "user endpoint",
  });
});

module.exports = router;
