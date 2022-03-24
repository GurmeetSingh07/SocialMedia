var express = require("express");
var router = express.Router();
const userController = require("../controller/user.Controller");
const authController = require("../controller/auto.Controller");
const tokenVerify = require("../middleware/verifyjwt");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.post("/signup", userController.signUp);

router.post("/signupverify", userController.signUpVerify);
router.post("/login", authController.userlogin);
router.put("/update", tokenVerify, userController.update);
router.post("/forget", tokenVerify, userController.forget);
router.put("/reset", tokenVerify, userController.reset);

router.post("/friendRequest", userController.friendRequest);
router.post("/requestApprove", userController.requestApprove);

module.exports = router;
