const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    userName: {
      type: String,
      required: true,
      maxlength: 50,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/128/1177/1177568.png",
    },
    listPicture: [
      {
        type: Object,
        default: "",
      },
    ],
    listFriends: [{ type: mongoose.Types.ObjectId, default: "", ref: "Users" }],
    role: {
      type: String,
      default: "user",
      trim: true,
    },
    gender: {
      type: String,
      default: "",
      trim: true,
    },
    phoneNumber: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
    },
    story: [{ type: mongoose.Types.ObjectId, ref: "Stories" }],

    website: {
      type: String,
      default: "",
    },
    followers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Users",
      },
    ],
    following: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Users",
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Users", userSchema);
