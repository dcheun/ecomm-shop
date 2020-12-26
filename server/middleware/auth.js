const asyncHandler = require("express-async-handler");
const admin = require("../firebase");
const fbError = require("firebase-admin/lib/utils/error");
const User = require("../models/user");

const authCheck = asyncHandler(async (req, res, next) => {
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    console.log("firebase user in authcheck", firebaseUser);
    req.user = firebaseUser;
    next();
  } catch (e) {
    // console.log(e);
    // console.log("errorInfo=", e.errorInfo);
    // if (e.errorInfo.code === "auth/id-token-expired") {
    if (e instanceof fbError.FirebaseAuthError) {
      res.status(401);
      res.json({
        error: "Invalid or expired token",
      });
    } else {
      throw e;
    }
  }
});

// This check should run after authCheck
// which will have req.user already set.
const adminCheck = asyncHandler(async (req, res, next) => {
  const { email } = req.user;

  const adminUser = await User.findOne({ email });

  if (adminUser.role !== "admin") {
    res.status(403).json({
      err: "Not authorized",
    });
  } else {
    next();
  }
});

module.exports = {
  authCheck,
  adminCheck,
};
