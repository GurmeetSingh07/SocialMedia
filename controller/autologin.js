const Model = require("../models/user.Schema");
const tokenGenerator = require("../middleware/genjwt");
const jwt = require("jsonwebtoken");
class AuthController {
  adminlogin = async (req, res) => {
    try {
      const { emailId, password } = req.body;
      console.log(req.body);
      if (!emailId || !password) {
        return res
          .status(206)
          .json({ message: "Please fill the Field", success: false });
      }
      const admin = await collection.Model({ emailId });

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
      if (!emailId || !password) {
        return res
          .status(206)
          .json({ message: "Please fill the Field", success: false });
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

  loginPassword = async (req, res) => {
    try {
      const { emailId, password, phoneNumber } = req.body;

      if ((!emailId && !phoneNumber) || !password) {
        return res
          .status(206)
          .json({ message: "fill the field", success: false });
      }

      const users = await collection.findOne({
        $or: [{ emailId: emailId }, { phoneNumber: phoneNumber }],
      });

      if (!users) {
        return res
          .status(404)
          .json({ message: "users not  found", success: false });
      } else if (users.password === password) {
        return res.status(206).json({ message: "user welcome", success: true });
      } else {
        return res
          .status(404)
          .json({ message: "password  not match", success: false });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "server error", success: false });
    }
  };
}
module.exports = new AuthController();
