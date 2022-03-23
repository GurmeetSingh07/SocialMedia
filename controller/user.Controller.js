const Model = require("../models/user.Schema");

class Usercontoller {
  signUp = async (req, res) => {
    try {
      const { fName, lName, emailId, password } = req.body;

      if (!fName || !lName || !emailId || !password) {
        return res
          .status(206)
          .json({ message: "please fill the field", success: false });
      }

      const userExist = await Model.findOne({ emailId: emailId });

      if (userExist) {
        return res
          .status(409)
          .json({ message: "User Already Exist", success: false });
      } else {
        const adding = new Model({
          fName,
          lName,
          emailId,
          password,
          role: "admin",
        });
        const result = await adding.save();
        return res
          .status(200)
          .json({ message: "user successfully register", success: true });
      }
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json(e, { message: "server error", success: false });
    }
  };
}

module.exports = new Usercontoller();
