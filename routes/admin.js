var express = require("express");
var router = express.Router();
const adminController = require("../controller/admin.Controller");
const authController = require("../controller/auto.Controller");
const tokenVerify = require("../middleware/verifyjwt");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.post("/signup", adminController.signUp);
router.post("/signupverify", adminController.signUpVerify);
router.post("/login", authController.adminlogin);
router.put("/update", tokenVerify, adminController.update);
router.post("/forget", tokenVerify, adminController.forget);
router.put("/reset", tokenVerify, adminController.reset);
module.exports = router;
