const router = require("express").Router();
const authControllers = require("../controllers/authControllers");
const { auth } = require("../middlewares/authMiddlewares");

router.post("/register", authControllers.register);
router.post("/login", authControllers.login);
router.post("/logout", authControllers.logout);
router.post("/refresh-token", authControllers.generateAccessToken);
router.get("/getUserIsLogin/:id", auth, authControllers.getUserIsLogin);
module.exports = router;
