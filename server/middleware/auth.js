const admin = require("../firebase");

const authCheck = (req, res, next) => {
  console.log(req.headers);
  next();
};

module.exports = {
  authCheck: authCheck,
};
