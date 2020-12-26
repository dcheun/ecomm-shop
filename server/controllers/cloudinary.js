const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();

// config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = asyncHandler(async (req, res) => {
  const result = await cloudinary.uploader.upload(req.body.image, {
    public_id: `${Date.now()}`,
    resource_type: "auto", // jpeg, png
  });
  res.json({
    public_id: result.public_id,
    url: result.secure_url,
  });
});

const remove = asyncHandler(async (req, res) => {
  const public_id = req.body.public_id;
  await cloudinary.uploader.destroy(public_id, (err, result) => {
    if (err) {
      return res.json({ success: false, err });
    } else {
      return res.json({ success: true });
    }
  });
});

module.exports = {
  upload,
  remove,
};
