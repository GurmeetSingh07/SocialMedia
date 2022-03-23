var express = require("express");
var router = express.Router();
const userController = require("../controller/user.Controller");
const AuthController = require("../controller/autologin");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.post("/signup", userController.signUp);
router.post("/friendRequest", userController.friendRequest);
router.post("/requestApprove", userController.requestApprove);
router.post("/login", AuthController.userlogin);

module.exports = router;
