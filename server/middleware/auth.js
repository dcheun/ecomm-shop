const admin = require("../firebase");
const User = require("../models/user");

const authCheck = async (req, res, next) => {
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    console.log("firebase user in authcheck", firebaseUser);
    req.user = firebaseUser;
    next();
  } catch (error) {
    res.status(401).json({
      err: "Invalid or expired token",
    });
  }
};

// This check should run after authCheck
// which will have req.user already set.
const adminCheck = async (req, res, next) => {
  const { email } = req.user;

  const adminUser = await User.findOne({ email });

  if (adminUser.role !== "admin") {
    res.status(403).json({
      err: "Not authorized",
    });
  } else {
    next();
  }
};

module.exports = {
  authCheck,
  adminCheck,
};
