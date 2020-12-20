const asyncHandler = require("express-async-handler");
const User = require("../models/user");

const createOrUpdateUser = asyncHandler(async (req, res) => {
  const { name, picture, email } = req.user;
  // Check if user exists in db - either a create or update operation.
  const user = await User.findOneAndUpdate(
    { email },
    { name, picture },
    { new: true }
  );
  if (user) {
    console.log("USER UPDATED", user);
    res.json(user);
  } else {
    const newUser = await new User({ email, name, picture }).save();
    console.log("USER CREATED", newUser);
    res.json(newUser);
  }
});

const currentUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.user.email });

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  createOrUpdateUser,
  currentUser,
};
