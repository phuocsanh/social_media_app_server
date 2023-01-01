const Users = require("../models/userModel");
const brcypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../configs/cloudnary");
const folder = { folder: "Social-Media-App/Image-User" };
const notifications = require("../constants/notifications");
const userControllers = {
  searchUser: async (req, res) => {
    const userLogin = req?.user;

    let user = [];

    try {
      user = await Users.find({
        userName: { $regex: req?.query?.userName },
      })
        .limit(10)
        .select("fullName userName avatar");

      const newUser = user?.filter(
        (item, idx) => item?._id.toString() !== userLogin?._id.toString()
      );
      console.log(
        "file: userController.js:24 ~ searchUser: ~ newUser",
        newUser
      );

      res.json({ user: newUser });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUserById: async (req, res) => {
    console.log(
      "🚀 ~ file: userController.js ~ line 21 ~ getUserById: ~ getUserById",
      req
    );
    try {
      const user = await Users.findById(req.params.id)
        .populate("listFriends")
        .select("-password");
      console.log(" file: userController.js:31 ~ getUserById: ~ user", user);

      if (!user)
        return res.status(400).json({ status: false, msg: "User not found" });
      res.json({ status: true, data: user });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  uploadImage: async (req, res) => {
    // console.log(" userController.js:38 ~ uploadImage: ~ uploadImage");
    const user = req.user;
    const isImageUser = req.body.isImageUser;
    let avatarUpload;
    let update;
    try {
      switch (isImageUser) {
        case true:
          avatarUpload = await cloudinary.uploader.upload(
            req.body.data,
            folder
          );
          update = {
            $push: {
              listPicture: { id: avatarUpload.asset_id, url: avatarUpload.url },
            },
          };
          break;
        case false:
          update = {
            avatar: req.body.data,
          };
          break;

        default:
          break;
      }
      const result = await Users.findByIdAndUpdate(user?._id, update, {
        new: true,
      });
      if (!result)
        return res.status(400).json({ status: false, msg: "Upload failed" });
      res.json({ status: true, data: result });
    } catch (error) {
      console.log(" userController.js:72 ~ uploadImage: ~ error", error);
      return res.status(500).json({ msg: error.message });
    }
  },
  updateInFo: async (req, res) => {
    const user = req.user;
    const body = req.body;
    const { type } = req?.query;
    console.log("file: userController.js:80 ~ updateInFo: ~ type", type);
    try {
      let result = null;
      if (type === "addFriend") {
        result = await Users.findByIdAndUpdate(
          user?._id,
          { $addToSet: { listFriends: body?.data } },
          {
            new: true,
          }
        );
      } else if (type === "unFriend") {
        result = await Users.findByIdAndUpdate(
          user?._id,
          { $pull: { listFriends: body?.data } },
          {
            new: true,
          }
        );
      } else if (type === "updateInFo") {
        result = await Users.findByIdAndUpdate(user?._id, body?.data, {
          new: true,
        });
      }

      if (!result)
        return res.status(400).json({ status: false, msg: "Upload failed" });
      res.json({ status: true, data: result });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
module.exports = userControllers;
