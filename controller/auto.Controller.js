const Model = require("../models/user.Schema");
const tokenGenerator = require("../middleware/genjwt");
const jwt = require("jsonwebtoken");
const { login } = require("../joiValidation/login.Validation");
class AuthController {
  adminlogin = async (req, res) => {
    try {
      const { emailId, password } = req.body;

      const results = login.validate(req.body);
      if (results.error) {
        return res
          .status(206)
          .json({ message: results.error.message, success: false });
      }
      const admin = await Model.findOne({ emailId });

      if (!admin)
        return res
          .status(404)
          .json({ message: "admin not found", success: false });
      else if (admin.role !== "admin") {
        return res.status(401).json({
          message: "You are not Authorized admin",
          success: false,
        });
      }
      // condtion opreator
      if (admin.password != password) {
        return res.status(400).json({ message: "Invalid password" });
      } else {
        let token = tokenGenerator(admin);

        return res
          .status(200)
          .json({ message: " admin  Welcome ", success: true, token });
      }
    } catch (e) {
      console.log(e);
      return res
        .status(400)
        .json(e, { message: "server error", success: false });
    }
  };

  userlogin = async (req, res) => {
    try {
      const { emailId, password } = req.body;
      console.log(req.body);
      const results = login.validate(req.body);
      if (results.error) {
        return res
          .status(206)
          .json({ message: results.error.message, success: false });
      }
      const user = await Model.findOne({ emailId });
      console.log(user);

      if (!user)
        return res
          .status(404)
          .json({ message: "user not found", success: false });
      else if (user.role !== "user") {
        return res.status(401).json({
          message: "You are not Authorized user",
          success: false,
        });
      }
      // condtion opreator
      if (user.password != password) {
        return res.status(400).json({ message: "Invalid password" });
      } else {
        let token = tokenGenerator(user);

        return res
          .status(200)
          .json({ message: " user  Welcome ", success: true, token });
      }
    } catch (e) {
      console.log(e);
      return res
        .status(400)
        .json(e, { message: "server error", success: false });
    }
  };
}
module.exports = new AuthController();
