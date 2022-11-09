const jwt = require("jsonwebtoken");
const authMiddlewares = {
  checkIsExist: (model, condition) => async (req, res, next) => {
    const isExist = await model.findOne(condition);
  },
  verifyToken: (req, res, next) => {
    const token = req.header.token;
    if (token) {
      const accessToken = token.spipt("")[1];
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRECT, (err, user) => {
        if (err) {
          res.status(403).json("Token is not valid");
        }
        req.user = user;
        next();
      });
    } else res.status(401).josn("You're not authenticated");
  },
  verifyIsAdmin: (req, res, next) => {
    authMiddlewares.verifyToken(req, res, () => {
      if (req.user.id == req.params.id || req.user.role == "admin") {
        next();
      } else res.status(403).json("You're not allow");
    });
  },
};
module.exports = authMiddlewares;
