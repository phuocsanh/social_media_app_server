const Users = require("../models/userModel");
const brcypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const notifications = require("../constants/notifications");
const userControllers = {
  searchUser: async (req, res) => {
    console.log("🚀 ~ file: userController.js ~ line 19 ~ userControllers");
    try {
      const user = await Users.find({
        userName: { $regex: req.query.userName },
      })
        .limit(10)
        .select("fullName userName avatar");

      res.json({ user });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUserById: async (req, res) => {
    console.log(
      "🚀 ~ file: userController.js ~ line 21 ~ getUserById: ~ getUserById",
      res
    );
    try {
      const user = await Users.findById(req.params.id).select("-password");

      if (!user)
        return res.status(400).json({ status: false, msg: "User not found" });
      res.json({ status: true, data: user });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
module.exports = userControllers;
