const Users = require("../models/userModel");
const brcypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const notifications = require("../constants/notifications");
const authControllers = {
  register: async (req, res) => {
    try {
      const { fullName, userName, email, password, gender } = req.body;
      let newUserName = userName.toLowerCase().replace(/ /g, "");

      const userNameIsExist = await Users.findOne({ userName: newUserName });
      const emailIsExist = await Users.findOne({ email });

      if (userNameIsExist) {
        return res.status(400).send({ msg: notifications.userNameExist });
      }
      if (emailIsExist) {
        return res.status(400).send({ msg: notifications.emailExist });
      }
      if (password.length < 8 || password.length > 32) {
        return res.status(400).send({ msg: notifications.lengthPassword });
      }
      const passwordHash = await brcypt.hash(password, 12);

      const userNew = new Users({
        fullName,
        userName: newUserName,
        email,
        password: passwordHash,
        gender,
      });

      const accessToken = createAccessToken({ id: userNew.id });
      const refreshAccessToken = createRefreshAccessToken({ id: userNew.id });
      res.cookie("refreshToken", refreshAccessToken, {
        httpOnly: true,
        path: "api/refesh-token",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      await userNew.save();
      res.json({
        msg: notifications.registerSuccess,
        accessToken,
        data: { ...userNew._doc, password: "" },
      });
    } catch (error) {
      console.log(
        "🚀 ~ file: authControllers.js ~ line 47 ~ register: ~ error",
        error
      );
      return res.status(500).send({ msg: notifications.severErr });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email }).populate(
        "followers following",
        "-password"
      );
      if (!user) {
        return res.status(400).json({ msg: notifications.emailNotExist });
      }
      const isMatch = await brcypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: notifications.passwordNotMatch });
      }
      const accessToken = createAccessToken({ id: user.id });
      const refreshAccessToken = createRefreshAccessToken({ id: user.id });
      res.cookie("refreshToken", refreshAccessToken, {
        httpOnly: true,
        path: "api/refesh-token",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        msg: notifications.loginSuccess,
        accessToken,
        data: { ...user._doc, password: "" },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: notifications.severErr });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshToken", { path: "api/refesh-token" });
      return res.json({ msg: notifications.loggedOut });
    } catch (error) {
      return res.status(500).send({ message: notifications.severErr });
    }
  },
  generateAccessToken: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(400).json({ msg: "Please login now." });
      }

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRECT,
        async (err, result) => {
          if (err) return res.status(400).json({ msg: "Please login now." });

          const user = await Users.findById(result.id)
            .select("-password")
            .populate("followers following", "-password");
          if (!user)
            return res.status(400).json({ msg: notifications.userNotExist });

          const accessToken = createAccessToken({ id: result.id });
          res.json({
            accessToken,
            data: user,
          });
        }
      );
    } catch (error) {
      return res.status(500).send({ message: notifications.severErr });
    }
  },
};
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRECT, {
    expiresIn: "1d",
  });
};
const createRefreshAccessToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRECT, {
    expiresIn: "30d",
  });
};
module.exports = authControllers;
