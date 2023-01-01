require('dotenv/config')

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.ClOUD_NAME, 
  api_key: process.env.ClOUDNARY_API_KEY, 
  api_secret: process.env.ClOUDNARY_API_SECRET,
  secure: process.env.ClOUDNARY_SECURE
});

module.exports = cloudinary;
