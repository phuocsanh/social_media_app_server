const router = require("express").Router();
const userControllers = require("../controllers/userController");
const { auth } = require("../middlewares/authMiddlewares");

router.get("/search", auth, userControllers.searchUser);
router.get("/getUserById/:id", auth, userControllers.getUserById);

module.exports = router;
